import axios from 'axios';

// Настраиваем apiClient с базовым URL
export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
});

// Инициализация токена при загрузке приложения
const token = localStorage.getItem('authToken');
if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

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
        // Предполагается, что /users/logout может не существовать или не требоваться на бэкенде для простого удаления токена
        // Если эндпоинт есть, раскомментируйте строку ниже
        // await apiClient.post('/users/logout');
        setAuthToken(null);
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error.response || error.message);
        setAuthToken(null); // На всякий случай удаляем токен даже при ошибке
        throw error;
    }
};

// Функции API для категорий
export const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Fetch categories API error:", error.response || error.message);
        throw error;
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await apiClient.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error("Add category API error:", error.response || error.message);
        throw error;
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await apiClient.put(`/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Update category API error:", error.response || error.message);
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const response = await apiClient.delete(`/categories/${categoryId}`);
        return response.data; // Обычно возвращает { success: true } или пустой ответ
    } catch (error) {
        console.error("Delete category API error:", error.response || error.message);
        throw error;
    }
};