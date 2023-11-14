import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';

const app = express();


app.use(logger('dev'));
app.use(cors());
const connection = mysql.createConnection({
    host: '193.0.61.203',
    user: 'admin',
    password: 'FSAda@KNLNDAmf@((#$njp10-2DJ',
    database: 'products'
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
app.delete('/deleteProduct', (req, res) => {

})
app.post('/addProduct', (req, res) => {
    console.log('Получен POST запрос на /addProduct');
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