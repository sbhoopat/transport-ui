import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Route } from '../../types';
import { mockApiService } from '../../services/mockApi';

const USE_MOCK = true;

export const fetchRoutes = createAsyncThunk(
  'routes/fetch',
  async (token: string) => {
    if (USE_MOCK) {
      return await mockApiService.getRoutes();
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/routes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch routes');
    }

    return response.json();
  }
);

interface RouteState {
  routes: Route[];
  selectedRoute: Route | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  routes: [],
  selectedRoute: null,
  isLoading: false,
  error: null,
};

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    selectRoute: (state, action) => {
      state.selectedRoute = action.payload;
    },
    clearSelectedRoute: (state) => {
      state.selectedRoute = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch routes';
      });
  },
});

export const { selectRoute, clearSelectedRoute } = routeSlice.actions;
export default routeSlice.reducer;

