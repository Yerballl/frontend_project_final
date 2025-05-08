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
        <div>
            <h1>Статистика</h1>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Нет данных для отображения.</p>
            )}
        </div>
    );
};

export default StatsPage;