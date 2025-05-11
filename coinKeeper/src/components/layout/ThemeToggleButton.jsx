// src/components/layout/ThemeToggleButton.jsx (пример пути)
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleThemeMode, selectIsDarkMode } from '../../redux/slices/settingsSlice'; // Адаптируйте путь

const ThemeToggleButton = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector(selectIsDarkMode);

    return (
        <button
            onClick={() => dispatch(toggleThemeMode())}
            className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            title={isDarkMode ? "Переключить на светлую тему" : "Переключить на темную тему"}
        >
            {isDarkMode ? (
                // Иконка солнца
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                // Иконка луны
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggleButton;
