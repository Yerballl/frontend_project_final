import React, { useState, useEffect } from 'react';

const AccountModal = ({ isOpen, onClose, onSave, account = null }) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('💰');
    const [color, setColor] = useState('#4CAF50');
    const [initialBalance, setInitialBalance] = useState('');
    const [error, setError] = useState('');

    const commonIcons = ['💰', '🏦', '💳', '👛', '💵', '🪙', '💼', '🏠'];
    const commonColors = ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#00BCD4', '#795548', '#607D8B'];


    useEffect(() => {
        if (isOpen) {
            if (account) {
                setName(account.name || '');
                setIcon(account.icon || '💰');
                setColor(account.color || '#4CAF50');
                setInitialBalance(account.initial_balance !== undefined ? String(account.initial_balance) : '');
            } else {
                setName('');
                setIcon('💰');
                setColor('#4CAF50');
                setInitialBalance('0');
            }
            setError('');
        }
    }, [account, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Название счета обязательно.');
            return;
        }
        const balanceValue = parseFloat(initialBalance);
        if (isNaN(balanceValue) && (account === null || initialBalance.trim() !== '')) {
            setError('Начальный баланс должен быть числом.');
            return;
        }

        const accountData = {
            name: name.trim(),
            icon,
            color,
            initial_balance: initialBalance.trim() === '' ? (account ? account.initial_balance : 0) : balanceValue,
        };

        onSave(account ? { ...accountData, id: account.id } : accountData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    {account ? 'Редактировать счет' : 'Добавить новый счет'}
                </h3>
                {error && (
                    <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Название счета</label>
                        <input
                            id="accountName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Например, Кошелек Visa"
                        />
                    </div>

                    <div>
                        <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 mb-1">
                            {account ? 'Изменить начальный баланс' : 'Начальный баланс'}
                        </label>
                        <input
                            id="initialBalance"
                            type="number"
                            value={initialBalance}
                            onChange={(e) => setInitialBalance(e.target.value)}
                            step="0.01"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="0.00"
                        />
                        <p className="text-xs text-gray-500 mt-1">Текущий баланс будет пересчитан с учетом транзакций.</p>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Иконка</label>
                        <div className="grid grid-cols-6 gap-2 bg-gray-50 p-2 rounded-lg">
                            {commonIcons.map((emoji, i) => (
                                <button
                                    key={i} type="button" aria-label={`Выбрать иконку ${emoji}`}
                                    className={`w-10 h-10 text-xl flex items-center justify-center rounded-full transition-all ${icon === emoji ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 'hover:bg-gray-200'}`}
                                    onClick={() => setIcon(emoji)}
                                >{emoji}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
                        <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-lg">
                            {commonColors.map((clr, i) => (
                                <button
                                    key={i} type="button" aria-label={`Выбрать цвет ${clr}`}
                                    className={`w-8 h-8 rounded-full transition-all border-2 border-transparent ${color === clr ? 'ring-2 ring-offset-1 ring-indigo-500 border-white' : 'hover:border-gray-400'}`}
                                    style={{ backgroundColor: clr }}
                                    onClick={() => setColor(clr)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Отмена
                        </button>
                        <button type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                            {account ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountModal;