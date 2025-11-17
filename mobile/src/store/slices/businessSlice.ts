import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BusinessType } from '../../types';
import { mockApiService } from '../../services/mockApi';

const USE_MOCK = true;

export const fetchBusinesses = createAsyncThunk(
  'businesses/fetch',
  async (token: string) => {
    if (USE_MOCK) {
      return await mockApiService.getBusinesses();
    }
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/developer/businesses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }

    return response.json();
  }
);

export const createBusiness = createAsyncThunk(
  'businesses/create',
  async ({ business, token }: { business: Omit<BusinessType, 'id' | 'createdAt' | 'updatedAt'>; token: string }) => {
    if (USE_MOCK) {
      return await mockApiService.createBusiness(business);
    }
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/developer/businesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(business),
    });

    if (!response.ok) {
      throw new Error('Failed to create business');
    }

    return response.json();
  }
);

export const updateBusiness = createAsyncThunk(
  'businesses/update',
  async ({ businessId, business, token }: { businessId: string; business: Partial<BusinessType>; token: string }) => {
    if (USE_MOCK) {
      return await mockApiService.updateBusiness(businessId, business);
    }
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/developer/businesses/${businessId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(business),
    });

    if (!response.ok) {
      throw new Error('Failed to update business');
    }

    return response.json();
  }
);

export const deleteBusiness = createAsyncThunk(
  'businesses/delete',
  async ({ businessId, token }: { businessId: string; token: string }) => {
    if (USE_MOCK) {
      await mockApiService.deleteBusiness(businessId);
      return businessId;
    }
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/developer/businesses/${businessId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete business');
    }

    return businessId;
  }
);

interface BusinessState {
  businesses: BusinessType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  isLoading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.businesses.push(action.payload);
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        const index = state.businesses.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.businesses = state.businesses.filter((b) => b.id !== action.payload);
      });
  },
});

export default businessSlice.reducer;

