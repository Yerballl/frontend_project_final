import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loginUser, registerUser, logoutUser, checkAuthAndFetchProfile,
    selectIsAuthenticated, selectCurrentUser, selectAuthToken, selectAuthError, selectAuthStatus
} from '../redux/slices/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectAuthToken);
    const error = useSelector(selectAuthError);
    const status = useSelector(selectAuthStatus);

    useEffect(() => {
        if (token) {
            dispatch(checkAuthAndFetchProfile());
        }
    }, [dispatch]);

    // Адаптеры методов для сохранения совместимости с текущим кодом
    const login = async (email, password) => {
        try {
            const resultAction = await dispatch(loginUser({ email, password }));
            if (!resultAction.error) {
                // Даем немного времени на установку токена
                setTimeout(() => dispatch(checkAuthAndFetchProfile()), 100);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const resultAction = await dispatch(registerUser(userData));
            return !resultAction.error;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    };

    const logout = () => {
        dispatch(logoutUser());
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout,
            register,
            token,
            error,
            status
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);