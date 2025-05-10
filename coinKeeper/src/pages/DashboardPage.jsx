import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Slices and Selectors
import { fetchUserBalance, selectBalanceAmount, selectBalanceLoading as selectOverallBalanceLoading, selectBalanceError as selectOverallBalanceError } from '../redux/slices/balanceSlice';
import { fetchCategories, selectAllCategories, selectCategoriesLoading, selectCategoriesError } from '../redux/slices/categoriesSlice';
import { fetchAccounts, addAccount, updateAccount, deleteAccount as apiDeleteAccountCall, selectAllAccounts, selectAccountsLoading, selectAccountsError } from '../redux/slices/accountsSlice';
import { addTransaction, updateTransaction, deleteTransaction as apiDeleteTransactionCall, fetchTransactions, selectAllTransactions, selectTransactionsStatus, selectTransactionsError } from '../redux/slices/transactionsSlice';

// Components
import BalanceDisplay from '../components/dashboard/BalanceDisplay'; // Overall balance
import TransactionList from '../components/transactions/TransactionList';
import CategoryList from '../components/categories/CategoryList'; // Will be used as is for now
import AccountList from '../components/accounts/AccountList';
import TransactionModal from '../components/transactions/TransactionModal';
import CategoryModal from '../components/categories/CategoryModal';
import AccountModal from '../components/accounts/AccountModal';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


