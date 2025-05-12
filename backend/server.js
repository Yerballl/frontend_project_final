const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'users.json');
const transactionsFilePath = path.join(__dirname, 'transactions.json');
const categoriesFilePath = path.join(__dirname, 'categories.json');
const accountsFilePath = path.join(__dirname, 'accounts.json');

const JWT_SECRET = 'nantkhun_your_strong_secret_key';

const readJsonFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
        return [];
    }
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading or parsing JSON from ${filePath}:`, error);
        return [];
    }
};

const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing JSON to ${filePath}:`, error);
    }
};

const generateNewId = (items) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен: токен не предоставлен' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Доступ запрещен: срок действия токена истек' });
            }
            return res.status(403).json({ message: 'Доступ запрещен: невалидный токен' });
        }
        req.user = decoded;
        next();
    });
};

app.post('/api/users/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Имя, email и пароль обязательны' });
    }

    const users = readJsonFile(usersFilePath);
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

    const newUser = {
        id: generateNewId(users),
        name,
        email,
        password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    users.push(newUser);
    writeJsonFile(usersFilePath, users);

    const tokenPayload = { id: newUser.id, email: newUser.email, name: newUser.name };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
        token
    });
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const users = readJsonFile(usersFilePath);
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    const tokenPayload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        message: 'Успешный вход',
        user: { id: user.id, email: user.email, name: user.name },
        token
    });
});

app.get('/api/users/me', authenticateToken, (req, res) => {
    const users = readJsonFile(usersFilePath);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at
    });
});

app.put('/api/users/me', authenticateToken, (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body;

    const users = readJsonFile(usersFilePath);
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const currentUser = users[userIndex];
    let passwordChanged = false;

    if (currentPassword && newPassword) {
        if (currentUser.password !== currentPassword) {
            return res.status(403).json({ message: 'Текущий пароль неверен' });
        }
        if (newPassword.length < 3) {
            return res.status(400).json({ message: 'Новый пароль слишком короткий (минимум 3 символа)' });
        }
        currentUser.password = newPassword;
        passwordChanged = true;
    } else if (currentPassword || newPassword) {
        return res.status(400).json({ message: 'Для смены пароля необходимо указать текущий и новый пароли.' });
    }

    if (email && email !== currentUser.email && users.some(u => u.email === email && u.id !== req.user.id)) {
        return res.status(409).json({ message: 'Этот email уже используется другим пользователем.' });
    }

    currentUser.name = name || currentUser.name;
    currentUser.email = email || currentUser.email;
    currentUser.updated_at = new Date().toISOString();

    users[userIndex] = currentUser;
    writeJsonFile(usersFilePath, users);

    const userResponse = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        updated_at: currentUser.updated_at,
    };
    if (passwordChanged) {
        userResponse.message = 'Профиль и пароль успешно обновлены.';
    } else {
        userResponse.message = 'Профиль успешно обновлен.';
    }

    res.json(userResponse);
});

app.delete('/api/users/me', authenticateToken, (req, res) => {
    let users = readJsonFile(usersFilePath);
    const userExists = users.some(u => u.id === req.user.id);

    if (!userExists) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    users = users.filter(u => u.id !== req.user.id);
    writeJsonFile(usersFilePath, users);

    res.json({ message: 'Пользователь успешно удален' });
});

const calculateAccountBalance = (accountId, userId, allTransactions, allAccounts) => {
    const account = allAccounts.find(acc => acc.id === accountId && acc.user_id === userId);
    if (!account) return 0;

    let balance = parseFloat(account.initial_balance) || 0;
    allTransactions.forEach(transaction => {
        if (transaction.user_id === userId && transaction.account_id === accountId) {
            if (transaction.type === 'income') {
                balance += parseFloat(transaction.amount);
            } else if (transaction.type === 'expense') {
                balance -= parseFloat(transaction.amount);
            }
        }
    });
    return balance;
};

app.get('/api/accounts', authenticateToken, (req, res) => {
    const allAccounts = readJsonFile(accountsFilePath);
    const allTransactions = readJsonFile(transactionsFilePath);
    const userAccounts = allAccounts.filter(acc => acc.user_id === req.user.id);

    const accountsWithBalances = userAccounts.map(acc => ({
        ...acc,
        balance: calculateAccountBalance(acc.id, req.user.id, allTransactions, allAccounts).toFixed(2)
    }));
    res.json(accountsWithBalances);
});

