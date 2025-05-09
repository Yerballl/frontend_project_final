import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllCategories } from '../../redux/slices/categoriesSlice'; // Убедитесь, что путь правильный

const TransactionItem = ({ transaction }) => {
  const categories = useSelector(selectAllCategories);
  const category = categories.find(cat => cat.id === transaction.category_id);

  const itemStyle = {
    border: '1px solid #e0e0e0',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: transaction.type === 'income' ? '#e8f5e9' : '#ffebee',
  };
  const amountStyle = {
    fontWeight: 'bold',
    color: transaction.type === 'income' ? 'green' : 'red',
  };

  // Форматирование даты
  let formattedDate = 'Неверная дата';
  if (transaction.transaction_date) {
    try {
      formattedDate = new Date(transaction.transaction_date).toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", transaction.transaction_date, e);
    }
  }


  return (
      <div style={itemStyle}>
        <div>
          <div><strong>Категория:</strong> {category ? `${category.icon || ''} ${category.name}` : (transaction.category_id || 'Без категории')}</div>
          {transaction.comment && <div style={{ fontSize: '0.9em', color: '#555' }}><em>{transaction.comment}</em></div>}
          <div style={{ fontSize: '0.8em', color: '#777' }}>
            Дата: {formattedDate}
          </div>
        </div>
        <div style={amountStyle}>
          {transaction.type === 'income' ? '+' : '-'}{Math.abs(parseFloat(transaction.amount) || 0).toFixed(2)}₽
        </div>
      </div>
  );
};

export default TransactionItem;