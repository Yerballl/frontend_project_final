import React from 'react';
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, isLoading, error }) => {
  const styles = {
    loading: { textAlign: 'center', fontSize: '1.1em', color: '#718096', padding: '30px 0' },
    error: { textAlign: 'center', color: '#c53030', padding: '20px', border: '1px solid #fed7d7', backgroundColor: '#fff5f5', borderRadius: '4px' },
    noTransactions: { textAlign: 'center', color: '#718096', padding: '30px 0' },
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
    <div>
      {transactions.map(tx => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
};

export default TransactionList;
