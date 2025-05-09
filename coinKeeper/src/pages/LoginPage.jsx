import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Неверный email или пароль. Попробуйте снова.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-stretch">
            {/* Декоративная левая панель */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                </div>
                <div className="absolute top-1/4 left-1/4">
                    <div className="w-40 h-40 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-60 blur-xl"></div>
                </div>
                <div className="absolute bottom-1/4 right-1/3">
                    <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-60 blur-lg"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <h1 className="text-5xl font-bold mb-6">CoinKeeper</h1>
                    <p className="text-xl mb-8 max-w-md text-center">Управляйте своими финансами с легкостью и стилем</p>
                    <div className="flex space-x-8 mt-10">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-sm">Простой учет</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-sm">Статистика</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm">Экономия</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Правая панель с формой */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 bg-white">
                <div className="lg:hidden text-center mb-10">
                    <h1 className="text-3xl font-bold text-indigo-700">CoinKeeper</h1>
                    <p className="text-gray-500 mt-1">Управляйте финансами с легкостью</p>
                </div>

                <div className="max-w-md mx-auto w-full">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2 text-gray-800">Добро пожаловать!</h2>
                        <p className="text-gray-500">Войдите в свой аккаунт, чтобы продолжить</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1 pl-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Пароль
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    name="remember_me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                                    Запомнить меня
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
                                    Забыли пароль?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            >
                                Войти
                            </button>
                        </div>
                    </form>

                    <div className="relative mt-12 mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">или продолжить с</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z" fill="#1877F2"/>
                            </svg>
                        </button>
                        <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM18 16.58C18 19.07 15.07 21 12 21C8.93 21 6 19.07 6 16.58C6 14.09 8.93 12 12 12C15.07 12 18 14.09 18 16.58Z" fill="#EA4335"/>
                            </svg>
                        </button>
                        <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <path d="M21.5884 12.2363C21.5884 11.5117 21.5259 10.8159 21.4009 10.1514H12.2373V14.0774H17.4989C17.2864 15.2052 16.6489 16.1607 15.6788 16.7995V19.4204H18.9196C20.7587 17.7241 21.5884 15.2114 21.5884 12.2363Z" fill="#4285F4"/>
                                <path d="M12.2371 21.8741C14.9496 21.8741 17.2348 20.9199 18.9193 19.4202L15.6786 16.7994C14.828 17.384 13.6995 17.7365 12.2371 17.7365C9.65044 17.7365 7.46847 16.0089 6.75413 13.6748H3.41138V16.3766C5.08859 19.6335 8.39759 21.8741 12.2371 21.8741Z" fill="#34A853"/>
                                <path d="M6.75432 13.675C6.5731 13.0354 6.47244 12.3587 6.47244 11.6622C6.47244 10.9656 6.5731 10.2889 6.75432 9.6494V6.94751H3.41157C2.71651 8.36079 2.3241 10.0594 2.3241 11.6622C2.3241 13.2649 2.71651 14.9635 3.41157 16.3768L6.75432 13.675Z" fill="#FBBC05"/>
                                <path d="M12.2371 5.58783C13.7454 5.58783 15.0905 6.10474 16.1446 7.10473L19.0334 4.21595C17.2318 2.52345 14.9466 1.45044 12.2371 1.45044C8.39759 1.45044 5.08859 3.69097 3.41138 6.94789L6.75413 9.64978C7.46847 7.31568 9.65044 5.58783 12.2371 5.58783Z" fill="#EA4335"/>
                            </svg>
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Нет аккаунта?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;