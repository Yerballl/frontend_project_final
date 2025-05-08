const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // <--- Добавьте эту строку

// Создаем экземпляр Express
const app = express();

// Используйте CORS middleware
app.use(cors()); // <--- Добавьте эту строку. Это разрешит все CORS-запросы.
                 // Для более строгой настройки см. документацию пакета cors.

app.use(bodyParser.json());

// Пути к JSON-файлам
const usersFilePath = path.join(__dirname, 'users.json');
const transactionsFilePath = path.join(__dirname, 'transactions.json');

// Функция для чтения данных из JSON-файла
const readJsonFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// Функция для записи данных в JSON-файл
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Маршрут для логина пользователя
app.post('/api/users/login', (req, res) => {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    const users = readJsonFile(usersFilePath);

    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        res.json({
            message: 'Успешный вход',
            user,
        });
    } else {
        res.status(401).json({ message: 'Неверные учетные данные' });
    }
});

// Маршрут для добавления транзакции
app.post('/api/transactions', (req, res) => {
    const { user_id, category_id, type, amount, transaction_date, comment } = req.body;

    const transactions = readJsonFile(transactionsFilePath);

    const newTransaction = {
        id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
        user_id,
        category_id,
        type,
        amount,
        transaction_date,
        comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    writeJsonFile(transactionsFilePath, transactions);

    res.status(201).json({
        message: 'Транзакция успешно добавлена',
        transaction: newTransaction,
    });
});

// Маршрут для получения всех транзакций пользователя
app.get('/api/transactions/:userId', (req, res) => {
    const { userId } = req.params;
    const transactions = readJsonFile(transactionsFilePath);

    const userTransactions = transactions.filter((t) => t.user_id === parseInt(userId, 10));
    res.json(userTransactions);
});

// Запуск сервера
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});