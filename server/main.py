from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import socketio
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, routes, subscriptions, admin, payments
from app.socketio_app import sio_app

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="BusTrackr API",
    description="Backend API for BusTrackr bus tracking application",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(routes.router, prefix="/routes", tags=["routes"])
app.include_router(subscriptions.router, prefix="/routes", tags=["subscriptions"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(payments.router, prefix="", tags=["payments"])

# Mount Socket.IO app
app.mount("/socket.io/", sio_app)

@app.get("/")
async def root():
    return {"message": "BusTrackr API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)

