// src/components/accounts/AccountList.jsx
import React from 'react';

const AccountListItem = ({ account, onEdit, onDelete }) => {
    const balance = parseFloat(account.balance);
    const balanceColor = balance >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl mr-3 flex-shrink-0"
                    style={{ backgroundColor: account.color || '#CCCCCC' }}
                    title={account.name}
                >
                    {account.icon}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 truncate">{account.name}</p>
                    <p className={`text-xs font-medium ${balanceColor}`}>
                        {balance.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                    </p>
                </div>
            </div>
            <div className="flex space-x-1 flex-shrink-0">
                <button
                    onClick={() => onEdit(account)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                    title="Редактировать счет"
                >
                    {/* Edit Icon (Heroicons Pencil) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(account.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    title="Удалить счет"
                >
                    {/* Delete Icon (Heroicons Trash) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};


const AccountList = ({ accounts, onEdit, onDelete, onAdd, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2].map(i => (
                    <div key={i} className="bg-gray-200 p-4 rounded-lg shadow-md h-16 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-4 bg-red-50 rounded-md">Ошибка загрузки счетов: {error}</div>;
    }

    return (
        <div className="bg-slate-50 p-3 sm:p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Счета</h2>
                <button
                    onClick={onAdd}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    + Счет
                </button>
            </div>
            {(!accounts || accounts.length === 0) && !isLoading && (
                <div className="text-center text-gray-500 py-6 px-3 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="mb-2">У вас пока нет счетов.</p>
                    <button
                        onClick={onAdd}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                        Создать первый счет
                    </button>
                </div>
            )}
            {accounts && accounts.length > 0 && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1"> {/* Added scroll for long lists */}
                    {accounts.map(account => (
                        <AccountListItem
                            key={account.id}
                            account={account}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AccountList;