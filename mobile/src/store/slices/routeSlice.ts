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

export const createRoute = createAsyncThunk(
  'routes/create',
  async ({ route, token }: { route: Omit<Route, 'id'>; token: string }) => {
    if (USE_MOCK) {
      return await mockApiService.createRoute(route);
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(route),
    });

    if (!response.ok) {
      throw new Error('Failed to create route');
    }

    return response.json();
  }
);

export const updateRoute = createAsyncThunk(
  'routes/update',
  async ({ routeId, route, token }: { routeId: string; route: Partial<Route>; token: string }) => {
    if (USE_MOCK) {
      return await mockApiService.updateRoute(routeId, route);
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/routes/${routeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(route),
    });

    if (!response.ok) {
      throw new Error('Failed to update route');
    }

    return response.json();
  }
);

export const deleteRoute = createAsyncThunk(
  'routes/delete',
  async ({ routeId, token }: { routeId: string; token: string }) => {
    if (USE_MOCK) {
      await mockApiService.deleteRoute(routeId);
      return routeId;
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/routes/${routeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete route');
    }

    return routeId;
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
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        state.routes.push(action.payload);
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        const index = state.routes.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.routes[index] = action.payload;
        }
        if (state.selectedRoute?.id === action.payload.id) {
          state.selectedRoute = action.payload;
        }
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.routes = state.routes.filter((r) => r.id !== action.payload);
        if (state.selectedRoute?.id === action.payload) {
          state.selectedRoute = null;
        }
      });
  },
});

export const { selectRoute, clearSelectedRoute } = routeSlice.actions;
export default routeSlice.reducer;

