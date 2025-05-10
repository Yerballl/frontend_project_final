// src/components/dashboard/BalanceDisplay.jsx
import React from 'react';

const BalanceDisplay = ({ amount, isLoading, error }) => {
  const styles = {
    balanceSection: {
      backgroundColor: '#f0f4f8', // Более светлый фон
      padding: '30px', // Увеличим паддинг
      borderRadius: '12px', // Более скругленные углы
      textAlign: 'center',
      marginBottom: '30px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.08)', // Чуть более выраженная тень
      transition: 'all 0.3s ease-in-out',
    },
    balanceTitle: {
      margin: '0 0 12px 0',
      color: '#374151', // Темнее для лучшего контраста
      fontSize: '1.3em', // Немного больше
      fontWeight: '500',
    },
    balanceAmount: {
      margin: '0',
      color: parseFloat(amount) >= 0 ? '#10B981' : '#EF4444', // Ярче зеленый и красный
      fontSize: '3em', // Значительно больше для акцента
      fontWeight: 'bold',
      letterSpacing: '-0.02em', // Немного уплотним буквы
    },
    currencySymbol: {
      fontSize: '0.8em', // Меньше, чем сумма
      marginLeft: '8px', // Отступ от суммы
      color: parseFloat(amount) >= 0 ? '#10B981' : '#EF4444',
      fontWeight: 'normal',
    },
    loading: { fontSize: '1.5em', color: '#6B7280' }, // Цвет для загрузки
    error: { color: '#D32F2F', fontWeight: 'bold', fontSize: '1.1em'}, // Цвет для ошибки
  };

  if (isLoading) {
    return <div style={styles.balanceSection}><p style={styles.loading}>Загрузка баланса...</p></div>;
  }

  if (error) {
    return <div style={styles.balanceSection}><p style={styles.error}>Ошибка: {error}</p></div>;
  }

  const numericAmount = parseFloat(amount) || 0;

  return (
      <section style={styles.balanceSection}>
        <h2 style={styles.balanceTitle}>Текущий Баланс</h2>
        <p style={styles.balanceAmount}>
          {numericAmount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span style={styles.currencySymbol}>₽</span>
        </p>
      </section>
  );
};

export default BalanceDisplay;