const DashboardPage = () => {
  const dispatch = useDispatch();

  // Overall Balance
  const overallBalance = useSelector(selectBalanceAmount);
  const overallBalanceLoading = useSelector(selectOverallBalanceLoading);
  const overallBalanceError = useSelector(selectOverallBalanceError);

  // Accounts
  const accounts = useSelector(selectAllAccounts);
  const accountsLoading = useSelector(selectAccountsLoading);
  const accountsError = useSelector(selectAccountsError);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  // Categories
  const categories = useSelector(selectAllCategories); // These have their own balances
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Transactions (All for the right panel, income for the left)
  const allUserTransactions = useSelector(selectAllTransactions); // Fetches all user transactions
  const transactionsStatus = useSelector(selectTransactionsStatus); // 'idle', 'loading', 'succeeded', 'failed'
  const transactionsError = useSelector(selectTransactionsError);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionModalPrefillType, setTransactionModalPrefillType] = useState(null); // 'income' or 'expense'

  const incomeTransactions = useMemo(() => {
    return allUserTransactions.filter(tx => tx.type === 'income').sort((a,b) => new Date(b.transaction_date) - new Date(a.transaction_date));
  }, [allUserTransactions]);

  const expenseTransactions = useMemo(() => { // For potential future use
    return allUserTransactions.filter(tx => tx.type === 'expense').sort((a,b) => new Date(b.transaction_date) - new Date(a.transaction_date));
  }, [allUserTransactions]);

  // Initial data fetching
  useEffect(() => {
    dispatch(fetchUserBalance());
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions({ limit: 20 })); // Fetch recent 20 transactions initially for the right panel
  }, [dispatch]);

  const refreshAllData = () => {
    dispatch(fetchUserBalance());
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions({ limit: 20 }));
  };

  // --- Transaction Handlers ---
  const handleOpenTransactionModal = (tx = null, type = null) => {
    setCurrentTransaction(tx ? { // Prepare transaction for modal
      id: tx.id,
      type: tx.type,
      amount: Math.abs(parseFloat(tx.amount)),
      accountId: tx.account_id,
      categoryId: tx.category_id,
      date: tx.transaction_date.split('T')[0],
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

  // --- Account Handlers ---
  const handleOpenAccountModal = (acc = null) => {
    setCurrentAccount(acc);
    setIsAccountModalOpen(true);
  };
  const handleSaveAccount = (accountData) => {
    const action = accountData.id ? updateAccount({ id: accountData.id, ...accountData }) : addAccount(accountData);
    dispatch(action).unwrap()
        .then(refreshAllData) // Refresh all to update balances
        .catch(err => console.error("Failed to save account:", err))
        .finally(() => setIsAccountModalOpen(false));
  };
  const handleDeleteAccount = (accountId) => {
    if (window.confirm('Удалить этот счет? Все связанные с ним транзакции также будут удалены!')) {
      dispatch(apiDeleteAccountCall(accountId)).unwrap()
          .then(refreshAllData) // Refresh all
          .catch(err => console.error("Failed to delete account:", err));
    }
  };

  // --- Category Handlers (mostly unchanged from previous version) ---
  const handleOpenCategoryModal = (cat = null) => { /* ... */ setCurrentCategory(cat); setIsCategoryModalOpen(true); };
  const handleSaveCategory = (categoryData) => { /* ... */ refreshAllData(); setIsCategoryModalOpen(false);}; // Simplified, assuming slice handles update/add then fetch
  const handleDeleteCategory = (categoryId) => { /* ... */ refreshAllData(); };


  return (
      <div className="p-4 md:p-6 lg:p-8 bg-slate-100 min-h-full">
        {/* Top Section: Add Transaction Button & Overall Balance */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1">
            <button
                onClick={() => handleOpenTransactionModal(null, 'expense')} // Default to expense
                className="w-full flex items-center justify-center text-lg font-semibold py-3 px-6 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-0.5"
            >
              <PlusIcon /> Добавить операцию
            </button>
          </div>
          <div className="md:col-span-2">
            <BalanceDisplay
                amount={overallBalance}
                isLoading={overallBalanceLoading}
                error={overallBalanceError}
            />
          </div>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Income Section */}
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
                  transactions={incomeTransactions.slice(0, 5)} // Show recent 5 incomes
                  isLoading={transactionsStatus === 'loading'}
                  error={transactionsError}
                  onEdit={(tx) => handleOpenTransactionModal(tx)}
                  onDelete={handleDeleteTransaction}
              />
              {incomeTransactions.length === 0 && transactionsStatus !== 'loading' && <p className="text-sm text-gray-500 text-center py-3">Пока нет доходов.</p>}
            </section>

            {/* Accounts Section */}
            <AccountList
                accounts={accounts}
                isLoading={accountsLoading}
                error={accountsError}
                onAdd={() => handleOpenAccountModal()}
                onEdit={handleOpenAccountModal}
                onDelete={handleDeleteAccount}
            />

            {/* Categories Section */}
            <section className="bg-slate-50 p-3 sm:p-4 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Категории</h2>
                {/* <button onClick={() => handleOpenCategoryModal()} className="...">+ Категория</button> */}
              </div>
              <CategoryList
                  categories={categories.slice(0,6)} // Show a few categories, can add a "show all" later
                  isLoading={categoriesLoading}
                  error={categoriesError}
                  onEdit={handleOpenCategoryModal}
                  onDelete={handleDeleteCategory}
              />
              {categories.length === 0 && !categoriesLoading && <p className="text-sm text-gray-500 text-center py-3">Нет категорий.</p>}
            </section>
          </div>

          {/* Right Column: All Transactions */}
          <div className="lg:col-span-2">
            <section className="bg-slate-50 p-3 sm:p-4 rounded-xl shadow-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Все операции</h2>
              <TransactionList
                  transactions={allUserTransactions} // Display all fetched transactions
                  isLoading={transactionsStatus === 'loading'}
                  error={transactionsError}
                  onEdit={(tx) => handleOpenTransactionModal(tx)}
                  onDelete={handleDeleteTransaction}
              />
              {allUserTransactions.length === 0 && transactionsStatus !== 'loading' && <p className="text-sm text-gray-500 text-center py-3">Операций не найдено.</p>}
            </section>
          </div>
        </div>

        {/* Modals */}
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
            onSave={(data) => { // Ad-hoc save for categories
              const action = data.id ? updateCategory({id: data.id, ...data}) : addCategory(data);
              dispatch(action).unwrap().then(refreshAllData).catch(console.error).finally(() => setIsCategoryModalOpen(false));
            }}
            category={currentCategory}
        />
      </div>
  );
};

export default DashboardPage;