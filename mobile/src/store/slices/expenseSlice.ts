import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Expense } from '../../types';
import { mockApiService } from '../../services/mockApi';

const USE_MOCK = true;

export const fetchExpenses = createAsyncThunk(
  'expenses/fetch',
  async (token: string) => {
    if (USE_MOCK) {
      return await mockApiService.getExpenses();
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    return response.json();
  }
);

export const addExpense = createAsyncThunk(
  'expenses/add',
  async ({
    expense,
    token,
  }: {
    expense: Omit<Expense, 'id'>;
    token: string;
  }) => {
    if (USE_MOCK) {
      return await mockApiService.addExpense(
        expense.category,
        expense.amount,
        expense.description || '',
        expense.date || new Date().toISOString()
      );
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/admin/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      throw new Error('Failed to add expense');
    }

    return response.json();
  }
);

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      });
  },
});

export default expenseSlice.reducer;

