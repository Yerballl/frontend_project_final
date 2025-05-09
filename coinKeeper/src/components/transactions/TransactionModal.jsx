import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllCategories } from "../../redux/slices/categoriesSlice";

const TransactionModal = ({ isOpen, onClose, onSave, transaction = null }) => {
    const categories = useSelector(selectAllCategories);

    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(transaction.amount < 0 ? Math.abs(transaction.amount) : transaction.amount);
            setCategoryId(transaction.categoryId);
            setDate(transaction.date);
            setComment(transaction.comment || '');
        } else {
            setType('expense');
            setAmount('');
            setCategoryId('');
            setDate(new Date().toISOString().split('T')[0]);
            setComment('');
        }
        setError('');
    }, [transaction, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || !categoryId || !date) {
            setError('Пожалуйста, заполните все обязательные поля: Сумма, Категория, Дата.');
            return;
        }

        const transactionData = {
            ...(transaction && { id: transaction.id }),
            type,
            amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
            categoryId,
            date,
            comment,
        };

        onSave(transactionData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                <div className="bg-white">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {transaction ? 'Редактировать транзакцию' : 'Добавить транзакцию'}
                    </h3>
                        {error && (
                            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                                <div className="w-full sm:w-1/2">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                                        Тип транзакции
                                    </label>
                                    <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setType('expense')}
                                            className={`flex-1 py-3 px-4 text-center ${type === 'expense' ? 'bg-red-100 text-red-700 font-medium' : 'bg-white text-gray-500'}`}
                                        >
                                            Расход
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setType('income')}
                                            className={`flex-1 py-3 px-4 text-center ${type === 'income' ? 'bg-green-100 text-green-700 font-medium' : 'bg-white text-gray-500'}`}
                                        >
                                            Доход
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                                        Сумма
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-400">₽</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                                    Категория
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Выберите категорию</option>
                                    {categories && categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.icon} {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                                    Дата
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                                    Комментарий
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="2"
                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Описание транзакции (необязательно)"
                                />
                            </div>

                            <div className="pt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto sm:ml-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-xl shadow-md"
                                >
                                    {transaction ? 'Сохранить изменения' : 'Добавить транзакцию'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 sm:mt-0 w-full sm:w-auto bg-white text-gray-700 font-medium py-2 px-6 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    );
};

export default TransactionModal;