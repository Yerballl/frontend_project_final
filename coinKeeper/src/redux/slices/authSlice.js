// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ЗАМЕНИТЕ ЭТО НА ВАШИ РЕАЛЬНЫЕ API СЕРВИСЫ
// import { apiLogin, apiRegister, apiFetchProfile, apiLogout } from '../../services/authService';

// --- Mock API Service Functions (ЗАМЕНИТЕ ИХ!) ---
const FAKE_DELAY = 500;
const apiLogin = async (credentials) => {
  console.log('API Call: loginUser', credentials);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  if (credentials.email === 'test@example.com' && credentials.password === 'password') {
    const token = 'fake-jwt-token-' + Date.now();
    const user = { id: 'user1', email: credentials.email, name: 'Тестовый Пользователь' };
    localStorage.setItem('authToken', token); // Сохраняем токен
    return { user, token };
  } else {
    throw { response: { data: { message: 'Неверный email или пароль' } } };
  }
};
const apiRegister = async (userData) => {
  console.log('API Call: registerUser', userData);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  if (userData.email && userData.password) {
    const token = 'fake-jwt-token-' + Date.now();
    const user = { id: 'user' + Date.now(), email: userData.email, name: userData.name || 'Новый Пользователь' };
    localStorage.setItem('authToken', token);
    return { user, token };
  } else {
    throw { response: { data: { message: 'Ошибка регистрации' } } };
  }
};
const apiFetchProfile = async (token) => { // Обычно токен передается в заголовках
  console.log('API Call: fetchProfile with token', token);
  await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
  if (token && token.startsWith('fake-jwt-token')) {
    return { id: 'user1', email: 'test@example.com', name: 'Тестовый Пользователь (профиль)' };
  } else {
    throw { response: { data: { message: 'Невалидный токен или сессия истекла' } } };
  }
};
const apiLogout = async () => { // На бэкенде может быть инвалидация токена
    console.log('API Call: logoutUser');
    await new Promise(resolve => setTimeout(resolve, FAKE_DELAY));
    localStorage.removeItem('authToken'); // Удаляем токен
    return { message: 'Вы успешно вышли' };
};
// --- Конец Mock API ---


export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiLogin(credentials);
      return data; // Ожидаем { user: {...}, token: '...' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await apiRegister(userData);
      return data; // Ожидаем { user: {...}, token: '...' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout(); // На бэкенде может быть инвалидация токена
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка выхода');
    }
  }
);

// Thunk для проверки существующего токена и загрузки профиля пользователя
export const checkAuthAndFetchProfile = createAsyncThunk(
  'auth/checkAuthAndFetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Получаем токен из состояния (или напрямую из localStorage)
    if (!token) {
      return rejectWithValue('Нет токена для аутентификации');
    }
    try {
      const userProfile = await apiFetchProfile(token); // API должен вернуть данные пользователя
      return { user: userProfile, token }; // Возвращаем пользователя и существующий токен
    } catch (error) {
      localStorage.removeItem('authToken'); // Если токен невалиден, удаляем его
      return rejectWithValue(error.response?.data?.message || 'Сессия истекла или невалидна');
    }
  }
);


const initialState = {
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Можно использовать для ручной установки токена, если это необходимо
    // setToken: (state, action) => {
    //   state.token = action.payload;
    //   state.isAuthenticated = !!action.payload;
    //   if (action.payload) localStorage.setItem('authToken', action.payload);
    //   else localStorage.removeItem('authToken');
    // },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => { // Если выход с ошибкой, все равно чистим фронт
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'failed';
        state.error = action.payload; // Можно записать ошибку, если это важно
      })
      // Check Auth and Fetch Profile
      .addCase(checkAuthAndFetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkAuthAndFetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token; // Токен уже должен быть, но можно обновить, если API его возвращает
        state.isAuthenticated = true;
      })
      .addCase(checkAuthAndFetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// export const { setToken } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
