<script setup>
import {onMounted, ref} from 'vue'
import UiPoshta from "@/components/Poshta/UiPoshta.vue";
import {useMyStore} from "@/store/store.js";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()

const store = useMyStore()
let telephone = ref('');
let firstname = ref('');
let lastName = ref('');
let surname = ref('');
let paymentMethod = ref(null);
let comment = ref('');
const loadCartProducts = () => {
  const savedCartProducts = sessionStorage.getItem('cartProducts');
  if (savedCartProducts) {
    store.cartProducts = JSON.parse(savedCartProducts);
  }
};
const validateTelephone = () => {
  let maxLength = 10
  telephone.value = telephone.value.replace(/\D/g, '');
  if (telephone.value.length > maxLength) {
    telephone.value = telephone.value.slice(0, maxLength);
  }
}
const validateText = () => {
  lastName.value = lastName.value.replace(/[^а-яА-ЯёЁіІїЇґҐєЄ]/g, '');
  firstname.value = firstname.value.replace(/[^а-яА-ЯёЁіІїЇґҐєЄ]/g, '');
  surname.value = surname.value.replace(/[^а-яА-ЯёЁіІїЇґҐєЄ]/g, '');
  comment.value = comment.value.replace(/[^\sа-яА-ЯёЁіІїЇґҐєЄ0-9.,]/g, '');
}
const messageToTelegram = () => {
  async function sendMessageToTelegram(message) {
    try {
      const response = await axios.post('/api/send-message', { message });
      console.log(response.data);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  }

// Пример использования
  sendMessageToTelegram('У вас нове замовлення 🥹');
}
const addOrders = async () => {
  try {
    if (store.cartProducts.length !== 0) {
      if (
          telephone.value !== '' &&
          lastName.value !== '' &&
          firstname.value !== '' &&
          paymentMethod.value !== null &&
          surname.value !== '' &&
          store.selectPoshta.cities !== '' &&
          (store.selectPoshta.searchQuery !== '' || store.selectPoshta.postIndex !== '') &&
          acceptTerms.value !== false
      ) {
        // Если все поля заполнены, формируем заказ и отправляем данные
        let order = {
          order_date: new Date(),
          telephone: telephone.value,
          last_name: lastName.value,
          first_name: firstname.value,
          middle_name: surname.value,
          comment: comment.value,
          city: store.selectPoshta.cities,
          address: store.selectPoshta.searchQuery,
          postal_code: store.selectPoshta.postIndex,
          total_price: store.allPriceProducts,
          complete: true,
          payment_method: paymentMethod.value,
        };

        // Отправка данных на сервер
        const orderResponse = await axios.post('https://eseniabila.com.ua/addOrders', order, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Ответ сервера:', orderResponse.data);
        let idOrder = ref(0);
        const getIdOrder = async () => {
          try {
            const response = await axios.get('https://eseniabila.com.ua/getOrders');
            // Обработка данных и сохранение их в состоянии магазина
            const lastItem = response.data.reduce((acc, curr) => (curr.id > acc.id ? curr : acc), response.data[0]);
            console.log(lastItem.id)
            idOrder.value = lastItem.id;
            // Предполагается, что lastIdOrders - это свойство в данных ответа
            return lastItem.lastIdOrders;
          } catch (error) {
            // Обработка ошибок
            console.error('Произошла ошибка:', error);
            throw error; // Переброс ошибки для обработки в вызывающем коде, если это необходимо
          }
        };

        // Используйте await или .then для получения данных из асинхронной функции
        const lastIdOrders = await getIdOrder();
        console.log('Ответ сервера:', lastIdOrders);

        for (const cartProduct of store.cartProducts) {
          let orderItem = {
            order_id: idOrder.value,
            quantity: cartProduct.countProduct,
            image_url: cartProduct.images.img,
            price: cartProduct.product.price_item,
            variety_price: cartProduct.selectedVariety ? cartProduct.selectedVariety.variety_price : null,
            item_name: cartProduct.product.name_item,
            variety_name: cartProduct.selectedVariety ? cartProduct.selectedVariety.variety_name : null,
            order_product_id: cartProduct.product.id,
            order_variety_id: cartProduct.selectedVariety ? cartProduct.selectedVariety.id : null,
          };

          if (cartProduct.selectedVariety !== null) {
            let varietyId = cartProduct.selectedVariety.id;
            let newVarietyQuan = cartProduct.selectedVariety.variety_quan - cartProduct.countProduct;
            cartProduct.selectedVariety.variety_quan = newVarietyQuan;
            console.log('количество в корзине', cartProduct.selectedVariety.variety_quan = newVarietyQuan);

            // Обновление количества вариации
            const varietyResponse = await axios.put(`https://eseniabila.com.ua/updateVarietyCount/${varietyId}`, {
              variety_quan: newVarietyQuan,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('Ответ сервера количество вариации:', varietyResponse.data);

            let productId = cartProduct.product.id;
            let newProductQuan = cartProduct.product.quan_item - cartProduct.countProduct;
            cartProduct.product.quan_item = newProductQuan;

            console.log('Количество продукта:', newProductQuan);

            // Ищем индексы текущего продукта в массиве store.cartProducts
            const indexes = store.cartProducts
                .map((item, index) => (item.product.id === cartProduct.product.id ? index : -1))
                .filter(index => index !== -1);

            // Если продукт найден, обновляем его количество для каждого индекса
            indexes.forEach(index => {
              store.cartProducts[index].product.quan_item = newProductQuan;
            });

            const varietyResponse2 = await axios.put(`https://eseniabila.com.ua/updateProductCount/${productId}`, {
              variety_quan: newProductQuan,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('Ответ сервера количество вариации:', varietyResponse2.data);
            // Обновление количества продукта
            // await updateProductCount(cartProduct);
          } else if (cartProduct.selectedVariety === null) {
            // Обновление количества продукта
            let productId = cartProduct.product.id;
            let newProductQuan = cartProduct.product.quan_item - cartProduct.countProduct;
            cartProduct.product.quan_item = newProductQuan;

            console.log('Количество продукта:', newProductQuan);

            // Ищем индексы текущего продукта в массиве store.cartProducts
            const indexes = store.cartProducts
                .map((item, index) => (item.product.id === cartProduct.product.id ? index : -1))
                .filter(index => index !== -1);

            // Если продукт найден, обновляем его количество для каждого индекса
            indexes.forEach(index => {
              store.cartProducts[index].product.quan_item = newProductQuan;
            });

            const varietyResponse2 = await axios.put(`https://eseniabila.com.ua/updateProductCount/${productId}`, {
              variety_quan: newProductQuan,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('Ответ сервера количество вариации:', varietyResponse2.data);

          } else {
            console.log('ты лох');
            return;
          }

          // Добавление товара в заказ
          const itemResponse = await axios.post('https://eseniabila.com.ua/addItemOrders', orderItem, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Ответ сервера:', itemResponse.data);
        }
        checkBtn.value = false;
        store.cartProducts = []
        messageToTelegram()
        setTimeout(() => {
          router.push({name: 'RenderProducts'})
          setTimeout(() => {
            window.location.reload();
          }, 100)
        }, 3000)
        sessionStorage.removeItem('cartProducts');
      } else {
        // Если какое-то поле не заполнено, добавляем класс error для подсветки
        if (telephone.value === '') {
          fnRedBorder('.inp-telephone');
        }
        if (firstname.value === '') {
          fnRedBorder('.inp-firstName');
        }
        if (lastName.value === '') {
          fnRedBorder('.inp-lastName');
        }
        if (surname.value === '') {
          fnRedBorder('.inp-surname');
        }
        if (paymentMethod.value === null) {
          fnRedBorder('.payment-options')
        }
        if (store.selectPoshta.cities === '') {
          alert('введіть місто')
        }
        if(acceptTerms.value === false){
          fnRedBorder('.form-group')
        }
        if (store.selectPoshta.postIndex === '' || store.selectPoshta.searchQuery === '') {
          if(store.selectPoshta.postIndex !== ''){
            return
          }else{
            if(store.selectPoshta.searchQuery === ''){
              alert('введіть місце доставки')
            }
          }

        }
        console.log('Не все поля заполнены');
      }
    } else {
      console.log('Ошибка');
      fnRedBorder('.order-summary');
    }
  } catch (error) {
    console.error('Ошибка при выполнении заказа:', error);
    // Обработка ошибки
  }
}

const fnRedBorder = (item) => {
  const inp = document.querySelector(item)
  inp.style.border = "1px solid red";
  inp.style.borderRadius = "10px";
}
let allPrice = sessionStorage.getItem('allPrice')
store.allPriceProducts = allPrice;

onMounted(() => {
  loadCartProducts();
  store.getOrders();
});

let acceptTerms = ref(false);
let checkBtn = ref(true);
</script>

<template>
  <div class="container" v-show="checkBtn === true">
    <div class="header">
      <h1>Оформлення замовлення</h1>
    </div>
    <div class="body">
      <div class="contact-info">
        <h3 style="font-size: 22px">Ваші контактні дані</h3>
        <div class="input-group">
          <label>Мобільний телефон</label>
          <input class="inp-telephone" @input="validateTelephone" v-model="telephone" placeholder="0963567893"/>
        </div>
        <div class="input-group">
          <label>Призвище</label>
          <input class="inp-lastName" v-model="lastName" @input="validateText" placeholder="Прізвище"/>
        </div>
        <div class="input-group">
          <label>Ім'я</label>
          <input class="inp-firstName" v-model="firstname" @input="validateText" placeholder="Ім'я"/>
        </div>
        <div class="input-group">
          <label>По-батькові</label>
          <input class="inp-surname" v-model="surname" @input="validateText" placeholder="По-батькові"/>
        </div>
        <div class="input-group">
          <label>Коментар(за бажанням)</label>
          <input v-model="comment" @input="validateText" placeholder="Коментерій"/>
        </div>
      </div>
      <div class="delivery-info">
        <UiPoshta></UiPoshta>
      </div>

    </div>
    <div class="order-summary">
      <h2>Замовлення</h2>
      <div class="product-list">
        <div style="width: 100%; box-shadow: 2px 2px 5px gray" class="product-item" v-for="item in store.cartProducts"
             :key="item.id">
          <img style="border-radius: 5px" :src="item.images.img"/>
          <div class="product-details">
            <span style=" word-break: break-word; height: 58px;  overflow: hidden">{{ item.product.name_item }}</span>
            <span>Кількість: {{ item.countProduct }}</span>
            <span style="margin-top: 10px">Ціна {{ item.product.price_item * item.countProduct }} ₴</span>
          </div>
        </div>
      </div>
      <div class="edit-cart-button">
        <button @click="store.swapOpenCart()">Редагувати товари</button>
      </div>
    </div>

    <div class="payment-options" style="margin-top: 15px;">
      <h2>Спосiб Оплати</h2>
      <label v-if="store.allPriceProducts >= 200" class="payment-option">
        <input type="radio" name="paymentMethod" v-model="paymentMethod" value="cashOnDelivery" class="radio-input"/>
        <span class="radio-custom"></span>
        <span>Післяплата (оплата при отриманні)</span>
      </label>

      <label class="payment-option" style="margin-top: 10px;">
        <input type="radio" name="paymentMethod" v-model="paymentMethod" value="creditCard" class="radio-input"/>
        <span class="radio-custom"></span>
        <span>Повна передоплата на картку</span>
      </label>
    </div>

    <div class="form-group">

      <label for="acceptTerms">
        <input type="checkbox" v-model="acceptTerms" id="acceptTerms" class="checkbox-field">
        Я прочитав(-ла) і приймаю <router-link to="/uiUserAgreement">Користувача угода</router-link>.
      </label>
    </div>


    <div class="order-total">
      <h2>Разом</h2>
      <h4>{{ store.cartProducts.length }} Товару на суму: {{ store.allPriceProducts }} ₴</h4>
      <h4>Вартість доставки згідно з тарифами перевізника</h4>
      <h2></h2>
      <button v-if="checkBtn" @click="addOrders">Підтвердити замовлення</button>
    </div>
  </div>
  <div v-show="checkBtn !== true" class="custom-container">
    <h1>Ваше замовлення принято. Дякуємо за замовлення!</h1>
  </div>
</template>

<style scoped>

/* Принятие после заказа */
.custom-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

h1 {
  text-align: center;
  color: #1a1a1a; /* Change the color to your preference */
}

@media screen and (max-width: 600px) {
  .custom-container {
    padding: 10px;
  }
}

/* Общие стили */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  color: #333;
}

.error {
  border: 1px solid red;
}

/* Стили для заголовка */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 1.8em;
  margin: 0;
}

/* Стили для блоков контактной информации и доставки */
.body {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contact-info,
.delivery-info {
  flex: 1 1 50%;
}

.contact-info h3,
.delivery-info h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

/* Стили для полей ввода */
.input-group {
  margin-top: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 5px;
}

/* Стили для списка товаров */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.product-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.product-item img {
  width: 150px;
  height: 150px;
}

.product-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Стили для кнопки редактирования корзины */
.edit-cart-button {
  text-align: center;

  margin-top: 15px;
}

.edit-cart-button button {
  padding: 10px 20px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #fdd8b4;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-cart-button button:hover {
  background-color: #fdd8b4;
}

/* Стили для блока суммарной информации по заказу */
.order-summary {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  background-color: #f5f5f5;
  margin-top: 20px;
}

.order-summary h2 {
  margin-top: 0;
  font-size: 1.5em;
}

.order-summary h4 {
  margin-bottom: 10px;
}

.order-summary button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #343434;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.order-summary button:hover {
  background-color: #181818;
}

.order-total {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  background-color: #f5f5f5;
  margin-top: 20px;
  text-align: center;
}

.order-total h2 {
  margin-top: 0;
  font-size: 1.8em;
  color: #333;
}

.order-total h4 {
  margin-bottom: 15px;
  font-size: 1.1em;
  color: #777;
}

.order-total button {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  background-color: #282828;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.1em;
  text-transform: uppercase;
}


.order-total button:hover {
  background-color: #181818;
}

/* Выбор оплаты*/
.payment-option {
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
  margin-bottom: 10px;
}

.radio-input {
  width: 20px; /* Adjust the width as needed */
}


input[type="radio"]:checked + .radio-custom::after {
  display: block;
}



.form-group {
  margin-left: 5px;
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.form-group input{
  width: 13px;
}
.checkbox-field {
  margin-right: 2px;
}

/* Общие стили для чекбокса и его лейбла */
.checkbox-field,
.form-group label {
  padding-top: 3px;
  display: inline-block;
  vertical-align: middle;
}

/* Стили для подсветки текста ссылки в лейбле */
.form-group label a {
  color: #007bff; /* Change the color to your preference */
  text-decoration: underline;
  cursor: pointer;
}

.form-group label a:hover {
  color: #0056b3; /* Change the color to your preference */
}

/* Медиа-запросы для адаптивности */
@media (max-width: 600px) {
  .form-group {
    flex-direction: column;
  }

  .checkbox-field {
    margin-right: 0;
    margin-top: 5px; /* Adjust the margin as needed */
  }

  .form-group label {
    margin-top: 5px;
  }
}


/* Медиа-запросы для адаптивности */
@media (max-width: 960px) {
  .body {
    flex-direction: column;
  }

  .contact-info,
  .delivery-info {
    flex: 1 1 100%;
  }
}

</style>
