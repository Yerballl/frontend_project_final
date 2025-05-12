import { createSlice } from '@reduxjs/toolkit';

const SETTINGS_STORAGE_KEY = 'userAppSettings';
const loadInitialOtherSettings = () => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            return {
                currency: parsed.currency || 'KZT',
                notifications: typeof parsed.notifications === 'boolean' ? parsed.notifications : true,
                language: parsed.language || 'ru'
            };
        } catch (error) {
            console.error("Ошибка парсинга настроек из localStorage:", error);
        }
    }
    return {
        currency: 'KZT',
        notifications: true,
        language: 'ru'
    };
};

const initialOtherSettings = loadInitialOtherSettings();

const initialState = {
    ...initialOtherSettings,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setAllSettings: (state, action) => {
            const otherSettings = action.payload;
            Object.assign(state, otherSettings);

            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(otherSettings));
            } catch (error) {
                console.error("Ошибка сохранения остальных настроек в localStorage из Redux:", error);
            }
        },
        updateCurrency: (state, action) => {
            state.currency = action.payload;
            const otherSettingsToSave = { ...state };
            delete otherSettingsToSave.isDarkMode;

            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(otherSettingsToSave));
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