// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Импорт страниц
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import TransactionFormPage from './pages/TransactionFormPage'; // Страница для добавления/редактирования транзакции

// Импорт компонента для защищенных маршрутов
import ProtectedRoute from './components/ProtectedRoute';

// Импорт для аутентификации
import { logoutUser, selectIsAuthenticated, checkAuthAndFetchProfile } from './redux/slices/authSlice';

import './App.css'; // Общие стили для App

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем аутентификацию при загрузке приложения, если есть токен
    if (localStorage.getItem('authToken')) { // Или как вы храните признак аутентификации
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
      <header className="app-header">
        <Link to="/" className="logo-link">CoinKeeper</Link>
        <nav>
          <ul>
            {!isAuthenticated && <li><Link to="/login">Вход</Link></li>}
            {!isAuthenticated && <li><Link to="/register">Регистрация</Link></li>}
            {isAuthenticated && <li><Link to="/dashboard">Панель</Link></li>}
            {isAuthenticated && <li><Link to="/stats">Статистика</Link></li>}
            {isAuthenticated && <li><Link to="/settings">Настройки</Link></li>}
            {isAuthenticated && <li><button onClick={handleLogout} className="logout-button">Выход</button></li>}
          </ul>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Защищенные маршруты */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/transactions/new" element={<TransactionFormPage />} />
            <Route path="/transactions/edit/:id" element={<TransactionFormPage />} /> {/* Для редактирования */}
            {/* Главная страница для авторизованного пользователя */}
            <Route index element={<DashboardPage />} />
          </Route>

          {/* Маршрут по умолчанию (если не авторизован, можно перенаправить на /login) */}
          {/* <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} /> */}


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
// src/App.css