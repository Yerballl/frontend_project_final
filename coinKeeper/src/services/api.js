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

/* Функции API для транзакций */
export const fetchTransactions = async (filters = {}) => {
    try {
        // Построение query параметров из фильтров
        const queryParams = new URLSearchParams();
        if (filters.limit) queryParams.append('limit', filters.limit);
        if (filters.offset) queryParams.append('offset', filters.offset);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await apiClient.get(`/transactions${query}`);
        return response.data;
    } catch (error) {
        console.error("Fetch transactions API error:", error.response || error.message);
        throw error;
    }
};

export const addTransaction = async (transactionData) => {
    try {
        const formattedData = {
            category_id: transactionData.categoryId,
            type: transactionData.type,
            amount: transactionData.amount,
            transaction_date: transactionData.date,
            comment: transactionData.comment
        };

        const response = await apiClient.post('/transactions', formattedData);
        return response.data;
    } catch (error) {
        console.error("Add transaction API error:", error.response || error.message);
        throw error;
    }
};

export const updateTransaction = async (transactionId, transactionData) => {
    try {
        const formattedData = {};
        if (transactionData.categoryId !== undefined) formattedData.category_id = transactionData.categoryId;
        if (transactionData.type !== undefined) formattedData.type = transactionData.type;
        if (transactionData.amount !== undefined) formattedData.amount = transactionData.amount;
        if (transactionData.date !== undefined) formattedData.transaction_date = transactionData.date;
        if (transactionData.comment !== undefined) formattedData.comment = transactionData.comment;

        const response = await apiClient.put(`/transactions/${transactionId}`, formattedData);
        return response.data;
    } catch (error) {
        console.error("Update transaction API error:", error.response || error.message);
        throw error;
    }
};

export const deleteTransaction = async (transactionId) => {
    try {
        const response = await apiClient.delete(`/transactions/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error("Delete transaction API error:", error.response || error.message);
        throw error;
    }
};