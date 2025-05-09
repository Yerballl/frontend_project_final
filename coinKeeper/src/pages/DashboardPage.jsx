import React, { useState, useEffect } from 'react';
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
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError
} from '../redux/slices/categoriesSlice';
import CategoryList from '../components/categories/CategoryList';
import CategoryModal from '../components/categories/CategoryModal';

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

          <section className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Категории</h2>
              <button
                  onClick={handleAddCategory}
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Добавить
              </button>
            </div>
            <CategoryList
                categories={categories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                isLoading={categoriesLoading}
                error={categoriesError}
            />
          </section>

          <CategoryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveCategory}
              category={currentCategory}
          />
        </div>
      </div>
  );
};

export default DashboardPage;