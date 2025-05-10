// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// // import { useAuth } from '../AuthContext'; // Не обязательно, если axios настроен глобально

// const StatsPage = () => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     // const { token } = useAuth(); // Можно получить токен, если нужно для чего-то еще

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Замените '/api/stats' на ваш реальный эндпоинт API
//                 // Если axios настроен глобально в AuthContext, токен уже будет в заголовках
//                 const response = await axios.get('/api/stats');
//                 setData(response.data);
//             } catch (err) {
//                 if (err.response && err.response.status === 401) {
//                     setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
//                     // Здесь можно также вызвать logout() из useAuth(), если сессия истекла
//                 } else {
//                     setError(err.message);
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) {
//         return <p>Загрузка статистики...</p>;
//     }

//     if (error) {
//         return <p>Ошибка при загрузке данных: {error}</p>;
//     }

//     return (
//         // Add a container for consistent padding
//         <div className="container mx-auto p-8"> {/* p-8 will be below the fixed header */}
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Статистика</h1>
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//                 {data ? (
//                     <pre className="text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
//                 ) : (
//                     <p className="text-gray-600">Нет данных для отображения.</p>
//                 )}
//                 {loading && <p className="text-gray-600">Загрузка статистики...</p>}
//                 {error && <p className="text-red-600">Ошибка при загрузке данных: {error}</p>}
//             </div>
//         </div>
//     );
// };

// export default StatsPage;







// src/pages/StatsPage.jsx
// src/pages/StatsPage.jsx
// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios'; // Или ваш настроенный apiClient
// import { useSelector, useDispatch } from 'react-redux'; // <--- Добавляем для получения категорий
// import { Pie, Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
// } from 'chart.js';

// // Импортируем экшен для загрузки категорий и селектор
// import { fetchCategories, selectAllCategories } from '../redux/slices/categoriesSlice'; // <--- Убедитесь, что путь правильный

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement
// );

// const StatsPage = () => {
//     const dispatch = useDispatch(); // <--- Добавляем useDispatch

//     const today = new Date().toISOString().split('T')[0];
//     const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

//     const [startDate, setStartDate] = useState(firstDayOfMonth);
//     const [endDate, setEndDate] = useState(today);

//     const [transactions, setTransactions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Получаем все категории из Redux store
//     const allCategories = useSelector(selectAllCategories); // <--- Получаем категории

//     // Загружаем категории при монтировании компонента
//     useEffect(() => {
//         dispatch(fetchCategories());
//     }, [dispatch]);

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get('/api/transactions/filtered', { // Замените на ваш эндпоинт
//                     params: {
//                         startDate,
//                         endDate,
//                     },
//                 });
//                 // Теперь мы знаем, что response.data - это массив, как вы предоставили
//                 if (Array.isArray(response.data)) {
//                     setTransactions(response.data);
//                 } else {
//                     console.warn("Ответ API для статистики не является массивом:", response.data);
//                     setTransactions([]);
//                 }
//             } catch (err) {
//                 if (err.response && err.response.status === 401) {
//                     setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
//                 } else {
//                     setError(err.message || 'Не удалось загрузить данные для статистики.');
//                 }
//                 setTransactions([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (startDate && endDate && new Date(startDate) <= new Date(endDate)) {
//             fetchData();
//         } else if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
//             setError("Дата начала не может быть позже даты окончания.");
//             setTransactions([]);
//             setLoading(false);
//         }
//     }, [startDate, endDate]);

//     const chartData = useMemo(() => {
//         if (!Array.isArray(transactions) || transactions.length === 0 || !Array.isArray(allCategories) || allCategories.length === 0) {
//             return { incomePie: null, expensePie: null, categoryBar: null };
//         }

//         // Создаем карту категорий для быстрого доступа к имени по ID
//         const categoryMap = allCategories.reduce((map, category) => {
//             map[category.id] = category.name;
//             return map;
//         }, {});

//         const incomeByCategory = {};
//         const expenseByCategory = {};
//         const uniqueCategoryNames = new Set();

//         transactions.forEach(tx => {
//             // Получаем имя категории из карты или используем "Без категории"
//             const categoryName = categoryMap[tx.category_id] || 'Без категории';
//             uniqueCategoryNames.add(categoryName);
//             // Преобразуем amount в число
//             const amount = parseFloat(tx.amount);
//             if (isNaN(amount)) return; // Пропускаем, если сумма не является числом

//             if (tx.type === 'income') {
//                 incomeByCategory[categoryName] = (incomeByCategory[categoryName] || 0) + amount;
//             } else if (tx.type === 'expense') {
//                 expenseByCategory[categoryName] = (expenseByCategory[categoryName] || 0) + amount;
//             }
//         });

//         const categoryLabels = Array.from(uniqueCategoryNames);

//         const incomePieData = {
//             labels: Object.keys(incomeByCategory),
//             datasets: [{
//                 label: 'Доходы по категориям',
//                 data: Object.values(incomeByCategory),
//                 backgroundColor: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#00BCD4', '#03A9F4'],
//                 hoverOffset: 4,
//             }],
//         };

//         const expensePieData = {
//             labels: Object.keys(expenseByCategory),
//             datasets: [{
//                 label: 'Расходы по категориям',
//                 data: Object.values(expenseByCategory),
//                 backgroundColor: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#f48fb1', '#ce93d8'],
//                 hoverOffset: 4,
//             }],
//         };

//         const categoryBarData = {
//             labels: categoryLabels,
//             datasets: [
//                 {
//                     label: 'Доходы',
//                     data: categoryLabels.map(cat => incomeByCategory[cat] || 0),
//                     backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1,
//                 },
//                 {
//                     label: 'Расходы',
//                     data: categoryLabels.map(cat => expenseByCategory[cat] || 0),
//                     backgroundColor: 'rgba(255, 99, 132, 0.6)',
//                     borderColor: 'rgba(255, 99, 132, 1)',
//                     borderWidth: 1,
//                 },
//             ],
//         };

//         return { incomePie: incomePieData, expensePie: expensePieData, categoryBar: categoryBarData };
//     }, [transactions, allCategories]); // Добавляем allCategories в зависимости useMemo

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 font: { size: 16 }
//             },
//             tooltip: { // Настройка всплывающих подсказок для отображения валюты
//                 callbacks: {
//                     label: function(context) {
//                         let label = context.dataset.label || '';
//                         if (label) {
//                             label += ': ';
//                         }
//                         if (context.parsed.y !== null) { // Для Bar chart
//                             label += new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(context.parsed.y);
//                         } else if (context.parsed !== null) { // Для Pie chart
//                              label += new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(context.parsed);
//                         }
//                         return label;
//                     }
//                 }
//             }
//         },
//         scales: { // Настройка осей для Bar chart для отображения валюты
//             y: {
//                 ticks: {
//                     callback: function(value, index, ticks) {
//                         return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value);
//                     }
//                 }
//             }
//         }
//     };

//     // JSX разметка остается такой же, как в предыдущем примере
//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Статистика</h1>

//             <div className="mb-8 p-4 bg-white rounded-lg shadow">
//                 <h2 className="text-xl font-semibold mb-3 text-gray-700">Фильтр по дате</h2>
//                 <div className="flex flex-col sm:flex-row gap-4">
//                     <div className="flex-1">
//                         <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Дата начала:</label>
//                         <input
//                             type="date"
//                             id="startDate"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                     <div className="flex-1">
//                         <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Дата окончания:</label>
//                         <input
//                             type="date"
//                             id="endDate"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {loading && <p className="text-center text-gray-600 py-10">Загрузка статистики...</p>}
//             {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md shadow">{error}</p>}

//             {!loading && !error && (!Array.isArray(transactions) || transactions.length === 0) && (
//                 <p className="text-center text-gray-600 py-10">Нет данных для отображения за выбранный период.</p>
//             )}

//             {!loading && !error && Array.isArray(transactions) && transactions.length > 0 && (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {chartData.incomePie && Object.keys(chartData.incomePie.labels).length > 0 && (
//                         <div className="bg-white p-4 rounded-lg shadow-lg">
//                             <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Доходы по категориям</h2>
//                             <div style={{ height: '300px', width: '100%' }}>
//                                 <Pie data={chartData.incomePie} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Доходы по категориям'}}}} />
//                             </div>
//                         </div>
//                     )}

//                     {chartData.expensePie && Object.keys(chartData.expensePie.labels).length > 0 && (
//                         <div className="bg-white p-4 rounded-lg shadow-lg">
//                             <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Расходы по категориям</h2>
//                             <div style={{ height: '300px', width: '100%' }}>
//                                 <Pie data={chartData.expensePie} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Расходы по категориям'}}}} />
//                             </div>
//                         </div>
//                     )}

//                     {chartData.categoryBar && chartData.categoryBar.labels.length > 0 && (
//                          <div className="bg-white p-4 rounded-lg shadow-lg lg:col-span-2">
//                             <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Доходы и Расходы по категориям</h2>
//                             <div style={{ height: '400px', width: '100%' }}>
//                                 <Bar data={chartData.categoryBar} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Сравнение по категориям'}}}} />
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default StatsPage;


// src/pages/StatsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; // Или ваш настроенный apiClient
import { useSelector, useDispatch } from 'react-redux';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

import { fetchCategories, selectAllCategories } from '../redux/slices/categoriesSlice';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const StatsPage = () => {
    const dispatch = useDispatch();

    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const allCategories = useSelector(selectAllCategories);
    // Новое состояние для выбранных ID категорий
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/transactions/filtered', {
                    params: {
                        startDate,
                        endDate,
                        // Если ваш API поддерживает фильтрацию по категориям на сервере,
                        // передавайте selectedCategoryIds здесь:
                        // category_ids: selectedCategoryIds.join(','), // Например, как строку ID через запятую
                    },
                });
                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    console.warn("Ответ API для статистики не является массивом:", response.data);
                    setTransactions([]);
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
                } else {
                    setError(err.message || 'Не удалось загрузить данные для статистики.');
                }
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        if (startDate && endDate && new Date(startDate) <= new Date(endDate)) {
            fetchData();
        } else if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setError("Дата начала не может быть позже даты окончания.");
            setTransactions([]);
            setLoading(false);
        }
        // Перезагружаем данные, если изменились выбранные категории,
        // ТОЛЬКО ЕСЛИ API поддерживает фильтрацию по категориям на сервере.
        // Если фильтрация на клиенте, то этот useEffect не должен зависеть от selectedCategoryIds.
    }, [startDate, endDate /*, selectedCategoryIds */]); // Раскомментируйте selectedCategoryIds, если API фильтрует

    // Обработчик изменения выбранных категорий
    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryIds(prevSelectedIds =>
            prevSelectedIds.includes(categoryId)
                ? prevSelectedIds.filter(id => id !== categoryId) // Убрать, если уже выбрана
                : [...prevSelectedIds, categoryId] // Добавить, если не выбрана
        );
    };

    const chartData = useMemo(() => {
        // Фильтруем транзакции по выбранным категориям (если какие-то выбраны)
        // Эту фильтрацию делаем на клиенте, если API не поддерживает фильтрацию по категориям.
        const filteredTransactions = selectedCategoryIds.length > 0
            ? transactions.filter(tx => selectedCategoryIds.includes(tx.category_id))
            : transactions; // Если категории не выбраны, используем все транзакции (за выбранный период)

        if (!Array.isArray(filteredTransactions) || filteredTransactions.length === 0 || !Array.isArray(allCategories) || allCategories.length === 0) {
            return { incomePie: null, expensePie: null, categoryBar: null };
        }

        const categoryMap = allCategories.reduce((map, category) => {
            map[category.id] = category.name;
            return map;
        }, {});

        const incomeByCategory = {};
        const expenseByCategory = {};
        const uniqueCategoryNames = new Set();

        filteredTransactions.forEach(tx => { // Используем отфильтрованные транзакции
            const categoryName = categoryMap[tx.category_id] || 'Без категории';
            uniqueCategoryNames.add(categoryName);
            const amount = parseFloat(tx.amount);
            if (isNaN(amount)) return;

            if (tx.type === 'income') {
                incomeByCategory[categoryName] = (incomeByCategory[categoryName] || 0) + amount;
            } else if (tx.type === 'expense') {
                expenseByCategory[categoryName] = (expenseByCategory[categoryName] || 0) + amount;
            }
        });

        const categoryLabels = Array.from(uniqueCategoryNames);

        // ... (остальная логика формирования incomePieData, expensePieData, categoryBarData остается такой же)
        const incomePieData = Object.keys(incomeByCategory).length > 0 ? {
            labels: Object.keys(incomeByCategory),
            datasets: [{
                label: 'Доходы по категориям',
                data: Object.values(incomeByCategory),
                backgroundColor: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#00BCD4', '#03A9F4'],
                hoverOffset: 4,
            }],
        } : null;

        const expensePieData = Object.keys(expenseByCategory).length > 0 ? {
            labels: Object.keys(expenseByCategory),
            datasets: [{
                label: 'Расходы по категориям',
                data: Object.values(expenseByCategory),
                backgroundColor: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#f48fb1', '#ce93d8'],
                hoverOffset: 4,
            }],
        } : null;

        const categoryBarData = categoryLabels.length > 0 ? {
            labels: categoryLabels,
            datasets: [
                {
                    label: 'Доходы',
                    data: categoryLabels.map(cat => incomeByCategory[cat] || 0),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Расходы',
                    data: categoryLabels.map(cat => expenseByCategory[cat] || 0),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        } : null;


        return { incomePie: incomePieData, expensePie: expensePieData, categoryBar: categoryBarData };
    }, [transactions, allCategories, selectedCategoryIds]); // Добавляем selectedCategoryIds в зависимости

    const chartOptions = { /* ... (ваш chartOptions остается таким же) ... */ };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Статистика</h1>

            {/* Фильтры даты */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                 <h2 className="text-xl font-semibold mb-3 text-gray-700">Фильтр по дате</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Дата начала:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate} // Привязка к состоянию startDate
                        onChange={(e) => setStartDate(e.target.value)} // Обновление состояния startDate
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Дата окончания:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate} // Привязка к состоянию endDate
                        onChange={(e) => setEndDate(e.target.value)} // Обновление состояния endDate
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>
        

            {/* Новый блок для выбора категорий */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Фильтр по категориям</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {allCategories.map(category => (
                        <div key={category.id} className="flex items-center">
                            <input
                                id={`category-${category.id}`}
                                type="checkbox"
                                checked={selectedCategoryIds.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-900">
                                {category.name}
                            </label>
                        </div>
                    ))}
                </div>
                {allCategories.length > 0 && (
                    <button
                        onClick={() => setSelectedCategoryIds([])}
                        className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                        disabled={selectedCategoryIds.length === 0}
                    >
                        Сбросить выбор категорий
                    </button>
                )}
            </div>

            {loading && <p className="text-center text-gray-600 py-10">Загрузка статистики...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md shadow">{error}</p>}

            {!loading && !error && (!Array.isArray(transactions) || transactions.length === 0) && (
                <p className="text-center text-gray-600 py-10">Нет транзакций для отображения за выбранный период.</p>
            )}
             {!loading && !error && Array.isArray(transactions) && transactions.length > 0 &&
                (!chartData.incomePie && !chartData.expensePie && !chartData.categoryBar) && (
                <p className="text-center text-gray-600 py-10">Нет данных по выбранным категориям за указанный период.</p>
            )}


            {!loading && !error && Array.isArray(transactions) && transactions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* График доходов по категориям (PieChart) */}
                    {chartData.incomePie && ( // Проверяем, что данные для графика существуют
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Доходы по выбранным категориям</h2>
                            <div style={{ height: '300px', width: '100%' }}>
                                <Pie data={chartData.incomePie} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Доходы по категориям'}}}} />
                            </div>
                        </div>
                    )}


                    {/* График расходов по категориям (PieChart) */}
                    {chartData.expensePie && ( // Проверяем, что данные для графика существуют
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Расходы по выбранным категориям</h2>
                            <div style={{ height: '300px', width: '100%' }}>
                                <Pie data={chartData.expensePie} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Расходы по категориям'}}}} />
                            </div>
                        </div>
                    )}

                    {/* График доходов и расходов по категориям (BarChart) */}
                    {chartData.categoryBar && ( // Проверяем, что данные для графика существуют
                         <div className="bg-white p-4 rounded-lg shadow-lg lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Доходы и Расходы по выбранным категориям</h2>
                            <div style={{ height: '400px', width: '100%' }}>
                                <Bar data={chartData.categoryBar} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Сравнение по категориям'}}}} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatsPage;
