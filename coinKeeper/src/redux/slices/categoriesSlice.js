import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchCategoriesWithSummary as apiFetchCategoriesWithSummary,
    addCategory as apiAddCategory,
    updateCategory as apiUpdateCategory,
    deleteCategory as apiDeleteCategory
} from '../../services/api';

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiFetchCategoriesWithSummary();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки категорий со сводкой');
        }
    }
);

export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const data = await apiAddCategory(categoryData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка добавления категории');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, ...categoryData }, { rejectWithValue }) => {
        try {
            const data = await apiUpdateCategory(id, categoryData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка обновления категории');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            await apiDeleteCategory(categoryId);
            return categoryId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка удаления категории');
        }
    }
);

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.items.push({ ...action.payload, balance: "0.00" });
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.items.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter(c => c.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoriesLoading = (state) => state.categories.status === 'loading';


export default categoriesSlice.reducer;