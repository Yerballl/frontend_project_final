const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // <--- Добавьте эту строку

// Создаем экземпляр Express
const app = express();

// Используйте CORS middleware
app.use(cors());

app.use(bodyParser.json());

// Пути к JSON-файлам
const usersFilePath = path.join(__dirname, 'users.json');
const transactionsFilePath = path.join(__dirname, 'transactions.json');

// Секретный ключ для JWT. В реальном приложении его лучше хранить в переменных окружения.
const JWT_SECRET = 'nantkhun'; // <--- Замените на ваш секретный ключ

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

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Формат: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Неверный или устаревший токен' });
        }
        req.user = decoded; // Сохраняем данные из токена в объекте запроса
        next();
    });
};

// Маршрут для получения данных текущего пользователя
app.get('/api/users/me', authenticateToken, (req, res) => {
    console.log("User data request received:", req.user);
    const users = readJsonFile(usersFilePath);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Возвращаем данные пользователя без пароля
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at
    });
});

// Маршрут для логина пользователя
app.post('/api/users/login', (req, res) => {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    const users = readJsonFile(usersFilePath);

    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        // Создаем токен
        // Не включайте пароль или другую чувствительную информацию в payload токена
        const tokenPayload = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Токен действителен 1 час

        res.json({
            message: 'Успешный вход',
            user: { // Возвращаем только необходимую информацию о пользователе
                id: user.id,
                email: user.email,
                name: user.name
            },
            token, // <--- Возвращаем токен
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

// Маршрут для регистрации нового пользователя
app.post('/api/users/register', (req, res) => {
    console.log("Register request received:", req.body);
    const { name, email, password } = req.body;
    const users = readJsonFile(usersFilePath);

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаем нового пользователя
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        email,
        password, // В реальном приложении пароль должен быть хэширован
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // Добавляем пользователя в файл
    users.push(newUser);
    writeJsonFile(usersFilePath, users);

    // Создаем токен
    const tokenPayload = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    // Отправляем ответ
    res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        },
        token
    });
});

// Запуск сервера
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});