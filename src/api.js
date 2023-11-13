import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';

const app = express();

const corsOptions = {
    origin: 'https://eseniabila.com.ua',
    optionsSuccessStatus: 200, // некоторые браузеры поддерживают этот флаг
};

app.use(cors(corsOptions));

app.use(logger('dev'));

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
    next();
});

app.use('/images', express.static('/var/www/vueShop/images'));

app.get('/getProducts', (req, res) => {
    const sqlQuery = 'SELECT * FROM product';
    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            res.json(results);
        }
    });
});
// Добавьте этот маршрут перед app.listen

app.delete('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id;

    // Ваш SQL-запрос для удаления продукта
    const sqlQuery = 'DELETE FROM product WHERE id = ?';

    connection.query(sqlQuery, [productId], (error) => {
        if (error) {
            console.error('Ошибка удаления продукта:', error);
            res.status(500).json({ error: 'Ошибка удаления продукта' });
        } else {
            res.status(200).json({ message: 'Продукт успешно удален' });
        }
    });
});


app.post('/addProduct', (req, res) => {

    const {name_item, price_item, quan_item, image_item} = req.body;

    // Ваш SQL-запрос для добавления продукта
    const sqlQuery = 'INSERT INTO product (name_item, price_item, quan_item, image_item) VALUES (?, ?, ?, ?)';

    connection.query(sqlQuery, [name_item, price_item, quan_item, image_item], (error) => {
        if (error) {
            console.error('Ошибка добавления продукта:', error);
            res.status(500).json({error: 'Ошибка добавления продукта'});
        } else {
            res.status(200).json({message: 'Продукт успешно добавлен'});

        }
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});