from pyfcm import FCMNotification
from app.core.config import settings
from app.models import User
from sqlalchemy.orm import Session
from app.core.database import SessionLocal

push_service = None

def get_fcm_service():
    global push_service
    if not push_service and settings.FCM_SERVER_KEY:
        push_service = FCMNotification(api_key=settings.FCM_SERVER_KEY)
    return push_service

async def send_fcm_notification(user_id: str, title: str, body: str):
    """Send FCM push notification to user"""
    fcm_service = get_fcm_service()
    if not fcm_service:
        print("FCM service not configured")
        return
    
    # In production, store FCM tokens in database
    # For now, this is a placeholder
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return
        
        # TODO: Get FCM token from user device
        # For now, this is a placeholder
        # fcm_token = user.fcm_token
        
        # Example:
        # result = fcm_service.notify_single_device(
        #     registration_id=fcm_token,
        #     message_title=title,
        #     message_body=body
        # )
        print(f"FCM notification (placeholder): {title} - {body} to user {user_id}")
    finally:
        db.close()

