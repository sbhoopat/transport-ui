import { User, Route, Stop, Subscription, Expense, Bus } from '../types';

// Mock data
const mockUser: User = {
  id: 'user-1',
  email: 'parent@example.com',
  name: 'John Parent',
  role: 'parent',
};

const mockAdminUser: User = {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
};

const mockStops: Stop[] = [
  {
    id: 'stop-1',
    name: 'Main Street',
    address: '123 Main St',
    latitude: 37.7749,
    longitude: -122.4194,
    index: 0,
  },
  {
    id: 'stop-2',
    name: 'Oak Avenue',
    address: '456 Oak Ave',
    latitude: 37.7849,
    longitude: -122.4094,
    index: 1,
  },
  {
    id: 'stop-3',
    name: 'Park Boulevard',
    address: '789 Park Blvd',
    latitude: 37.7949,
    longitude: -122.3994,
    index: 2,
  },
  {
    id: 'stop-4',
    name: 'School Entrance',
    address: '100 School Way',
    latitude: 37.8049,
    longitude: -122.3894,
    index: 3,
  },
];

const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Route A - Downtown',
    description: 'Serves downtown area and main school',
    price: 29.99,
    stops: mockStops,
    polyline: [
      { latitude: 37.7749, longitude: -122.4194 },
      { latitude: 37.7849, longitude: -122.4094 },
      { latitude: 37.7949, longitude: -122.3994 },
      { latitude: 37.8049, longitude: -122.3894 },
    ],
  },
  {
    id: 'route-2',
    name: 'Route B - Suburbs',
    description: 'Serves suburban neighborhoods',
    price: 34.99,
    stops: [
      {
        id: 'stop-5',
        name: 'Suburb Station',
        address: '200 Suburb St',
        latitude: 37.7649,
        longitude: -122.4294,
        index: 0,
      },
      {
        id: 'stop-6',
        name: 'Hillside Drive',
        address: '300 Hillside Dr',
        latitude: 37.7549,
        longitude: -122.4394,
        index: 1,
      },
    ],
    polyline: [
      { latitude: 37.7649, longitude: -122.4294 },
      { latitude: 37.7549, longitude: -122.4394 },
    ],
  },
];

const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    category: 'Fuel',
    amount: 450.0,
    description: 'Monthly fuel expenses',
    date: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    category: 'Maintenance',
    amount: 320.0,
    description: 'Bus maintenance and repairs',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'exp-3',
    category: 'Insurance',
    amount: 280.0,
    description: 'Monthly insurance premium',
    date: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'exp-4',
    category: 'Fuel',
    amount: 420.0,
    description: 'Previous month fuel',
    date: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiService {
  private currentUser: User | null = null;
  private subscriptions: Subscription[] = [];

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await delay(1000);
    
    if (email === 'admin@example.com') {
      this.currentUser = mockAdminUser;
      return {
        token: 'mock-jwt-token-admin',
        user: mockAdminUser,
      };
    }
    
    this.currentUser = mockUser;
    return {
      token: 'mock-jwt-token',
      user: mockUser,
    };
  }

  async register(email: string, password: string, name: string): Promise<{ token: string; user: User }> {
    await delay(1000);
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'parent',
    };
    
    this.currentUser = newUser;
    return {
      token: 'mock-jwt-token-new',
      user: newUser,
    };
  }

  async getRoutes(): Promise<Route[]> {
    await delay(500);
    return mockRoutes;
  }

  async subscribeToRoute(
    routeId: string,
    stopId: string,
    stopIndex: number
  ): Promise<Subscription> {
    await delay(800);
    
    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId: this.currentUser?.id || 'user-1',
      routeId,
      stopId,
      stopIndex,
      isActive: true,
      notificationsEnabled: true,
    };
    
    this.subscriptions.push(subscription);
    return subscription;
  }

  async getExpenses(): Promise<Expense[]> {
    await delay(500);
    return mockExpenses;
  }

  async addExpense(
    category: string,
    amount: number,
    description: string
  ): Promise<Expense> {
    await delay(500);
    
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      category,
      amount,
      description,
      date: new Date().toISOString(),
    };
    
    mockExpenses.unshift(expense);
    return expense;
  }

  async createCheckoutSession(
    routeId: string,
    stopId: string,
    stopIndex: number
  ): Promise<{ url: string }> {
    await delay(500);
    // Mock Stripe Checkout URL
    return {
      url: 'https://checkout.stripe.com/mock-session',
    };
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }
}

export const mockApiService = new MockApiService();

