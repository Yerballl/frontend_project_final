import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

// Настраиваем apiClient с базовым URL
export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
});

// Функция для установки токена авторизации
export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
    }
};

// Единые функции API для Redux и Context
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post(`/users/login`, credentials);
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Login API error:", error.response || error.message);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post(`/users/register`, userData);
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Register API error:", error.response || error.message);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await apiClient.get('/users/me');
        return response.data;
    } catch (error) {
        console.error("Fetch profile error:", error.response || error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await apiClient.post('/users/logout');
        setAuthToken(null);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error.response || error.message);
        setAuthToken(null); // На всякий случай удаляем токен даже при ошибке
        throw error;
    }
};