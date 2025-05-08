const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON тел запросов
app.use(express.json());

// Хранилище данных в памяти (для примера)
let items = [
    { id: 1, name: 'Первый элемент' },
    { id: 2, name: 'Второй элемент' }
];
let nextId = 3;

app.get('/', (req, res) => {
    res.send('Привет от имитации бэкенда на Express!');
});

// Пример эндпоинта для GET запроса
app.get('/api/data', (req, res) => {
    res.json({ message: 'Это тестовые данные', value: 42 });
});

// Пример эндпоинта для POST запроса
app.post('/api/submit', (req, res) => { // express.json() уже используется глобально
    console.log('Получены данные:', req.body);
    res.status(201).json({ message: 'Данные успешно получены', receivedData: req.body });
});

// --- Новые эндпоинты ---

// GET эндпоинт для получения списка всех элементов
app.get('/api/items', (req, res) => {
    res.json(items);
});

// POST эндпоинт для добавления нового элемента
app.post('/api/items', (req, res) => {
    const newItem = {
        id: nextId++,
        name: req.body.name || 'Безымянный элемент' // Предполагаем, что в теле запроса есть поле name
    };
    items.push(newItem);
    console.log('Добавлен новый элемент:', newItem);
    res.status(201).json(newItem);
});

// GET эндпоинт для получения элемента по ID
app.get('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === itemId);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Элемент не найден' });
    }
});

// PUT эндпоинт для обновления элемента по ID
app.put('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        items[itemIndex] = { ...items[itemIndex], ...req.body };
        console.log('Обновлен элемент:', items[itemIndex]);
        res.json(items[itemIndex]);
    } else {
        res.status(404).json({ message: 'Элемент не найден для обновления' });
    }
});

// DELETE эндпоинт для удаления элемента по ID
app.delete('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        const deletedItem = items.splice(itemIndex, 1);
        console.log('Удален элемент:', deletedItem[0]);
        res.json({ message: 'Элемент успешно удален', item: deletedItem[0] });
    } else {
        res.status(404).json({ message: 'Элемент не найден для удаления' });
    }
});


app.listen(port, () => {
    console.log(`Express сервер запущен по адресу http://localhost:${port}`);
});