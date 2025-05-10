import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom'; // Link не используется, можно убрать если нет других ссылок

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
  fetchCategories, // Этот thunk теперь загружает категории с балансами
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
  deleteTransaction as apiDeleteTransaction, // Импортируем thunk для удаления транзакции
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const categories = useSelector(selectAllCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategories()); // Загружаем категории с балансами
    dispatch(fetchUserBalance());
    dispatch(fetchRecentTransactions({ limit: 5 }));
  }, [dispatch]);

  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    // Для редактирования, нам нужна "плоская" структура транзакции, как в модальном окне
    const editableTransaction = {
      id: transaction.id,
      type: transaction.type,
      // Сумма в recentTransactions хранится как строка, и всегда положительная.
      // Модальное окно ожидает число.
      amount: parseFloat(transaction.amount),
      categoryId: transaction.category_id,
      date: transaction.transaction_date.split('T')[0], // Убедимся, что дата в формате YYYY-MM-DD
      comment: transaction.comment || ''
    };
    setCurrentTransaction(editableTransaction);
    setIsTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      try {
        await dispatch(apiDeleteTransaction(transactionId)).unwrap();
        // После успешного удаления обновляем данные
        dispatch(fetchUserBalance());
        dispatch(fetchCategories()); // Обновляем балансы категорий
        dispatch(fetchRecentTransactions({ limit: 5 })); // Обновляем список недавних транзакций
      } catch (error) {
        console.error('Ошибка при удалении транзакции:', error);
        // Здесь можно показать уведомление об ошибке
      }
    }
  };


  const handleSaveTransaction = (transactionData) => {
    const actionToDispatch = transactionData.id
        ? updateTransaction({id: transactionData.id, ...transactionData}) // Передаем id и остальные данные
        : addTransaction(transactionData);

    dispatch(actionToDispatch)
        .unwrap()
        .then(() => {
          dispatch(fetchUserBalance());       // Обновляем общий баланс
          dispatch(fetchCategories());       // Обновляем балансы категорий
          dispatch(fetchRecentTransactions({ limit: 5 })); // Обновляем список недавних транзакций
        })
        .catch((error) => {
          console.error("Ошибка сохранения транзакции:", error);
        })
        .finally(() => {
          setIsTransactionModalOpen(false);
        });
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
    if (window.confirm('Вы уверены, что хотите удалить эту категорию? Эта операция не затронет связанные транзакции.')) {
      dispatch(deleteCategory(categoryId))
          .unwrap()
          .then(() => {
            dispatch(fetchCategories()); // Обновляем список категорий (удаленная исчезнет)
            // Общий баланс не изменится, т.к. транзакции не удаляются с категорией
            // Но если бы логика была другой (удаление транзакций), то и fetchUserBalance()
          })
          .catch((error) => {
            console.error("Ошибка удаления категории:", error);
          });
    }
  };

  const handleSaveCategory = (categoryData) => {
    const actionToDispatch = categoryData.id
        ? updateCategory({ id: categoryData.id, ...categoryData })
        : addCategory(categoryData);

    dispatch(actionToDispatch)
        .unwrap()
        .then(() => {
          dispatch(fetchCategories()); // Перезагружаем категории для обновления балансов
        })
        .catch((error) => {
          console.error("Ошибка сохранения категории:", error);
        })
        .finally(() => {
          setIsModalOpen(false);
        });
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
                onDelete={handleDeleteTransaction} // Передаем функцию удаления
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
                categories={categories} // категории теперь содержат поле 'balance'
                isLoading={categoriesLoading}
                error={categoriesError}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
            />
          </section>

          <CategoryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)} // Закрытие управляется здесь
              onSave={handleSaveCategory}
              category={currentCategory}
          />

          <TransactionModal
              isOpen={isTransactionModalOpen}
              onClose={() => setIsTransactionModalOpen(false)} // Закрытие управляется здесь
              onSave={handleSaveTransaction}
              transaction={currentTransaction}
          />
        </div>
      </div>
  );
};

export default DashboardPage;