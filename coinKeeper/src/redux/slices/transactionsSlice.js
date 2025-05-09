import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTransactions as apiFetchTransactions,
  addTransaction as apiAddTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction
} from '../../services/api';

export const fetchAllTransactions = createAsyncThunk(
    'transactions/fetchAllTransactions',
    async (_, { rejectWithValue }) => {
      try {
        const data = await apiFetchTransactions();
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки всех транзакций');
      }
    }
);

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (filters, { rejectWithValue }) => {
      try {
        const data = await apiFetchTransactions(filters);
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки транзакций');
      }
    }
);

export const fetchRecentTransactions = createAsyncThunk(
    'transactions/fetchRecentTransactions',
    async (filters = { limit: 5 }, { rejectWithValue }) => {
      try {
        const data = await apiFetchTransactions(filters);
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки недавних транзакций');
      }
    }
);

export const addTransaction = createAsyncThunk(
    'transactions/addTransaction',
    async (transactionData, { rejectWithValue }) => {
      try {
        const data = await apiAddTransaction(transactionData);
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка добавления транзакции');
      }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async ({ id, ...updateData }, { rejectWithValue }) => {
      try {
        const data = await apiUpdateTransaction(id, updateData);
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка обновления транзакции');
      }
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async (transactionId, { rejectWithValue }) => {
      try {
        await apiDeleteTransaction(transactionId);
        return transactionId;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка удаления транзакции');
      }
    }
);

const initialState = {
  items: [],
  recentItems: [],
  status: 'idle',
  recentStatus: 'idle',
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        // Остальной код reducer'ов не меняется
        .addCase(fetchTransactions.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchTransactions.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(fetchTransactions.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        // Fetch Recent Transactions
        .addCase(fetchRecentTransactions.pending, (state) => {
          state.recentStatus = 'loading';
        })
        .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
          state.recentStatus = 'succeeded';
          state.recentItems = action.payload;
        })
        .addCase(fetchRecentTransactions.rejected, (state, action) => {
          state.recentStatus = 'failed';
          state.error = action.payload;
        })
        // Add Transaction
        .addCase(addTransaction.fulfilled, (state, action) => {
          state.items.push(action.payload);
          state.recentItems.unshift(action.payload);
          if (state.recentItems.length > 5) state.recentItems.pop();
        })
        // Update Transaction
        .addCase(updateTransaction.fulfilled, (state, action) => {
          const index = state.items.findIndex(t => t.id === action.payload.id);
          if (index !== -1) state.items[index] = action.payload;
          const recentIndex = state.recentItems.findIndex(t => t.id === action.payload.id);
          if (recentIndex !== -1) state.recentItems[recentIndex] = action.payload;
        })
        .addCase(fetchAllTransactions.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchAllTransactions.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(fetchAllTransactions.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        // Delete Transaction
        .addCase(deleteTransaction.fulfilled, (state, action) => {
          state.items = state.items.filter(t => t.id !== action.payload);
          state.recentItems = state.recentItems.filter(t => t.id !== action.payload);
        });
  },
});

// Селекторы остаются без изменений
export const selectAllTransactions = (state) => state.transactions.items;
export const selectRecentTransactions = (state) => state.transactions.recentItems;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectRecentTransactionsStatus = (state) => state.transactions.recentStatus;
export const selectTransactionsError = (state) => state.transactions.error;
export const selectRecentTransactionsLoading = (state) => state.transactions.recentStatus === 'loading';
export const selectAllTransactionsLoading = (state) => state.transactions.status === 'loading';

export default transactionsSlice.reducer;