import React, { useState, useEffect } from 'react';

function CategoryModal({ isOpen, onClose, onSave, category = null }) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('💰');
    const [color, setColor] = useState('#6366f1');

    const icons = ['💰', '🛒', '🍔', '🏠', '🚗', '✈️', '💊', '👕', '📚', '🎮', '🎁', '💼', '💡', '💸', '💳'];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6b7280', '#000000', '#FACC15', '#22C55E', '#0EA5E9'];

    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setIcon(category.icon || '💰');
            setColor(category.color || '#6366f1');
        } else {
            setName('');
            setIcon('💰');
            setColor('#6366f1');
        }
    }, [category, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...(category ? { id: category.id } : {}),
            name,
            icon,
            color
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    {category ? 'Редактировать категорию' : 'Добавить категорию'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                        <input
                            id="categoryName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Например, Продукты"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Иконка</label>
                        <div className="grid grid-cols-5 gap-2 bg-gray-50 p-2 rounded-lg">
                            {icons.map((emoji, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Выбрать иконку ${emoji}`}
                                    className={`w-10 h-10 text-xl flex items-center justify-center rounded-full transition-all ${icon === emoji ? 'bg-indigo-500 text-white ring-2 ring-indigo-300' : 'hover:bg-gray-200'}`}
                                    onClick={() => setIcon(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
                        <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-lg">
                            {colors.map((clr, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Выбрать цвет ${clr}`}
                                    className={`w-8 h-8 rounded-full transition-all border-2 border-transparent ${color === clr ? 'ring-2 ring-offset-1 ring-indigo-500 border-white' : 'hover:border-gray-400'}`}
                                    style={{ backgroundColor: clr }}
                                    onClick={() => setColor(clr)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        >
                            {category ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryModal;