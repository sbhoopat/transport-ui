import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Subscription } from '../../types';
import { mockApiService } from '../../services/mockApi';

const USE_MOCK = true;

export const subscribeToRoute = createAsyncThunk(
  'subscriptions/subscribe',
  async (
    {
      routeId,
      stopId,
      stopIndex,
      token,
    }: { routeId: string; stopId: string; stopIndex: number; token: string }
  ) => {
    if (USE_MOCK) {
      return await mockApiService.subscribeToRoute(routeId, stopId, stopIndex);
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/routes/${routeId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stopId, stopIndex }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    return response.json();
  }
);

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    addSubscription: (state, action) => {
      state.subscriptions.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToRoute.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(subscribeToRoute.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions.push(action.payload);
      })
      .addCase(subscribeToRoute.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to subscribe';
      });
  },
});

export const { addSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

