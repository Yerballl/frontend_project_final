import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchUserBalance, selectBalanceAmount, selectBalanceLoading as selectOverallBalanceLoading, selectBalanceError as selectOverallBalanceError } from '../redux/slices/balanceSlice';
import { fetchCategories, addCategory, updateCategory, deleteCategory as apiDeleteCategoryCall, selectAllCategories, selectCategoriesLoading, selectCategoriesError } from '../redux/slices/categoriesSlice';
import { fetchAccounts, addAccount, updateAccount, deleteAccount as apiDeleteAccountCall, selectAllAccounts, selectAccountsLoading, selectAccountsError } from '../redux/slices/accountsSlice';
import { addTransaction, updateTransaction, deleteTransaction as apiDeleteTransactionCall, fetchTransactions, selectAllTransactions, selectTransactionsStatus, selectTransactionsError } from '../redux/slices/transactionsSlice';
import { selectCurrency } from '../redux/slices/settingsSlice';

import BalanceDisplay from '../components/dashboard/BalanceDisplay';
import TransactionList from '../components/transactions/TransactionList';
import CategoryList from '../components/categories/CategoryList';
import AccountList from '../components/accounts/AccountList';
import TransactionModal from '../components/transactions/TransactionModal';
import CategoryModal from '../components/categories/CategoryModal';
import AccountModal from '../components/accounts/AccountModal';

const BASE_CURRENCY = 'RUB';
const MOCK_EXCHANGE_RATES = {
  [BASE_CURRENCY]: {
    'RUB': 1,
    'USD': 0.011,
    'EUR': 0.010,
  },
};

