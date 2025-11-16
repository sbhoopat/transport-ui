export interface User {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'admin' | 'driver';
}

export interface Route {
  id: string;
  name: string;
  description: string;
  price: number;
  stops: Stop[];
  polyline?: Coordinate[];
}

export interface Stop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  index: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Bus {
  id: string;
  routeId: string;
  driverId: string;
  driverName?: string;
  driverPhone?: string;
  currentLocation: Coordinate;
  speed: number;
  lastUpdate: string;
  currentStopIndex: number;
}

export interface Subscription {
  id: string;
  userId: string;
  routeId: string;
  stopId: string;
  stopIndex: number;
  isActive: boolean;
  notificationsEnabled: boolean;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface BusUpdate {
  busId: string;
  routeId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}

export interface BusStopEvent {
  busId: string;
  stopId: string;
  stopIndex: number;
  timestamp: string;
}

export interface UpcomingStopAlert {
  busId: string;
  routeId: string;
  stopId: string;
  stopIndex: number;
  stopName: string;
  eta: number; // minutes
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  busId?: string;
  routeId?: string;
  isActive: boolean;
}

