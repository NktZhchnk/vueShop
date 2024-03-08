import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import bodyParser from 'body-parser';

const token = '6963095733:AAFvWDEDDP8zysXg4Qad4g9nGoBTX4nkXsk';

// Создание объекта бота с отключенным polling
const bot = new TelegramBot(token, { polling: false });

// Создание объекта express и выбор подходящего порта
const app = express();
const port = 3000;

// Парсер для JSON данных
app.use(bodyParser.json());

// Обработчик для Webhook
app.post(`/webhook/${token}`, (req, res) => {
    const update = req.body;
    bot.processUpdate(update);
    res.sendStatus(200);
});

// Запуск веб-сервера
app.listen(port, () => {
    console.log(`Webhook server is running on port ${port}`);
});

// Настройка URL вашего сервера (замените 'your_domain' на домен вашего сервера)
const url = 'https://eseniabila.com.ua/webhook/' + token;
bot.setWebHook(url);

// Обработчик для новых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(`Received message in chat ${chatId}`);
});
