from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.core.security import decode_access_token
from app.models import Subscription, Route
from app.schemas import CheckoutSessionCreate
from typing import Optional
import stripe
import uuid

stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

def get_current_user_id(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

@router.post("/create-checkout-session")
async def create_checkout_session(
    session_data: CheckoutSessionCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    route = db.query(Route).filter(Route.id == session_data.route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"BusTrackr - {route.name}",
                        "description": route.description or "Monthly bus tracking subscription",
                    },
                    "unit_amount": int(route.price * 100),  # Convert to cents
                },
                "quantity": 1,
            }],
            mode="subscription",
            success_url="bustrackr://payment-success",
            cancel_url="bustrackr://payment-cancel",
            client_reference_id=f"{current_user_id}:{session_data.route_id}:{session_data.stop_id}:{session_data.stop_index}",
            metadata={
                "user_id": current_user_id,
                "route_id": session_data.route_id,
                "stop_id": session_data.stop_id,
                "stop_index": str(session_data.stop_index),
            }
        )
        
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook/payment")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        
        # Activate subscription
        subscription = db.query(Subscription).filter(
            Subscription.user_id == metadata.get("user_id"),
            Subscription.route_id == metadata.get("route_id"),
            Subscription.stop_id == metadata.get("stop_id")
        ).first()
        
        if subscription:
            subscription.is_active = True
            db.commit()
    
    return {"status": "success"}

