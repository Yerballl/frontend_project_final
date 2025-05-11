import React, { useEffect } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/layout/Header';
import { selectIsAuthenticated, checkAuthAndFetchProfile } from './redux/slices/authSlice';

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

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            dispatch(checkAuthAndFetchProfile());
        }
    }, [dispatch]);

    return (
        <div className={`flex flex-col min-h-screen`}>
            {isAuthenticated && (
                <>
                    <Header />
                </>
            )}

            <main className={`app-main flex-grow ${isAuthenticated ? 'pt-16' : ''}`}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
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
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;