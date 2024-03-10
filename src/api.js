import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import axios from "axios";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import sendTelegramMessage from './sendTelegramMessage.js'
import { exec } from 'child_process';

dotenv.config();

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: '193.0.61.203',
    user: 'admin',
    password: 'ASJ$Hfbd$mnoj852$398hJSAjbf2$492jn$df',
    database: 'products',
});


const bearerToken = '5b9e48ca-6301-3736-b527-1bcfce3e423c';
app.use('/images', express.static('/var/www/vueShop/images'));

function backupMySQL() {
    const dbName = 'products';
    const backupPath = '/var/www/';

    const command = `mysqldump --defaults-extra-file=/root/my.cnf -h ${connection.config.host} -u ${connection.config.user} ${dbName} > ${backupPath}/${dbName}_backup.sql`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка при создании резервной копии: ${stderr}`);
        } else {
            console.log(`Резервная копия успешно создана: ${stdout}`);
        }
    });
}

// Выполнение резервной копии каждый день в 21:42
setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours === 22 && minutes === 50) {
        backupMySQL();
    }
}, 60000); // Проверка каждую минуту

app.get('/getProducts', (req, res) => {
    const sqlQuery = 'SELECT * FROM product';
    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            res.json(results);
        }
    });
});

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
app.get('/getProductsCategory', (req, res) => {
    const category = req.query.category; // Получение категории из запроса

    if (!category) {
        res.status(400).json({error: 'Категория не указана'});
        return;
    }

    const sqlQuery = 'SELECT * FROM product WHERE category_item = ?'; // Запрос с фильтрацией по категории
    connection.query(sqlQuery, [category], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            res.json(results); // Отправка результатов в формате JSON
        }
    });
});


const apiUrl = 'https://www.ukrposhta.ua/address-classifier-ws/get_postoffices_by_city_id';
const cityId = "3";
const districtId = "";
const regionId = "";
const postIndex = "";

// Формування параметрів запиту
const params = {
    city_id: cityId,
    district_id: districtId,
    region_id: regionId,
    postIndex: postIndex
};

const apiUrlRegion = 'https://www.ukrposhta.ua/address-classifier-ws//get_regions_by_region_ua';
const apiUrlCity = 'https://www.ukrposhta.ua/address-classifier-ws//get_cities_by_city_ua';


// Формування параметрів запиту

// Роут для отримання даних від сервера "www.ukrposhta.ua"
app.get('/getUkrPoshtaData', async (req, res) => {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Accept': 'application/json'
            },
            params: params
        });

        // Обробка отриманих даних та їх повернення як відповідь
        res.status(200).json(response.data);
    } catch (error) {
        // Обробка помилок
        console.error('Произошла ошибка:', error);
        res.status(500).json({error: 'Помилка при отриманні даних від сервера UkrPoshta'});
    }
});
app.post('/api/send-message', (req, res) => {
    const { message } = req.body;

    sendTelegramMessage(message)
        .then((result) => {
            res.json({ success: true, result });
        })
        .catch((error) => {
            res.status(500).json({ success: false, error: error.message });
        });
});
app.get('/getUkrPoshtaRegion', async (req, res) => {
    try {
        const response = await axios.get(apiUrlRegion, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Accept': 'application/json'
            },

        });

        // Обробка отриманих даних та їх повернення як відповідь
        res.status(200).json(response.data);
    } catch (error) {
        // Обробка помилок
        console.error('Произошла ошибка:', error);
        res.status(500).json({error: 'Помилка при отриманні даних від сервера UkrPoshta'});
    }
});
app.get('/getUkrPoshtaCity', async (req, res) => {
    try {
        const response = await axios.get(apiUrlCity, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Accept': 'application/json'
            },
        });

        // Обробка отриманих даних та їх повернення як відповідь
        res.status(200).json(response.data);
    } catch (error) {
        // Обробка помилок
        console.error('Произошла ошибка:', error);
        res.status(500).json({error: 'Помилка при отриманні даних від сервера UkrPoshta'});
    }
});


app.get('/getProductById/:id', (req, res) => {
    const productId = req.params.id; // Получаем ID товара из параметра запроса

    const sqlQuery = 'SELECT * FROM product WHERE id = ?'; // SQL-запрос для выборки товара по его ID
    connection.query(sqlQuery, [productId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            if (results.length === 0) {
                res.status(404).json({message: 'Товар не найден'}); // Если товар не найден, отправляем ошибку 404
            } else {
                res.json(results[0]); // Отправляем найденный товар в качестве ответа (если товар найден)
            }
        }
    });
});

app.get('/getImgById/:id', (req, res) => {
    const productId = req.params.id; // Получаем ID товара из параметра запроса

    const sqlQuery = 'SELECT * FROM img_product WHERE product_id = ?'; // SQL-запрос для выборки изображений по product_id
    connection.query(sqlQuery, [productId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            if (results.length === 0) {
                res.status(404).json({message: 'Изображения не найдены'});
            } else {
                res.json(results); // Отправляем найденные изображения в качестве ответа
            }
        }
    });
});

app.get('/getVarietiesById/:id', (req, res) => {
    const productId = req.params.id; // Получаем ID товара из параметра запроса

    const sqlQuery = 'SELECT * FROM product_varieties WHERE product_id = ?'; // SQL-запрос для выборки Вариаций по product_id
    connection.query(sqlQuery, [productId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            if (results.length === 0) {
                res.status(404).json({message: 'Вариации не найдены'});
            } else {
                res.json(results); // Отправляем найденные вариации в качестве ответа
            }
        }
    });
});
app.get('/getVarietiesId/:id', (req, res) => {
    const productId = req.params.id; // Получаем ID товара из параметра запроса

    const sqlQuery = 'SELECT * FROM product_varieties WHERE id = ?'; // SQL-запрос для выборки Вариаций по product_id
    connection.query(sqlQuery, [productId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            if (results.length === 0) {
                res.status(404).json({message: 'Вариации не найдены'});
            } else {
                res.json(results); // Отправляем найденные вариации в качестве ответа
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

app.get('/getOrders', (req, res) => {
    const sqlQuery = 'SELECT * FROM orders';
    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            res.json(results);
        }
    });
});

app.get('/getOrdersPhone', (req, res) => {
    const telephone = req.query.phoneNumber;

    // Проверка наличия номера телефона в запросе
    if (!telephone) {
        return res.status(400).json({ error: 'Номер телефона не указан' });
    }

    // Ваш код для выполнения SQL-запроса с использованием phone_number
    const sqlQuery = 'SELECT * FROM orders WHERE telephone = ?';

    connection.query(sqlQuery, [telephone], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            res.json(results);
        }
    });
});


app.get('/getItemOrder/:orderId', (req, res) => {
    const orderId = req.params.orderId; // Исправлено с req.params.order_id
    console.log(orderId)

    const sqlQuery = 'SELECT * FROM order_items WHERE order_id = ?';
    connection.query(sqlQuery, [orderId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            if (results.length === 0) {
                res.status(404).json({message: 'Вариации не найдены'});
            } else {
                res.json(results); // Отправляем найденные вариации в качестве ответа
            }
        }
    });
});

app.put('/updateVarietyCount/:varietyId', (req, res) => {
    const varietyId = req.params.varietyId;
    const {variety_quan} = req.body; // Предполагается, что вы отправляете объект с полем newVarietyQuan в запросе

    const sqlQuery = 'UPDATE product_varieties SET variety_quan = ? WHERE id = ?';
    connection.query(sqlQuery, [variety_quan, varietyId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({message: 'Вариация товара не найдена'});
            } else {
                // Если обновление прошло успешно, отправляем обновленные данные вариации в качестве ответа
                const updatedVarietyQuery = 'SELECT * FROM product_varieties WHERE id = ?';
                connection.query(updatedVarietyQuery, [varietyId], (error, updatedResults) => {
                    if (error) {
                        console.error('Ошибка выполнения запроса:', error);
                        res.status(500).json({error: 'Ошибка выполнения запроса'});
                    } else {
                        res.json(updatedResults[0]);
                    }
                });
            }
        }
    });
});
app.put('/updateProduct/:productId', (req, res) => {
    const productId = req.params.productId;
    const { popularity_item } = req.body; // Предполагается, что вы отправляете объект с полем popularity_item в запросе

    const sqlQuery = 'UPDATE product SET popularity_item = ? WHERE id = ?';
    connection.query(sqlQuery, [popularity_item, productId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Товар не найден' });
            } else {
                // Если обновление прошло успешно, отправляем обновленные данные товара в качестве ответа
                const updatedProductQuery = 'SELECT * FROM product WHERE id = ?';
                connection.query(updatedProductQuery, [productId], (error, updatedResults) => {
                    if (error) {
                        console.error('Ошибка выполнения запроса:', error);
                        res.status(500).json({ error: 'Ошибка выполнения запроса' });
                    } else {
                        res.json(updatedResults[0]);
                    }
                });
            }
        }
    });
});

app.put('/updateProductCount/:productId', (req, res) => {
    const productId = req.params.productId;
    const {variety_quan} = req.body; // Предполагается, что вы отправляете объект с полем newVarietyQuan в запросе

    const sqlQuery = 'UPDATE product SET quan_item = ? WHERE id = ?';
    connection.query(sqlQuery, [variety_quan, productId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({error: 'Ошибка выполнения запроса'});
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({message: 'Товар не найден'});
            } else {
                // Если обновление прошло успешно, отправляем обновленные данные товара в качестве ответа
                const updatedProductQuery = 'SELECT * FROM product WHERE id = ?';
                connection.query(updatedProductQuery, [productId], (error, updatedResults) => {
                    if (error) {
                        console.error('Ошибка выполнения запроса:', error);
                        res.status(500).json({error: 'Ошибка выполнения запроса'});
                    } else {
                        res.json(updatedResults[0]);
                    }
                });
            }
        }
    });
});

app.put('/updateOrder/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const { complete, poshta_tnn, comment_for_user } = req.body; // Добавлено поле poshta_tnn

    const sqlQuery = 'UPDATE orders SET complete = ?, poshta_tnn = ?, comment_for_user = ? WHERE id = ?'; // Обновлен SQL-запрос
    connection.query(sqlQuery, [complete, poshta_tnn, comment_for_user, orderId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Заказ не найден' });
            } else {
                // Если обновление прошло успешно, отправляем обновленные данные заказа в качестве ответа
                const updatedOrderQuery = 'SELECT * FROM orders WHERE id = ?';
                connection.query(updatedOrderQuery, [orderId], (error, updatedResults) => {
                    if (error) {
                        console.error('Ошибка выполнения запроса:', error);
                        res.status(500).json({ error: 'Ошибка выполнения запроса' });
                    } else {
                        res.json(updatedResults[0]);
                    }
                });
            }
        }
    });
});

app.delete('/deleteOrder/:id', (req, res) => {
    const orderId = req.params.id; // Получаем ID заказа

    // SQL-запрос для удаления элементов заказа из таблицы order_items по order_id
    const deleteOrderItemsQuery = 'DELETE FROM order_items WHERE order_id = ?';
    connection.query(deleteOrderItemsQuery, [orderId], (error, results) => {
        if (error) {
            console.error('Ошибка выполнения запроса:', error);
            res.status(500).json({ error: 'Ошибка выполнения запроса' });
        } else {
            // SQL-запрос для удаления заказа из таблицы orders по id
            const deleteOrderQuery = 'DELETE FROM orders WHERE id = ?';
            connection.query(deleteOrderQuery, [orderId], (error, results) => {
                if (error) {
                    console.error('Ошибка выполнения запроса:', error);
                    res.status(500).json({ error: 'Ошибка выполнения запроса' });
                } else {
                    res.json({ message: 'Заказ и связанные с ним элементы успешно удалены' });
                }
            });
        }
    });
});
app.delete('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id; // Получаем ID продукта для удаления

    // Начинаем транзакцию
    connection.beginTransaction(function (err) {
        if (err) {
            console.error('Ошибка начала транзакции:', err);
            res.status(500).json({error: 'Ошибка удаления продукта'});
            return;
        }

        const deleteImgProductQuery = 'DELETE FROM img_product WHERE product_id = ?';
        const deleteProductVarietiesQuery = 'DELETE FROM product_varieties WHERE product_id = ?';
        const deleteProductQuery = 'DELETE FROM product WHERE id = ?';

        // Удаление связанных записей из img_product
        connection.query(deleteImgProductQuery, [productId], function (error, result) {
            if (error) {
                console.error('Ошибка удаления изображений продукта:', error);
                return connection.rollback(function () {
                    res.status(500).json({error: 'Ошибка удаления продукта'});
                });
            }

            // Затем удаляем записи из product_varieties
            connection.query(deleteProductVarietiesQuery, [productId], function (error, result) {
                if (error) {
                    console.error('Ошибка удаления вариантов продукта:', error);
                    return connection.rollback(function () {
                        res.status(500).json({error: 'Ошибка удаления продукта'});
                    });
                }

                // Удаляем основной продукт
                connection.query(deleteProductQuery, [productId], function (error, result) {
                    if (error) {
                        console.error('Ошибка удаления основного продукта:', error);
                        return connection.rollback(function () {
                            res.status(500).json({error: 'Ошибка удаления продукта'});
                        });
                    }

                    connection.commit(function (err) {
                        if (err) {
                            console.error('Ошибка подтверждения транзакции:', err);
                            return connection.rollback(function () {
                                res.status(500).json({error: 'Ошибка удаления продукта'});
                            });
                        }

                        res.status(200).json({message: 'Продукт и его связанные записи успешно удалены'});
                    });
                });
            });
        });
    });
});

app.post('/addUsers', (req, res) => {
    const {phone_number, login, password, first_name, last_name} = req.body;

    if (!phone_number || !login || !password || !first_name || !last_name) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }

    // Проверка наличия пользователя с таким номером телефона или логином
    const checkDuplicateQuery = 'SELECT * FROM users WHERE phone_number = ? OR login = ?';
    connection.query(checkDuplicateQuery, [phone_number, login], (duplicateError, duplicateResults) => {
        if (duplicateError) {
            console.error('Ошибка при проверке дубликатов:', duplicateError);
            return res.status(500).json({error: 'Ошибка при проверке дубликатов'});
        }

        if (duplicateResults.length > 0) {
            // Пользователь с таким номером телефона или логином уже существует
            return res.status(409).json({error: 'Пользователь с таким номером телефона или логином уже существует'});
        }

        // Продолжаем регистрацию, так как пользователь с таким номером телефона или логином не существует

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const insertUserQuery = 'INSERT INTO users (phone_number, login, password, first_name, last_name) VALUES (?,?,?,?,?)';
        connection.query(insertUserQuery, [phone_number, login, hashedPassword, first_name, last_name], (error) => {
            if (error) {
                console.error('Ошибка добавления пользователя:', error);
                return res.status(500).json({error: 'Ошибка добавления пользователя'});
            }

            res.status(200).json({message: 'Пользователь успешно добавлен'});
        });
    });
});


app.post('/login', (req, res) => {
    let { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Отсутствует логин или пароль в запросе' });
    }

    let sqlQuery;
    let sqlParams;

    // Если введенное имя пользователя является числом, считаем это номером телефона
    if (!isNaN(login)) {
        sqlQuery = 'SELECT * FROM users WHERE phone_number = ?';
        sqlParams = [login];
    } else {
        sqlQuery = 'SELECT * FROM users WHERE login = ?';
        sqlParams = [login];
    }

    connection.query(sqlQuery, sqlParams, (error, results) => {
        if (error) {
            console.error('Ошибка при поиске пользователя:', error);
            res.status(500).json({ error: 'Ошибка при поиске пользователя' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: 'Пользователь не найден' });
            } else {
                const hashedPassword = results[0].password;

                bcrypt.compare(password, hashedPassword, (bcryptError, bcryptResult) => {
                    if (bcryptError) {
                        console.error('Ошибка сравнения паролей:', bcryptError);
                        res.status(500).json({ error: 'Ошибка сравнения паролей' });
                    } else {
                        if (bcryptResult) {
                            // Пароль совпадает, генерируем токен
                            const user = {
                                id: results[0].id,
                                login: results[0].login,
                                firstName: results[0].first_name,
                                lastName: results[0].last_name,
                                phoneNumber: results[0].phone_number,
                                // Другие данные о пользователе, которые могут быть полезны
                            };

                            const accessToken = jwt.sign(user, 'секретный_ключ', { expiresIn: '1h' });

                            res.status(200).json({
                                accessToken,
                                login: user.login,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                phoneNumber: user.phoneNumber
                            });
                        } else {
                            // Неправильный пароль
                            res.status(401).json({ error: 'Неправильный пароль' });
                        }
                    }
                });
            }
        }
    });
});



app.post('/addProduct', (req, res) => {
    // Проверяем наличие необходимых полей в запросе
    console.log('Received request:', req.body);
    if (!req.body || !req.body.name_item || !req.body.price_item || !req.body.quan_item || !req.body.show_item || !req.body.category_item || !req.body.text_info) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }
    // Деструктурируем данные о новом продукте из тела запроса
    const {name_item, price_item, quan_item, show_item, category_item, text_info, date_item} = req.body;
    // Ваш SQL-запрос для добавления продукта в базу данных
    const sqlQuery = 'INSERT INTO product (name_item, price_item, quan_item, show_item, category_item, text_info, date_item) VALUES (?, ?, ?, ?, ?, ?, ?)';

    // Выполняем запрос к базе данных для добавления продукта
    connection.query(sqlQuery, [name_item, price_item, quan_item, show_item, category_item, text_info, date_item], (error) => {
        if (error) {
            console.error('Ошибка добавления продукта:', error);
            res.status(500).json({error: 'Ошибка добавления продукта'});
        } else {
            res.status(200).json({message: 'Продукт успешно добавлен'});
        }
    });
});
app.post('/addItemOrders', (req, res) => {
    if (!req.body || !req.body.quantity || !req.body.image_url) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }
    const {order_id, quantity, image_url, price, variety_price, item_name, variety_name, order_product_id, order_variety_id} = req.body;
    const sqlQuery = 'INSERT INTO order_items (order_id, quantity, image_url, price, variety_price, item_name, variety_name, order_product_id, order_variety_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sqlQuery, [order_id, quantity, image_url, price, variety_price, item_name, variety_name, order_product_id, order_variety_id], (error) => {
        if (error) {
            console.error('Ошибка добавления продукта:', error);
            res.status(500).json({error: 'Ошибка добавления продукта'});
        } else {
            res.status(200).json({message: 'Продукт успешно добавлен'});
        }
    });
})
app.post('/addOrders', (req, res) => {
    if (!req.body || !req.body.order_date || !req.body.telephone || !req.body.last_name || !req.body.first_name || !req.body.middle_name) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }
    const {
        order_date,
        telephone,
        last_name,
        first_name,
        middle_name,
        comment,
        city,
        address,
        postal_code,
        total_price,
        complete,
        payment_method
    } = req.body;
    const sqlQuery = 'INSERT INTO orders (order_date, telephone, last_name, first_name, middle_name, comment, city, address, postal_code, total_price, complete, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sqlQuery, [order_date, telephone, last_name, first_name, middle_name, comment, city, address, postal_code, total_price, complete, payment_method], (error) => {
        if (error) {
            console.error('Ошибка добавления продукта:', error);
            res.status(500).json({error: 'Ошибка добавления продукта'});
        } else {
            res.status(200).json({message: 'Продукт успешно добавлен'});
        }
    });
})


app.post('/addProductVarieties', (req, res) => {
    console.log('Received request:', req.body); // Добавляем эту строку для вывода содержимого тела запроса в консоль
    if (!req.body || !req.body.product_id || !req.body.variety_name || !req.body.variety_quan || !req.body.variety_price) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }
    const {product_id, variety_name, variety_quan, variety_price} = req.body;

    if (!Array.isArray(variety_name) || !Array.isArray(variety_quan) || !Array.isArray(variety_price)) {
        return res.status(400).json({error: 'Variety_name, variety_quan и variety_price должны быть массивами'});
    }

    if (variety_name.length !== variety_quan.length || variety_name.length !== variety_price.length) {
        return res.status(400).json({error: 'Длины массивов не совпадают'});
    }

    // Подготовка SQL-запроса с placeholder'ами для значений
    const sqlQuery = `INSERT INTO product_varieties (product_id, variety_name, variety_quan, variety_price)
                      VALUES ?`;

    // Формирование массива массивов значений для вставки в SQL-запрос
    const values = variety_name.map((_, index) => [product_id, variety_name[index], variety_quan[index], variety_price[index]]);

    // Выполнение запроса к базе данных с использованием значений
    connection.query(sqlQuery, [values], (error, results) => {
        if (error) {
            console.error('Ошибка вставки данных:', error);
            return res.status(500).json({error: error.message}); // Отображаем подробности ошибки
        } else {
            console.log('Данные успешно вставлены:', results);
            return res.status(200).json({message: 'Данные успешно добавлены в таблицу'});
        }
    });
});

app.post('/addProductImg', (req, res) => {
    console.log('Received request:', req.body); // Добавляем эту строку для вывода содержимого тела запроса в консоль
    if (!req.body || !req.body.product_id || !req.body.img) {
        return res.status(400).json({error: 'Отсутствуют необходимые поля в запросе'});
    }
    const {img, product_id} = req.body;

    if (!Array.isArray(img)) {
        return res.status(400).json({error: 'Variety_name, variety_quan и variety_price должны быть массивами'});
    }

    // Подготовка SQL-запроса с placeholder'ами для значений
    const sqlQuery = `INSERT INTO img_product (img, product_id)
                      VALUES ?`;

    // Формирование массива массивов значений для вставки в SQL-запрос
    const values = img.map((_, index) => [img[index], product_id]);

    // Выполнение запроса к базе данных с использованием значений
    connection.query(sqlQuery, [values], (error, results) => {
        if (error) {
            console.error('Ошибка вставки данных:', error);
            return res.status(500).json({error: error.message}); // Отображаем подробности ошибки
        } else {
            console.log('Данные успешно вставлены:', results);
            return res.status(200).json({message: 'Данные успешно добавлены в таблицу'});
        }
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});