app.post('/api/accounts', authenticateToken, (req, res) => {
    const { name, icon, color, initial_balance = 0 } = req.body;
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: 'Название счета обязательно' });
    }
    const accounts = readJsonFile(accountsFilePath);
    const newAccount = {
        id: generateNewId(accounts),
        user_id: req.user.id,
        name: name.trim(),
        icon: icon || '💰',
        color: color || '#000000',
        initial_balance: parseFloat(initial_balance) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    accounts.push(newAccount);
    writeJsonFile(accountsFilePath, accounts);

    const allTransactions = readJsonFile(transactionsFilePath);
    res.status(201).json({
        ...newAccount,
        balance: calculateAccountBalance(newAccount.id, req.user.id, allTransactions, accounts).toFixed(2)
    });
});

app.get('/api/accounts/:id', authenticateToken, (req, res) => {
    const accountId = parseInt(req.params.id);
    const allAccounts = readJsonFile(accountsFilePath);
    const account = allAccounts.find(acc => acc.id === accountId && acc.user_id === req.user.id);

    if (!account) {
        return res.status(404).json({ message: 'Счет не найден или не принадлежит пользователю' });
    }
    const allTransactions = readJsonFile(transactionsFilePath);
    res.json({
        ...account,
        balance: calculateAccountBalance(accountId, req.user.id, allTransactions, allAccounts).toFixed(2)
    });
});

app.put('/api/accounts/:id', authenticateToken, (req, res) => {
    const accountId = parseInt(req.params.id);
    const { name, icon, color, initial_balance } = req.body;
    const accounts = readJsonFile(accountsFilePath);
    const accountIndex = accounts.findIndex(acc => acc.id === accountId && acc.user_id === req.user.id);

    if (accountIndex === -1) {
        return res.status(404).json({ message: 'Счет не найден или не принадлежит пользователю' });
    }
    if (name !== undefined && name.trim() === "") {
        return res.status(400).json({ message: 'Название счета не может быть пустым' });
    }

    accounts[accountIndex] = {
        ...accounts[accountIndex],
        name: name !== undefined ? name.trim() : accounts[accountIndex].name,
        icon: icon !== undefined ? icon : accounts[accountIndex].icon,
        color: color !== undefined ? color : accounts[accountIndex].color,
        initial_balance: initial_balance !== undefined ? (parseFloat(initial_balance) || 0) : accounts[accountIndex].initial_balance,
        updated_at: new Date().toISOString()
    };
    writeJsonFile(accountsFilePath, accounts);

    const allTransactions = readJsonFile(transactionsFilePath);
    res.json({
        ...accounts[accountIndex],
        balance: calculateAccountBalance(accounts[accountIndex].id, req.user.id, allTransactions, accounts).toFixed(2)
    });
});

app.delete('/api/accounts/:id', authenticateToken, (req, res) => {
    const accountId = parseInt(req.params.id);
    let accounts = readJsonFile(accountsFilePath);
    const accountExists = accounts.some(acc => acc.id === accountId && acc.user_id === req.user.id);

    if (!accountExists) {
        return res.status(404).json({ message: 'Счет не найден или не принадлежит пользователю' });
    }
    accounts = accounts.filter(acc => acc.id !== accountId);
    writeJsonFile(accountsFilePath, accounts);

    let transactions = readJsonFile(transactionsFilePath);
    transactions = transactions.filter(t => !(t.user_id === req.user.id && t.account_id === accountId));
    writeJsonFile(transactionsFilePath, transactions);

    res.json({ message: 'Счет и связанные транзакции успешно удалены', id: accountId });
});

app.get('/api/categories', authenticateToken, (req, res) => {
    const allCategories = readJsonFile(categoriesFilePath);
    const userCategories = allCategories.filter(cat => cat.user_id === req.user.id);
    res.json(userCategories);
});

app.get('/api/categories/summary', authenticateToken, (req, res) => {
    const allCategories = readJsonFile(categoriesFilePath);
    const allTransactions = readJsonFile(transactionsFilePath);
    const userCategories = allCategories.filter(cat => cat.user_id === req.user.id);
    const userTransactions = allTransactions.filter(t => t.user_id === req.user.id);

    const categoriesWithSummary = userCategories.map(category => {
        let categoryBalance = 0;
        userTransactions.forEach(transaction => {
            if (transaction.category_id === category.id) {
                if (transaction.type === 'income') {
                    categoryBalance += parseFloat(transaction.amount);
                } else if (transaction.type === 'expense') {
                    categoryBalance -= parseFloat(transaction.amount);
                }
            }
        });
        return { ...category, balance: categoryBalance.toFixed(2) };
    });
    res.json(categoriesWithSummary);
});

