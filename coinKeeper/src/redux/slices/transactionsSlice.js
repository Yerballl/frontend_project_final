// src/store/slices/transactionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ЗАМЕНИТЕ ЭТО НА ВАШИ РЕАЛЬНЫЕ API СЕРВИСЫ
// import { apiFetchTransactions, apiAddTransaction, apiUpdateTransaction, apiDeleteTransaction } from '../../services/transactionService';

// --- Mock API Service Functions (ЗАМЕНИТЕ ИХ!) ---
let mockTransactions = [
  { id: 't1', type: 'income', amount: 1500.00, categoryId: 'cat1', category: {id: 'cat1', name: 'Зарплата'}, date: '2025-05-01', comment: 'Аванс' },
  { id: 't2', type: 'expense', amount: 75.20, categoryId: 'cat2', category: {id: 'cat2', name: 'Продукты'}, date: '2025-05-03', comment: 'Супермаркет "Удача"' },
];
const apiFetchTransactions = async (filters = {}) => {
  console.log('API Call: fetchTransactions', filters);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  let result = [...mockTransactions];
  if (filters.limit) {
    result = result.slice(0, filters.limit);
  }
  // Добавьте фильтрацию по дате, типу и т.д., если необходимо
  return result;
};
const apiAddTransaction = async (transactionData) => {
  console.log('API Call: addTransaction', transactionData);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  const newTransaction = { ...transactionData, id: 't' + Date.now(), date: transactionData.date || new Date().toISOString().split('T')[0] };
  mockTransactions.push(newTransaction);
  return newTransaction;
};
const apiUpdateTransaction = async ({ id, ...updateData }) => {
  console.log('API Call: updateTransaction', id, updateData);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  const index = mockTransactions.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTransactions[index] = { ...mockTransactions[index], ...updateData };
    return mockTransactions[index];
  }
  throw { response: { data: { message: 'Транзакция не найдена' } } };
};
const apiDeleteTransaction = async (transactionId) => {
  console.log('API Call: deleteTransaction', transactionId);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  const index = mockTransactions.findIndex(t => t.id === transactionId);
  if (index !== -1) {
    mockTransactions.splice(index, 1);
    return { id: transactionId }; // Возвращаем ID удаленной транзакции
  }
  throw { response: { data: { message: 'Транзакция не найдена для удаления' } } };
};
// --- Конец Mock API ---

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await apiFetchTransactions(filters);
      return data; // Ожидаем массив транзакций
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки транзакций');
    }
  }
);

// Для DashboardPage, чтобы загружать только последние
export const fetchRecentTransactions = createAsyncThunk(
  'transactions/fetchRecentTransactions',
  async (filters = { limit: 5 }, { rejectWithValue }) => { // filters может содержать limit, sortBy, etc.
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
      return data; // Ожидаем созданную транзакцию
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления транзакции');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const data = await apiUpdateTransaction({ id, ...updateData });
      return data; // Ожидаем обновленную транзакцию
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
      return transactionId; // Возвращаем ID для удаления из состояния
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления транзакции');
    }
  }
);

const initialState = {
  items: [], // Все транзакции для страницы статистики/истории
  recentItems: [], // Для дашборда
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' (для общего списка)
  recentStatus: 'idle', // (для недавних)
  error: null,
  // Можно добавить отдельные статусы для add, update, delete, если нужна более гранулярная обратная связь
  // addStatus: 'idle', updateStatus: 'idle', deleteStatus: 'idle'
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Transactions
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
        state.error = action.payload; // Можно использовать общий error или отдельный recentError
      })
      // Add Transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload); // Добавляем в общий список
        state.recentItems.unshift(action.payload); // Добавляем в начало списка недавних
        if (state.recentItems.length > 5) state.recentItems.pop(); // Ограничиваем список недавних
        // state.addStatus = 'succeeded';
      })
      // .addCase(addTransaction.pending, (state) => { state.addStatus = 'loading'; })
      // .addCase(addTransaction.rejected, (state, action) => { state.addStatus = 'failed'; state.error = action.payload; })
      // Update Transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        const recentIndex = state.recentItems.findIndex(t => t.id === action.payload.id);
        if (recentIndex !== -1) state.recentItems[recentIndex] = action.payload;
        // state.updateStatus = 'succeeded';
      })
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
        state.recentItems = state.recentItems.filter(t => t.id !== action.payload);
        // state.deleteStatus = 'succeeded';
      });
  },
});

export const selectAllTransactions = (state) => state.transactions.items;
export const selectRecentTransactions = (state) => state.transactions.recentItems;
export const selectTransactionsStatus = (state) => state.transactions.status;
export const selectRecentTransactionsStatus = (state) => state.transactions.recentStatus;
export const selectTransactionsError = (state) => state.transactions.error;


export const selectRecentTransactionsLoading = (state) => state.transactions.recentStatus === 'loading';

// Опционально: селектор для состояния загрузки всех транзакций (если понадобится где-то еще)
export const selectAllTransactionsLoading = (state) => state.transactions.status === 'loading';

export default transactionsSlice.reducer;
