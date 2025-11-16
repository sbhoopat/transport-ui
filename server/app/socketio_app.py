import socketio
from fastapi import Request
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.config import settings
from app.core.security import decode_access_token
from app.models import Bus, BusLocation, Subscription, Stop
from app.services.fcm_service import send_fcm_notification
import uuid
from datetime import datetime

sio = socketio.AsyncServer(
    cors_allowed_origins=settings.ALLOWED_ORIGINS_LIST,
    async_mode="asgi"
)
sio_app = socketio.ASGIApp(sio)

# Store active bus connections
active_buses = {}  # {bus_id: {route_id, current_stop_index, ...}}

@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    token = auth.get("token") if auth else None
    if not token:
        await sio.disconnect(sid)
        return False
    
    payload = decode_access_token(token)
    if not payload:
        await sio.disconnect(sid)
        return False
    
    user_id = payload.get("sub")
    await sio.save_session(sid, {"user_id": user_id})
    print(f"Client connected: {sid}, user: {user_id}")
    return True

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    session = await sio.get_session(sid)
    user_id = session.get("user_id")
    print(f"Client disconnected: {sid}, user: {user_id}")

@sio.event
async def bus_connect(sid, data):
    """Bus device connects and authenticates"""
    session = await sio.get_session(sid)
    bus_id = data.get("bus_id")
    route_id = data.get("route_id")
    
    if bus_id and route_id:
        active_buses[bus_id] = {
            "route_id": route_id,
            "sid": sid,
            "current_stop_index": 0
        }
        await sio.enter_room(sid, f"route:{route_id}")
        await sio.enter_room(sid, f"bus:{bus_id}")
        print(f"Bus {bus_id} connected to route {route_id}")

@sio.event
async def bus_update(sid, data):
    """Handle bus location update"""
    bus_id = data.get("bus_id")
    route_id = data.get("route_id")
    lat = data.get("lat")
    lng = data.get("lng")
    speed = data.get("speed", 0.0)
    
    if not all([bus_id, route_id, lat, lng]):
        return
    
    # Save to database
    db = SessionLocal()
    try:
        bus_location = BusLocation(
            id=str(uuid.uuid4()),
            bus_id=bus_id,
            latitude=lat,
            longitude=lng,
            speed=speed
        )
        db.add(bus_location)
        db.commit()
        
        # Update active bus info
        if bus_id in active_buses:
            active_buses[bus_id]["current_location"] = {"lat": lat, "lng": lng}
        
        # Calculate current stop index
        route = db.query(Bus).filter(Bus.route_id == route_id).first()
        if route:
            stops = db.query(Stop).filter(
                Stop.route_id == route_id
            ).order_by(Stop.index).all()
            
            # Simple distance-based stop detection (in production, use more sophisticated algorithm)
            current_stop_index = 0
            min_distance = float("inf")
            for i, stop in enumerate(stops):
                distance = ((lat - stop.latitude) ** 2 + (lng - stop.longitude) ** 2) ** 0.5
                if distance < min_distance:
                    min_distance = distance
                    current_stop_index = i
            
            if bus_id in active_buses:
                active_buses[bus_id]["current_stop_index"] = current_stop_index
            
            # Check for upcoming stop alerts (2 stops before)
            await check_upcoming_stop_alerts(
                db, route_id, bus_id, current_stop_index
            )
        
    finally:
        db.close()
    
    # Broadcast to subscribers
    update_payload = {
        "busId": bus_id,
        "routeId": route_id,
        "lat": lat,
        "lng": lng,
        "speed": speed,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    await sio.emit("bus:update", update_payload, room=f"route:{route_id}")
    await sio.emit("bus:update", update_payload, room=f"bus:{bus_id}")

@sio.event
async def bus_stop(sid, data):
    """Bus reaches a stop"""
    bus_id = data.get("bus_id")
    stop_id = data.get("stop_id")
    stop_index = data.get("stop_index")
    
    if bus_id in active_buses:
        active_buses[bus_id]["current_stop_index"] = stop_index
    
    # Broadcast stop event
    await sio.emit("bus:stop", {
        "busId": bus_id,
        "stopId": stop_id,
        "stopIndex": stop_index,
        "timestamp": datetime.utcnow().isoformat()
    }, room=f"bus:{bus_id}")

@sio.on("subscribe:route")
async def subscribe_route(sid, route_id):
    """Client subscribes to a route"""
    if route_id:
        await sio.enter_room(sid, f"route:{route_id}")
        print(f"Client {sid} subscribed to route {route_id}")

@sio.on("subscribe:bus")
async def subscribe_bus(sid, bus_id):
    """Client subscribes to a specific bus"""
    if bus_id:
        await sio.enter_room(sid, f"bus:{bus_id}")
        print(f"Client {sid} subscribed to bus {bus_id}")

@sio.on("unsubscribe:route")
async def unsubscribe_route(sid, route_id):
    """Client unsubscribes from a route"""
    if route_id:
        await sio.leave_room(sid, f"route:{route_id}")

@sio.on("unsubscribe:bus")
async def unsubscribe_bus(sid, bus_id):
    """Client unsubscribes from a bus"""
    if bus_id:
        await sio.leave_room(sid, f"bus:{bus_id}")

async def check_upcoming_stop_alerts(
    db: Session, route_id: str, bus_id: str, current_stop_index: int
):
    """Check if bus is 2 stops before any subscribed stop and send alerts"""
    # Get all active subscriptions for this route
    subscriptions = db.query(Subscription).filter(
        Subscription.route_id == route_id,
        Subscription.is_active == True,
        Subscription.notifications_enabled == True
    ).all()
    
    for subscription in subscriptions:
        # Check if bus is 2 stops before subscribed stop
        if current_stop_index == subscription.stop_index - 2:
            stop = db.query(Stop).filter(Stop.id == subscription.stop_id).first()
            if stop:
                # Calculate ETA (simplified - 5 minutes per stop)
                eta_minutes = 10  # 2 stops * 5 minutes
                
                alert_payload = {
                    "busId": bus_id,
                    "routeId": route_id,
                    "stopId": subscription.stop_id,
                    "stopIndex": subscription.stop_index,
                    "stopName": stop.name,
                    "eta": eta_minutes
                }
                
                # Emit socket event
                await sio.emit("alert:upcoming_stop", alert_payload, room=f"user:{subscription.user_id}")
                
                # Send FCM notification (for offline users)
                try:
                    await send_fcm_notification(
                        subscription.user_id,
                        "Bus Approaching",
                        f"Your stop {stop.name} is coming up in {eta_minutes} minutes"
                    )
                except Exception as e:
                    print(f"FCM notification failed: {e}")

