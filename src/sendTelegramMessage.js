// sendTelegramMessage.js

import fetch from 'node-fetch';

const botToken = '6963095733:AAFvWDEDDP8zysXg4Qad4g9nGoBTX4nkXsk';
const chatId = '669297666';

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Ошибка отправки сообщения в Telegram: ${error.message}`);
    }
}

export default sendTelegramMessage;
