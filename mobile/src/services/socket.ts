import { io, Socket } from 'socket.io-client';
import { BusUpdate, BusStopEvent, UpcomingStopAlert } from '../types';
import { mockSocketService } from './mockSocket';

const USE_MOCK = true;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private useMock = USE_MOCK;

  connect(token: string) {
    if (this.useMock) {
      this.token = token;
      mockSocketService.connect(token);
      return;
    }

    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    this.socket = io(API_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.useMock) {
      mockSocketService.disconnect();
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToRoute(routeId: string, callback: (update: BusUpdate) => void) {
    if (this.useMock) {
      mockSocketService.subscribeToRoute(routeId, callback);
      return;
    }

    if (!this.socket) return;

    this.socket.emit('subscribe:route', routeId);
    this.socket.on('bus:update', callback);
  }

  subscribeToBus(busId: string, callback: (update: BusUpdate) => void) {
    if (this.useMock) {
      mockSocketService.subscribeToBus(busId, callback);
      return;
    }

    if (!this.socket) return;

    this.socket.emit('subscribe:bus', busId);
    this.socket.on('bus:update', callback);
  }

  onBusStop(callback: (event: BusStopEvent) => void) {
    if (this.useMock) {
      mockSocketService.onBusStop(callback);
      return;
    }

    if (!this.socket) return;
    this.socket.on('bus:stop', callback);
  }

  onUpcomingStopAlert(callback: (alert: UpcomingStopAlert) => void) {
    if (this.useMock) {
      mockSocketService.onUpcomingStopAlert(callback);
      return;
    }

    if (!this.socket) return;
    this.socket.on('alert:upcoming_stop', callback);
  }

  unsubscribe(routeId?: string, busId?: string) {
    if (this.useMock) {
      mockSocketService.unsubscribe(routeId, busId);
      return;
    }

    if (!this.socket) return;

    if (routeId) {
      this.socket.emit('unsubscribe:route', routeId);
    }
    if (busId) {
      this.socket.emit('unsubscribe:bus', busId);
    }

    this.socket.off('bus:update');
    this.socket.off('bus:stop');
    this.socket.off('alert:upcoming_stop');
  }

  isConnected(): boolean {
    if (this.useMock) {
      return mockSocketService.isConnectedToServer();
    }
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();

