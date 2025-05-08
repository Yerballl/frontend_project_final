// src/components/transactions/TransactionItem.jsx
import React from 'react';

const TransactionItem = ({ transaction }) => {
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

  return (
    <div style={itemStyle}>
      <div>
        <div><strong>Категория:</strong> {transaction.category?.name || transaction.categoryId || 'Без категории'}</div>
        {transaction.comment && <div style={{ fontSize: '0.9em', color: '#555' }}><em>{transaction.comment}</em></div>}
        <div style={{ fontSize: '0.8em', color: '#777' }}>
          Дата: {new Date(transaction.date).toLocaleDateString()}
        </div>
      </div>
      <div style={amountStyle}>
        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionItem;
