// coinKeeper/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
// Убираем прямой импорт axios, если все запросы будут через api.js
// import axios from 'axios';
import { loginUser, setAuthToken, apiClient } from '../services/api'; // Импортируем функцию loginUser и setAuthToken

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            setAuthToken(token); // Устанавливаем токен для глобального инстанса axios
            // Тут можно добавить логику для проверки токена на сервере при загрузке
            // Например, запрос к /api/users/profile для получения данных пользователя
            // и установки isAuthenticated = true и setUser(userData)
            // Если токен невалидный, то logout()
            setIsAuthenticated(true);
            // Для примера, если бы у вас был эндпоинт для получения данных пользователя по токену:
            apiClient.get('/users/me').then(response => {
                setUser(response.data);
                setIsAuthenticated(true);
            }).catch(() => {
                logout(); // Если токен невалиден или произошла ошибка
            });
        } else {
            setAuthToken(null);
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password); // Используем функцию из api.js
            if (data.token) {
                localStorage.setItem('token', data.token);
                setTokenState(data.token);
                setUser(data.user); // Если API возвращает данные пользователя
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
            setUser(null);
            setTokenState(null);
            localStorage.removeItem('token');
            setAuthToken(null);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setTokenState(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null); // Удаляем токен из заголовков axios
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);