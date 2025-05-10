import React from 'react';
import TransactionItem from './TransactionItem'; // TransactionItem не меняется для этой задачи

const TransactionList = ({ transactions, isLoading, error, onEdit, onDelete }) => {
  const styles = {
    container: {
      // backgroundColor: '#fff',
      // borderRadius: '8px',
      // padding: '10px', // Уменьшим внутренний отступ, если элементы списка имеют свои
      // boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
    },
    list: {
      maxHeight: '400px', // Ограничение высоты для скролла, если список длинный
      overflowY: 'auto',
      paddingRight: '5px', // Небольшой отступ для полосы прокрутки
    },
    loading: { textAlign: 'center', fontSize: '1.1em', color: '#718096', padding: '30px 0' },
    error: { textAlign: 'center', color: '#c53030', padding: '20px', border: '1px solid #fed7d7', backgroundColor: '#fff5f5', borderRadius: '4px' },
    noTransactions: { textAlign: 'center', color: '#718096', padding: '30px 0', fontSize: '1.1em' },
  };

  if (isLoading) {
    return <p style={styles.loading}>Загрузка транзакций...</p>;
  }

  if (error) {
    return <p style={styles.error}>Ошибка загрузки транзакций: {error}</p>;
  }

  if (!transactions || transactions.length === 0) {
    return <p style={styles.noTransactions}>Пока нет транзакций для отображения.</p>;
  }

  return (
      <div style={styles.container}>
        <div style={styles.list}>
          {transactions.map(tx => (
              <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onEdit={() => onEdit(tx)} // Передаем всю транзакцию в onEdit
                  onDelete={() => onDelete(tx.id)} // Передаем ID в onDelete
              />
          ))}
        </div>
      </div>
  );
};

export default TransactionList;