// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import BalanceDisplay from '../components/dashboard/BalanceDisplay';
import TransactionList from '../components/transactions/TransactionList';

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

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700">Панель Управления</h1>
          </header>

          <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 mb-8">
            <BalanceDisplay
                amount={balanceAmount}
                isLoading={balanceLoading}
                error={balanceError}
            />
          </div>

          <div className="text-center mb-10">
            <Link
                to="/transactions/new"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5"
            >
              Добавить транзакцию
            </Link>
          </div>

          <section className="bg-white shadow-2xl rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
              Последние Транзакции
            </h2>
            <TransactionList
                transactions={recentTransactions}
                isLoading={transactionsLoading}
                error={transactionsError}
            />
          </section>
        </div>
      </div>
  );
};

export default DashboardPage;