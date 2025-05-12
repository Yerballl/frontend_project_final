import { createSlice } from '@reduxjs/toolkit';

const SETTINGS_STORAGE_KEY = 'userAppSettings';

const loadInitialSettings = () => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            return {
                currency: parsed.currency === 'USD' || parsed.currency === 'EUR' || parsed.currency === 'RUB' || parsed.currency === 'KZT' ? parsed.currency : 'KZT',
                language: parsed.language || 'ru',
            };
        } catch (error) {
            console.error("Ошибка парсинга настроек из localStorage:", error);
        }
    }
    return {
        currency: 'KZT',
        language: 'ru',
    };
};

const initialState = loadInitialSettings();

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setAllSettings: (state, action) => {
            const { currency, language } = action.payload;

            state.currency = currency || state.currency;
            state.language = language || state.language;

            const settingsToSave = {
                currency: state.currency,
                language: state.language,
            };
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
            } catch (error) {
                console.error("Ошибка сохранения настроек в localStorage из Redux:", error);
            }
        },
        updateCurrency: (state, action) => {
            state.currency = action.payload;
            const settingsToSave = {
                currency: state.currency,
                language: state.language,
            };
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
            } catch (error) {
                console.error("Ошибка сохранения настроек (валюта) в localStorage из Redux:", error);
            }
        },
    }
});

export const { setAllSettings, updateCurrency } = settingsSlice.actions;

export const selectAllSettings = (state) => state.settings;
export const selectCurrency = (state) => state.settings.currency;

export default settingsSlice.reducer;