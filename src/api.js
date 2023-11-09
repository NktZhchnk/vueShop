import mysql from 'mysql2';
import express from 'express';
import path from 'path';
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

app.post("/addItem", (req, res) => {
    const { price, name, quantity } = req.body;

    // Предполагая, что ваша таблица в базе данных называется "product"
    const sqlQuery = 'INSERT INTO product (name_item, price_item, quan_item) VALUES (?, ?, ?)';

    connection.query(sqlQuery, [name, price, quantity], (error, results, fields) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            res.status(200).json({ message: 'Элемент успешно добавлен' });
        }
    });
});


app.use('/images', express.static( '/var/www/vueShop/images'));

const connection = mysql.createConnection({
    host: '193.0.61.203',
    user: 'admin',
    password: 'FSAda@KNLNDAmf@((#$njp10-2DJ',
    database: 'products'
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