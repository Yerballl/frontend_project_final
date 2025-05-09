import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import BalanceDisplay from '../components/dashboard/BalanceDisplay';
import TransactionList from '../components/transactions/TransactionList';
import CategoryList from '../components/categories/CategoryList';
import CategoryModal from '../components/categories/CategoryModal';
import TransactionModal from '../components/transactions/TransactionModal';

import {
  fetchUserBalance,
  selectBalanceAmount,
  selectBalanceLoading,
  selectBalanceError
} from '../redux/slices/balanceSlice';

import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError
} from '../redux/slices/categoriesSlice';

import {
  addTransaction,
  updateTransaction,
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
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Добавим состояние для работы с модальным окном категорий
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Получаем данные категорий из Redux
  const categories = useSelector(selectAllCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchUserBalance());
    dispatch(fetchRecentTransactions({ limit: 5 }));
  }, [dispatch]);

  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = (transactionData) => {
    if (transactionData.id) {
      dispatch(updateTransaction(transactionData))
          .then(() => {
            dispatch(fetchUserBalance());
            setIsTransactionModalOpen(false);
          });
    } else {
      // Добавляем новую транзакцию и затем обновляем баланс
      dispatch(addTransaction(transactionData))
          .then(() => {
            dispatch(fetchUserBalance());
            setIsTransactionModalOpen(false);
          });
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      dispatch(deleteCategory(categoryId));
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (categoryData.id) {
      dispatch(updateCategory({ id: categoryData.id, ...categoryData }));
    } else {
      dispatch(addCategory(categoryData));
    }
  };

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
            <button
                onClick={handleAddTransaction}
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5"
            >
              Добавить транзакцию
            </button>
          </div>

          <section className="bg-white shadow-2xl rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
              Последние Транзакции
            </h2>
            <TransactionList
                transactions={recentTransactions}
                isLoading={transactionsLoading}
                error={transactionsError}
                onEdit={handleEditTransaction}
            />
          </section>

          <section className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 mt-6">
            <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Категории</h2>
              <button
                  onClick={handleAddCategory}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                Добавить категорию
              </button>
            </div>
            <CategoryList
                categories={categories}
                isLoading={categoriesLoading}
                error={categoriesError}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
            />
          </section>

          <CategoryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveCategory}
              category={currentCategory}
          />

          <TransactionModal
              isOpen={isTransactionModalOpen}
              onClose={() => setIsTransactionModalOpen(false)}
              onSave={handleSaveTransaction}
              transaction={currentTransaction}
          />
        </div>
      </div>
  );
};

export default DashboardPage;