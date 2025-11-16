# BusTrackr Backend

FastAPI backend with Socket.IO for real-time bus tracking.

## Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Docker and Docker Compose (optional, for containerized setup)

## Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database:**

   **Option A: Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d db
   ```

   **Option B: Local PostgreSQL**
   - Create database: `createdb bustrackr`
   - Update `DATABASE_URL` in `.env`

5. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

   Or create initial migration:
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

## Running the Server

### Development Mode

```bash
uvicorn main:app --reload
```

Server will run on `http://localhost:8000`

### Using Docker Compose

```bash
docker-compose up
```

This starts both PostgreSQL and the FastAPI server.

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (generate with `openssl rand -hex 32`)
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `FCM_SERVER_KEY`: Firebase Cloud Messaging server key
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Socket.IO Events

### Client Events

- `bus_connect`: Bus device connects (requires `bus_id`, `route_id`)
- `bus_update`: Bus sends location update (requires `bus_id`, `route_id`, `lat`, `lng`, `speed`)
- `bus_stop`: Bus reaches a stop (requires `bus_id`, `stop_id`, `stop_index`)
- `subscribe:route`: Client subscribes to route updates (requires `route_id`)
- `subscribe:bus`: Client subscribes to specific bus (requires `bus_id`)

### Server Events

- `bus:update`: Broadcast when bus location updates
- `bus:stop`: Broadcast when bus reaches a stop
- `alert:upcoming_stop`: Sent when bus is 2 stops before subscribed stop

## Testing Bus Simulation

Use the sample script to simulate bus updates:

```bash
python scripts/send_sample_bus_updates.py
```

**Note:** You'll need to:
1. Register a test user and get a JWT token
2. Update `TOKEN` in the script
3. Ensure a bus and route exist in the database

## Database Models

- `User`: Application users (parent, admin, driver)
- `Route`: Bus routes with stops
- `Stop`: Individual stops on routes
- `Bus`: Bus vehicles
- `Driver`: Driver information
- `Subscription`: User route subscriptions
- `Expense`: Admin expense records
- `BusLocation`: Historical bus location data

## Stripe Integration

1. **Create Stripe account** at [stripe.com](https://stripe.com)
2. **Get API keys** from Dashboard → Developers → API keys
3. **Set up webhook:**
   - Add endpoint: `https://your-domain.com/webhook/payment`
   - Select events: `checkout.session.completed`
   - Copy webhook signing secret to `.env`

## FCM Setup

1. **Create Firebase project** at [Firebase Console](https://console.firebase.google.com)
2. **Get Server Key:**
   - Project Settings → Cloud Messaging
   - Copy Server Key
   - Add to `.env` as `FCM_SERVER_KEY`

## Testing

```bash
pytest
```

## Project Structure

```
server/
├── app/
│   ├── api/          # API route handlers
│   ├── core/         # Core configuration
│   ├── models.py     # Database models
│   ├── schemas.py    # Pydantic schemas
│   ├── services/     # Business logic services
│   └── socketio_app.py  # Socket.IO handlers
├── alembic/          # Database migrations
├── scripts/          # Utility scripts
├── main.py           # Application entry point
└── requirements.txt  # Python dependencies
```

## Production Deployment

1. Set strong `JWT_SECRET`
2. Use environment-specific database
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use production-grade ASGI server (e.g., Gunicorn with Uvicorn workers)
6. Set up monitoring and logging

