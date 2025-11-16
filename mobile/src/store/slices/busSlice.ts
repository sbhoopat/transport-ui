import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bus, BusUpdate, Coordinate } from '../../types';

interface BusState {
  activeBus: Bus | null;
  currentLocation: Coordinate | null;
  isTracking: boolean;
  lastUpdate: string | null;
}

const initialState: BusState = {
  activeBus: null,
  currentLocation: null,
  isTracking: false,
  lastUpdate: null,
};

const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setActiveBus: (state, action: PayloadAction<Bus>) => {
      state.activeBus = action.payload;
      state.currentLocation = action.payload.currentLocation;
    },
    updateBusLocation: (state, action: PayloadAction<BusUpdate>) => {
      if (state.activeBus) {
        state.currentLocation = {
          latitude: action.payload.lat,
          longitude: action.payload.lng,
        };
        state.activeBus.currentLocation = state.currentLocation;
        state.activeBus.speed = action.payload.speed;
        state.activeBus.lastUpdate = action.payload.timestamp;
        state.lastUpdate = action.payload.timestamp;
      }
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    clearBus: (state) => {
      state.activeBus = null;
      state.currentLocation = null;
      state.isTracking = false;
      state.lastUpdate = null;
    },
  },
});

export const { setActiveBus, updateBusLocation, setTracking, clearBus } =
  busSlice.actions;
export default busSlice.reducer;

