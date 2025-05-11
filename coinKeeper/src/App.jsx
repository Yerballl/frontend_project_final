// import React, { useEffect } from 'react';

// import { useSelector } from 'react-redux'; // Для применения темы при первой загрузке
// import { selectIsDarkMode } from './redux/slices/settingsSlice'; // Адаптируйте путь
// import ThemeToggleButton from './components/layout/ThemeToggleButton'; // Адаптируйте путь

// import { Routes, Route, Link, Navigate, useNavigate, NavLink } from 'react-router-dom'; // Added NavLink
// import { useSelector, useDispatch } from 'react-redux';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage';
// import StatsPage from './pages/StatsPage';
// import SettingsPage from './pages/SettingsPage';
// import HelpPage from './pages/HelpPage'; // Import HelpPage
// import NotFoundPage from './pages/NotFoundPage';
// import Header from './components/layout/Header'; // Import Header
// import { logoutUser, selectIsAuthenticated, checkAuthAndFetchProfile, selectCurrentUser } from './redux/slices/authSlice';

// // ProtectedRoute remains the same
// function ProtectedRoute({ children }) {
//     const isAuthenticated = useSelector(selectIsAuthenticated);
//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }
//     return children;
// }

// function App() {
//     const isAuthenticated = useSelector(selectIsAuthenticated);
//     const dispatch = useDispatch();
//     // navigate is not used directly in App component anymore for logout, Header handles it.

//     useEffect(() => {
//         // If there's a token, try to authenticate and fetch profile
//         if (localStorage.getItem('authToken')) {
//             dispatch(checkAuthAndFetchProfile());
//         }
//     }, [dispatch]);

//     // handleLogout is now in Header component

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-100">
//             {isAuthenticated && <Header />} {/* Render Header if authenticated */}

//             {/* Apply padding-top to main content area if header is present and fixed */}
//             <main className={`app-main flex-grow ${isAuthenticated ? 'pt-16' : ''}`}>
//                 <Routes>
//                     {/* Public Routes */}
//                     <Route path="/login" element={<LoginPage />} />
//                     <Route path="/register" element={<RegisterPage />} />

//                     {/* Protected Routes */}
//                     <Route
//                         path="/dashboard"
//                         element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
//                     />
//                     <Route
//                         path="/stats"
//                         element={<ProtectedRoute><StatsPage /></ProtectedRoute>}
//                     />
//                     <Route
//                         path="/settings"
//                         element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
//                     />
//                     <Route
//                         path="/help"
//                         element={<ProtectedRoute><HelpPage /></ProtectedRoute>} // Add HelpPage route
//                     />
//                     <Route
//                         path="/"
//                         element={
//                             isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
//                         }
//                     />

//                     {/* Not Found Page */}
//                     <Route path="*" element={<NotFoundPage />} />
//                 </Routes>
//             </main>
//         </div>
//     );
// }

// export default App;


import React, { useState, useEffect } from 'react'; // Добавляем useState
// Убираем дублирующиеся и неиспользуемые для этой задачи импорты, связанные с темой из Redux
// import { useSelector } from 'react-redux'; // Этот useSelector используется ниже, оставляем один
// import { selectIsDarkMode } from './redux/slices/settingsSlice'; // Не используем в этом подходе
// import ThemeToggleButton from './components/layout/ThemeToggleButton'; // Не используем в этом подходе, кнопка будет здесь

import { Routes, Route, Navigate, NavLink } from 'react-router-dom'; // NavLink не используется, можно убрать если не нужен
import { useSelector, useDispatch } from 'react-redux'; // Оставляем один импорт useSelector
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/layout/Header';
import { selectIsAuthenticated, checkAuthAndFetchProfile } from './redux/slices/authSlice'; // Убрали logoutUser и selectCurrentUser, если они не используются здесь

// ProtectedRoute остается без изменений
function ProtectedRoute({ children }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    // --- ДОБАВЛЕНО: Логика для управления темой ---
    const THEME_STORAGE_KEY = 'appGlobalTheme';
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem(THEME_STORAGE_KEY, 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem(THEME_STORAGE_KEY, 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };
    // --- КОНЕЦ: Логика для управления темой ---

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            dispatch(checkAuthAndFetchProfile());
        }
    }, [dispatch]);

    return (
        // Применяем классы для фона всей страницы
        <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900`}>
            {isAuthenticated && (
                <>
                    <Header />
                    {/* --- ДОБАВЛЕНО: Кнопка переключения темы --- */}
                    {/* Эта кнопка будет отображаться, когда пользователь аутентифицирован */}
                    {/* Стилизована для примерного размещения в углу */}
                    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1050 }}> {/* zIndex выше чем у Header, если он fixed */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md"
                            title={isDarkMode ? "Светлая тема" : "Темная тема"}
                        >
                            {isDarkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </>
            )}

            {/* Основной контент */}
            {/* Класс для фона основного контента также должен учитывать тему */}
            <main className={`app-main flex-grow ${isAuthenticated ? 'pt-16' : ''} bg-gray-100 dark:bg-slate-900`}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/stats"
                        element={<ProtectedRoute><StatsPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/settings"
                        element={<ProtectedRoute><SettingsPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/help"
                        element={<ProtectedRoute><HelpPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                        }
                    />

                    {/* Not Found Page */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
