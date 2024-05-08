<script setup>
import {ref, computed, onMounted, onUnmounted} from "vue";
import {useMyStore} from "@/store/store.js";
import LazyLoadImage from "@/LazyLoadImage.vue";
import {throttle} from 'lodash';
import axios from "axios";


const store = useMyStore();
const productsPerPage = 15;
// const initiallyLoadedProducts = ref(productsPerPage);
const totalProducts = ref(0);
const scrollPosition = ref(0);
const selectedVariety = ref(null);
const countProduct = ref(1);
const product = ref(null); // Создаем реактивную переменную для информации о продукте
const images = ref([]); // Создаем реактивную переменную для изображений
const hasVarieties = computed(() => store.varieties.length > 0);
const INITIAL_PRODUCTS_PER_PAGE = 15;
const sessionStorageKey = 'initiallyLoadedProducts';
const showNotification = ref(false);

const resetState = () => {
  product.value = null
  images.value = []
  selectedVariety.value = null
  store.varieties = []
  store.showVariationModal = false
}

const selectedVarietyItem = async () => {
  await addToCart(product.value.id);
  setTimeout(() => {
    store.swapShowPage(); // Перемещение обратно на основную страницу после добавления в корзину
    resetState(); // Сброс состояния
  }, 130)
}

const initiallyLoadedProducts = ref(sessionStorage.getItem(sessionStorageKey) || INITIAL_PRODUCTS_PER_PAGE);

const loadMoreProducts = () => {
  initiallyLoadedProducts.value += productsPerPage;
  sessionStorage.setItem(sessionStorageKey, initiallyLoadedProducts.value); // Заменено на sessionStorage
};
const getProductDetails = async (itemId) => {
  try {
    const response = await axios.get(`https://eseniabila.com.ua/getProductById/${itemId}`);
    if (response.data) {
      product.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка при получении данных о товаре:', error);
  }

  try {
    const response = await axios.get(`https://eseniabila.com.ua/getImgById/${itemId}`);
    if (response.data) {
      images.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка при получении данных о картинках:', error);
  }

  try {
    const response = await axios.get(`https://eseniabila.com.ua/getVarietiesById/${itemId}`);
    if (response.data) {
      store.varieties = response.data;
    }
  } catch (error) {
    return;
  }
};
const updateCartProductCount = (index) => {
  const savedCartProducts = JSON.parse(sessionStorage.getItem('cartProducts'));
  // Обновляем количество товара в сохраненном массиве корзины
  savedCartProducts[index].countProduct = store.cartProducts[index].countProduct;

  // Обновляем корзину в sessionStorage
  sessionStorage.setItem('cartProducts', JSON.stringify(savedCartProducts));
};

const addToCart = async (itemId) => {
  await getProductDetails(itemId);
  if ((hasVarieties.value && selectedVariety.value !== null) || !hasVarieties.value) {
    // Проверяем, есть ли вариации и выбрана ли вариация, либо товар без вариаций
    const duplicateProductIndex = store.cartProducts.findIndex(item => {
      if (hasVarieties.value) {
        return item.selectedVariety && item.selectedVariety.id === selectedVariety.value.id;
      } else {
        return item.product.id === product.value.id;
      }
    });

    if (duplicateProductIndex !== -1) {
      // Если товар уже есть в корзине, увеличиваем количество товара
      store.cartProducts[duplicateProductIndex].countProduct += countProduct.value;
      updateCartProductCount(duplicateProductIndex);
    } else {
      // Если товара нет в корзине, добавляем новый элемент
      const newCartProduct = {
        selectedVariety: selectedVariety.value,
        product: product.value,
        images: images.value[0],
        countProduct: countProduct.value,
      };
      // Добавление нового товара в массив корзины
      store.cartProducts.push(newCartProduct);
      // Сохранение обновленной корзины в sessionStorage
      sessionStorage.setItem('cartProducts', JSON.stringify(store.cartProducts));
      console.log('Товар добавлен в корзину:', newCartProduct);
    }
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 1000);
  } else {
    // Проверяем, есть ли у товара вариации
    if (!hasVarieties.value) {
      // Если у товара нет вариаций, добавляем его в корзину без открытия модального окна
      const newCartProduct = {
        product: product.value,
        images: images.value[0],
        countProduct: countProduct.value,
      };
      // Добавление нового товара в массив корзины
      store.cartProducts.push(newCartProduct);
      // Сохранение обновленной корзины в sessionStorage
      sessionStorage.setItem('cartProducts', JSON.stringify(store.cartProducts));
      console.log('Товар добавлен в корзину:', newCartProduct);
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 1000);
    } else {
      if(store.showVariationModal === true){
        resetState();
        getProductDetails(itemId)
      }{
        if(store.varieties.length >= 1){
          openVariationModal();
        }else{
          resetState()
        }
      }
    }
  }
};

const openVariationModal = () => {
  store.swapShowVarietyProduct()
  store.showVariationModal = true;
};


