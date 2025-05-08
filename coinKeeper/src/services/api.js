// coinKeeper/src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users'; // Или ваш URL API

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data; // Обычно сервер возвращает токен и данные пользователя
    } catch (error) {
        // Обработка ошибок (например, если сервер вернул ошибку)
        console.error("Login API error:", error.response || error.message);
        throw error; // Перебрасываем ошибку для обработки в AuthContext
    }
};

// Сюда можно добавить другие функции API, например, для регистрации, получения статистики и т.д.
// export const registerUser = async (userData) => { ... };
// export const fetchStats = async () => { ... };

// Можно также настроить инстанс axios с базовым URL и заголовками по умолчанию
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Ваш базовый URL API
    // headers: { 'Content-Type': 'application/json' } // Общие заголовки
});

// Функция для установки токена авторизации для всех запросов через apiClient
export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// Пример использования apiClient для запроса статистики
export const getStats = async () => {
    try {
        const response = await apiClient.get('/stats');
        return response.data;
    } catch (error) {
        console.error("Get Stats API error:", error.response || error.message);
        throw error;
    }
};


export { apiClient }; // Экспортируем настроенный инстанс для использования в других частях приложения