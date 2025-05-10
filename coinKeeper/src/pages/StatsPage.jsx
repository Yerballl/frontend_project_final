import React, { useState, useEffect, useMemo } from 'react';
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
import { apiClient } from '../services/api';

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

    const today = new Date();
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState(formatDateForInput(firstDayCurrentMonth));
    const [endDate, setEndDate] = useState(formatDateForInput(today));
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const allCategories = useSelector(selectAllCategories);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // Store IDs (numbers)

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    startDate,
                    endDate,
                };
                // If categories are selected, pass them. Backend might not use this directly,
                // but we can filter client-side.
                // The backend /api/transactions endpoint supports filtering by a single categoryId,
                // not multiple. So, we will fetch all transactions for the date range
                // and then filter by selected categories on the client side.

                // If you want to filter by *one* category on backend:
                // if (selectedCategoryIds.length === 1) {
                //     params.categoryId = selectedCategoryIds[0];
                // }

                const response = await apiClient.get('/transactions', { params });

                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    console.warn("API response for transactions is not an array:", response.data);
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
    }, [startDate, endDate, dispatch]);

    const handleCategoryChange = (categoryId) => {
        const numCategoryId = Number(categoryId); // Ensure it's a number
        setSelectedCategoryIds(prevSelectedIds =>
            prevSelectedIds.includes(numCategoryId)
                ? prevSelectedIds.filter(id => id !== numCategoryId)
                : [...prevSelectedIds, numCategoryId]
        );
    };

    const filteredTransactionsForChart = useMemo(() => {
        if (selectedCategoryIds.length > 0) {
            return transactions.filter(tx => selectedCategoryIds.includes(tx.category_id));
        }
        return transactions;
    }, [transactions, selectedCategoryIds]);


    const chartData = useMemo(() => {
        if (!Array.isArray(filteredTransactionsForChart) || filteredTransactionsForChart.length === 0 || !Array.isArray(allCategories) || allCategories.length === 0) {
            return { incomePie: null, expensePie: null, categoryBar: null };
        }

        const categoryMap = allCategories.reduce((map, category) => {
            map[category.id] = { name: category.name, color: category.color || '#cccccc' };
            return map;
        }, {});

        const incomeByCategory = {};
        const expenseByCategory = {};
        const uniqueCategoryNamesPresentInTransactions = new Set();

        filteredTransactionsForChart.forEach(tx => {
            const categoryInfo = categoryMap[tx.category_id];
            const categoryName = categoryInfo ? categoryInfo.name : 'Без категории';
            uniqueCategoryNamesPresentInTransactions.add(categoryName); // Add only categories that have transactions

            const amount = parseFloat(tx.amount);
            if (isNaN(amount)) return;

            const currentCategoryData = categoryInfo || { name: 'Без категории', color: '#cccccc' };

            if (tx.type === 'income') {
                if (!incomeByCategory[categoryName]) incomeByCategory[categoryName] = { total: 0, color: currentCategoryData.color };
                incomeByCategory[categoryName].total += amount;
            } else if (tx.type === 'expense') {
                if (!expenseByCategory[categoryName]) expenseByCategory[categoryName] = { total: 0, color: currentCategoryData.color };
                expenseByCategory[categoryName].total += amount;
            }
        });

        const pieChartColors = [
            '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#00BCD4', '#03A9F4',
            '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#f48fb1', '#ce93d8'
        ];
        let colorIndex = 0;

        const getNextColor = () => pieChartColors[colorIndex++ % pieChartColors.length];


        const incomePieData = Object.keys(incomeByCategory).length > 0 ? {
            labels: Object.keys(incomeByCategory),
            datasets: [{
                label: 'Доходы по категориям',
                data: Object.values(incomeByCategory).map(d => d.total),
                backgroundColor: Object.values(incomeByCategory).map(d => d.color || getNextColor()),
                hoverOffset: 4,
            }],
        } : null;

        colorIndex = 0;

        const expensePieData = Object.keys(expenseByCategory).length > 0 ? {
            labels: Object.keys(expenseByCategory),
            datasets: [{
                label: 'Расходы по категориям',
                data: Object.values(expenseByCategory).map(d => d.total),
                backgroundColor: Object.values(expenseByCategory).map(d => d.color || getNextColor()),
                hoverOffset: 4,
            }],
        } : null;

        const barChartLabels = Array.from(uniqueCategoryNamesPresentInTransactions);

        const categoryBarData = barChartLabels.length > 0 ? {
            labels: barChartLabels,
            datasets: [
                {
                    label: 'Доходы',
                    data: barChartLabels.map(catName => incomeByCategory[catName]?.total || 0),
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Расходы',
                    data: barChartLabels.map(catName => expenseByCategory[catName]?.total || 0),
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        } : null;

        return { incomePie: incomePieData, expensePie: expensePieData, categoryBar: categoryBarData };
    }, [filteredTransactionsForChart, allCategories]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Финансовая статистика',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(context.parsed.y);
                        } else if (context.parsed !== null && typeof context.parsed === 'number' ) { // For Pie charts
                            label += new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
        scales: { // Only for Bar chart
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
                    }
                }
            }
        }
    };

    const pieChartOptions = { ...chartOptions, scales: {} }; // Remove scales for Pie charts


    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Статистика</h1>

            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Фильтр по дате</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Дата начала:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Дата окончания:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>


            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Фильтр по категориям (для диаграмм)</h2>
                {allCategories.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {allCategories.map(category => (
                                <div key={category.id} className="flex items-center">
                                    <input
                                        id={`category-${category.id}`}
                                        type="checkbox"
                                        value={category.id} // Ensure value is set for potential form submission (not used here)
                                        checked={selectedCategoryIds.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-900 truncate" title={category.name}>
                                        {category.icon} {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedCategoryIds([])}
                            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={selectedCategoryIds.length === 0}
                        >
                            Сбросить выбор категорий
                        </button>
                    </>
                ) : (
                    <p className="text-gray-500">Категории еще не загружены или отсутствуют.</p>
                )}
            </div>

            {loading && <p className="text-center text-gray-600 py-10">Загрузка статистики...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md shadow">{error}</p>}

            {!loading && !error && filteredTransactionsForChart.length === 0 && (
                <p className="text-center text-gray-600 py-10">
                    {selectedCategoryIds.length > 0 ? "Нет транзакций по выбранным категориям за указанный период." : "Нет транзакций для отображения за выбранный период."}
                </p>
            )}

            {!loading && !error && filteredTransactionsForChart.length > 0 &&
                (!chartData.incomePie && !chartData.expensePie && !chartData.categoryBar) && (
                    <p className="text-center text-gray-600 py-10">Нет данных для построения диаграмм по выбранным фильтрам.</p>
                )}


            {!loading && !error && filteredTransactionsForChart.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {chartData.incomePie && (
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Доходы</h2>
                            <div style={{ height: '300px', width: '100%' }}>
                                <Pie data={chartData.incomePie} options={{...pieChartOptions, plugins: {...pieChartOptions.plugins, title: {...pieChartOptions.plugins.title, text: 'Доходы по категориям'}}}} />
                            </div>
                        </div>
                    )}

                    {chartData.expensePie && (
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Расходы</h2>
                            <div style={{ height: '300px', width: '100%' }}>
                                <Pie data={chartData.expensePie} options={{...pieChartOptions, plugins: {...pieChartOptions.plugins, title: {...pieChartOptions.plugins.title, text: 'Расходы по категориям'}}}} />
                            </div>
                        </div>
                    )}

                    {chartData.categoryBar && (
                        <div className="bg-white p-4 rounded-lg shadow-lg lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Обзор по категориям</h2>
                            <div style={{ height: '400px', width: '100%' }}>
                                <Bar data={chartData.categoryBar} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Доходы и Расходы'}}}} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatsPage;