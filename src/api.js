import mysql from 'mysql2';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // добавлено


const __filename = fileURLToPath(import.meta.url); // добавлено
const __dirname = path.dirname(__filename);
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const connection = mysql.createConnection({
    host: '193.0.61.203',
    user: 'admin',
    password: 'FSAda@KNLNDAmf@((#$njp10-2DJ',
    database: 'products'
});

app.get('/', (req, res) => {
    // В этом примере отправляем статический HTML-файл
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/getProducts', (req, res) => {
    const sqlQuery = 'SELECT * FROM product';
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            res.json(results);
        }
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});