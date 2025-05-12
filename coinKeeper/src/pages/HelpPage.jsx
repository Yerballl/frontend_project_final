import React from 'react';

const HelpPage = () => {
    return (
        <div className="container mx-auto p-8 pt-24">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Помощь и поддержка</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700 mb-4">
                    Добро пожаловать в раздел помощи CoinKeeper!
                </p>
                <p className="text-gray-700 mb-4">
                    Эта страница в настоящее время находится в разработке. Скоро здесь появятся подробные руководства, часто задаваемые вопросы и советы о том, как максимально эффективно использовать CoinKeeper.
                </p>
                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Темы, которые мы рассмотрим:</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Управление вашими транзакциями</li>
                    <li>Настройка и использование категорий</li>
                    <li>Понимание ваших финансовых показателей</li>
                    <li>Настройки аккаунта и предпочтения</li>
                    <li>Решение распространенных проблем</li>
                </ul>
                <p className="text-gray-700 mt-8">
                    Тем временем, если у вас есть срочные вопросы, пожалуйста, попробуйте изучить приложение или представьте, что вы обращаетесь к нашей воображаемой службе поддержки по адресу <span className="text-indigo-600 font-medium">support@coinkeeper.com</span>.
                </p>
            </div>
        </div>
    );
};

export default HelpPage;