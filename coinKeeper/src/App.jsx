import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import TransactionFormPage from './pages/TransactionFormPage';
import NotFoundPage from './pages/NotFoundPage';

// Импорт для аутентификации
import { logoutUser, selectIsAuthenticated, checkAuthAndFetchProfile } from './redux/slices/authSlice';
import './App.css'; // Общие стили для App

// Используем единый компонент ProtectedRoute
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
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            dispatch(checkAuthAndFetchProfile());
        }
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser()).then(() => {
            navigate('/login');
        });
    };

    return (
        <>
            <main className="app-main">
                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Защищенные маршруты */}
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                    <Route path="/transactions/new" element={<ProtectedRoute><TransactionFormPage /></ProtectedRoute>} />
                    <Route path="/transactions/edit/:id" element={<ProtectedRoute><TransactionFormPage /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                    {/* Страница не найдена */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} CoinKeeper App</p>
            </footer>
        </>
    );
}

export default App;