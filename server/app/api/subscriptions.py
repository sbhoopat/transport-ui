from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models import Subscription, Route, Stop
from app.schemas import SubscriptionCreate, SubscriptionResponse
from typing import Optional
import uuid

router = APIRouter()

def get_current_user_id(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

@router.post("/{route_id}/subscribe", response_model=SubscriptionResponse)
async def subscribe_to_route(
    route_id: str,
    subscription_data: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    # Verify route exists
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    
    # Verify stop exists and belongs to route
    stop = db.query(Stop).filter(
        Stop.id == subscription_data.stop_id,
        Stop.route_id == route_id
    ).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    # Create subscription
    subscription = Subscription(
        id=str(uuid.uuid4()),
        user_id=current_user_id,
        route_id=route_id,
        stop_id=subscription_data.stop_id,
        stop_index=subscription_data.stop_index,
        is_active=True,
        notifications_enabled=True
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    
    return subscription

