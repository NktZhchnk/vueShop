<script setup>
import {useMyStore} from "@/store/store.js";
import {ref, computed, watch, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from "axios";


import {Swiper, SwiperSlide} from "swiper/vue";
import {Navigation, Pagination, EffectCards} from 'swiper/modules';


const route = useRoute();
const productId = ref(route.params.id); // Используем реактивную переменную

const store = useMyStore();
const router = useRouter()

const userLogin = ref(localStorage.getItem('userLogin'));

const isAdmin = () => {
  return userLogin.value === 'admin';
};

const product = ref(null); // Создаем реактивную переменную для информации о продукте
const images = ref([]); // Создаем реактивную переменную для изображений
const varieties = ref([]);
const selectedVariety = ref(null);
const hasVarieties = computed(() => varieties.value.length > 0);
let countProduct = ref(1)
const showNotification = ref(false)

// Функция для получения информации о продукте и изображений
const getProductDetails = async () => {
  try {
    const response = await axios.get(`https://eseniabila.com.ua/getProductById/${productId.value}`);
    if (response.data) {
      product.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка при получении данных о товаре:', error);
  }

  try {
    const response = await axios.get(`https://eseniabila.com.ua/getImgById/${productId.value}`);
    if (response.data) {
      images.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка при получении данных о картинках:', error);
  }

  try {
    const response = await axios.get(`https://eseniabila.com.ua/getVarietiesById/${productId.value}`);
    if (response.data) {
      varieties.value = response.data;
    }
  } catch (error) {
    return;
  }
};

// Вызываем функцию для получения информации о продукте и изображениях
getProductDetails();

// Следим за изменениями productId и обновляем данные
watch(() => route.params.id, (newProductId) => {
  productId.value = newProductId;
  getProductDetails();
});

const getProductById = computed(() => {
  return product.value;
});

const getImages = computed(() => {
  return images.value;
});

const getVarieties = computed(() => {
  return varieties.value;
});

const updateCartProductCount = (index) => {
  const savedCartProducts = JSON.parse(sessionStorage.getItem('cartProducts'));
  // Обновляем количество товара в сохраненном массиве корзины
  savedCartProducts[index].countProduct = store.cartProducts[index].countProduct;

  // Обновляем корзину в sessionStorage
  sessionStorage.setItem('cartProducts', JSON.stringify(savedCartProducts));
};

// Функция для добавления товара в корзину
const addToCart = () => {
  if ((hasVarieties.value && selectedVariety.value !== null) || !hasVarieties.value) {
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
    countProduct.value = 1;
  } else {
    store.swapShowVarietyProduct()
  }
};

const decrementCountProduct = () => {
  if (countProduct.value !== 1) {
    countProduct.value--
  } else {
    return
  }
}
const sumCountProduct = () => {
  if (selectedVariety.value) {
    const index = getVarieties.value.indexOf(selectedVariety.value)
    const variation = getVarieties.value[index]
    if (countProduct.value < variation.variety_quan) {
      countProduct.value++
    }
  } else {
    const production = getProductById.value
    if (countProduct.value < production.quan_item) {
      countProduct.value++
    }
  }
}
const resetCount = () => {
  countProduct.value = 1

  setTimeout(() => {
    store.swapShowPage()
  }, 250)
}

const deleteProductInDataBase = async () => {
  try {
    await axios.delete(`https://eseniabila.com.ua/deleteProduct/${productId.value}`);
    console.log(`Продукт с ID ${productId.value} успешно удален`);
    // После удаления обновите данные, если необходимо
    await store.fetchData();
    router.push({name: 'RenderProducts'})
  } catch (error) {
    console.error(`Ошибка при удалении продукта с ID ${productId.value}:`, error);
  }
}
const showFullText = ref(false);

const toggleTextInfo = () => {
  showFullText.value = !showFullText.value;
};

const truncatedTextInfo = computed(() => {
  const maxLength = 240;
  return showFullText.value
      ? getProductById.value.text_info
      : getProductById.value.text_info.slice(0, maxLength) + '  <span style="font-weight: bold; color: black;">... Показати більше</span>';
});

const formattedText = computed(() => {
  if (getProductById.value && getProductById.value.text_info) {
    return truncatedTextInfo.value.replace(/\n/g, '</p><p>');
  }
  return '';
});
onMounted(() => {
  store.fetchData()
})
store.getCartItems()
const isDataLoaded = ref(false);

watch(product, () => {
  setTimeout(() => {
    isDataLoaded.value = true;
  }, 70)
});
const isItemInCart = () => {
  return store.cartProducts.some(item => {
    return item.product.id === product.value.id;
  });
};
</script>

<template>
  <div v-if="isDataLoaded && product" class="product-details">
    <div v-if="isAdmin()"
         style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
      <svg class="icon-admin" style="width: 25px; height: 25px" xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
            d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/>
      </svg>
      <svg @click="deleteProductInDataBase()" class="icon-admin" style="width: 25px; height: 25px"
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 448 512">
        <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
      </svg>
      <svg class="icon-admin" style="width: 25px; height: 25px" xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 576 512">
        <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
            d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
      </svg>
    </div>

    <div v-if="getImages.length > 0" class="div-swiper">
      <Swiper
          :modules="[EffectCards, Pagination, Navigation]"
          effect="cards"
          :grab-cursor="true"
          :loop="true"
          :navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }"
          :pagination="{ clickable: true }"
          :cards="{ slideShadows: true, rotate: 30, stretch: 10, depth: 100, modifier: 1 }"
      >
        <SwiperSlide v-for="(image, index) in getImages" :key="index">
          <img :src="image.img" alt="error"/>
        </SwiperSlide>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </Swiper>
    </div>

    <div class="div-name-product">
      <h1>{{ getProductById.name_item }}</h1>
    </div>

    <div class="text-info-product">
      <p class="truncated-text" @click="toggleTextInfo">
        <span v-html="formattedText"></span>
        <span v-if="!showFullText" class="read-more"></span>
      </p>
    </div>

    <div>
      <button :class="{ 'pulse-button': selectedVariety === null}" :style="{ color: selectedVariety !== null ? '#7baeff' : '' }"
              style="margin-top: 15px;" v-if="getVarieties.length > 0" @click="store.swapShowVarietyProduct()">
        {{ selectedVariety ? 'Варіант: ' + selectedVariety.variety_name : 'Виберіть варіант' }}
      </button>
    </div>

    <div v-if="getVarieties.length > 0" class="popup">
      <div v-if="store.checkShowVariety" class="popup-content" :class="{ 'scaled': store.openVariety }">
        <h3 style="text-align: center; margin-bottom: 0px">Варіації:</h3>
        <div class="varieties-wrapper">
          <template v-for="item in getVarieties">
            <label v-if="item.variety_quan > 0" :key="item.id" class="rad-label">
              <input
                  type="radio"
                  :value="item"
                  v-model="selectedVariety"
                  class="rad-input"
                  :name="'rad' + item.id"
                  @change="resetCount"

              />
              <div class="rad-design"></div>
              <div class="rad-text">{{ item.variety_name }} - <span style="color: #676767">{{
                  item.variety_price
                }} ₴</span>
              </div>
              <p v-if="isAdmin()" style="margin: 0; margin-left: 10px">test: {{ item.variety_quan }}</p>
            </label>
            <div v-else :key="item.id" class="rad-label">
              <input
                  type="radio"
                  :value="item"
                  v-model="selectedVariety"
                  class="rad-input"
                  :name="'rad' + item.id"
                  @change="resetCount"

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
        <button style="margin-bottom: 0px;" @click="store.swapShowPage()">Закрити</button>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center">
      <div class="div-counter">
        <div>
          <button @click="decrementCountProduct" style="margin: 0">-</button>

        </div>
        <label>Кількість:</label>
        <div style="padding-left: 5px; padding-right: 5px"><h3 style="">{{ countProduct }}</h3></div>
        <div>
          <button @click="sumCountProduct" style="margin: 0;">+</button>
        </div>
      </div>
      <div>
        <button class="btn-add-cart-tel" v-if="isItemInCart()" @click.prevent="addToCart()">
          <span style="padding: 0; color: #a6f6a6;">Додати ще в кошик</span>
        </button>
        <button :class="{ 'pulse-button': selectedVariety !== null}" class="btn-add-cart-tel" v-else @click.prevent="addToCart()">
          Додати у кошик
        </button>
        <!--        <button class="btn-add-cart-tel" style="box-shadow: 2px 2px 5px gray;" @click="addToCart">Додати в кошик-->
        <!--        </button>-->
      </div>
      <div class="price-product" v-if="selectedVariety === null">
        Ціна: {{ getProductById.price_item * countProduct }} ₴
      </div>
      <div class="price-product" v-if="selectedVariety !== null">
        Ціна: {{ selectedVariety.variety_price * countProduct }} ₴
      </div>
    </div>
<!--    <button class="btn-add-cart-pc" style="box-shadow: 2px 2px 5px gray;" @click="addToCart">Додати в кошик</button>-->
    <button class="btn-add-cart-pc" v-if="isItemInCart()" @click.prevent="addToCart()">
      <span style="padding: 0; color: #a6f6a6;">Додати ще в кошик</span>
    </button>
    <button :class="{ 'pulse-button': selectedVariety !== null}" class="btn-add-cart-pc" v-else @click.prevent="addToCart()">
      Додати у кошик
    </button>
    <div v-if="showNotification" class="notification">
      <span>Товар доданий до кошика</span>
      <img style="margin-left: 10px; width: 40px; height: 40px" src="https://cdn-icons-png.flaticon.com/128/2018/2018269.png"/>
    </div>
  </div>
  <div v-else style="width: 100%; height: auto;  display: grid; place-items: center;">
    <div class="placeholder-details">
      <div style="display: flex; justify-content: center; align-items: center;">
        <div class="placeholder-image"><p>Loading...</p></div>
      </div>
      <div class="placeholder-name"></div>
      <div class="placeholder-text-info"></div>
    </div>
  </div>
</template>

<style scoped>
/*пульсация кнопки*/
.pulse-button {
  animation: pulse-animation 1s infinite alternate;
  color: white;
}

@keyframes pulse-animation {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.03);
  }
}

