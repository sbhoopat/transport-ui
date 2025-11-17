import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockApiService } from '../../services/mockApi';
import { Notification } from '../../types';

const USE_MOCK = true;

export const sendNotification = createAsyncThunk(
  'notifications/send',
  async ({
    notification,
    token,
  }: {
    notification: Omit<Notification, 'id' | 'timestamp'>;
    token: string;
  }) => {
    if (USE_MOCK) {
      return await mockApiService.sendNotification(
        notification.title,
        notification.message,
        notification.type
      );
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error('Failed to send notification');
    }

    return response.json();
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (token: string) => {
    if (USE_MOCK) {
      return await mockApiService.getNotifications();
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  }
);

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the sent notification to the list
        state.notifications.unshift(action.payload);
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send notification';
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });
  },
});

export const { markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