app.post('/api/categories', authenticateToken, (req, res) => {
    const { name, icon, color } = req.body;
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: 'Название категории обязательно' });
    }
    const categories = readJsonFile(categoriesFilePath);
    const newCategory = {
        id: generateNewId(categories),
        user_id: req.user.id,
        name: name.trim(),
        icon: icon || '📁',
        color: color || '#808080',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    categories.push(newCategory);
    writeJsonFile(categoriesFilePath, categories);
    res.status(201).json(newCategory);
});

app.get('/api/categories/:id', authenticateToken, (req, res) => {
    const categoryId = parseInt(req.params.id);
    const categories = readJsonFile(categoriesFilePath);
    const category = categories.find(cat => cat.id === categoryId && cat.user_id === req.user.id);
    if (!category) {
        return res.status(404).json({ message: 'Категория не найдена или не принадлежит пользователю' });
    }
    res.json(category);
});

app.put('/api/categories/:id', authenticateToken, (req, res) => {
    const categoryId = parseInt(req.params.id);
    const { name, icon, color } = req.body;
    const categories = readJsonFile(categoriesFilePath);
    const categoryIndex = categories.findIndex(c => c.id === categoryId && c.user_id === req.user.id);

    if (categoryIndex === -1) {
        return res.status(404).json({ message: 'Категория не найдена или не принадлежит пользователю' });
    }
    if (name !== undefined && name.trim() === "") {
        return res.status(400).json({ message: 'Название категории не может быть пустым' });
    }

    categories[categoryIndex] = {
        ...categories[categoryIndex],
        name: name !== undefined ? name.trim() : categories[categoryIndex].name,
        icon: icon !== undefined ? icon : categories[categoryIndex].icon,
        color: color !== undefined ? color : categories[categoryIndex].color,
        updated_at: new Date().toISOString()
    };
    writeJsonFile(categoriesFilePath, categories);
    res.json(categories[categoryIndex]);
});

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
    const categoryId = parseInt(req.params.id);
    let categories = readJsonFile(categoriesFilePath);
    const categoryExists = categories.some(c => c.id === categoryId && c.user_id === req.user.id);

    if (!categoryExists) {
        return res.status(404).json({ message: 'Категория не найдена или не принадлежит пользователю' });
    }
    categories = categories.filter(c => c.id !== categoryId);
    writeJsonFile(categoriesFilePath, categories);

    res.json({ message: 'Категория успешно удалена', id: categoryId });
});

app.get('/api/transactions', authenticateToken, (req, res) => {
    const allTransactions = readJsonFile(transactionsFilePath);
    let userTransactions = allTransactions.filter(t => t.user_id === req.user.id);

    if (req.query.account_id) {
        userTransactions = userTransactions.filter(t => t.account_id === parseInt(req.query.account_id));
    }
    if (req.query.category_id) {
        userTransactions = userTransactions.filter(t => t.category_id === parseInt(req.query.category_id));
    }
    if (req.query.type) {
        userTransactions = userTransactions.filter(t => t.type === req.query.type);
    }
    if (req.query.startDate) {
        userTransactions = userTransactions.filter(t => new Date(t.transaction_date) >= new Date(req.query.startDate));
    }
    if (req.query.endDate) {
        userTransactions = userTransactions.filter(t => new Date(t.transaction_date) <= new Date(req.query.endDate));
    }

    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || userTransactions.length;

    const paginatedTransactions = userTransactions
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date) || b.id - a.id)
        .slice(offset, offset + limit);
    res.json(paginatedTransactions);
});

app.post('/api/transactions', authenticateToken, (req, res) => {
    const { account_id, category_id, type, amount, transaction_date, comment } = req.body;

    if (!account_id || !category_id || !type || !transaction_date || amount === undefined) {
        return res.status(400).json({ message: 'Счет, категория, тип, сумма и дата транзакции обязательны' });
    }
    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ message: 'Тип транзакции должен быть "income" или "expense"' });
    }
    const accounts = readJsonFile(accountsFilePath);
    if (!accounts.some(acc => acc.id === parseInt(account_id) && acc.user_id === req.user.id)) {
        return res.status(400).json({ message: 'Указанный счет не найден или не принадлежит пользователю' });
    }
    const categories = readJsonFile(categoriesFilePath);
    if (!categories.some(cat => cat.id === parseInt(category_id) && cat.user_id === req.user.id)) {
        return res.status(400).json({ message: 'Указанная категория не найдена или не принадлежит пользователю' });
    }


    const amountValue = Math.abs(parseFloat(amount));
    if (isNaN(amountValue) || amountValue <= 0) {
        return res.status(400).json({ message: 'Сумма должна быть положительным числом' });
    }

    const transactions = readJsonFile(transactionsFilePath);
    const newTransaction = {
        id: generateNewId(transactions),
        user_id: req.user.id,
        account_id: parseInt(account_id),
        category_id: parseInt(category_id),
        type,
        amount: amountValue.toFixed(2),
        transaction_date,
        comment: comment || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    writeJsonFile(transactionsFilePath, transactions);
    res.status(201).json(newTransaction);
});

