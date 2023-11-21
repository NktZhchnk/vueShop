import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';

const app = express();


app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
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
app.delete('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id; // Получаем ID продукта для удаления

    const sqlQuery = 'DELETE FROM product WHERE id = ?'; // SQL-запрос для удаления продукта

    connection.query(sqlQuery, [productId], (error, result) => {
        if (error) {
            console.error('Ошибка удаления продукта:', error);
            res.status(500).json({error: 'Ошибка удаления продукта'});
        } else {
            if (result.affectedRows > 0) {
                res.status(200).json({message: 'Продукт успешно удален'});
            } else {
                res.status(404).json({error: 'Продукт не найден'});
            }
        }
    });
});


app.post('/addProduct', (req, res) => {
    // Проверяем наличие необходимых полей в запросе
    if (!req.body || !req.body.name_item || !req.body.price_item || !req.body.quan_item || !req.body.image_item || !req.body.show_item || !req.body.category_item) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }
    // Деструктурируем данные о новом продукте из тела запроса
    const {name_item, price_item, quan_item, image_item, show_item, category_item} = req.body;

    // Ваш SQL-запрос для добавления продукта в базу данных
    const sqlQuery = 'INSERT INTO product (name_item, price_item, quan_item, image_item, show_item, category_item) VALUES (?, ?, ?, ?, ?, ?)';

    // Выполняем запрос к базе данных для добавления продукта
    connection.query(sqlQuery, [name_item, price_item, quan_item, image_item, show_item, category_item, varieties_item], (error) => {

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