import React from 'react';

const BalanceDisplay = ({ amount, isLoading, error, currency = 'RUB' }) => {
  const numericAmount = parseFloat(amount) || 0;
  const amountColorClass = numericAmount >= 0 ? 'text-green-600' : 'text-red-600';

  if (isLoading) {
    return (
        <div className="bg-slate-100 p-6 sm:p-8 rounded-xl shadow-lg text-center animate-pulse">
          <p className="text-lg text-gray-500">Загрузка баланса...</p>
          <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto mt-2"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 p-6 sm:p-8 rounded-xl shadow-lg text-center">
          <p className="text-lg font-semibold text-red-700">Ошибка загрузки баланса:</p>
          <p className="text-sm text-red-600">{typeof error === 'string' ? error : 'Не удалось получить данные.'}</p>
        </div>
    );
  }

  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  return (
      <section className="bg-white shadow-xl rounded-xl p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">
          Текущий Общий Баланс
        </h2>
        <p className={`text-4xl sm:text-5xl font-bold ${amountColorClass} tracking-tight`}>
          {formattedAmount}
        </p>
      </section>
  );
};

export default BalanceDisplay;
