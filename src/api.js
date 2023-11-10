import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import path from 'path';
const app = express();
app.use(cors());
const connection = mysql.createConnection({
    host: '193.0.61.203',
    user: 'admin',
    password: 'FSAda@KNLNDAmf@((#$njp10-2DJ',
    database: 'products'
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.post('/addProduct', (req, res) => {
    const { name_item, price_item, quan_item, image_item } = req.body;

    // Ваш SQL-запрос для добавления продукта
    const sqlQuery = 'INSERT INTO product (name_item, price_item, quan_item, image_item) VALUES (?, ?, ?, ?)';

    connection.query(sqlQuery, [name_item, price_item, quan_item, image_item], (error, results, fields) => {
        if (error) {
            console.error('Ошибка добавления продукта:', error);
            res.status(500).json({ error: 'Ошибка добавления продукта' });
        } else {
            res.status(200).json({ message: 'Продукт успешно добавлен' });
        }
    });
});



app.use('/images', express.static( '/var/www/vueShop/images'));




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