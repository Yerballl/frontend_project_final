// // src/redux/slices/settingsSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const SETTINGS_STORAGE_KEY = 'userAppSettings';

// // Функция для загрузки настроек из localStorage или установки значений по умолчанию
// const loadInitialSettings = () => {
//     const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
//     if (savedSettings) {
//         try {
//             return JSON.parse(savedSettings);
//         } catch (error) {
//             console.error("Ошибка парсинга настроек из localStorage:", error);
//         }
//     }
//     return { // Значения по умолчанию
//         darkMode: false,
//         currency: 'RUB', // Ваша валюта по умолчанию
//         notifications: true,
//         language: 'ru'
//     };
// };

// const initialState = loadInitialSettings();

// const settingsSlice = createSlice({
//     name: 'settings',
//     initialState,
//     reducers: {
//         // Редьюсер для установки всех настроек разом
//         setAllSettings: (state, action) => {
//             // action.payload должен быть объектом настроек
//             state.darkMode = action.payload.darkMode;
//             state.currency = action.payload.currency;
//             state.notifications = action.payload.notifications;
//             state.language = action.payload.language;
//             // Сохраняем в localStorage при каждом изменении в Redux
//             try {
//                 localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
//             } catch (error) {
//                 console.error("Ошибка сохранения настроек в localStorage из Redux:", error);
//             }
//         },
//         // Можно добавить отдельные редьюсеры для каждой настройки, если нужно
//         updateCurrency: (state, action) => {
//             state.currency = action.payload;
//             try {
//                 localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
//             } catch (error) {
//                 console.error("Ошибка сохранения настроек в localStorage из Redux:", error);
//             }
//         },
//         // ... другие редьюсеры для darkMode, notifications, language
//     }
// });

// export const { setAllSettings, updateCurrency } = settingsSlice.actions;

// // Селекторы
// export const selectAllSettings = (state) => state.settings;
// export const selectCurrency = (state) => state.settings.currency;
// export const selectDarkMode = (state) => state.settings.darkMode;
// // ... другие селекторы

// export default settingsSlice.reducer;



// src/redux/slices/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const SETTINGS_STORAGE_KEY = 'userAppSettings';
const THEME_STORAGE_KEY = 'appThemePreference'; // Отдельный ключ для темы

// Функция для загрузки начального состояния темы
const loadInitialTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
        return savedTheme === 'dark';
    }
    // Если не сохранено, проверяем системные предпочтения
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Функция для загрузки остальных настроек
const loadInitialOtherSettings = () => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            // Удаляем isDarkMode, если он там случайно оказался, т.к. он теперь управляется отдельно
            delete parsed.isDarkMode;
            return parsed;
        } catch (error) {
            console.error("Ошибка парсинга настроек из localStorage:", error);
        }
    }
    return { // Значения по умолчанию для других настроек
        currency: 'RUB',
        notifications: true,
        language: 'ru'
    };
};

const initialOtherSettings = loadInitialOtherSettings();
const initialIsDarkMode = loadInitialTheme();

// Применяем тему при первоначальной загрузке
if (initialIsDarkMode) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

const initialState = {
    ...initialOtherSettings,
    isDarkMode: initialIsDarkMode,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setAllSettings: (state, action) => {
            const { darkMode, ...otherSettings } = action.payload;
            Object.assign(state, otherSettings); // Обновляем остальные настройки

            // Сохраняем остальные настройки в localStorage
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(otherSettings));
            } catch (error) {
                console.error("Ошибка сохранения остальных настроек в localStorage из Redux:", error);
            }

            // Обработка темы (если передана)
            if (typeof darkMode === 'boolean' && state.isDarkMode !== darkMode) {
                state.isDarkMode = darkMode;
                if (state.isDarkMode) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem(THEME_STORAGE_KEY, 'light');
                }
            }
        },
        toggleThemeMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
            if (state.isDarkMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem(THEME_STORAGE_KEY, 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem(THEME_STORAGE_KEY, 'light');
            }
        },
        updateCurrency: (state, action) => { // Пример для одной настройки
            state.currency = action.payload;
            // Сохраняем все настройки (кроме темы) при изменении одной
            const { isDarkMode, ...otherSettingsToSave } = state;
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(otherSettingsToSave));
            } catch (error) {
                console.error("Ошибка сохранения настроек (валюта) в localStorage из Redux:", error);
            }
        },
        // ... другие редьюсеры для notifications, language
    }
});

export const { setAllSettings, toggleThemeMode, updateCurrency } = settingsSlice.actions;

// Селекторы
export const selectAllSettings = (state) => state.settings;
export const selectCurrency = (state) => state.settings.currency;
export const selectIsDarkMode = (state) => state.settings.isDarkMode; // <--- Селектор для темы
// ... другие селекторы

export default settingsSlice.reducer;