app.get('/api/transactions/:id', authenticateToken, (req, res) => {
    const transactionId = parseInt(req.params.id);
    const transactions = readJsonFile(transactionsFilePath);
    const transaction = transactions.find(t => t.id === transactionId && t.user_id === req.user.id);
    if (!transaction) {
        return res.status(404).json({ message: 'Транзакция не найдена или не принадлежит пользователю' });
    }
    res.json(transaction);
});

app.put('/api/transactions/:id', authenticateToken, (req, res) => {
    const transactionId = parseInt(req.params.id);
    const { account_id, category_id, type, amount, transaction_date, comment } = req.body;
    const transactions = readJsonFile(transactionsFilePath);
    const transactionIndex = transactions.findIndex(t => t.id === transactionId && t.user_id === req.user.id);

    if (transactionIndex === -1) {
        return res.status(404).json({ message: 'Транзакция не найдена или не принадлежит пользователю' });
    }

    const currentTransaction = transactions[transactionIndex];
    let newAmount = currentTransaction.amount;
    if (amount !== undefined) {
        const parsedAmount = Math.abs(parseFloat(amount));
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: 'Сумма должна быть положительным числом' });
        }
        newAmount = parsedAmount.toFixed(2);
    }
    if (type && type !== 'income' && type !== 'expense') {
        return res.status(400).json({ message: 'Тип транзакции должен быть "income" или "expense"' });
    }
    if (account_id) {
        const accounts = readJsonFile(accountsFilePath);
        if (!accounts.some(acc => acc.id === parseInt(account_id) && acc.user_id === req.user.id)) {
            return res.status(400).json({ message: 'Указанный для обновления счет не найден или не принадлежит пользователю' });
        }
    }
    if (category_id) {
        const categories = readJsonFile(categoriesFilePath);
        if (!categories.some(cat => cat.id === parseInt(category_id) && cat.user_id === req.user.id)) {
            return res.status(400).json({ message: 'Указанная для обновления категория не найдена или не принадлежит пользователю' });
        }
    }


    transactions[transactionIndex] = {
        ...currentTransaction,
        account_id: account_id ? parseInt(account_id) : currentTransaction.account_id,
        category_id: category_id ? parseInt(category_id) : currentTransaction.category_id,
        type: type || currentTransaction.type,
        amount: newAmount,
        transaction_date: transaction_date || currentTransaction.transaction_date,
        comment: comment !== undefined ? comment : currentTransaction.comment,
        updated_at: new Date().toISOString()
    };
    writeJsonFile(transactionsFilePath, transactions);
    res.json(transactions[transactionIndex]);
});

app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
    const transactionId = parseInt(req.params.id);
    let transactions = readJsonFile(transactionsFilePath);
    const transactionExists = transactions.some(t => t.id === transactionId && t.user_id === req.user.id);

    if (!transactionExists) {
        return res.status(404).json({ message: 'Транзакция не найдена или не принадлежит пользователю' });
    }
    transactions = transactions.filter(t => t.id !== transactionId);
    writeJsonFile(transactionsFilePath, transactions);
    res.json({ message: 'Транзакция успешно удалена', id: transactionId });
});

app.get('/api/balance', authenticateToken, (req, res) => {
    const allAccounts = readJsonFile(accountsFilePath);
    const allTransactions = readJsonFile(transactionsFilePath);
    const userAccounts = allAccounts.filter(acc => acc.user_id === req.user.id);

    let totalBalance = 0;
    userAccounts.forEach(acc => {
        totalBalance += calculateAccountBalance(acc.id, req.user.id, allTransactions, allAccounts);
    });
    res.json({ amount: totalBalance.toFixed(2) });
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT} с полным CRUD.`);
    readJsonFile(usersFilePath);
    readJsonFile(transactionsFilePath);
    readJsonFile(categoriesFilePath);
    readJsonFile(accountsFilePath);
});