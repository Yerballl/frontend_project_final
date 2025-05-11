// import { useState } from 'react';
// // import './SettingsPage.css';

// const SettingsPage = () => {
//     const [settings, setSettings] = useState({
//         darkMode: false,
//         currency: 'RUB',
//         notifications: true,
//         language: 'ru'
//     });

//     const handleChange = (key, value) => {
//         setSettings(prev => ({
//             ...prev,
//             [key]: value
//         }));
//     };

//     const handleSave = () => {
//         // Здесь будет логика сохранения настроек
//         alert('Настройки сохранены!');
//     };

//     return (
//         // Add a container for consistent padding
//         <div className="container mx-auto p-8"> {/* p-8 will be below the fixed header */}
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Настройки</h1>

//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
//                 {/* ... (rest of the form elements, style them with Tailwind if needed) ... */}
//                 {/* Example for one item with Tailwind */}
//                 <div className="setting-item mb-6">
//                     <div className="flex items-center justify-between">
//                         <label htmlFor="darkMode" className="text-gray-700 font-medium">Темная тема</label>
//                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                             <input
//                                 type="checkbox"
//                                 name="darkMode"
//                                 id="darkMode"
//                                 checked={settings.darkMode}
//                                 onChange={(e) => handleChange('darkMode', e.target.checked)}
//                                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                             />
//                             <label htmlFor="darkMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
//                         </div>
//                     </div>
//                     <style jsx>{`
//                         .toggle-checkbox:checked {
//                           right: 0;
//                           border-color: #4F46E5; /* indigo-600 */
//                         }
//                         .toggle-checkbox:checked + .toggle-label {
//                           background-color: #4F46E5; /* indigo-600 */
//                         }
//                       `}</style>
//                 </div>
//                 <div className="setting-item mb-6">
//                     <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
//                     <select
//                         id="currency"
//                         value={settings.currency}
//                         onChange={(e) => handleChange('currency', e.target.value)}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                     >
//                         <option value="RUB">Рубль (₽)</option>
//                         <option value="USD">Доллар ($)</option>
//                         <option value="EUR">Евро (€)</option>
//                     </select>
//                 </div>
//                 {/* Apply similar Tailwind classes to other settings items */}
//                 <div className="setting-item mb-6">
//                     <div className="flex items-center justify-between">
//                         <label htmlFor="notifications" className="text-gray-700 font-medium">Уведомления</label>
//                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                             <input
//                                 type="checkbox"
//                                 name="notifications"
//                                 id="notifications"
//                                 checked={settings.notifications}
//                                 onChange={(e) => handleChange('notifications', e.target.checked)}
//                                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                             />
//                             <label htmlFor="notifications" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="setting-item mb-6">
//                     <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Язык</label>
//                     <select
//                         id="language"
//                         value={settings.language}
//                         onChange={(e) => handleChange('language', e.target.value)}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                     >
//                         <option value="ru">Русский</option>
//                         <option value="en">English</option>
//                     </select>
//                 </div>


//                 <div className="mt-8 text-right">
//                     <button
//                         className="save-button px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
//                         onClick={handleSave}
//                     >
//                         Сохранить
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SettingsPage;



// import React, { useState, useEffect } from 'react'; // Добавляем useEffect
// import { useDispatch, useSelector } from 'react-redux'; // Импортируем useDispatch и useSelector из react-redux
// import {
//     setAllSettings, // Экшен для сохранения всех настроек
//     selectAllSettings // Селектор для получения всех настроек
// } from '../redux/slices/settingsSlice';

// const SettingsPage = () => {
//     // Ключ для хранения настроек в localStorage
//     const SETTINGS_STORAGE_KEY = 'userAppSettings';

//     // Функция для загрузки настроек из localStorage или установки значений по умолчанию
//     const loadSettings = () => {
//         const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
//         if (savedSettings) {
//             try {
//                 return JSON.parse(savedSettings);
//             } catch (error) {
//                 console.error("Ошибка парсинга настроек из localStorage:", error);
//                 // Если ошибка парсинга, возвращаем дефолтные
//             }
//         }
//         // Значения по умолчанию, если в localStorage ничего нет или ошибка парсинга
//         return {
//             darkMode: false,
//             currency: 'RUB',
//             notifications: true,
//             language: 'ru'
//         };
//     };

//     const [settings, setSettings] = useState(loadSettings); // Инициализируем состояние загруженными настройками

//     // Если вы хотите, чтобы настройки применялись немедленно (например, темная тема),
//     // а не только сохранялись по кнопке, можно использовать useEffect для отслеживания изменений settings
//     // и применения их к приложению. Но для простоты сохранения/загрузки это не обязательно.

//     const handleChange = (key, value) => {
//         setSettings(prev => ({
//             ...prev,
//             [key]: value
//         }));
//     };

//     const handleSave = () => {
//         try {
//             localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
//             alert('Настройки сохранены в localStorage!');
//         } catch (error) {
//             console.error("Ошибка сохранения настроек в localStorage:", error);
//             alert('Не удалось сохранить настройки.');
//         }
//     };

