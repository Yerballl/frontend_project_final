import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchAccounts as apiFetchAccounts,
    addAccount as apiAddAccount,
    updateAccount as apiUpdateAccount,
    deleteAccount as apiDeleteAccount,
} from '../../services/api';

export const fetchAccounts = createAsyncThunk(
    'accounts/fetchAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiFetchAccounts();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки счетов');
        }
    }
);

export const addAccount = createAsyncThunk(
    'accounts/addAccount',
    async (accountData, { rejectWithValue }) => {
        try {
            const data = await apiAddAccount(accountData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка добавления счета');
        }
    }
);

export const updateAccount = createAsyncThunk(
    'accounts/updateAccount',
    async ({ id, ...accountData }, { rejectWithValue }) => {
        try {
            const data = await apiUpdateAccount(id, accountData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка обновления счета');
        }
    }
);

export const deleteAccount = createAsyncThunk(
    'accounts/deleteAccount',
    async (accountId, { rejectWithValue }) => {
        try {
            const response = await apiDeleteAccount(accountId);
            return response.id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка удаления счета');
        }
    }
);

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addAccount.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(addAccount.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                const index = state.items.findIndex(acc => acc.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.items = state.items.filter(acc => acc.id !== action.payload);
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const selectAllAccounts = (state) => state.accounts.items;
export const selectAccountById = (state, accountId) => state.accounts.items.find(acc => acc.id === accountId);
export const selectAccountsLoading = (state) => state.accounts.status === 'loading';
export const selectAccountsError = (state) => state.accounts.error;

export default accountsSlice.reducer;