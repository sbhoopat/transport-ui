import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Driver } from '../../types';
import { mockApiService } from '../../services/mockApi';

const USE_MOCK = true;

export const fetchDrivers = createAsyncThunk(
  'drivers/fetch',
  async (token: string) => {
    if (USE_MOCK) {
      return await mockApiService.getDrivers();
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/drivers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }

    return response.json();
  }
);

export const createDriver = createAsyncThunk(
  'drivers/create',
  async ({ driver, token }: { driver: Omit<Driver, 'id'>; token: string }) => {
    if (USE_MOCK) {
      return await mockApiService.createDriver(driver);
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(driver),
    });

    if (!response.ok) {
      throw new Error('Failed to create driver');
    }

    return response.json();
  }
);

export const deleteDriver = createAsyncThunk(
  'drivers/delete',
  async ({ driverId, token }: { driverId: string; token: string }) => {
    if (USE_MOCK) {
      await mockApiService.deleteDriver(driverId);
      return driverId;
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/drivers/${driverId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete driver');
    }

    return driverId;
  }
);

interface DriverState {
  drivers: Driver[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  drivers: [],
  isLoading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch drivers';
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter((d) => d.id !== action.payload);
      });
  },
});

export default driverSlice.reducer;

