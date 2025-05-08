import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Импортируйте useAuth

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Сброс предыдущих ошибок
        const success = await login(email, password);
        if (success) {
            navigate('/'); // Перенаправление на дашборд после успешного входа
        } else {
            // Обработка ошибки входа (например, показать сообщение)
            setError('Неверный email или пароль. Попробуйте снова.');
            // Пароль можно сбросить для безопасности
            setPassword('');
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
            {/* <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p> */}
        </div>
    );
}

export default LoginPage;