// import React from 'react';
// import TransactionItem from './TransactionItem'; // TransactionItem не меняется для этой задачи

// const TransactionList = ({ transactions, isLoading, error, onEdit, onDelete }) => {
//   const styles = {
//     container: {
//       // backgroundColor: '#fff',
//       // borderRadius: '8px',
//       // padding: '10px', // Уменьшим внутренний отступ, если элементы списка имеют свои
//       // boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
//     },
//     list: {
//       maxHeight: '400px', // Ограничение высоты для скролла, если список длинный
//       overflowY: 'auto',
//       paddingRight: '5px', // Небольшой отступ для полосы прокрутки
//     },
//     loading: { textAlign: 'center', fontSize: '1.1em', color: '#718096', padding: '30px 0' },
//     error: { textAlign: 'center', color: '#c53030', padding: '20px', border: '1px solid #fed7d7', backgroundColor: '#fff5f5', borderRadius: '4px' },
//     noTransactions: { textAlign: 'center', color: '#718096', padding: '30px 0', fontSize: '1.1em' },
//   };

//   if (isLoading) {
//     return <p style={styles.loading}>Загрузка транзакций...</p>;
//   }

//   if (error) {
//     return <p style={styles.error}>Ошибка загрузки транзакций: {error}</p>;
//   }

//   if (!transactions || transactions.length === 0) {
//     return <p style={styles.noTransactions}>Пока нет транзакций для отображения.</p>;
//   }

//   return (
//       <div style={styles.container}>
//         <div style={styles.list}>
//           {transactions.map(tx => (
//               <TransactionItem
//                   key={tx.id}
//                   transaction={tx}
//                   onEdit={() => onEdit(tx)} // Передаем всю транзакцию в onEdit
//                   onDelete={() => onDelete(tx.id)} // Передаем ID в onDelete
//               />
//           ))}
//         </div>
//       </div>
//   );
// };

// export default TransactionList;


import React, { useMemo } from 'react'; // Добавляем useMemo для оптимизации
import { useSelector } from 'react-redux'; // Для получения категорий и счетов
import TransactionItem from './TransactionItem';
import { selectAllCategories } from '../../redux/slices/categoriesSlice'; // Убедитесь, что пути правильные
import { selectAllAccounts } from '../../redux/slices/accountsSlice';   // Убедитесь, что пути правильные

// Добавляем currency в список пропсов
const TransactionList = ({ transactions, isLoading, error, onEdit, onDelete, currency }) => {
  const allCategories = useSelector(selectAllCategories);
  const allAccounts = useSelector(selectAllAccounts);

  const styles = {
    // Ваши стили container, list, loading, error, noTransactions остаются здесь
    // ... (я их убрал для краткости, но они должны быть здесь)
    container: {},
    list: {
      maxHeight: '400px', // Пример
      overflowY: 'auto',
      paddingRight: '5px',
    },
    loading: { textAlign: 'center', fontSize: '1.1em', color: '#718096', padding: '30px 0' },
    error: { textAlign: 'center', color: '#c53030', padding: '20px', border: '1px solid #fed7d7', backgroundColor: '#fff5f5', borderRadius: '4px' },
    noTransactions: { textAlign: 'center', color: '#718096', padding: '30px 0', fontSize: '1.1em' },
  };

  // Создаем карты для быстрого поиска категорий и счетов.
  // useMemo гарантирует, что карты будут пересоздаваться только если allCategories или allAccounts изменятся.
  const categoryMap = useMemo(() =>
    allCategories.reduce((map, cat) => {
      map[cat.id] = cat;
      return map;
    }, {}), [allCategories]);

  const accountMap = useMemo(() =>
    allAccounts.reduce((map, acc) => {
      map[acc.id] = acc;
      return map;
    }, {}), [allAccounts]);

  if (isLoading) {
    return <p style={styles.loading}>Загрузка транзакций...</p>;
  }

  if (error) {
    return <p style={styles.error}>Ошибка загрузки транзакций: {error}</p>;
  }

  if (!transactions || transactions.length === 0) {
    return <p style={styles.noTransactions}>Пока нет транзакций для отображения.</p>;
  }

  return (
      <div style={styles.container}>
        <div style={styles.list}>
          {transactions.map(tx => {
            // Находим соответствующую категорию и счет для текущей транзакции
            const category = categoryMap[tx.category_id];
            const account = accountMap[tx.account_id];

            return (
              <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onEdit={() => onEdit(tx)}
                  onDelete={() => onDelete(tx.id)}
                  currency={currency} // Передаем валюту
                  // Передаем найденные детали категории
                  categoryName={category?.name}
                  categoryColor={category?.color}
                  categoryIcon={category?.icon}
                  // Передаем найденные детали счета
                  accountName={account?.name}
                  accountIcon={account?.icon}
              />
            );
          })}
        </div>
      </div>
  );
};

export default TransactionList;
