import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import TransactionItem from './TransactionItem';
import { selectAllCategories } from '../../redux/slices/categoriesSlice';
import { selectAllAccounts } from '../../redux/slices/accountsSlice';

const TransactionList = ({ transactions, isLoading, error, onEdit, onDelete, currency }) => {
    const allCategories = useSelector(selectAllCategories);
    const allAccounts = useSelector(selectAllAccounts);

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
        return <p className="text-center text-lg text-gray-500 py-7">Загрузка транзакций...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600 p-5 border border-red-200 bg-red-50 rounded">Ошибка загрузки транзакций: {error}</p>;
    }

    if (!transactions || transactions.length === 0) {
        return <p className="text-center text-gray-500 py-7 text-lg">Пока нет транзакций для отображения.</p>;
    }

    return (
        <div>
            <div className="max-h-[400px] overflow-y-auto pr-1.5">
                {transactions.map(tx => {
                    const category = categoryMap[tx.category_id];
                    const account = accountMap[tx.account_id];

                    return (
                        <TransactionItem
                            key={tx.id}
                            transaction={tx}
                            onEdit={() => onEdit(tx)}
                            onDelete={() => onDelete(tx.id)}
                            currency={currency}
                            categoryName={category?.name}
                            categoryColor={category?.color}
                            categoryIcon={category?.icon}
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