onMounted(() => {
  totalProducts.value = store.products.length;
  observeScroll();
  window.scrollTo(0, scrollPosition.value);
  store.fetchData()
});

const itemImages = computed(() => {
  return (itemId) => {
    return store.productImg
        .filter(img => img.product_id === itemId)
        .map(img => img.img);
  };
});


const observeScroll = () => {
  const handleScroll = throttle(() => {
    requestAnimationFrame(() => {
      scrollPosition.value = window.scrollY;
      const scrollY = window.scrollY;

      const windowHeight = window.innerHeight;
      const contentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= contentHeight - 200) {
        loadMoreProducts();
      }
    });
  }, 500);

  window.addEventListener("scroll", handleScroll);
  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);

  });
};
const isItemInCart = computed(() => {
  return (itemId) => {
    return store.cartProducts.some(item => {
      return item.product.id === itemId;
    });
  };
});


</script>


<template>
  <div>
    <div class="div-catalog">
      <div style="display: flex; justify-content: center; align-items: center">
        <router-link to="/catalog" class="div-catalog-link"><h1>Catalog</h1>
          <svg style="margin-left: 10px" xmlns="http://www.w3.org/2000/svg" height="30" width="32"
               viewBox="0 0 576 512">
            <path fill="#ffffff"
                  d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/>
          </svg>
        </router-link>
      </div>
    </div>
    <div class="style-products">
      <div v-for="item in store.products.slice(0, initiallyLoadedProducts)" :key="item.id" class="style-product"
           :class="{ 'out-of-stock': item.quan_item <= 0 }">
        <router-link class="custom-link" :to="'/product/' + item.id">
          <div class="image-container">
<!--            <LazyLoadImage class="img" :src="itemImages(item.id)[0]" :alt="item.name_item"></LazyLoadImage>-->
            <img rel="preload" class="img" v-lazy="itemImages(item.id)[0]" alt="Lazy Loaded Image" loading="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTd2ejM0MGlta3Bxdm1qNDV1eTdkMDZ0MTdkeWQyaDk4ZjhwczhndyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SvP3FgHsFVm7zwMdH6/200.webp"/>
            <div v-if="item.quan_item <= 0" class="out-of-stock-overlay">
              Товар закінчився
            </div>
          </div>
          <div class="product-details">
            <div class="product-name">
              {{ item.name_item }}
            </div>
          </div>
          <span v-if="item.popularity_item === 1" class="hit-badge">Хіт</span>
          <div class="product-price">
            <span>Ціна: {{ item.price_item }} ₴</span>
            <button v-if="isItemInCart(item.id)" @click.prevent="addToCart(item.id)">
              <span style="padding: 0; color: #a6f6a6;">Додати ще в кошик</span>
            </button>
            <button v-else @click.prevent="addToCart(item.id)">
              Додати у кошик
            </button>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="store.showVariationModal" class="popup">
      <div v-if="store.checkShowVariety" class="popup-content" :class="{ 'scaled': store.openVariety }">
        <h3 style="text-align: center; margin-bottom: 0px">Варіації:</h3>
        <div class="varieties-wrapper">
          <template v-for="item in store.varieties">

            <label v-if="item.variety_quan > 0" :key="item.id" class="rad-label">
              <input
                  type="radio"
                  :value="item"
                  v-model="selectedVariety"
                  class="rad-input"
                  :name="'rad' + item.id"
                  @change="selectedVarietyItem"
              />
              <div class="rad-design"></div>
              <div class="rad-text">{{ item.variety_name }} - <span style="color: #676767">{{
                  item.variety_price
                }} ₴</span>
              </div>
            </label>
            <div v-else :key="item.id" class="rad-label">
              <input
                  type="radio"
                  :value="item"
                  v-model="selectedVariety"
                  class="rad-input"
                  :name="'rad' + item.id"
              />
              <div class="rad-design"></div>
              <div class="rad-text" style="text-decoration: line-through;">{{ item.variety_name }} - {{
                  item.variety_price
                }} ₴
              </div>
              <p style="margin: 0; margin-left: 10px">немає в наявності</p>
            </div>
          </template>
        </div>
        <button @click="store.swapShowPage()">Закрити</button>
      </div>
    </div>
    <div v-if="showNotification" class="notification">
      <span>Товар доданий до кошика</span>
      <img style="margin-left: 10px; width: 40px; height: 40px" src="https://cdn-icons-png.flaticon.com/128/2018/2018269.png"/>
    </div>
  </div>
</template>

<style scoped>
/* выпад меню */
.notification {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50px; /* Регулируйте отступ сверху по вашему желанию */
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50; /* Зеленый цвет для уведомления об успешном действии */
  color: white;
  padding: 15px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 999; /* Убедитесь, что уведомление находится выше других элементов */
  animation: slideInDown 0.5s ease-out, slideOutUp 0.5s ease-in 3s forwards; /* Анимация появления и исчезновения */
}

