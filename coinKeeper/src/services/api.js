import axios from 'axios';

// Установите базовый URL вашего API
const API_URL = 'http://localhost:8080'; // Замените на ваш реальный URL API

// Создание экземпляра axios с базовым URL и, возможно, другими настройками
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехватчик запросов для добавления токена авторизации
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Или другое место хранения токена
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Функции для взаимодействия с API

// --- Аутентификация ---
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        // Сохранение токена после успешного входа
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logoutUser = async () => {
    // В зависимости от реализации API, может потребоваться запрос на сервер
    localStorage.removeItem('token');
    // Дополнительно можно отправить запрос на сервер для инвалидации токена
    // await apiClient.post('/auth/logout');
    return Promise.resolve();
};

// --- Транзакции ---
export const getTransactions = async () => {
    try {
        const response = await apiClient.get('/transactions');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const addTransaction = async (transactionData) => {
    try {
        const response = await apiClient.post('/transactions', transactionData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await apiClient.put(`/transactions/${id}`, transactionData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteTransaction = async (id) => {
    try {
        const response = await apiClient.delete(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// --- Категории ---
export const getCategories = async () => {
    try {
        const response = await apiClient.get('/categories');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await apiClient.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await apiClient.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// --- Статистика ---
export const getStatistics = async (params) => { // params может содержать { period, startDate, endDate }
    try {
        const response = await apiClient.get('/statistics', { params });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export default apiClient;