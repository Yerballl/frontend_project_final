import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { addTransaction, fetchAllTransactions } from '../redux/slices/transactionsSlice';
import { fetchCategories, selectAllCategories } from '../redux/slices/categoriesSlice';

const TransactionFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: transactionId } = useParams();
  const isEditMode = !!transactionId;

  const categories = useSelector(selectAllCategories);
  const addStatus = useSelector(state => state.transactions.addStatus);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || !categoryId || !date) {
      setError('Пожалуйста, заполните все обязательные поля: Сумма, Категория, Дата.');
      return;
    }

    const transactionData = {
      type,
      amount: type === 'expense' ? -parseFloat(amount) : parseFloat(amount),
      categoryId,
      date,
      comment,
    };

    if (isEditMode) {
      // Логика для редактирования
    } else {
      await dispatch(addTransaction(transactionData));
    }
  };

  useEffect(() => {
    if (addStatus === 'succeeded') {
      dispatch(fetchAllTransactions());
      navigate('/dashboard');
    }
  }, [addStatus, navigate, dispatch]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-5">
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Назад к панели управления
            </Link>
          </div>

          <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
              {isEditMode ? 'Редактировать транзакцию' : 'Добавить новую транзакцию'}
            </h2>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    Тип транзакции
                  </label>
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-3 px-4 text-center ${type === 'expense' ? 'bg-red-100 text-red-700 font-medium' : 'bg-white text-gray-500'} transition-colors`}
                    >
                      Расход
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-3 px-4 text-center ${type === 'income' ? 'bg-green-100 text-green-700 font-medium' : 'bg-white text-gray-500'} transition-colors`}
                    >
                      Доход
                    </button>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Сумма
                  </label>
                  <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">₽</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Категория
                </label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Выберите категорию</option>
                  {categories && categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Дата
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Комментарий
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Описание транзакции (необязательно)"
                />
              </div>

              <div className="pt-4">
                <button
                    type="submit"
                    disabled={addStatus === 'loading'}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                  {addStatus === 'loading' ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Добавить транзакцию')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default TransactionFormPage;