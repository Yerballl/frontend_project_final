import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  fetchUserProfile,
  logoutUser as apiLogout,
  setAuthToken,
  updateUserProfile as apiUpdateUserProfile
} from '../../services/api';

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

export const updateUserProfileData = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { getState, rejectWithValue }) => {
      try {
        const data = await apiUpdateUserProfile(userData);
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка обновления профиля');
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

        setAuthToken(token);

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
  status: 'idle',
  updateStatus: 'idle',
  error: null,
  updateError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(checkAuthAndFetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkAuthAndFetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthAndFetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
        .addCase(updateUserProfileData.pending, (state) => {
          state.updateStatus = 'loading';
          state.updateError = null;
        })
        .addCase(updateUserProfileData.fulfilled, (state, action) => {
          state.updateStatus = 'succeeded';

          if (state.user && action.payload.id === state.user.id) {
            state.user.name = action.payload.name;
            state.user.email = action.payload.email;
            state.user.updated_at = action.payload.updated_at;
          }
        })
        .addCase(updateUserProfileData.rejected, (state, action) => {
          state.updateStatus = 'failed';
          state.updateError = action.payload;
        });
  },
});

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectUserUpdateStatus = (state) => state.auth.updateStatus;
export const selectUserUpdateError = (state) => state.auth.updateError;

export default authSlice.reducer;
