import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AuthScreen from '../screens/AuthScreen';
import authReducer from '../store/slices/authSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      routes: (state = { routes: [] }) => state,
      bus: (state = { activeBus: null }) => state,
      subscriptions: (state = { subscriptions: [] }) => state,
      expenses: (state = { expenses: [] }) => state,
    },
  });
};

describe('AuthScreen', () => {
  it('renders login form by default', () => {
    const store = createMockStore();
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <AuthScreen />
      </Provider>
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('switches to register form', () => {
    const store = createMockStore();
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <AuthScreen />
      </Provider>
    );

    fireEvent.press(getByText("Don't have an account? Sign Up"));
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });
});

