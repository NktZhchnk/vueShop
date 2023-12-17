import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: '193.0.61.203',
    user: 'admin',
    password: 'FSAda@KNLNDAmf@((#$njp10-2DJ',
    database: 'products',
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
app.get('/getProductById/:id', (req, res) => {
    const productId = req.params.id; // Получаем ID товара из параметра запроса

    const sqlQuery = 'SELECT * FROM product WHERE id = ?'; // SQL-запрос для выборки товара по его ID
    connection.query(sqlQuery, [productId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: 'Товар не найден' }); // Если товар не найден, отправляем ошибку 404
            } else {
                res.json(results[0]); // Отправляем найденный товар в качестве ответа (если товар найден)
            }
        }
    });
});

app.get('/getProductVarieties', (req, res) => {
    const sqlQuery = 'SELECT * FROM product_varieties';
    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            res.json(results);
        }
    });
});

app.get('/getProductImg', (req, res) => {
    const sqlQuery = 'SELECT * FROM img_product';
    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            res.json(results);
        }
    });
});

app.get('/getUsers', (req, res) => {
    const sqlQuery = 'SELECT * FROM users';
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

    // Начинаем транзакцию
    connection.beginTransaction(function(err) {
        if (err) {
            console.error('Ошибка начала транзакции:', err);
            res.status(500).json({ error: 'Ошибка удаления продукта' });
            return;
        }

        const deleteImgProductQuery = 'DELETE FROM img_product WHERE product_id = ?';
        const deleteProductVarietiesQuery = 'DELETE FROM product_varieties WHERE product_id = ?';
        const deleteProductQuery = 'DELETE FROM product WHERE id = ?';

        // Удаление связанных записей из img_product
        connection.query(deleteImgProductQuery, [productId], function(error, result) {
            if (error) {
                console.error('Ошибка удаления изображений продукта:', error);
                return connection.rollback(function() {
                    res.status(500).json({ error: 'Ошибка удаления продукта' });
                });
            }

            // Затем удаляем записи из product_varieties
            connection.query(deleteProductVarietiesQuery, [productId], function(error, result) {
                if (error) {
                    console.error('Ошибка удаления вариантов продукта:', error);
                    return connection.rollback(function() {
                        res.status(500).json({ error: 'Ошибка удаления продукта' });
                    });
                }

                // Удаляем основной продукт
                connection.query(deleteProductQuery, [productId], function(error, result) {
                    if (error) {
                        console.error('Ошибка удаления основного продукта:', error);
                        return connection.rollback(function() {
                            res.status(500).json({ error: 'Ошибка удаления продукта' });
                        });
                    }

                    connection.commit(function(err) {
                        if (err) {
                            console.error('Ошибка подтверждения транзакции:', err);
                            return connection.rollback(function() {
                                res.status(500).json({ error: 'Ошибка удаления продукта' });
                            });
                        }

                        res.status(200).json({ message: 'Продукт и его связанные записи успешно удалены' });
                    });
                });
            });
        });
    });
});



app.post('/addProduct', (req, res) => {
    // Проверяем наличие необходимых полей в запросе
    console.log('Received request:', req.body);
    if (!req.body || !req.body.name_item || !req.body.price_item || !req.body.quan_item || !req.body.show_item || !req.body.category_item || !req.body.text_info) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }
    // Деструктурируем данные о новом продукте из тела запроса
    const {name_item, price_item, quan_item, show_item, category_item, text_info} = req.body;
    // Ваш SQL-запрос для добавления продукта в базу данных
    const sqlQuery = 'INSERT INTO product (name_item, price_item, quan_item, show_item, category_item, text_info) VALUES (?, ?, ?, ?, ?, ?)';

    // Выполняем запрос к базе данных для добавления продукта
    connection.query(sqlQuery, [name_item, price_item, quan_item, show_item, category_item, text_info], (error) => {
        if (error) {
            console.error('Ошибка добавления продукта:', error);
            res.status(500).json({error: 'Ошибка добавления продукта'});
        } else {
            res.status(200).json({message: 'Продукт успешно добавлен'});
        }
    });
});

app.post('/addProductVarieties', (req, res) => {
    console.log('Received request:', req.body); // Добавляем эту строку для вывода содержимого тела запроса в консоль
    if (!req.body || !req.body.product_id || !req.body.variety_name || !req.body.variety_quan || !req.body.variety_price) {
        return res.status(400).json({ error: 'Отсутствуют необходимые поля в запросе' });
    }
    const { product_id, variety_name, variety_quan, variety_price } = req.body;

    if (!Array.isArray(variety_name) || !Array.isArray(variety_quan) || !Array.isArray(variety_price)) {
        return res.status(400).json({ error: 'Variety_name, variety_quan и variety_price должны быть массивами' });
    }

    if (variety_name.length !== variety_quan.length || variety_name.length !== variety_price.length) {
        return res.status(400).json({ error: 'Длины массивов не совпадают' });
    }

    // Подготовка SQL-запроса с placeholder'ами для значений
    const sqlQuery = `INSERT INTO product_varieties (product_id, variety_name, variety_quan, variety_price) VALUES ?`;

    // Формирование массива массивов значений для вставки в SQL-запрос
    const values = variety_name.map((_, index) => [product_id, variety_name[index], variety_quan[index], variety_price[index]]);

    // Выполнение запроса к базе данных с использованием значений
    connection.query(sqlQuery, [values], (error, results) => {
        if (error) {
            console.error('Ошибка вставки данных:', error);
            return res.status(500).json({ error: error.message }); // Отображаем подробности ошибки
        } else {
            console.log('Данные успешно вставлены:', results);
            return res.status(200).json({ message: 'Данные успешно добавлены в таблицу' });
        }
    });
});

app.post('/addProductImg', (req, res) => {
    console.log('Received request:', req.body); // Добавляем эту строку для вывода содержимого тела запроса в консоль
    if (!req.body || !req.body.product_id || !req.body.img) {
        return res.status(400).json({ error: 'Отсутствуют необходимые поля в запросе' });
    }
    const {img, product_id} = req.body;

    if (!Array.isArray(img)) {
        return res.status(400).json({ error: 'Variety_name, variety_quan и variety_price должны быть массивами' });
    }

    // Подготовка SQL-запроса с placeholder'ами для значений
    const sqlQuery = `INSERT INTO img_product (img, product_id) VALUES ?`;

    // Формирование массива массивов значений для вставки в SQL-запрос
    const values = img.map((_, index) => [img[index], product_id]);

    // Выполнение запроса к базе данных с использованием значений
    connection.query(sqlQuery, [values], (error, results) => {
        if (error) {
            console.error('Ошибка вставки данных:', error);
            return res.status(500).json({ error: error.message }); // Отображаем подробности ошибки
        } else {
            console.log('Данные успешно вставлены:', results);
            return res.status(200).json({ message: 'Данные успешно добавлены в таблицу' });
        }
    });
});


app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});