const convertAmount = (amount, targetCurrency, rates = MOCK_EXCHANGE_RATES, sourceCurrency = BASE_CURRENCY) => {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return 0;
  }
  if (sourceCurrency === targetCurrency) {
    return numericAmount;
  }
  if (rates[sourceCurrency] && rates[sourceCurrency][targetCurrency]) {
    return numericAmount * rates[sourceCurrency][targetCurrency];
  }
  console.warn(`Обменный курс не найден для ${sourceCurrency} -> ${targetCurrency}. Сумма не будет конвертирована.`);
  return numericAmount;
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const currentDisplayCurrency = useSelector(selectCurrency);

  const overallBalanceInBase = useSelector(selectBalanceAmount);
  const overallBalanceLoading = useSelector(selectOverallBalanceLoading);
  const overallBalanceError = useSelector(selectOverallBalanceError);

  const convertedOverallBalance = useMemo(() => {
    return convertAmount(overallBalanceInBase, currentDisplayCurrency);
  }, [overallBalanceInBase, currentDisplayCurrency]);

  const accountsInBase = useSelector(selectAllAccounts);
  const accountsLoading = useSelector(selectAccountsLoading);
  const accountsError = useSelector(selectAccountsError);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const convertedAccounts = useMemo(() => {
    return accountsInBase.map(acc => ({
      ...acc,
      balance: convertAmount(acc.balance, currentDisplayCurrency)
    }));
  }, [accountsInBase, currentDisplayCurrency]);

  const categoriesInBase = useSelector(selectAllCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const convertedCategories = useMemo(() => {
    return categoriesInBase.map(cat => ({
      ...cat,
      balance: convertAmount(cat.balance, currentDisplayCurrency)
    }));
  }, [categoriesInBase, currentDisplayCurrency]);

  const allUserTransactionsInBase = useSelector(selectAllTransactions);
  const transactionsStatus = useSelector(selectTransactionsStatus);
  const transactionsError = useSelector(selectTransactionsError);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionModalPrefillType, setTransactionModalPrefillType] = useState(null);

  const convertedTransactions = useMemo(() => {
    return allUserTransactionsInBase.map(tx => ({
      ...tx,
      amount: convertAmount(tx.amount, currentDisplayCurrency)
    }));
  }, [allUserTransactionsInBase, currentDisplayCurrency]);

  const incomeTransactionsForDisplay = useMemo(() => {
    return convertedTransactions.filter(tx => tx.type === 'income')
        .sort((a,b) => new Date(b.transaction_date) - new Date(a.transaction_date));
  }, [convertedTransactions]);


  useEffect(() => {
    dispatch(fetchUserBalance());
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions({ limit: 20, sort: 'transaction_date', order: 'desc' }));
  }, [dispatch]);

  const refreshAllData = () => {
    dispatch(fetchUserBalance());
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions({ limit: 20, sort: 'transaction_date', order: 'desc' }));
  };

  const handleOpenTransactionModal = (tx = null, type = null) => {
    setCurrentTransaction(tx ? {
      id: tx.id,
      type: tx.type,
      amount: Math.abs(parseFloat(allUserTransactionsInBase.find(origTx => origTx.id === tx.id)?.amount || tx.amount)),
      account_id: tx.account_id,
      category_id: tx.category_id,
      transaction_date: tx.transaction_date.split('T')[0],
      comment: tx.comment || ''
    } : null);
    setTransactionModalPrefillType(type || (tx ? tx.type : 'expense'));
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = (transactionData) => {
    const action = transactionData.id ? updateTransaction({ id: transactionData.id, ...transactionData }) : addTransaction(transactionData);
    dispatch(action).unwrap()
        .then(refreshAllData)
        .catch(err => console.error("Failed to save transaction:", err))
        .finally(() => setIsTransactionModalOpen(false));
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Удалить эту транзакцию?')) {
      dispatch(apiDeleteTransactionCall(transactionId)).unwrap()
          .then(refreshAllData)
          .catch(err => console.error("Failed to delete transaction:", err));
    }
  };

  const handleOpenAccountModal = (acc = null) => {
    const originalAccount = acc ? accountsInBase.find(origAcc => origAcc.id === acc.id) : null;
    setCurrentAccount(originalAccount || acc);
    setIsAccountModalOpen(true);
  };
  const handleSaveAccount = (accountData) => {
    const action = accountData.id ? updateAccount({ id: accountData.id, ...accountData }) : addAccount(accountData);
    dispatch(action).unwrap()
        .then(refreshAllData)
        .catch(err => console.error("Failed to save account:", err))
        .finally(() => setIsAccountModalOpen(false));
  };
  const handleDeleteAccount = (accountId) => {
    if (window.confirm('Удалить этот счет? Все связанные с ним транзакции также будут удалены!')) {
      dispatch(apiDeleteAccountCall(accountId)).unwrap()
          .then(refreshAllData)
          .catch(err => console.error("Failed to delete account:", err));
    }
  };

  const handleOpenCategoryModal = (cat = null) => {
    const originalCategory = cat ? categoriesInBase.find(origCat => origCat.id === cat.id) : null;
    setCurrentCategory(originalCategory || cat);
    setIsCategoryModalOpen(true);
  };
  const handleSaveCategory = (categoryData) => {
    const action = categoryData.id ? updateCategory({id: categoryData.id, ...categoryData}) : addCategory(categoryData);
    dispatch(action).unwrap()
        .then(refreshAllData)
        .catch(err => console.error("Failed to save category:", err))
        .finally(() => setIsCategoryModalOpen(false));
  };
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Удалить эту категорию? Транзакции останутся без категории.')) {
      dispatch(apiDeleteCategoryCall(categoryId)).unwrap()
          .then(refreshAllData)
          .catch(err => console.error("Failed to delete category:", err));
    }
  };


  return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1">
            <button
                onClick={() => handleOpenTransactionModal(null, 'expense')}
                className="w-full flex items-center justify-center text-lg font-semibold py-3 px-6 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-0.5"
            >
              <PlusIcon /> Добавить операцию
            </button>
          </div>
          <div className="md:col-span-2">
            <BalanceDisplay
                amount={convertedOverallBalance}
                isLoading={overallBalanceLoading}
                error={overallBalanceError}
                currency={currentDisplayCurrency}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section className="bg-slate-50 p-3 sm:p-4 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Доходы</h2>
                <button
                    onClick={() => handleOpenTransactionModal(null, 'income')}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-sm"
                >
                  + Доход
                </button>
              </div>
              <TransactionList
                  transactions={incomeTransactionsForDisplay.slice(0, 5)}
                  isLoading={transactionsStatus === 'loading'}
                  error={transactionsError}
                  onEdit={(tx) => handleOpenTransactionModal(tx)}
                  onDelete={handleDeleteTransaction}
                  currency={currentDisplayCurrency}
              />
              {incomeTransactionsForDisplay.length === 0 && transactionsStatus !== 'loading' && <p className="text-sm text-gray-500 text-center py-3">Пока нет доходов.</p>}
            </section>

            <AccountList
                accounts={convertedAccounts}
                isLoading={accountsLoading}
                error={accountsError}
                onAdd={() => handleOpenAccountModal()}
                onEdit={handleOpenAccountModal}
                onDelete={handleDeleteAccount}
                currency={currentDisplayCurrency}
            />

            <section className="bg-slate-50 p-3 sm:p-4 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Категории</h2>
                <button
                    onClick={() => handleOpenCategoryModal()}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors shadow-sm"
                >
                  + Категория
                </button>
              </div>
              <CategoryList
                  categories={convertedCategories.slice(0,6)}
                  isLoading={categoriesLoading}
                  error={categoriesError}
                  onEdit={handleOpenCategoryModal}
                  onDelete={handleDeleteCategory}
                  currency={currentDisplayCurrency}
              />
              {convertedCategories.length === 0 && !categoriesLoading && <p className="text-sm text-gray-500 text-center py-3">Нет категорий.</p>}
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="bg-slate-50 p-3 sm:p-4 rounded-xl shadow-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Все операции</h2>
              <TransactionList
                  transactions={convertedTransactions}
                  isLoading={transactionsStatus === 'loading'}
                  error={transactionsError}
                  onEdit={(tx) => handleOpenTransactionModal(tx)}
                  onDelete={handleDeleteTransaction}
                  currency={currentDisplayCurrency}
              />
              {convertedTransactions.length === 0 && transactionsStatus !== 'loading' && <p className="text-sm text-gray-500 text-center py-3">Операций не найдено.</p>}
            </section>
          </div>
        </div>

        <TransactionModal
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            onSave={handleSaveTransaction}
            transaction={currentTransaction}
            prefillType={transactionModalPrefillType}
        />
        <AccountModal
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
            onSave={handleSaveAccount}
            account={currentAccount}
        />
        <CategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            onSave={handleSaveCategory}
            category={currentCategory}
        />
      </div>
  );
};

export default DashboardPage;