import React from 'react';

const BalanceDisplay = ({ amount, isLoading, error }) => {
  const numericAmount = parseFloat(amount) || 0;
  const amountColorClass = numericAmount >= 0 ? 'text-green-600' : 'text-red-600';

  if (isLoading) {
    return (
        <div className="bg-slate-100 p-6 sm:p-8 rounded-xl shadow-lg text-center animate-pulse">
          <p className="text-lg text-gray-500">Загрузка баланса...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 p-6 sm:p-8 rounded-xl shadow-lg text-center">
          <p className="text-lg font-semibold text-red-700">Ошибка:</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  return (
      <section className="bg-white shadow-xl rounded-xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">
          Текущий Общий Баланс
        </h2>
        <p className={`text-4xl sm:text-5xl font-bold ${amountColorClass} tracking-tight`}>
          {numericAmount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className={`text-3xl sm:text-4xl font-semibold ml-1 ${amountColorClass}`}>₽</span>
        </p>
      </section>
  );
};

export default BalanceDisplay;