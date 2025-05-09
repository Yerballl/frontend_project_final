import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  fetchUserProfile,
  logoutUser as apiLogout
} from '../../services/api';

// Удаляем все mock-функции API (apiLogin, apiRegister, apiFetchProfile, apiLogout),
// так как теперь используем реальные функции из api.js

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        return await apiLogin(credentials);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
      }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
      try {
        return await apiRegister(userData);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
      }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
        await apiLogout();
        return;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка выхода');
      }
    }
);

export const checkAuthAndFetchProfile = createAsyncThunk(
    'auth/checkAuthAndFetchProfile',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          return rejectWithValue('Нет токена для аутентификации');
        }
        const userProfile = await fetchUserProfile();
        return { user: userProfile, token };
      } catch (error) {
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
