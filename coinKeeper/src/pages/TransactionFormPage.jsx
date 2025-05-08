// src/pages/TransactionFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addTransaction, fetchAllTransactions /*, updateTransaction, selectTransactionById */ } from '../redux/slices/transactionsSlice';
import { fetchCategories, selectAllCategories } from '../redux/slices/categoriesSlice';

const TransactionFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: transactionId } = useParams(); // Для режима редактирования
  const isEditMode = !!transactionId;

  // const transactionToEdit = useSelector(state => isEditMode ? selectTransactionById(state, transactionId) : null);
  const categories = useSelector(selectAllCategories);
  const addStatus = useSelector(state => state.transactions.addStatus);
  // const updateStatus = useSelector(state => state.transactions.updateStatus);


  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    // if (isEditMode && transactionToEdit) {
    //   setType(transactionToEdit.type);
    //   setAmount(String(Math.abs(transactionToEdit.amount)));
    //   setCategoryId(transactionToEdit.categoryId);
    //   setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
    //   setComment(transactionToEdit.comment || '');
    // } else if (isEditMode && !transactionToEdit) {
    //   // Возможно, загрузить транзакцию, если ее нет в сторе
    // }
  }, [dispatch, isEditMode, transactionId /*, transactionToEdit*/]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !categoryId || !date) {
      alert('Пожалуйста, заполните все обязательные поля: Сумма, Категория, Дата.');
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
      // await dispatch(updateTransaction({ id: transactionId, ...transactionData }));
      // if (updateStatus === 'succeeded') navigate('/dashboard');
    } else {
      await dispatch(addTransaction(transactionData));
      // После успешного добавления можно перенаправить или очистить форму
      // Этот if (addStatus === 'succeeded') может не сработать сразу из-за асинхронности
      // Лучше использовать useEffect для отслеживания addStatus
    }
  };

  useEffect(() => {
    if (addStatus === 'succeeded') {
        dispatch(fetchAllTransactions()); // Обновить список всех транзакций
        navigate('/dashboard'); // Перенаправляем на дашборд после успешного добавления
    }
    // Добавить аналогично для updateStatus
  }, [addStatus, /*updateStatus,*/ navigate, dispatch]);


  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>{isEditMode ? 'Редактировать транзакцию' : 'Добавить транзакцию'}</h2>
      <form onSubmit={handleSubmit}>
        {/* ... поля формы для типа, суммы, категории, даты, комментария ... */}
        <div>
          <label>Тип: </label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
        </div>
        <div>
          <label>Сумма: </label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <label>Категория: </label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">Выберите категорию</option>
            {categories.filter(cat => cat.type === type || type === '').map(cat => ( // Фильтруем категории по типу транзакции
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Дата: </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Комментарий: </label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button type="submit" disabled={addStatus === 'loading' /*|| updateStatus === 'loading'*/}>
          {addStatus === 'loading' /*|| updateStatus === 'loading'*/ ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Добавить')}
        </button>
      </form>
    </div>
  );
};

export default TransactionFormPage;
