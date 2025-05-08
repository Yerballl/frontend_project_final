// src/store/slices/categoriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ЗАМЕНИТЕ ЭТО НА ВАШИ РЕАЛЬНЫЕ API СЕРВИСЫ
// import { apiFetchCategories, apiAddCategory, apiUpdateCategory, apiDeleteCategory } from '../../services/categoryService';

// --- Mock API Service Functions (ЗАМЕНИТЕ ИХ!) ---
let mockCategories = [
  { id: 'cat1', name: 'Зарплата', type: 'income', icon: '💰', color: '#4CAF50' },
  { id: 'cat2', name: 'Продукты', type: 'expense', icon: '🛒', color: '#FF9800' },
  { id: 'cat3', name: 'Транспорт', type: 'expense', icon: '🚌', color: '#2196F3' },
];
const apiFetchCategories = async () => {
  console.log('API Call: fetchCategories');
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  return [...mockCategories];
};
const apiAddCategory = async (categoryData) => {
  console.log('API Call: addCategory', categoryData);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  const newCategory = { ...categoryData, id: 'cat' + Date.now() };
  mockCategories.push(newCategory);
  return newCategory;
};
const apiUpdateCategory = async ({ id, ...updateData }) => {
  console.log('API Call: updateCategory', id, updateData);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  const index = mockCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...updateData };
    return mockCategories[index];
  }
  throw { response: { data: { message: 'Категория не найдена' } } };
};
const apiDeleteCategory = async (categoryId) => {
  console.log('API Call: deleteCategory', categoryId);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  const index = mockCategories.findIndex(c => c.id === categoryId);
  if (index !== -1) {
    mockCategories.splice(index, 1);
    return { id: categoryId };
  }
  throw { response: { data: { message: 'Категория не найдена для удаления' } } };
};
// --- Конец Mock API ---

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetchCategories();
      return data; // Ожидаем массив категорий
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
      return data; // Ожидаем созданную категорию
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления категории');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const data = await apiUpdateCategory({ id, ...updateData });
      return data; // Ожидаем обновленную категорию
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
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoryById = (state, categoryId) =>
  state.categories.items.find(category => category.id === categoryId);


export default categoriesSlice.reducer;
