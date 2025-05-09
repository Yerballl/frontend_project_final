import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCategories as apiFetchCategories,
  addCategory as apiAddCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory
} from '../../services/api';

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
      try {
        const data = await apiFetchCategories();
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки категорий');
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
        return categoryId; // Возвращаем ID для удаления из состояния
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка удаления категории');
      }
    }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  // Можно добавить отдельные статусы для add, update, delete, если нужна более гранулярная обратная связь
  // addStatus: 'idle', updateStatus: 'idle', deleteStatus: 'idle'
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        // Fetch Categories
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
        // Add Category
        .addCase(addCategory.fulfilled, (state, action) => {
          state.items.push(action.payload);
          // state.addStatus = 'succeeded';
        })
        // .addCase(addCategory.pending, (state) => { state.addStatus = 'loading'; })
        // .addCase(addCategory.rejected, (state, action) => { state.addStatus = 'failed'; state.error = action.payload; })
        // Update Category
        .addCase(updateCategory.fulfilled, (state, action) => {
          const index = state.items.findIndex(c => c.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          // state.updateStatus = 'succeeded';
        })
        // Delete Category
        .addCase(deleteCategory.fulfilled, (state, action) => {
          state.items = state.items.filter(c => c.id !== action.payload);
          // state.deleteStatus = 'succeeded';
        });
  },
});

export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCategoriesError = (state) => state.categories.error;
// Селектор для проверки, загружаются ли категории
export const selectCategoriesLoading = (state) => state.categories.status === 'loading';


export default categoriesSlice.reducer;