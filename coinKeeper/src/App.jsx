import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import { useAuth } from './contexts/AuthContext'; // Импортируйте useAuth
import './App.css';

// Компонент для защищенных маршрутов
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        // Перенаправляем на страницу входа, если пользователь не аутентифицирован
        return <Navigate to="/login" replace />;
    }
    return children;
}

function App() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <>
            <nav>
                <ul>
                    <li><Link to="/">Главная (Дашборд)</Link></li>
                    {isAuthenticated && <li><Link to="/stats">Статистика</Link></li>}
                    {!isAuthenticated && <li><Link to="/register">Регистрация</Link></li>}
                    {!isAuthenticated && <li><Link to="/login">Вход</Link></li>}
                    {isAuthenticated && (
                        <li>
                            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
                                Выход
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
            <main>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/stats"
                        element={
                            <ProtectedRoute>
                                <StatsPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* Можно добавить маршрут для ненайденных страниц */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </>
    );
}

export default App;