<script setup>
import {useMyStore} from "@/store/store.js";
import { onMounted } from 'vue';

const store = useMyStore()
const loadCartProducts = () => {
  const savedCartProducts = sessionStorage.getItem('cartProducts');
  if (savedCartProducts) {
    store.cartProducts = JSON.parse(savedCartProducts);
    console.log('Загружена корзина товаров:', store.cartProducts);
  }
};


onMounted(loadCartProducts);
</script>

<template>
  <div class="div-main" :class="{'show-menu': store.isOpenCart}">
    <div class="div-header">
      <h3>Корзина</h3>
      <h1 @click="store.swapShowPage()">x</h1>
    </div>
    <div class="div-body">
      <div v-for="item in store.cartProducts" :key="item.id" class="product-item">
        <img :src="item.images.img" alt="Product Image" class="product-image">
        <div class="product-details">
          <h1>{{ item.product.name_item }}</h1>
          <p>{{ item.selectedVariety.variety_name }}</p>
        </div>
      </div>
    </div>
    <div class="div-footer">
      <div class="cart-receipt">
        <button class="button-green">Оформить Заказ</button>
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
  width: 60%;
  max-width: 800px;
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

.div-header h1 {
  margin: 0;
  cursor: pointer;
}

.div-body {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.product-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px 8px 0 0;
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
}

.button-green:hover {
  background-color: #008c3f;
}
</style>