//     // Этот useEffect может быть полезен, если вы хотите, чтобы какие-то настройки
//     // (например, темная тема или язык) применялись к приложению сразу при их изменении,
//     // а не только после нажатия "Сохранить".
//     // useEffect(() => {
//     //    console.log("Настройки изменились, можно применить их глобально:", settings);
//     //    // Например, для темной темы:
//     //    // document.body.classList.toggle('dark-mode', settings.darkMode);
//     // }, [settings]);


//     return (
//         <div className="container mx-auto p-8">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Настройки</h1>

//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
//                 <div className="setting-item mb-6">
//                     <div className="flex items-center justify-between">
//                         <label htmlFor="darkMode" className="text-gray-700 font-medium">Темная тема</label>
//                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                             <input
//                                 type="checkbox"
//                                 name="darkMode"
//                                 id="darkMode"
//                                 checked={settings.darkMode}
//                                 onChange={(e) => handleChange('darkMode', e.target.checked)}
//                                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                             />
//                             <label htmlFor="darkMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
//                         </div>
//                     </div>
//                     {/* Стили для toggle остаются такими же */}
//                     <style jsx>{`
//                         .toggle-checkbox:checked {
//                           right: 0;
//                           border-color: #4F46E5; /* indigo-600 */
//                         }
//                         .toggle-checkbox:checked + .toggle-label {
//                           background-color: #4F46E5; /* indigo-600 */
//                         }
//                       `}</style>
//                 </div>

//                 <div className="setting-item mb-6">
//                     <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
//                     <select
//                         id="currency"
//                         value={settings.currency}
//                         onChange={(e) => handleChange('currency', e.target.value)}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                     >
//                         <option value="RUB">Рубль (₽)</option>
//                         <option value="USD">Доллар ($)</option>
//                         <option value="EUR">Евро (€)</option>
//                     </select>
//                 </div>

//                 <div className="setting-item mb-6">
//                     <div className="flex items-center justify-between">
//                         <label htmlFor="notifications" className="text-gray-700 font-medium">Уведомления</label>
//                         <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//                             <input
//                                 type="checkbox"
//                                 name="notifications"
//                                 id="notifications"
//                                 checked={settings.notifications}
//                                 onChange={(e) => handleChange('notifications', e.target.checked)}
//                                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                             />
//                             <label htmlFor="notifications" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="setting-item mb-6">
//                     <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Язык</label>
//                     <select
//                         id="language"
//                         value={settings.language}
//                         onChange={(e) => handleChange('language', e.target.value)}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                     >
//                         <option value="ru">Русский</option>
//                         <option value="en">English</option>
//                     </select>
//                 </div>

//                 <div className="mt-8 text-right">
//                     <button
//                         className="save-button px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
//                         onClick={handleSave}
//                     >
//                         Сохранить
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SettingsPage;




// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setAllSettings,     // Экшен для сохранения всех настроек в Redux
    selectAllSettings   // Селектор для получения всех настроек из Redux
} from '../redux/slices/settingsSlice'; // Убедитесь, что путь к вашему слайсу правильный

const SettingsPage = () => {
    const dispatch = useDispatch();
    // 1. Получаем текущие глобальные настройки из Redux store
    const currentGlobalSettings = useSelector(selectAllSettings);

    // 2. Локальное состояние для формы.
    // Инициализируется значениями из Redux store.
    // Это позволяет пользователю изменять значения в форме,
    // и эти изменения не будут сразу влиять на глобальное состояние до нажатия "Сохранить".
    const [formSettings, setFormSettings] = useState(currentGlobalSettings);

    // 3. Синхронизация локального состояния формы с глобальным.
    // Если глобальные настройки изменятся (например, из другого места в приложении или при первой загрузке),
    // локальное состояние формы обновится.
    useEffect(() => {
        setFormSettings(currentGlobalSettings);
    }, [currentGlobalSettings]);

    // Обработчик изменений в полях формы
    const handleChange = (key, value) => {
        setFormSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Обработчик сохранения настроек
    const handleSave = () => {
        // Отправляем экшен в Redux для обновления глобальных настроек
        // данными из локального состояния формы.
        dispatch(setAllSettings(formSettings));
        alert('Настройки сохранены!');
        // Сохранение в localStorage теперь будет происходить внутри редьюсера в settingsSlice.js
    };

    // Если currentGlobalSettings еще не загружены (например, при самом первом рендере,
    // если Redux store инициализируется асинхронно или loadInitialSettings в слайсе еще не отработал),
    // можно показать заглушку или дождаться. В нашем случае loadInitialSettings синхронный.
    if (!formSettings) {
        return <p>Загрузка настроек...</p>; // Или другой индикатор загрузки
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Настройки</h1>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                {/* Темная тема */}
                <div className="setting-item mb-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="darkMode" className="text-gray-700 font-medium">Темная тема</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                type="checkbox"
                                name="darkMode"
                                id="darkMode"
                                checked={formSettings.darkMode} 
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

                {/* Валюта */}
                <div className="setting-item mb-6">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
                    <select
                        id="currency"
                        value={formSettings.currency} 
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="RUB">Рубль (₽)</option>
                        <option value="USD">Доллар ($)</option>
                        <option value="EUR">Евро (€)</option>
                        {/* Добавьте другие валюты, если нужно */}
                    </select>
                </div>

                {/* Уведомления */}
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

                {/* Язык */}
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
