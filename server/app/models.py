from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="parent")  # parent, admin, driver
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    subscriptions = relationship("Subscription", back_populates="user")
    expenses = relationship("Expense", back_populates="user")

class Route(Base):
    __tablename__ = "routes"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    stops = relationship("Stop", back_populates="route", order_by="Stop.index")
    buses = relationship("Bus", back_populates="route")
    subscriptions = relationship("Subscription", back_populates="route")

class Stop(Base):
    __tablename__ = "stops"
    
    id = Column(String, primary_key=True, index=True)
    route_id = Column(String, ForeignKey("routes.id"), nullable=False)
    name = Column(String, nullable=False)
    address = Column(Text)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    index = Column(Integer, nullable=False)
    
    route = relationship("Route", back_populates="stops")
    subscriptions = relationship("Subscription", back_populates="stop")

class Bus(Base):
    __tablename__ = "buses"
    
    id = Column(String, primary_key=True, index=True)
    route_id = Column(String, ForeignKey("routes.id"), nullable=False)
    driver_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    route = relationship("Route", back_populates="buses")
    driver = relationship("User")
    locations = relationship("BusLocation", back_populates="bus", order_by="BusLocation.timestamp.desc()")

class Driver(Base):
    __tablename__ = "drivers"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    phone = Column(String)
    license_number = Column(String)
    
    user = relationship("User")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    route_id = Column(String, ForeignKey("routes.id"), nullable=False)
    stop_id = Column(String, ForeignKey("stops.id"), nullable=False)
    stop_index = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=False)
    notifications_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="subscriptions")
    route = relationship("Route", back_populates="subscriptions")
    stop = relationship("Stop", back_populates="subscriptions")

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text)
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="expenses")

class BusLocation(Base):
    __tablename__ = "bus_locations"
    
    id = Column(String, primary_key=True, index=True)
    bus_id = Column(String, ForeignKey("buses.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed = Column(Float, default=0.0)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    bus = relationship("Bus", back_populates="locations")

