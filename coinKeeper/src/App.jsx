import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
    return (
        <>
            <p>Hello, World!</p>
            <nav>
                <ul>
                    <li><Link to="/login">Вход</Link></li>
                    <li><Link to="/register">Регистрация</Link></li>
                    <li><Link to="/dashboard">Панель</Link></li>
                    <li><Link to="/stats">Статистика</Link></li>
                    <li><Link to="/settings">Настройки</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<DashboardPage />} />
            </Routes>
        </>
    );
}

export default App;