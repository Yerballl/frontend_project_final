// src/store/slices/balanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTransaction, updateTransaction, deleteTransaction } from './transactionsSlice'; // Для оптимистичного обновления

// ЗАМЕНИТЕ ЭТО НА ВАШИ РЕАЛЬНЫЕ API СЕРВИСЫ
// import { apiFetchUserBalance } from '../../services/balanceService';

// --- Mock API Service Functions (ЗАМЕНИТЕ ИХ!) ---
let currentMockBalance = 2575.50;
const apiFetchUserBalance = async () => {
  console.log('API Call: fetchUserBalance');
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  // В реальном приложении баланс будет считаться на бэкенде или на фронте по транзакциям
  // Здесь для примера просто возвращаем текущее значение
  return { amount: currentMockBalance };
};
// --- Конец Mock API ---

export const fetchUserBalance = createAsyncThunk(
  'balance/fetchUserBalance',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetchUserBalance();
      return data; // Ожидаем объект типа { amount: 123.45 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки баланса');
    }
  }
);

const initialState = {
  amount: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    // Можно добавить синхронные редюсеры для обновления баланса, если это необходимо
    // например, при добавлении/удалении транзакции, чтобы не ждать ответа от fetchUserBalance
    // updateBalanceOptimistically: (state, action) => {
    //   // action.payload должен быть суммой изменения (+ или -)
    //   state.amount += action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBalance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserBalance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.amount = action.payload.amount;
      })
      .addCase(fetchUserBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Оптимистичное обновление или обновление после успешной транзакции
      // Это более сложный сценарий, требующий точного расчета
      // Простой вариант - просто перезапрашивать баланс после каждой транзакции
      // или если бэкенд возвращает новый баланс с транзакцией, использовать его.
      // Здесь пример, если транзакция возвращает новый баланс:
      .addCase(addTransaction.fulfilled, (state, action) => {
        // Если action.payload от addTransaction содержит новый баланс:
        // if (action.payload.newBalance !== undefined) {
        //   state.amount = action.payload.newBalance;
        // } else {
        //   // Или обновляем на основе суммы транзакции (требует осторожности)
        //   const transactionAmount = parseFloat(action.payload.amount);
        //   if (action.payload.type === 'income') {
        //     state.amount += transactionAmount;
        //   } else if (action.payload.type === 'expense') {
        //     state.amount -= transactionAmount;
        //   }
        // }
        // Для мока:
        const transaction = action.payload;
        if (transaction.type === 'income') {
            currentMockBalance += parseFloat(transaction.amount);
        } else {
            currentMockBalance -= parseFloat(transaction.amount);
        }
        state.amount = currentMockBalance; // Обновляем моковый баланс
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        // Потребуется найти удаленную транзакцию, чтобы скорректировать баланс
        // Это становится сложным, проще перезапросить баланс или если API возвращает новый
        // dispatch(fetchUserBalance()); // Можно сделать так в компоненте
        // Для мока (предполагаем, что мы знаем сумму удаленной транзакции)
        // Это очень упрощенный пример для мока, в реальности так делать не стоит без точных данных
        console.warn("Balance update on delete is simplified for mock and might be inaccurate.");
        // state.amount = currentMockBalance; // Перезапросить было бы лучше
      })
       .addCase(updateTransaction.fulfilled, (state, action) => {
        // Аналогично delete, обновление баланса требует знания "дельты" или перезапроса
        console.warn("Balance update on transaction update is simplified for mock and might be inaccurate.");
        // state.amount = currentMockBalance; // Перезапросить было бы лучше
      });
  },
});

// export const { updateBalanceOptimistically } = balanceSlice.actions;

export const selectUserBalance = (state) => state.balance; // Возвращает весь объект { amount, status, error }
export const selectBalanceAmount = (state) => state.balance.amount;
export const selectBalanceLoading = (state) => state.balance.status === 'loading';
export const selectBalanceError = (state) => state.balance.error;


export default balanceSlice.reducer;
