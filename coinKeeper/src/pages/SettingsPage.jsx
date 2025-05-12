import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setAllSettings,
    selectAllSettings
} from '../redux/slices/settingsSlice';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const currentGlobalSettings = useSelector(selectAllSettings);

    const [formSettings, setFormSettings] = useState(currentGlobalSettings);

    useEffect(() => {
        setFormSettings(currentGlobalSettings);
    }, [currentGlobalSettings]);

    const handleChange = (key, value) => {
        setFormSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        dispatch(setAllSettings(formSettings));
        alert('Настройки сохранены!');
    };

    if (!formSettings) {
        return <p>Загрузка настроек...</p>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Настройки</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                <div className="setting-item mb-6">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
                    <select
                        id="currency"
                        value={formSettings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        +                    <option value="KZT">Тенге (₸)</option>
                        <option value="RUB">Рубль (₽)</option>
                        <option value="USD">Доллар ($)</option>
                        <option value="EUR">Евро (€)</option>
                    </select>
                </div>

                <div className="setting-item mb-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="notifications" className="text-gray-700 font-medium">Уведомления</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="notifications"
                                id="notifications"
                                checked={formSettings.notifications} 
                                onChange={(e) => handleChange('notifications', e.target.checked)}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label htmlFor="notifications" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                </div>

                <div className="setting-item mb-6">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Язык</label>
                    <select
                        id="language"
                        value={formSettings.language} 
                        onChange={(e) => handleChange('language', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <div className="mt-8 text-right">
                    <button
                        className="save-button px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                        onClick={handleSave}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
