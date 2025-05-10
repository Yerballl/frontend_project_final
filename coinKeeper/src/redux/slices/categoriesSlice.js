import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchCategoriesWithSummary as apiFetchCategoriesWithSummary, // Используем новую функцию
    addCategory as apiAddCategory,
    updateCategory as apiUpdateCategory,
    deleteCategory as apiDeleteCategory
} from '../../services/api';

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories', // Имя thunk остается прежним для минимизации рефакторинга
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiFetchCategoriesWithSummary(); // Вызываем функцию, получающую категории с балансами
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
            return data; // Возвращаем созданную категорию
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
            return data; // Возвращаем обновленную категорию
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
            return categoryId; // Возвращаем ID для удаления из состояния
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка удаления категории');
        }
    }
);

const initialState = {
    items: [], // Теперь будут содержать категории с полем 'balance'
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Categories (теперь с балансами)
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // action.payload теперь включает 'balance'
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add Category
            .addCase(addCategory.fulfilled, (state, action) => {
                // Оптимистичное добавление. Баланс будет обновлен при следующем fetchCategories.
                // Добавляем новый элемент с временным балансом 0 или без него,
                // так как DashboardPage вызовет fetchCategories для получения актуальных данных.
                state.items.push({ ...action.payload, balance: "0.00" });
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.error = action.payload; // Можно записать ошибку
            })
            // Update Category
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.items.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    // Сохраняем существующий баланс, если action.payload (ответ от PUT) его не содержит,
                    // и обновляем остальные поля. Баланс обновится при следующем fetchCategories.
                    state.items[index] = { ...state.items[index], ...action.payload };
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete Category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter(c => c.id !== action.payload); // action.payload это categoryId
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