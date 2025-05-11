// src/redux/slices/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const SETTINGS_STORAGE_KEY = 'userAppSettings';

// Функция для загрузки настроек из localStorage или установки значений по умолчанию
const loadInitialSettings = () => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
        try {
            return JSON.parse(savedSettings);
        } catch (error) {
            console.error("Ошибка парсинга настроек из localStorage:", error);
        }
    }
    return { // Значения по умолчанию
        darkMode: false,
        currency: 'RUB', // Ваша валюта по умолчанию
        notifications: true,
        language: 'ru'
    };
};

const initialState = loadInitialSettings();

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        // Редьюсер для установки всех настроек разом
        setAllSettings: (state, action) => {
            // action.payload должен быть объектом настроек
            state.darkMode = action.payload.darkMode;
            state.currency = action.payload.currency;
            state.notifications = action.payload.notifications;
            state.language = action.payload.language;
            // Сохраняем в localStorage при каждом изменении в Redux
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
            } catch (error) {
                console.error("Ошибка сохранения настроек в localStorage из Redux:", error);
            }
        },
        // Можно добавить отдельные редьюсеры для каждой настройки, если нужно
        updateCurrency: (state, action) => {
            state.currency = action.payload;
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
            } catch (error) {
                console.error("Ошибка сохранения настроек в localStorage из Redux:", error);
            }
        },
        // ... другие редьюсеры для darkMode, notifications, language
    }
});

export const { setAllSettings, updateCurrency } = settingsSlice.actions;

// Селекторы
export const selectAllSettings = (state) => state.settings;
export const selectCurrency = (state) => state.settings.currency;
export const selectDarkMode = (state) => state.settings.darkMode;
// ... другие селекторы

export default settingsSlice.reducer;
