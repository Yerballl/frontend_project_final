import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useAuth } from '../AuthContext'; // Не обязательно, если axios настроен глобально

const StatsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const { token } = useAuth(); // Можно получить токен, если нужно для чего-то еще

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Замените '/api/stats' на ваш реальный эндпоинт API
                // Если axios настроен глобально в AuthContext, токен уже будет в заголовках
                const response = await axios.get('/api/stats');
                setData(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
                    // Здесь можно также вызвать logout() из useAuth(), если сессия истекла
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Загрузка статистики...</p>;
    }

    if (error) {
        return <p>Ошибка при загрузке данных: {error}</p>;
    }

    return (
        // Add a container for consistent padding
        <div className="container mx-auto p-8"> {/* p-8 will be below the fixed header */}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Статистика</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {data ? (
                    <pre className="text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
                ) : (
                    <p className="text-gray-600">Нет данных для отображения.</p>
                )}
                {loading && <p className="text-gray-600">Загрузка статистики...</p>}
                {error && <p className="text-red-600">Ошибка при загрузке данных: {error}</p>}
            </div>
        </div>
    );
};

export default StatsPage;