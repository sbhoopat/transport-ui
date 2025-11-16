# BusTrackr Architecture

## Overview

BusTrackr is a fullstack real-time bus tracking application with:
- **Mobile App**: Expo-managed React Native (iOS + Android)
- **Backend**: Python FastAPI with Socket.IO for real-time updates
- **Database**: PostgreSQL with SQLAlchemy ORM

## Architecture Decisions

### Mobile: Expo Managed vs Bare Workflow

**Why Expo Managed:**
- Faster development and iteration
- Built-in tooling (EAS Build, OTA updates)
- Simplified deployment process

**Trade-offs:**
- Native modules require EAS dev client (not Expo Go)
- Some native SDKs need custom builds

**Solution:**
- Use EAS dev client for local development
- Document when to use Expo Go vs dev client
- Provide clear migration path to native modules

### State Management: Redux Toolkit

**Why Redux Toolkit:**
- Predictable state management
- Excellent TypeScript support
- DevTools for debugging
- Async thunks for API calls
- Better than Context API for complex state

**Alternative Considered:**
- Context API + useReducer (simpler but less scalable)

### Maps: react-native-maps

**Why react-native-maps:**
- Industry standard
- Full Google Maps integration
- Polyline support for routes
- Custom markers

**Expo Compatibility:**
- Requires EAS dev client (not Expo Go)
- Configured via Expo config plugin
- Google Maps API key injected automatically

### Real-time: Socket.IO

**Why Socket.IO:**
- Bidirectional communication
- Room-based subscriptions
- Automatic reconnection
- Works well with FastAPI

**Implementation:**
- Client: `socket.io-client`
- Server: `python-socketio[asyncio]` with ASGI
- Events: `bus:update`, `bus:stop`, `alert:upcoming_stop`

### Backend: FastAPI

**Why FastAPI:**
- Modern Python async framework
- Automatic API documentation
- Type hints and validation
- Easy Socket.IO integration
- High performance

**Database:**
- SQLAlchemy ORM
- Alembic migrations
- PostgreSQL for production

## Key Features Implementation

### 1. Real-time Bus Tracking

**Flow:**
1. Bus device emits `bus_update` with location
2. Server stores in database
3. Server broadcasts to route/bus rooms
4. Clients receive `bus:update` event
5. Mobile app animates marker smoothly

**Animation:**
- Uses `react-native-reanimated` for smooth interpolation
- Linear interpolation between updates
- 1-second animation duration

### 2. 2-Stops-Before Notifications

**Logic:**
- Server tracks bus current stop index
- Compares with subscription stop indices
- When `current_index == subscribed_index - 2`:
  - Emit `alert:upcoming_stop` via Socket.IO
  - Send FCM push notification

**Client Handling:**
- Show in-app alert
- Schedule local notification
- Works when app is backgrounded

### 3. Route Subscription & Payment

**Flow:**
1. User selects route and stop
2. Client calls `/create-checkout-session`
3. Server creates Stripe Checkout session
4. Client opens Stripe Checkout in WebView
5. User completes payment
6. Stripe webhook activates subscription

**Why Stripe Checkout:**
- No native SDK required (works in Expo managed)
- Secure payment handling
- Easy to implement
- Can upgrade to native SDK later if needed

### 4. Admin Expense Management

**Features:**
- Add expenses with category, amount, description
- View expense list
- Export to CSV/XLSX
- Pie chart visualization (Victory Native)

**Export:**
- Server generates file with pandas/openpyxl
- Client downloads via `expo-file-system`
- Shares via `expo-sharing`

## Data Models

### Core Entities

- **User**: Parents, admins, drivers
- **Route**: Bus routes with stops
- **Stop**: Individual stops on routes
- **Bus**: Bus vehicles
- **Driver**: Driver information
- **Subscription**: User route subscriptions
- **Expense**: Admin expense records
- **BusLocation**: Historical location data

### Relationships

```
User 1:N Subscription
Route 1:N Stop
Route 1:N Bus
Route 1:N Subscription
Bus 1:N BusLocation
User 1:N Expense
```

## Security

### Authentication
- JWT tokens stored in `expo-secure-store`
- Token expiration: 24 hours (configurable)
- Password hashing: bcrypt

### API Security
- CORS configured for allowed origins
- JWT validation on protected routes
- Role-based access control (admin endpoints)

### Socket.IO Security
- Token-based authentication on connect
- User ID stored in session
- Room-based access control

## Deployment Considerations

### Mobile
- **Development**: EAS dev client
- **Preview**: EAS build (internal testing)
- **Production**: EAS build → App Store/Play Store

### Backend
- **Development**: Local with Docker Compose
- **Production**: 
  - Containerized (Docker)
  - ASGI server (Gunicorn + Uvicorn)
  - PostgreSQL (managed or containerized)
  - Environment variables for secrets

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Production: Use secrets management (AWS Secrets Manager, etc.)

## Performance Optimizations

### Mobile
- Redux for efficient state updates
- Memoized components where needed
- Lazy loading for routes
- Image optimization

### Backend
- Database indexing on frequently queried fields
- Connection pooling
- Async/await for I/O operations
- Socket.IO room-based broadcasting (not global)

## Scalability

### Current Limitations
- Single server instance
- In-memory bus tracking state
- No Redis for Socket.IO scaling

### Future Improvements
- Redis adapter for Socket.IO (multi-server)
- Database read replicas
- CDN for static assets
- Message queue for notifications

## Testing Strategy

### Mobile
- Jest for unit tests
- Component snapshot tests
- Integration tests for critical flows

### Backend
- Pytest for API tests
- Test database for isolation
- Mock external services (Stripe, FCM)

## Monitoring & Logging

### Recommended
- Error tracking (Sentry)
- Analytics (Mixpanel, Amplitude)
- Performance monitoring
- Log aggregation

## Code Organization

### Mobile
```
src/
├── components/    # Reusable UI components
├── navigation/   # Navigation setup
├── screens/      # Screen components
├── services/     # API, Socket.IO services
├── store/        # Redux store and slices
├── types/        # TypeScript types
└── utils/        # Utility functions
```

### Backend
```
app/
├── api/          # Route handlers
├── core/         # Config, database, security
├── models.py     # SQLAlchemy models
├── schemas.py    # Pydantic schemas
├── services/     # Business logic
└── socketio_app.py  # Socket.IO handlers
```

## Future Enhancements

1. **Offline Support**: Cache routes and locations
2. **Route Optimization**: Multi-stop routing
3. **Driver App**: Separate app for drivers
4. **Analytics Dashboard**: Usage statistics
5. **Multi-language**: i18n support
6. **Dark Mode**: Theme support