/* выпад меню */
.notification {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
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
/* Общие стили */
.text-info-product {
  background-color: #f2f2f2; /* Измените на желаемый цвет фона */
  border-radius: 5px; /* Закругленные края */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень */
}

.truncated-text {
  font-family: 'Roboto Light', sans-serif;
  margin-top: 0;
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-height 0.5s ease; /* Плавное изменение высоты */
}

.show-full-text {
  max-height: 500px; /* Измените на достаточную высоту для отображения полного текста */
}

.read-more {
  color: Black;
  cursor: pointer;
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
}

.popup-content.scaled {
  transform: translate(-50%, -50%) scale(1); /* Увеличиваем масштаб до 1 при наличии класса .scaled */
}

.div-swiper {
  max-width: 100%; /* Измените значение по необходимости */
  max-height: 100%; /* Измените значение по необходимости */
  padding: 20px;
  overflow: hidden;
}

.swiper-slide img {
  background-color: #f8f8f9;
  width: 100%;
  height: 100%;
  object-fit: contain; /* Или используйте 'cover' в зависимости от ваших предпочтений */
  border-radius: 5px;
  z-index: 1;
}

.swiper {
  width: 400px;
  height: 500px;
  z-index: 1;
}

.placeholder-details {
  max-width: 600px;
  width: 85%;
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f8f8;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); /* Увеличены значения для создания более заметного эффекта объемности */
}

