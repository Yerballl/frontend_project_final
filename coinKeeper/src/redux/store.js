// src/store/store.js (или как у вас называется файл конфигурации стора)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transactionsReducer from './slices/transactionsSlice';
import categoriesReducer from './slices/categoriesSlice';
import balanceReducer from './slices/balanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    categories: categoriesReducer,
    balance: balanceReducer,
    // ...другие ваши редюсеры
  },
});
