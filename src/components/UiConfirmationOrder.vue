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
const loadCartProducts = () => {
  const savedCartProducts = sessionStorage.getItem('cartProducts');
  if (savedCartProducts) {
    store.cartProducts = JSON.parse(savedCartProducts);
    console.log('Загружена корзина товаров в офор:', store.cartProducts);
  }
};

onMounted(loadCartProducts);
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Оформлення замовлення</h1>
    </div>
    <div class="body">
      <div class="contact-info">
        <h3>Ваші контактні дані</h3>
        <div class="input-group">
          <label>Мобільний телефон</label>
          <input v-model="telephone" placeholder="+380963567893"/>
        </div>
        <div class="input-group">
          <label>Призвище</label>
          <input v-model="lastName" placeholder="Прізвище"/>
        </div>
        <div class="input-group">
          <label>Ім'я</label>
          <input v-model="firstname" placeholder="Ім'я"/>
        </div>
        <div class="input-group">
          <label>По-батькові</label>
          <input v-model="surname" placeholder="По-батькові"/>
        </div>
      </div>
      <div class="delivery-info">
        <UiPoshta></UiPoshta>
      </div>
    </div>
    <div class="order-summary">
      <h2>Замовлення</h2>
      <div class="product-list">
        <div style="width: 100%; box-shadow: 2px 2px 5px gray" class="product-item" v-for="item in store.cartProducts" :key="item.id">
          <img style="border-radius: 5px" :src="item.images.img"/>
          <div class="product-details">
            <span style=" word-break: break-word; height: 60px; ">{{ item.product.name_item }}</span>
            <span>Ціна {{ item.product.price_item }} ₴</span>
          </div>
        </div>
      </div>
      <div class="edit-cart-button">
        <button @click="store.swapOpenCart()">Редагувати товари</button>
      </div>
    </div>
    <div class="order-total">
      <h2>Разом</h2>
      <h4>{{ store.cartProducts.length }} Товару на суму ???</h4>
      <h4>Вартість доставки згідно з тарифами перевізника</h4>
      <button>Підтвердити замовлення</button>
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
  margin-bottom: 15px;
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
  background-color: #00a0e4;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-cart-button button:hover {
  background-color: #0083b0;
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
  background-color: #00a0e4;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.order-summary button:hover {
  background-color: #0083b0;
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
  background-color: #00a0e4;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.1em;
  text-transform: uppercase;
}

.order-total button:hover {
  background-color: #0083b0;
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
