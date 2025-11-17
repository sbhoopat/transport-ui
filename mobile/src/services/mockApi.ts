import { User, Route, Stop, Subscription, Expense, Bus, Driver, BusinessType, Notification } from '../types';

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

const mockDeveloperUser: User = {
  id: 'dev-1',
  email: 'developer@example.com',
  name: 'Developer User',
  role: 'developer',
};

const mockBusinesses: BusinessType[] = [
  {
    id: 'business-1',
    name: 'Greenwood School',
    type: 'school',
    role: 'Educational Institution',
    startDate: '2024-01-15',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'business-2',
    name: 'City Infrastructure Corp',
    type: 'infra',
    role: 'Infrastructure Management',
    startDate: '2024-02-20',
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
  },
];

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
    
    if (email === 'developer@example.com') {
      this.currentUser = mockDeveloperUser;
      return {
        token: 'mock-jwt-token-developer',
        user: mockDeveloperUser,
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
    description: string,
    date?: string
  ): Promise<Expense> {
    await delay(500);
    
    const expense: Expense = {
      id: `exp-${Date.now()}`,
      category,
      amount,
      description,
      date: date || new Date().toISOString(),
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

  // Driver management methods
  async getDrivers(): Promise<Driver[]> {
    await delay(500);
    return [
      {
        id: 'driver-1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        licenseNumber: 'DL123456',
        busId: 'bus-001',
        routeId: 'route-1',
        isActive: true,
      },
      {
        id: 'driver-2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1234567891',
        licenseNumber: 'DL123457',
        busId: 'bus-002',
        routeId: 'route-2',
        isActive: true,
      },
    ];
  }

  async createDriver(driver: Omit<Driver, 'id'>): Promise<Driver> {
    await delay(500);
    const newDriver: Driver = {
      id: `driver-${Date.now()}`,
      ...driver,
    };
    return newDriver;
  }

  async deleteDriver(driverId: string): Promise<void> {
    await delay(500);
    // Mock deletion - in real app would call API
  }

  // Route management methods
  async createRoute(route: Omit<Route, 'id'>): Promise<Route> {
    await delay(500);
    const newRoute: Route = {
      id: `route-${Date.now()}`,
      ...route,
    };
    mockRoutes.push(newRoute);
    return newRoute;
  }

  async updateRoute(routeId: string, updates: Partial<Route>): Promise<Route> {
    await delay(500);
    const routeIndex = mockRoutes.findIndex((r) => r.id === routeId);
    if (routeIndex === -1) {
      throw new Error('Route not found');
    }
    mockRoutes[routeIndex] = { ...mockRoutes[routeIndex], ...updates };
    return mockRoutes[routeIndex];
  }

  async deleteRoute(routeId: string): Promise<void> {
    await delay(500);
    const routeIndex = mockRoutes.findIndex((r) => r.id === routeId);
    if (routeIndex !== -1) {
      mockRoutes.splice(routeIndex, 1);
    }
  }

  // Business management methods (for developer role)
  async getBusinesses(): Promise<BusinessType[]> {
    await delay(500);
    return mockBusinesses;
  }

  async createBusiness(business: Omit<BusinessType, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessType> {
    await delay(500);
    const newBusiness: BusinessType = {
      id: `business-${Date.now()}`,
      ...business,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockBusinesses.push(newBusiness);
    return newBusiness;
  }

  async updateBusiness(businessId: string, updates: Partial<BusinessType>): Promise<BusinessType> {
    await delay(500);
    const businessIndex = mockBusinesses.findIndex((b) => b.id === businessId);
    if (businessIndex === -1) {
      throw new Error('Business not found');
    }
    mockBusinesses[businessIndex] = {
      ...mockBusinesses[businessIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockBusinesses[businessIndex];
  }

  async deleteBusiness(businessId: string): Promise<void> {
    await delay(500);
    const businessIndex = mockBusinesses.findIndex((b) => b.id === businessId);
    if (businessIndex !== -1) {
      mockBusinesses.splice(businessIndex, 1);
    }
  }

  // Notification methods
  async sendNotification(
    title: string,
    message: string,
    type: 'info' | 'warning' | 'alert' = 'info'
  ): Promise<Notification> {
    await delay(500);
    
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    // In a real app, this would be sent to all users via push notifications
    // For now, we'll just return the notification
    console.log('Notification sent to all users:', notification);
    
    return notification;
  }

  async getNotifications(): Promise<Notification[]> {
    await delay(500);
    // Return mock notifications for the current user
    return [
      {
        id: 'notif-1',
        title: 'Welcome to BusTrackr',
        message: 'Thank you for using BusTrackr. Track your bus in real-time!',
        type: 'info',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isRead: false,
      },
      {
        id: 'notif-2',
        title: 'Route Update',
        message: 'Route 1 schedule has been updated. Please check the new timings.',
        type: 'warning',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: false,
      },
    ];
  }
}

export const mockApiService = new MockApiService();

