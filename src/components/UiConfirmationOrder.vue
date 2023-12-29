<script setup>
import {onMounted, ref} from 'vue'
import UiPoshta from "@/components/Poshta/UiPoshta.vue";
import {useMyStore} from "@/store/store.js";
import UiUkrPoshta from "@/components/Poshta/UiUkrPoshta.vue";

const store = useMyStore()
let telephone = ref('');
let firstname = ref('');
let lastName = ref('');
let surname = ref('');
let comment = ref('');
const loadCartProducts = () => {
  const savedCartProducts = sessionStorage.getItem('cartProducts');
  if (savedCartProducts) {
    store.cartProducts = JSON.parse(savedCartProducts);
    console.log('Загружена корзина товаров в офор:', store.cartProducts);
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
  lastName.value = lastName.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
  firstname.value = firstname.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
  surname.value = surname.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
}
const addOrders = () =>{
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
    complete: false,
  }


}
onMounted(loadCartProducts);
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Оформлення замовлення</h1>
    </div>
    <div class="body">
      <div class="contact-info">
        <h3 style="font-size: 22px">Ваші контактні дані</h3>
        <div class="input-group">
          <label>Мобільний телефон</label>
          <input @input="validateTelephone" v-model="telephone" placeholder="0963567893"/>
        </div>
        <div class="input-group">
          <label>Призвище</label>
          <input v-model="lastName" @input="validateText" placeholder="Прізвище"/>
        </div>
        <div class="input-group">
          <label>Ім'я</label>
          <input v-model="firstname" @input="validateText" placeholder="Ім'я"/>
        </div>
        <div class="input-group">
          <label>По-батькові</label>
          <input v-model="surname" @input="validateText" placeholder="По-батькові"/>
        </div>
        <div class="input-group">
          <label>Коментерій</label>
          <input v-model="comment" placeholder="Коментерій"/>
        </div>
      </div>
      <div class="delivery-info">
        <UiPoshta></UiPoshta>
      </div>

    </div>
    <div class="order-summary">
      <h2>Замовлення</h2>
      <button @click="console.log(store.selectPoshta)">test</button>
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
    <div class="order-total">
      <h2>Разом</h2>
      <h4>{{ store.cartProducts.length }} Товару на суму: {{ store.allPriceProducts }} ₴</h4>
      <h4>Вартість доставки згідно з тарифами перевізника</h4>
      <button @click="addOrders">Підтвердити замовлення</button>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 100px;
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
  background-color: #fcc79f;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.order-summary button:hover {
  background-color: #f8a86d;
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
  background-color: #fcc79f;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.1em;
  text-transform: uppercase;
}

.order-total button:hover {
  background-color: #f8a86d;
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
