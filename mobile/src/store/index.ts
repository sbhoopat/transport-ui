import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import routeReducer from './slices/routeSlice';
import busReducer from './slices/busSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import expenseReducer from './slices/expenseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routeReducer,
    bus: busReducer,
    subscriptions: subscriptionReducer,
    expenses: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

