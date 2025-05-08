// src/components/dashboard/BalanceDisplay.jsx
import React from 'react';

const BalanceDisplay = ({ amount, isLoading, error }) => {
  const styles = {
    balanceSection: {
      backgroundColor: '#f0f4f8',
      padding: '25px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '30px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    },
    balanceTitle: { margin: '0 0 10px 0', color: '#4a5568', fontSize: '1.2em' },
    balanceAmount: { margin: '0', color: amount >= 0 ? '#38a169' : '#e53e3e', fontSize: '2.8em', fontWeight: 'bold' },
    loading: { fontSize: '1.5em', color: '#718096' },
    error: { color: '#c53030', fontWeight: 'bold'},
  };

  if (isLoading) {
    return <div style={styles.balanceSection}><p style={styles.loading}>Загрузка баланса...</p></div>;
  }

  if (error) {
    return <div style={styles.balanceSection}><p style={styles.error}>Ошибка: {error}</p></div>;
  }

  return (
    <section style={styles.balanceSection}>
      <h2 style={styles.balanceTitle}>Текущий Баланс</h2>
      <p style={styles.balanceAmount}>
        ${(amount || 0).toFixed(2)}
      </p>
    </section>
  );
};

export default BalanceDisplay;
