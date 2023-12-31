<script setup>
import {useMyStore} from "@/store/store.js";
import {computed, onMounted} from 'vue';

const store = useMyStore()
const loadCartProducts = () => {
  const savedCartProducts = sessionStorage.getItem('cartProducts');
  if (savedCartProducts) {
    store.cartProducts = JSON.parse(savedCartProducts);
    console.log('Загружена корзина товаров:', store.cartProducts);
  }
};

const allPriceCart = computed(() => {
  // Получаем все цены товаров из store.cartProducts и складываем их
  return store.cartProducts.reduce((totalPrice, cartItem) => {
    let itemPrice = 0; // Инициализируем цену товара

    // Проверяем, есть ли у товара выбранная вариация и у нее есть variety_price
    if (cartItem.selectedVariety && cartItem.selectedVariety.variety_price) {
      itemPrice = parseFloat(cartItem.selectedVariety.variety_price * cartItem.countProduct);
    } else if (cartItem.product && cartItem.product.price_item && !isNaN(cartItem.product.price_item)) {
      // Если нет variety_price, но есть price_item у товара, используем его
      itemPrice = parseFloat(cartItem.product.price_item * cartItem.countProduct);
    }
      store.allPriceProducts = totalPrice + itemPrice;
    // Добавляем цену товара к общей стоимости
    return totalPrice + itemPrice;
  }, 0); // Начальное значение общей стоимости равно 0
});

const removeProduct = (index) => {
  console.log(index)
  const savedCartProducts = JSON.parse(sessionStorage.getItem('cartProducts'));
  savedCartProducts.splice(index, 1)
  store.cartProducts.splice(index, 1)

  sessionStorage.setItem('cartProducts', JSON.stringify(savedCartProducts));
}

onMounted(loadCartProducts);
</script>

<template>
  <div class="div-main" :class="{'show-menu': store.isOpenCart}">
    <div class="div-header">
      <h3>Кошик</h3>
      <h1 @click="store.swapShowPage()">x</h1>
    </div>
    <div class="div-body">
      <div v-for="(item, index) in store.cartProducts" :key="index" class="product-item">

        <img :src="item.images.img" alt="Product Image" class="product-image">
        <div class="product-details">
          <h1 class="text-name">Name:{{ item.product.name_item }}</h1>
          <p v-if="item.selectedVariety">variety: {{ item.selectedVariety.variety_name }} '''''' Quan: {{item.countProduct}} </p>

          <div
              style="display: block;"
              v-if="item.selectedVariety === null"
          >
            <p>Quan: {{item.countProduct}}</p>
          </div>
          <div style=" width: 100%; display: flex; justify-content: space-between; align-items: center">
            <p v-if="item.selectedVariety">Ціна: {{ item.selectedVariety.variety_price * item.countProduct}} ₴</p>

            <p v-if="item.selectedVariety === null">Ціна: {{ item.product.price_item * item.countProduct}} ₴</p>
            <svg @click="removeProduct(index)" class="icon-trash" xmlns="http://www.w3.org/2000/svg" height="28"
                 width="26" viewBox="0 0 448 512">
              <path
                  d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="div-footer">
      <div class="cart-receipt">
        <p>price:{{ allPriceCart }}</p>
        <router-link to="/uiConfirmationOrder">
          <button @click="store.swapShowPage()" class="button-green">Оформить Заказ</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>

.div-main {
  z-index: 5;
  border-radius: 10px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.7);
  transition: transform 0.3s ease, opacity 0.3s ease;
  width: 800px;
  height: 70%;
  overflow-y: auto;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.div-header {
  border-radius: 10px 10px 0 0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f2f2f2;
  border-bottom: 1px solid #ddd;
}

.div-header h3 {
  margin: 0;
  font-size: 1.2em;
}

.text-name {
  font-size: 18px;
  font-weight: bold;
  word-wrap: break-word;
  height: 40px;
  overflow: hidden;

}

.div-header h1 {
  margin: 0;
  cursor: pointer;
}

.div-body {
  padding: 20px;
  display: flex;
  flex-wrap: wrap; /* Разрешаем перенос элементов на новую строку */
  overflow: auto; /* Добавляем прокрутку, если элементы не помещаются */
  gap: 20px;
}

.product-item {
  width: calc(50% - 20px); /* Установка ширины элемента в половину контейнера с учетом отступов */
  margin-bottom: 20px; /* Отступ снизу между элементами */
  border: 1px solid gray;
  box-shadow: 3px 3px 5px gray;
  border-radius: 20px;
}

.product-image {
  width: 100%;
  height: 250px;
  display: block;
  border-radius: 20px 20px 0 0;
}

.product-details {
  padding: 10px;
}

.show-menu {
  transform: translate(-50%, -50%) scale(1); /* Увеличиваем размер до 1 (100%) */
}

.div-footer {
  position: sticky;
  bottom: 0;
  padding: 10px;
  background: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 -5px 5px -5px rgba(0, 0, 0, 0.2);
}

.cart-receipt {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button-green {
  background-color: #00a046;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
  cursor: pointer;
  margin-left: 20px;
}

.button-green:hover {
  background-color: #008c3f;
}

@media (max-width: 800px) {
  .div-main {
    width: 100%;
    border-radius: 0;
    height: 100%;
  }

  .div-header {
    border-radius: 0;

  }
}

@media (max-width: 450px) {
  .product-image {
    height: 200px;
  }
}

@media (min-width: 800px) {
  .product-item {
    width: calc(33% - 20px); /* Установка ширины элемента в половину контейнера с учетом отступов */
  }
}
</style>

