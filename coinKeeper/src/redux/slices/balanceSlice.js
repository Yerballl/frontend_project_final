import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';

export const fetchUserBalance = createAsyncThunk(
    'balance/fetchUserBalance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/balance');
            return response.data;
        } catch (error) {
            console.error("Ошибка запроса баланса:", error);
            return rejectWithValue('Ошибка загрузки баланса');
        }
    }
);

const initialState = {
    amount: 0,
    status: 'idle',
    error: null
};

const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {},
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
            });
    }
});

export const selectBalanceAmount = (state) => state.balance.amount;
export const selectBalanceLoading = (state) => state.balance.status === 'loading';
export const selectBalanceError = (state) => state.balance.error;

export default balanceSlice.reducer;