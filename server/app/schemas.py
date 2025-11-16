from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

# Routes
class StopCreate(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    index: int

class StopResponse(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    index: int
    
    class Config:
        from_attributes = True

class RouteResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: float
    stops: List[StopResponse]
    
    class Config:
        from_attributes = True

# Subscriptions
class SubscriptionCreate(BaseModel):
    stop_id: str
    stop_index: int

class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    route_id: str
    stop_id: str
    stop_index: int
    is_active: bool
    notifications_enabled: bool
    
    class Config:
        from_attributes = True

# Bus
class BusLocationUpdate(BaseModel):
    bus_id: str
    route_id: str
    lat: float
    lng: float
    speed: float
    timestamp: str

class BusStatusResponse(BaseModel):
    id: str
    route_id: str
    current_location: dict
    speed: float
    last_update: datetime
    current_stop_index: int
    
    class Config:
        from_attributes = True

# Expenses
class ExpenseCreate(BaseModel):
    category: str
    amount: float
    description: str

class ExpenseResponse(BaseModel):
    id: str
    category: str
    amount: float
    description: Optional[str]
    date: datetime
    
    class Config:
        from_attributes = True

# Payments
class CheckoutSessionCreate(BaseModel):
    route_id: str
    stop_id: str
    stop_index: int

