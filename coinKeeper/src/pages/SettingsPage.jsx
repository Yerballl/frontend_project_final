import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setAllSettings,
    selectAllSettings
} from '../redux/slices/settingsSlice';
import { updateUserProfileData, selectCurrentUser, selectUserUpdateStatus, selectUserUpdateError } from '../redux/slices/authSlice';
import ChangePasswordModal from '../components/settings/ChangePasswordModal';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const currentGlobalSettings = useSelector(selectAllSettings);

    const userUpdateStatus = useSelector(selectUserUpdateStatus);
    const userUpdateError = useSelector(selectUserUpdateError);


    const [formSettings, setFormSettings] = useState({
        ...currentGlobalSettings,
        currency: currentGlobalSettings.currency || 'KZT'
    });
    const [userName, setUserName] = useState(currentUser?.name || '');
    const [userEmail, setUserEmail] = useState(currentUser?.email || '');
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');


    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        setFormSettings(prev => ({ ...prev, ...currentGlobalSettings, currency: currentGlobalSettings.currency || 'KZT' }));
        if (currentUser) {
            setUserName(currentUser.name);
            setUserEmail(currentUser.email);
        }
    }, [currentGlobalSettings, currentUser]);

    const handleSettingsChange = (key, value) => {
        setFormSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleProfileChange = (setter) => (e) => {
        setter(e.target.value);
        setProfileError('');
        setProfileSuccess('');
    };

    const handleSaveAppSettings = () => {
        const { currency, language } = formSettings;
        dispatch(setAllSettings({ currency, language }));
        alert('Настройки приложения сохранены!');
    };

    const handleSaveProfile = async () => {
        setProfileError('');
        setProfileSuccess('');
        if (!userName.trim() || !userEmail.trim()) {
            setProfileError('Имя и email не могут быть пустыми.');
            return;
        }
        try {
            const result = await dispatch(updateUserProfileData({ name: userName, email: userEmail })).unwrap();
            setProfileSuccess(result.message || 'Профиль успешно обновлен!');
        } catch (rejectedValueOrSerializedError) {
            setProfileError(typeof rejectedValueOrSerializedError === 'string'
                ? rejectedValueOrSerializedError
                : rejectedValueOrSerializedError?.message || 'Ошибка обновления профиля.');
        }
    };


    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Настройки</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Профиль пользователя</h2>
                {profileError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded mb-3">{profileError}</p>}
                {profileSuccess && <p className="text-sm text-green-600 bg-green-100 p-2 rounded mb-3">{profileSuccess}</p>}

                <div className="mb-4">
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={handleProfileChange(setUserName)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="userEmail"
                        value={userEmail}
                        onChange={handleProfileChange(setUserEmail)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Сменить пароль
                    </button>
                    <button
                        className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                        onClick={handleSaveProfile}
                        disabled={userUpdateStatus === 'loading'}
                    >
                        {userUpdateStatus === 'loading' ? 'Сохранение...' : 'Сохранить профиль'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Настройки приложения</h2>
                <div className="setting-item mb-6">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
                    <select
                        id="currency"
                        value={formSettings.currency || 'KZT'}
                        onChange={(e) => handleSettingsChange('currency', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="KZT">Тенге (₸)</option>
                        <option value="RUB">Рубль (₽)</option>
                        <option value="USD">Доллар ($)</option>
                        <option value="EUR">Евро (€)</option>
                    </select>
                </div>

                <div className="mt-8 text-right">
                    <button
                        className="save-button px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                        onClick={handleSaveAppSettings}
                    >
                        Сохранить настройки приложения
                    </button>
                </div>
            </div>
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default SettingsPage;