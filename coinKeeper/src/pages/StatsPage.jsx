import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Замените '/api/stats' на ваш реальный эндпоинт API
                const response = await axios.get('/api/stats');
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании

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