#!/usr/bin/env python3
"""
Sample script to simulate bus location updates via Socket.IO.
Run this script to test real-time tracking functionality.
"""

import socketio
import time
import random
import sys

# Configuration
API_URL = "http://localhost:8000"
BUS_ID = "bus-001"
ROUTE_ID = "route-001"
TOKEN = "your-test-token-here"  # Replace with actual JWT token

# Sample route coordinates (circular route)
ROUTE_COORDINATES = [
    (37.7749, -122.4194),  # San Francisco
    (37.7849, -122.4094),
    (37.7949, -122.3994),
    (37.8049, -122.3894),
    (37.8149, -122.3794),
    (37.8049, -122.3694),
    (37.7949, -122.3594),
    (37.7849, -122.3494),
    (37.7749, -122.3394),
    (37.7649, -122.3494),
    (37.7549, -122.3594),
    (37.7449, -122.3694),
    (37.7549, -122.3794),
    (37.7649, -122.3894),
    (37.7749, -122.3994),
]

def main():
    print(f"Connecting to {API_URL}...")
    sio = socketio.Client()
    
    @sio.event
    def connect():
        print("Connected to server")
        # Authenticate as bus
        sio.emit("bus_connect", {
            "bus_id": BUS_ID,
            "route_id": ROUTE_ID
        })
        print(f"Bus {BUS_ID} connected to route {ROUTE_ID}")
    
    @sio.event
    def disconnect():
        print("Disconnected from server")
    
    @sio.event
    def connect_error(data):
        print(f"Connection error: {data}")
        sys.exit(1)
    
    try:
        sio.connect(
            API_URL,
            auth={"token": TOKEN},
            transports=["websocket"]
        )
        
        # Simulate bus movement
        current_index = 0
        print("Starting bus simulation...")
        print("Press Ctrl+C to stop")
        
        while True:
            # Get current coordinates
            lat, lng = ROUTE_COORDINATES[current_index]
            
            # Add some random variation
            lat += random.uniform(-0.001, 0.001)
            lng += random.uniform(-0.001, 0.001)
            
            # Simulate speed (km/h)
            speed = random.uniform(20, 50)
            
            # Send update
            sio.emit("bus_update", {
                "bus_id": BUS_ID,
                "route_id": ROUTE_ID,
                "lat": lat,
                "lng": lng,
                "speed": speed
            })
            
            print(f"Update sent: ({lat:.6f}, {lng:.6f}) @ {speed:.1f} km/h")
            
            # Move to next coordinate
            current_index = (current_index + 1) % len(ROUTE_COORDINATES)
            
            # Wait before next update (simulate 5-10 second intervals)
            time.sleep(random.uniform(5, 10))
            
    except KeyboardInterrupt:
        print("\nStopping simulation...")
        sio.disconnect()
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sio.disconnect()
        sys.exit(1)

if __name__ == "__main__":
    main()

