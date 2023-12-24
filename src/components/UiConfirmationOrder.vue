<script setup>
import {onMounted, ref} from 'vue'
import UiPoshta from "@/components/Poshta/UiPoshta.vue";
import {useMyStore} from "@/store/store.js";

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
  <div style="box-sizing: border-box">
    <div style="width: 1000px">
    <div class="div-header">
      <h1>
        Оформлення замовлення
      </h1>
    </div>
    <div class="div-body">
      <div>
        <h3>Ваші контактні дані</h3>
        <label>Мобільний телефон</label>
        <input v-model="telephone" placeholder="+380963567893"/>
        <label>Призвище</label>
        <input v-model="lastName" placeholder="Прізвище"/>
        <label>Ім'я</label>
        <input v-model="firstname" placeholder="Ім'я"/>
        <label>По-батькові</label>
        <input v-model="surname" placeholder="По-батькові"/>
      </div>
      <div>
        <UiPoshta></UiPoshta>
      </div>
    </div>
    <div>
      <h2>Замовлення</h2>
      <div class="div-product" v-for="item in store.cartProducts" :key="item.id">
        <img :src="item.images.img"/>
        {{item.product.name_item}}
        {{item.product.price_item}}
      </div>
      <div class="div-button">
        <button @click="store.swapOpenCart()">Редагувати товари</button>
      </div>
    </div>
    </div>
    <div class="div-addForm">
        <h2>Разом</h2>
        <h4>{{store.cartProducts.length}} Товару на суму ???</h4>
        <h4>Вартість доставки згідно з тарифами перевізника</h4>
        <button>підтвердити замовлення</button>
    </div>
  </div>
</template>

<style scoped>
/* Стили для контейнера */
.div-header {
  background-color: #f2f2f2;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}
.div-product{
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid gray;
  padding: 15px;
  display: flex;
}
img{
  height: 150px;
  width: 100px;
}
.div-header h1 {
  margin: 0;
  font-size: 1.5em;
}
.div-addForm{
  border: 1px solid gray;
  width: 400px;
  height: 100%;
  padding: calc(4px * 4);
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #e9e9e9;
}
.div-body {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.div-body div {
  flex: 1 1 50%; /* При ширине экрана больше 800px каждый блок будет занимать половину */
}

.div-body h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

/* Стили для формы */
input[type="text"] {
  width: calc(100% - 20px); /* Вычитаем отступы для учета полей padding */
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
}

input[type="text"]:focus {
  outline: none;
  border-color: #00a0e4;
}

label {
  font-weight: bold;
  margin-top: 20px;
  display: block;
  font-size: 0.9em;
  color: #444;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #00a0e4;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.div-button{
  display: flex;
  justify-content: end;
  margin: 10px;
}
button:hover {
  background-color: #0083b0;
}
input{
  border-radius: 5px;
  border: 1px solid gray;
  padding: 10px;
}

@media (max-width: 800px) {
  .div-body div {
    flex: 1 1 100%; /* При ширине экрана меньше 800px каждый блок будет занимать 100% */
  }
}
</style>>