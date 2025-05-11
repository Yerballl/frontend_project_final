import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transactionsReducer from './slices/transactionsSlice';
import categoriesReducer from './slices/categoriesSlice';
import balanceReducer from './slices/balanceSlice';
import accountsReducer from './slices/accountsSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    categories: categoriesReducer,
    balance: balanceReducer,
    accounts: accountsReducer,
    settings: settingsReducer
  },
});