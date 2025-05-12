import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllCategories } from "../../redux/slices/categoriesSlice";
import { selectAllAccounts } from "../../redux/slices/accountsSlice";

const TransactionModal = ({ isOpen, onClose, onSave, transaction = null, prefillType = null }) => {
    const categories = useSelector(selectAllCategories);
    const accounts = useSelector(selectAllAccounts);

    const [type, setType] = useState(prefillType || 'expense');
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                setType(transaction.type);
                setAmount(String(Math.abs(parseFloat(transaction.amount))));
                setAccountId(String(transaction.accountId || (accounts.length > 0 ? accounts[0].id : '')));
                setCategoryId(String(transaction.categoryId));
                setDate(transaction.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0]);
                setComment(transaction.comment || '');
            } else {
                setType(prefillType || 'expense');
                setAmount('');
                setAccountId(accounts.length > 0 ? String(accounts[0].id) : '');
                setCategoryId('');
                setDate(new Date().toISOString().split('T')[0]);
                setComment('');
            }
            setError('');
        }
    }, [transaction, isOpen, accounts, prefillType]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!amount || !categoryId || !date || !accountId) {
            setError('Пожалуйста, заполните все обязательные поля: Счет, Сумма, Категория, Дата.');
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('Сумма должна быть больше нуля.');
            return;
        }


        const transactionData = {
            ...(transaction && { id: transaction.id }),
            accountId: parseInt(accountId),
            type,
            amount: parseFloat(amount),
            categoryId: parseInt(categoryId),
            date,
            comment,
        };

        onSave(transactionData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    {transaction ? 'Редактировать транзакцию' : (prefillType === 'income' ? 'Добавить доход' : 'Добавить расход')}
                </h3>
                {error && (
                    <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1">Счет</label>
                        <select
                            id="accountId"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Выберите счет</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.icon} {acc.name} ({new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(acc.balance || 0))})
                                </option>
                            ))}
                        </select>
                        {accounts.length === 0 && <p className="text-xs text-gray-500 mt-1">Сначала добавьте счет в разделе "Счета".</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        {!prefillType && (
                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setType('expense')}
                                        className={`flex-1 py-2.5 px-4 text-center text-sm transition-colors ${type === 'expense' ? 'bg-red-500 text-white font-medium' : 'bg-white text-gray-600 hover:bg-red-50'}`}
                                    >
                                        Расход
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('income')}
                                        className={`flex-1 py-2.5 px-4 text-center text-sm transition-colors ${type === 'income' ? 'bg-green-500 text-white font-medium' : 'bg-white text-gray-600 hover:bg-green-50'}`}
                                    >
                                        Доход
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className={`w-full ${!prefillType ? 'sm:w-1/2' : ''}`}>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Сумма</label>
                            <div className="relative">
                                <input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    step="0.01"
                                    min="0.01"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                    placeholder="0.00"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">₽</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                        <select
                            id="categoryId"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="2"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Описание (необязательно)"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                            disabled={accounts.length === 0 && !transaction}
                        >
                            {transaction ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
