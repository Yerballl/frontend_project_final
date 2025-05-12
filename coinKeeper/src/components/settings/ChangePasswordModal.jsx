import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfileData } from '../../redux/slices/authSlice';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Все поля обязательны для заполнения.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('Новые пароли не совпадают.');
            return;
        }
        if (newPassword.length < 3) {
            setError('Новый пароль слишком короткий (минимум 3 символа).');
            return;
        }

        setLoading(true);
        try {
            await dispatch(updateUserProfileData({ currentPassword, newPassword })).unwrap();
            setSuccessMessage('Пароль успешно изменен!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (rejectedValueOrSerializedError) {
            setError(typeof rejectedValueOrSerializedError === 'string'
                ? rejectedValueOrSerializedError
                : rejectedValueOrSerializedError?.message || 'Ошибка при смене пароля.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Смена пароля
                </h3>
                {error && (
                    <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md">
                        <p className="text-sm">{successMessage}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Текущий пароль</label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Подтвердите новый пароль</label>
                        <input
                            id="confirmNewPassword"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                disabled={loading}>
                            {successMessage ? 'Закрыть' : 'Отмена'}
                        </button>
                        <button type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                                disabled={loading || !!successMessage}>
                            {loading ? 'Сохранение...' : 'Сохранить пароль'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;