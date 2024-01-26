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
};
const updateCartProductCount = (index) => {
  const savedCartProducts = JSON.parse(sessionStorage.getItem('cartProducts'));
  savedCartProducts[index].countProduct = store.cartProducts[index].countProduct;

  sessionStorage.setItem('cartProducts', JSON.stringify(savedCartProducts));
}

const decrementQuanProduct = (index) => {
  if (store.cartProducts[index].countProduct > 1) {
    store.cartProducts[index].countProduct--

    updateCartProductCount(index)
  } else {
    console.log('h')
  }
};
const sumQuanProduct = (index) => {
  const storeVariety = store.cartProducts[index].selectedVariety

  if (storeVariety === null && store.cartProducts[index].countProduct < store.cartProducts[index].product.quan_item) {
    store.cartProducts[index].countProduct++;

    updateCartProductCount(index)
  } else {

    if (storeVariety !== null && storeVariety.variety_quan > store.cartProducts[index].countProduct) {
      store.cartProducts[index].countProduct++;

      updateCartProductCount(index)
    }

  }

};

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
        <div class="product-image">
          <img :src="item.images.img" alt="Product Image">
        </div>
        <div class="product-details">
          <div class="div-text-name">
            <h1 class="text-name">
              {{ item.product.name_item }}
            </h1>
            <svg @click="removeProduct(index)" class="icon-trash" xmlns="http://www.w3.org/2000/svg" height="28"
                 width="26" viewBox="0 0 448 512">
              <path
                  d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
            </svg>
          </div>
          <div v-if="item.selectedVariety">
            <div>
              <p style="margin-bottom: 0; overflow-wrap: break-word; height: 38px; overflow: hidden">Варіація: {{ item.selectedVariety.variety_name }}</p>
            </div>
            <div>
              <div>

                <button @click="decrementQuanProduct(index)">-</button>
                <span class="span-quan">Кiл: </span>{{ item.countProduct }}<button @click="sumQuanProduct(index)">+</button>
              </div>
            </div>
          </div>


          <div
              style="display: flex; height: 20px;align-items: center;"
              v-if="item.selectedVariety === null"
          >
            <button @click="decrementQuanProduct(index)">-</button>
            <p>Кiл: {{ item.countProduct }}</p>
            <button @click="sumQuanProduct(index)">+</button>
          </div>

          <div style=" width: 100%; display: flex; justify-content: space-between; align-items: center">
            <p v-if="item.selectedVariety">Ціна: {{ item.selectedVariety.variety_price * item.countProduct }} ₴</p>
            <p v-if="item.selectedVariety === null">Ціна: {{ item.product.price_item * item.countProduct }} ₴</p>

          </div>
        </div>
      </div>
    </div>
    <div class="div-footer">
      <div class="cart-receipt">
        <p style="margin-bottom: 0">Загальна ціна: <span style="color: black">{{ allPriceCart }}</span> ₴</p>
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
.div-text-name{

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text-name {
  height: 40px;
  margin-bottom: 0px;
  overflow: hidden;
  word-wrap: break-word;
  font-size: 18px;
  font-weight: bold;
  width: 100%;
}

.icon-trash {
  height: 24px;
  width: 28px;
}

.div-header h1 {
  margin: 0;
  cursor: pointer;
}

.div-body {
  padding: 20px;
  flex-wrap: wrap; /* Разрешаем перенос элементов на новую строку */
  overflow: auto; /* Добавляем прокрутку, если элементы не помещаются */
  gap: 20px;
}

.product-item {
  margin-bottom: 20px; /* Отступ снизу между элементами */
  width: 100%; /* Установка ширины элемента в половину контейнера с учетом отступов */

  display: flex;
  background: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #cecece;
  box-shadow: 2px 2px 10px gray;
}

.product-image {
  width: 250px;
  height: 100%;
  display: block;
  border-radius: 10px 2px 2px 10px;
}

img {
  width: 200px;
  height: 200px;
  border-radius: 10px 2px 2px 10px;
}

.product-details {
  padding: 10px;
  width: 100%;
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

  .product-image {
    width: 200px;
    height: 250px;
  }

  img {
    height: 200px;
    width: 180px;
    border-radius: 10px 2px 2px 10px;
  }

}

@media (max-width: 450px) {
  .product-image {
    height: 200px;
    width: 200px;
  }

}
@media (max-width: 368px) {
  .product-image{
    height: 200px;
    width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img{
    margin-left: 5px;
    border-radius: 0 2px 2px 0;
    height: 120px;
    width: 115px;
    box-shadow: 2px 2px 10px gray;
  }
}

@media (min-width: 800px) {
  .product-item {
    width: 100%; /* Установка ширины элемента в половину контейнера с учетом отступов */
  }

  .product-image {
    height: 100%;
  }

}
</style>

