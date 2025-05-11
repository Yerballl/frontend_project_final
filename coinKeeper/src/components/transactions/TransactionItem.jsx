import React from 'react';

const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
  currency = 'RUB',
  categoryName,
  categoryColor,
  categoryIcon,
  accountName,
  accountIcon,
}) => {
  const amount = parseFloat(transaction.amount) || 0;
  const isIncome = transaction.type === 'income';

  let formattedDate = 'Неверная дата';
  if (transaction.transaction_date) {
    try {
      const datePart = transaction.transaction_date.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      if (year && month && day) {
          formattedDate = new Date(year, month - 1, day).toLocaleDateString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric'
          });
      }
    } catch (e) {
      console.error("Error formatting date:", transaction.transaction_date, e);
    }
  }

  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
      <div className={`flex items-center justify-between p-3 mb-2 rounded-lg shadow-sm transition-all hover:shadow-md ${isIncome ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`}>
        <div className="flex items-center overflow-hidden">
          <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white mr-3 flex-shrink-0"
              style={{ backgroundColor: categoryColor || (isIncome ? '#10B981' : '#EF4444') }}
              title={categoryName || 'Без категории'}
          >
            {categoryIcon || (isIncome ? '➕' : '➖')}
          </div>

          <div className="overflow-hidden">
            <div className="font-medium text-gray-800 text-sm">
              {categoryName || (transaction.category_id ? `ID: ${transaction.category_id}` : 'Без категории')}
            </div>
            {accountName && (
                <div className="text-xs text-gray-500">
                  Счет: {accountIcon || '🏦'} {accountName}
                </div>
            )}
            {transaction.comment && <div className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-xs" title={transaction.comment}>{transaction.comment}</div>}
            <div className="text-xs text-gray-400 mt-0.5">
              {formattedDate}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <div className={`font-semibold text-sm ${isIncome ? 'text-green-700' : 'text-red-700'}`}>
            {isIncome ? '+' : '-'}
            {formattedAmount}
          </div>
          <button
              onClick={onEdit}
              className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition"
              title="Редактировать"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition"
              title="Удалить"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
  );
};

export default TransactionItem;
