import { useState } from 'react';
// import './SettingsPage.css';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        darkMode: false,
        currency: 'RUB',
        notifications: true,
        language: 'ru'
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        // Здесь будет логика сохранения настроек
        alert('Настройки сохранены!');
    };

    return (
        // Add a container for consistent padding
        <div className="container mx-auto p-8"> {/* p-8 will be below the fixed header */}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Настройки</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                {/* ... (rest of the form elements, style them with Tailwind if needed) ... */}
                {/* Example for one item with Tailwind */}
                <div className="setting-item mb-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="darkMode" className="text-gray-700 font-medium">Темная тема</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="darkMode"
                                id="darkMode"
                                checked={settings.darkMode}
                                onChange={(e) => handleChange('darkMode', e.target.checked)}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label htmlFor="darkMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                    <style jsx>{`
                        .toggle-checkbox:checked {
                          right: 0;
                          border-color: #4F46E5; /* indigo-600 */
                        }
                        .toggle-checkbox:checked + .toggle-label {
                          background-color: #4F46E5; /* indigo-600 */
                        }
                      `}</style>
                </div>
                <div className="setting-item mb-6">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
                    <select
                        id="currency"
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="RUB">Рубль (₽)</option>
                        <option value="USD">Доллар ($)</option>
                        <option value="EUR">Евро (€)</option>
                    </select>
                </div>
                {/* Apply similar Tailwind classes to other settings items */}
                <div className="setting-item mb-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="notifications" className="text-gray-700 font-medium">Уведомления</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="notifications"
                                id="notifications"
                                checked={settings.notifications}
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
                        value={settings.language}
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