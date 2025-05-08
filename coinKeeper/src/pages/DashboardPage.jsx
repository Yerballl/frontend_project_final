// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import BalanceDisplay from '../components/dashboard/BalanceDisplay'; // Путь к компоненту
import TransactionList from '../components/transactions/TransactionList'; // Путь к компоненту

import {
  fetchUserBalance,
  selectBalanceAmount,
  selectBalanceLoading,
  selectBalanceError
} from '../redux/slices/balanceSlice';

import {
  fetchRecentTransactions,
  selectRecentTransactions,
  selectRecentTransactionsLoading,
  selectTransactionsError
} from '../redux/slices/transactionsSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();

  const balanceAmount = useSelector(selectBalanceAmount);
  const balanceLoading = useSelector(selectBalanceLoading);
  const balanceError = useSelector(selectBalanceError);

  const recentTransactions = useSelector(selectRecentTransactions);
  const transactionsLoading = useSelector(selectRecentTransactionsLoading);
  const transactionsError = useSelector(selectTransactionsError);

  useEffect(() => {
    dispatch(fetchUserBalance());
    dispatch(fetchRecentTransactions({ limit: 5 }));
  }, [dispatch]);

  const pageStyles = {
    container: { maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { textAlign: 'center', marginBottom: '30px' },
    addTransactionButton: {
      display: 'block',
      width: 'fit-content',
      margin: '0 auto 30px auto',
      padding: '12px 25px',
      backgroundColor: '#4299e1',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '5px',
      fontSize: '1.1em',
      textAlign: 'center',
      transition: 'background-color 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    transactionsSection: { marginTop: '20px' },
    sectionTitle: { fontSize: '1.5em', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' },
  };

  return (
    <div style={pageStyles.container}>
      <header style={pageStyles.header}>
        <h1>Панель Управления</h1>
      </header>

      <BalanceDisplay
        amount={balanceAmount}
        isLoading={balanceLoading}
        error={balanceError}
      />

      <Link
        to="/transactions/new" // Убедитесь, что этот роут настроен для добавления транзакции
        style={pageStyles.addTransactionButton}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2b6cb0'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4299e1'}
      >
        Добавить транзакцию
      </Link>

      <section style={pageStyles.transactionsSection}>
        <h2 style={pageStyles.sectionTitle}>Последние Транзакции</h2>
        <TransactionList
          transactions={recentTransactions}
          isLoading={transactionsLoading}
          error={transactionsError}
        />
      </section>
    </div>
  );
};

export default DashboardPage;
