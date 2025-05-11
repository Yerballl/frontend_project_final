// import React from 'react';

// const BalanceDisplay = ({ amount, isLoading, error }) => {
//   const numericAmount = parseFloat(amount) || 0;
//   const amountColorClass = numericAmount >= 0 ? 'text-green-600' : 'text-red-600';

//   if (isLoading) {
//     return (
//         <div className="bg-slate-100 p-6 sm:p-8 rounded-xl shadow-lg text-center animate-pulse">
//           <p className="text-lg text-gray-500">Загрузка баланса...</p>
//         </div>
//     );
//   }

//   if (error) {
//     return (
//         <div className="bg-red-50 p-6 sm:p-8 rounded-xl shadow-lg text-center">
//           <p className="text-lg font-semibold text-red-700">Ошибка:</p>
//           <p className="text-sm text-red-600">{error}</p>
//         </div>
//     );
//   }

//   return (
//       <section className="bg-white shadow-xl rounded-xl p-6 sm:p-8 text-center">
//         <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">
//           Текущий Общий Баланс
//         </h2>
//         <p className={`text-4xl sm:text-5xl font-bold ${amountColorClass} tracking-tight`}>
//           {numericAmount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           <span className={`text-3xl sm:text-4xl font-semibold ml-1 ${amountColorClass}`}>₽</span>
//         </p>
//       </section>
//   );
// };

// export default BalanceDisplay;


import React from 'react';

// Добавляем currency в список пропсов, с дефолтным значением на всякий случай
const BalanceDisplay = ({ amount, isLoading, error, currency = 'RUB' }) => {
  const numericAmount = parseFloat(amount) || 0;
  const amountColorClass = numericAmount >= 0 ? 'text-green-600' : 'text-red-600';

  if (isLoading) {
    return (
        <div className="bg-slate-100 p-6 sm:p-8 rounded-xl shadow-lg text-center animate-pulse">
          <p className="text-lg text-gray-500">Загрузка баланса...</p>
          {/* Можно добавить плейсхолдер для суммы */}
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

  // Форматируем сумму с использованием переданной валюты
  const formattedAmount = new Intl.NumberFormat('ru-RU', { // 'ru-RU' для форматирования числа (разделители и т.д.)
    style: 'currency',
    currency: currency, // Используем код валюты из пропа
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
          {/* Символ валюты теперь будет частью formattedAmount, отдельный span не нужен,
              но если вы хотите его стилизовать отдельно, можно оставить, но без жестко заданного '₽' */}
        </p>
      </section>
  );
};

export default BalanceDisplay;
