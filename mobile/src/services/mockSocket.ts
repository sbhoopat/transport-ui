import { BusUpdate, BusStopEvent, UpcomingStopAlert } from '../types';

// Mock bus location simulation
class MockSocketService {
  private listeners: Map<string, Function[]> = new Map();
  private isConnected = false;
  private updateInterval: NodeJS.Timeout | null = null;
  private currentRouteId: string | null = null;
  private currentBusId = 'bus-001';

  // Simulate bus moving along route
  private routeCoordinates = [
    { lat: 37.7749, lng: -122.4194 },
    { lat: 37.7789, lng: -122.4184 },
    { lat: 37.7829, lng: -122.4174 },
    { lat: 37.7869, lng: -122.4164 },
    { lat: 37.7909, lng: -122.4154 },
    { lat: 37.7949, lng: -122.4144 },
    { lat: 37.7989, lng: -122.4134 },
    { lat: 37.8029, lng: -122.4124 },
  ];

  private currentIndex = 0;
  private direction = 1; // 1 for forward, -1 for backward

  connect(token: string) {
    console.log('Mock Socket: Connecting...');
    this.isConnected = true;
    
    // Simulate connection delay
    setTimeout(() => {
      this.emit('connect', {});
      this.startSimulation();
    }, 500);
  }

  disconnect() {
    console.log('Mock Socket: Disconnecting...');
    this.isConnected = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.listeners.clear();
  }

  subscribeToRoute(routeId: string, callback: (update: BusUpdate) => void) {
    console.log(`Mock Socket: Subscribing to route ${routeId}`);
    this.currentRouteId = routeId;
    this.on('bus:update', callback);
    this.startSimulation();
  }

  subscribeToBus(busId: string, callback: (update: BusUpdate) => void) {
    console.log(`Mock Socket: Subscribing to bus ${busId}`);
    this.currentBusId = busId;
    this.on('bus:update', callback);
    this.startSimulation();
  }

  onBusStop(callback: (event: BusStopEvent) => void) {
    this.on('bus:stop', callback);
  }

  onUpcomingStopAlert(callback: (alert: UpcomingStopAlert) => void) {
    this.on('alert:upcoming_stop', callback);
  }

  unsubscribe(routeId?: string, busId?: string) {
    console.log('Mock Socket: Unsubscribing');
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.off('bus:update');
    this.off('bus:stop');
    this.off('alert:upcoming_stop');
  }

  private startSimulation() {
    if (this.updateInterval) {
      return; // Already running
    }

    this.updateInterval = setInterval(() => {
      if (!this.isConnected) {
        return;
      }

      // Move to next coordinate
      const coord = this.routeCoordinates[this.currentIndex];
      const nextIndex = this.currentIndex + this.direction;

      // Reverse direction at ends
      if (nextIndex >= this.routeCoordinates.length) {
        this.direction = -1;
        this.currentIndex = this.routeCoordinates.length - 1;
      } else if (nextIndex < 0) {
        this.direction = 1;
        this.currentIndex = 0;
      } else {
        this.currentIndex = nextIndex;
      }

      // Emit bus update
      const update: BusUpdate = {
        busId: this.currentBusId,
        routeId: this.currentRouteId || 'route-1',
        lat: coord.lat + (Math.random() - 0.5) * 0.001, // Add slight randomness
        lng: coord.lng + (Math.random() - 0.5) * 0.001,
        speed: 25 + Math.random() * 15, // 25-40 km/h
        timestamp: new Date().toISOString(),
      };

      this.emit('bus:update', update);

      // Occasionally emit stop event
      if (Math.random() > 0.7 && this.currentIndex % 2 === 0) {
        const stopEvent: BusStopEvent = {
          busId: this.currentBusId,
          stopId: `stop-${this.currentIndex}`,
          stopIndex: this.currentIndex,
          timestamp: new Date().toISOString(),
        };
        this.emit('bus:stop', stopEvent);
      }

      // Occasionally emit upcoming stop alert (2 stops before)
      if (Math.random() > 0.8) {
        const alert: UpcomingStopAlert = {
          busId: this.currentBusId,
          routeId: this.currentRouteId || 'route-1',
          stopId: `stop-${this.currentIndex + 2}`,
          stopIndex: this.currentIndex + 2,
          stopName: `Stop ${this.currentIndex + 2}`,
          eta: 10, // 10 minutes
        };
        this.emit('alert:upcoming_stop', alert);
      }
    }, 3000); // Update every 3 seconds
  }

  private on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private off(event: string) {
    this.listeners.delete(event);
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} callback:`, error);
      }
    });
  }

  isConnectedToServer(): boolean {
    return this.isConnected;
  }
}

export const mockSocketService = new MockSocketService();