.placeholder-image {
  background: #dadada;
  margin-top: 20px;
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}

.placeholder-name {
  margin-top: 70px;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  background: #dadada;
}

.placeholder-text-info {
  margin-top: 40px;
  height: 60px;
  width: 100%;
  border-radius: 10px;
  background: #dadada;
}

.icon-admin:hover {
  transform: scale(1.3);
}

.div-counter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: 2px 2px 5px gray;
  height: 41.77px;
  margin-top: 20px
}

.div-name-product {
  overflow-wrap: break-word;
  max-height: 90px;
  overflow: hidden;
  margin-top: 20px;
  padding: 10px;
}

.swiper-button-prev, .swiper-button-next {
  color: rgba(194, 194, 194, 0.8);
  position: absolute;
  top: 6%;
  width: 17px;
  border-radius: 50%;
  bottom: 0;
  height: 100%;
}

.swiper-button-prev {
  right: 20%;
}


.swiper-slide {
  background-size: cover;
  background-position: center;
  border-radius: 5px;
  box-shadow: 0px 0px 20px rgba(75, 75, 75, 0.5); /* Добавлены стили для тени */
}

.price-product {
  background-color: #343434;
  border-radius: 5px;
  margin-top: 20px;
  color: #ffffff;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 10px;
  padding-left: 10px;
  box-shadow: 2px 2px 5px gray;
  height: 41.77px
}

.product-details {
  margin-top: 10px;
  max-width: 100%;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f8f8;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); /* Увеличены значения для создания более заметного эффекта объемности */
}


.product-details h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.product-details p {
  color: #555;
  margin-bottom: 8px;
}

.product-details button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #343434;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(21, 21, 21, 0.1);
}

.product-details button:hover {
  background-color: #181818;
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

.btn-add-cart-pc {
  display: none;
}

.btn-add-cart-tel {
  display: block;
}

/* Медиа-запросы для адаптивности */
@media (min-width: 768px) {
  .product-details {
    max-width: 600px;
    margin: 0 auto;
    margin-top: 30px;
  }
}

@media (max-width: 540px) {
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }
}

@media (max-width: 600px) {
  .swiper {
    width: 280px;
    max-height: 350px;
  }

  .popup-content {
    min-width: 100%;
  }

  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }


}

@media (max-width: 590px) {
  .btn-add-cart-tel {
    display: none;
  }

  .btn-add-cart-pc {
    display: block
  }

  .price-product {
    font-size: 16px;
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
  .swiper {
    width: 263px;
    max-height: 330px;
  }

  .popup-content {
    max-height: 100%;
    border-radius: 0;
  }
}

@media (max-width: 330px) {
  .swiper {
    width: 240px;
    max-height: 300px;
  }
}
</style>

