import React from 'react';

function CategoryList({ categories, onEdit, onDelete, isLoading, error }) {
    if (isLoading) {
        return <div className="animate-pulse text-center py-4">Загрузка категорий...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Ошибка: {error}</div>;
    }

    if (!categories || categories.length === 0) {
        return <div className="text-gray-500 text-center py-4">Категории не найдены</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                            style={{ backgroundColor: category.color || '#6366f1' }}
                        >
                            <span>{category.icon || '💰'}</span>
                        </div>
                        <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(category)}
                            className="text-indigo-600 hover:text-indigo-800 transition p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="text-red-600 hover:text-red-800 transition p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CategoryList;