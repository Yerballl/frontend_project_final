import React, { useState } from 'react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Предотвращаем стандартную отправку формы
        // Здесь будет логика для отправки данных на сервер
        console.log('Login attempt with:', { email, password });
        // Например, вызов API для аутентификации
        // alert(`Email: ${email}, Password: ${password}`);
        // После успешного входа можно перенаправить пользователя
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
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
            {/* Можно добавить ссылку на страницу регистрации */}
            {/* <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p> */}
        </div>
    );
}

export default LoginPage;