@keyframes slideInDown {
  0% {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutUp {
  0% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
}

/* закончил */
.div-catalog-header {
  display: flex;
  align-items: center;
}

.hit-badge {
  position: absolute;
  top: 10px; /* Позиция от верхнего края */
  left: 10px; /* Позиция от левого края */
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 1));
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 16px;
  animation-name: pulse; /* Name of the keyframes animation */
  animation-duration: 2s; /* Duration of each pulse cycle */
  animation-timing-function: ease-in-out; /* Timing function for smooth animation */
  animation-iteration-count: infinite; /* Make the animation repeat infinitely */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.style-products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}


.div-catalog {
  color: white;
  display: none;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 2px 3px 10px gray;
  border-radius: 5px;
}

.div-catalog-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-decoration: none; /* Убирает подчеркивание ссылки */
  color: white; /* Задайте цвет текста, который вы хотите использовать */
}


@media (max-width: 700px) {
  .div-catalog {
    display: block;
  }
}


.style-product {
  position: relative;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  width: 300px;
  margin: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  }

  &.out-of-stock {
    opacity: 0.5;
    pointer-events: none;
  }

  .custom-link {
    text-decoration: none;
    color: inherit;
  }

  .product-price {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    bottom: 15px;
    max-width: 275px;
    padding-left: 15px;
    font-size: 1rem;
    color: #555;
    width: 83%;

    button {
      padding: 10px;
      font-size: 14px;
      background: linear-gradient(to right, rgb(38, 38, 38), rgba(54, 54, 54, 0.9));
      color: #ffffff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
      box-shadow: 0 2px 4px rgba(21, 21, 21, 0.1);

    }
    button:hover {
      background: linear-gradient(to right, rgb(38, 38, 38), rgba(54, 54, 54, 0.8)); /* Новые цветовые остановки */
      box-shadow: 0 4px 8px rgba(21, 21, 21, 0.2);
    }
  }
}

.image-container {
  min-height: 250px;
  max-height: 300px;
  max-width: 300px;
  overflow: hidden;
  position: relative;
  border-radius: 10px; /* Добавлено скругление углов */

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px; /* Здесь также добавлено скругление углов, чтобы соответствовать контейнеру */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Тень для объемности */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Анимация для тени */
  }

  .out-of-stock-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    font-weight: bold;
    background: white;
    border-radius: 20px;
    color: #000000;
  }
}


.product-details {
  padding: 15px;

  .product-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 35px;
  }
}

/* Общие стили varieties */

.varieties-wrapper {
  outline: none; /* Убирает контур при активации */
  -webkit-tap-highlight-color: transparent; /* Убирает выделение на мобильных устройствах */
  display: grid;
  padding: 10px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Open Sans', sans-serif;
}

.rad-label {
  display: flex;
  align-items: center;
  border-radius: 100px;
  padding: 14px 16px;
  margin: 5px 0;
  cursor: pointer;
  transition: .3s;
}

.rad-label:hover,
.rad-label:focus-within {
  background: hsla(0, 0%, 80%, .14);
}

.rad-input {
  position: absolute;
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  z-index: -1;
}

.rad-design {
  width: 22px;
  height: 22px;
  border-radius: 100px;
  background: linear-gradient(to right bottom, hsl(126, 96%, 81%), hsl(125, 96%, 10%));
  position: relative;
}

.rad-design::before {
  content: '';
  display: inline-block;
  width: inherit;
  height: inherit;
  border-radius: inherit;

  background: hsl(0, 0%, 90%);
  transform: scale(1.1);
  transition: .3s;
}

.rad-input:checked + .rad-design::before {
  transform: scale(0);
}

.rad-text {
  color: hsl(0, 0%, 60%);
  margin-left: 14px;
  font-size: 18px;
  font-weight: 900;
  transition: .3s;
}

.rad-input:checked ~ .rad-text {
  color: hsl(0, 0%, 40%);
}

.popup-content {
  z-index: 5;
  border-radius: 10px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.7);
  transition: transform 0.3s ease, opacity 0.3s ease;
  width: auto;
  min-width: 600px;
  height: auto;
  overflow-y: auto;
  background: #f5f5f5; /* Soft gray background */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 0, 0, 0.7); /* Lighter shadow with spread */

  button {
    padding: 10px;
    font-size: 14px;
    background-color: #343434;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s;
  }
}

.popup-content.scaled {
  transform: translate(-50%, -50%) scale(1); /* Увеличиваем масштаб до 1 при наличии класса .scaled */
}

@media (max-width: 600px) {
  .popup-content {
    min-width: 100%;
  }
}


@media (max-width: 500px) {
  .product-details {
    padding: 10px;
  }
}

@media (max-width: 450px) {
  .product-details {
    padding: 10px;
  }
}

@media (max-width: 400px) {
  .popup-content {
    max-height: 100%;
    border-radius: 0;
  }
}
</style>

