import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, NavLink } from 'react-router-dom'; // Added NavLink
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage'; // Import HelpPage
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/layout/Header'; // Import Header
import { logoutUser, selectIsAuthenticated, checkAuthAndFetchProfile, selectCurrentUser } from './redux/slices/authSlice';

// ProtectedRoute remains the same
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
    // navigate is not used directly in App component anymore for logout, Header handles it.

    useEffect(() => {
        // If there's a token, try to authenticate and fetch profile
        if (localStorage.getItem('authToken')) {
            dispatch(checkAuthAndFetchProfile());
        }
    }, [dispatch]);

    // handleLogout is now in Header component

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {isAuthenticated && <Header />} {/* Render Header if authenticated */}

            {/* Apply padding-top to main content area if header is present and fixed */}
            <main className={`app-main flex-grow ${isAuthenticated ? 'pt-16' : ''}`}>
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
                        element={<ProtectedRoute><HelpPage /></ProtectedRoute>} // Add HelpPage route
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