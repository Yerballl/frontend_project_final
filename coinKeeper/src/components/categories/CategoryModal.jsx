import React, { useState, useEffect } from 'react';

function CategoryModal({ isOpen, onClose, onSave, category = null }) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('💰');
    const [color, setColor] = useState('#6366f1');

    const icons = ['💰', '🛒', '🍔', '🏠', '🚗', '✈️', '💊', '👕', '📚', '🎮'];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6b7280', '#000000'];

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
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {category ? 'Редактировать категорию' : 'Добавить категорию'}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Название категории"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Иконка</label>
                        <div className="grid grid-cols-5 gap-2">
                            {icons.map((emoji, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`w-10 h-10 flex items-center justify-center rounded-full ${icon === emoji ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-gray-100'}`}
                                    onClick={() => setIcon(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
                        <div className="flex space-x-2">
                            {colors.map((clr, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`w-8 h-8 rounded-full ${color === clr ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                    style={{ backgroundColor: clr }}
                                    onClick={() => setColor(clr)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
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