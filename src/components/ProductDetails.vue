<script setup>
import {useMyStore} from "@/store/store.js";
import {ref, computed, watch} from 'vue';
import {useRoute} from 'vue-router';
import axios from "axios";

import {Swiper, SwiperSlide} from "swiper/vue";
import {EffectCube, Pagination, Navigation} from "swiper/modules";


import "swiper/css"
import "swiper/css/bundle"

const route = useRoute();
const productId = ref(route.params.id); // Используем реактивную переменную

const store = useMyStore();

const product = ref(null); // Создаем реактивную переменную для информации о продукте
const images = ref([]); // Создаем реактивную переменную для изображений
const varieties = ref([]);
const selectedVariety = ref(null);
let countProduct = ref(0)

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
    console.log(varieties.value)
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


// Функция для добавления товара в корзину
const addToCart = () => {
  if (selectedVariety.value || product.value && images.value.length > 0) {
    if (selectedVariety.value !== {} && selectedVariety.value !== null) {
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
    } else {
      alert('Пожалуйста, выберите вариант товара перед добавлением в корзину.')
    }

  } else {
    console.warn('Ошибка в imag or product');
  }
};
const decrementCountProduct = () =>{
  if(countProduct.value !== 0){
    countProduct.value--
  }else{
    return
  }
}
store.getCartItems()
</script>

<template>
  <div v-if="getProductById" class="product-details">

    <!--    <div v-if="getImages.length > 0" class="image-container">-->
    <!--      <h3>Product Images:</h3>-->
    <!--      <div class="image-wrapper">-->
    <!--        <img v-for="(image, index) in getImages" :key="index" :src="image.img" alt="Product Image"-->
    <!--             class="product-image"/>-->
    <!--      </div>-->
    <!--    </div>-->

    <div v-if="getImages.length > 0">
      <Swiper
          :modules="[EffectCube, Pagination, Navigation]"
          effect="cube"
          :grab-cursor="true"
          :loop="true"
          :cube-effect="{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          :pagination="true"
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
      <p>{{ getProductById.text_info }}</p>
    </div>


    <div v-if="getVarieties.length > 0">
      <h3 style="display: flex; justify-content: center">Варіанти:</h3>
      <div class="varieties-wrapper">
        <label v-for="item in getVarieties" :key="item.id" class="rad-label">
          <input
              type="radio"
              :value="item"
              v-model="selectedVariety"
              class="rad-input"
              name="rad"
          />
          <div class="rad-design"></div>
          <div class="rad-text">{{ item.variety_name }} - {{ item.variety_price }} ₴</div>
        </label>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div class="div-counter">
        <div>
          <button @click="decrementCountProduct" style="margin: 0">-</button>

        </div>
        <div style=""><h3>Кількість:{{ countProduct }}</h3></div>
        <div>
          <button @click="countProduct++" style="margin: 0;">+</button>
        </div>
      </div>
      <div>
        <button style="box-shadow: 2px 2px 5px gray;" @click="addToCart">Додати в кошик</button>
      </div>
      <div class="price-product">
        Price: {{ getProductById.price_item }} ₴
      </div>
    </div>
  </div>

  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
/* Общие стили */

.swiper {
  width: 400px;
  height: 400px;

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
  margin-top: 50px;
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

.swiper-slide img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.price-product {
  background-color: #ff8c6a;
  border-radius: 5px;
  margin-top: 20px;
  color: white;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 10px;
  padding-left: 10px;
  box-shadow: 2px 2px 5px gray;
  height: 41.77px
}

.product-details {
  max-width: 100%;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f8f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  background-color: #ff8c6a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-details button:hover {
  background-color: #ff5a3c;
}

/* Общие стили varieties */

.varieties-wrapper {
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
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  z-index: -1;
}

.rad-design {
  width: 22px;
  height: 22px;
  border-radius: 100px;

  background: linear-gradient(to right bottom, hsl(154, 97%, 62%), hsl(225, 97%, 62%));
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
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 900;

  transition: .3s;
}

.rad-input:checked ~ .rad-text {
  color: hsl(0, 0%, 40%);
}


/* Медиа-запросы для адаптивности */
@media (min-width: 768px) {
  .product-details {
    max-width: 600px;
    margin: 0 auto;
    margin-top: 30px;

  }

  .product-image {
    width: 150px;
    height: 150px;
  }

}

@media (max-width: 600px) {
  .swiper {
    width: calc(90% - 60px);
    max-height: 350px;
  }

  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }


}


@media (max-width: 500px) {
  .swiper {
    width: calc(90% - 60px);
    max-height: 350px;
  }
}

@media (max-width: 400px) {
  .swiper {
    width: 100%;
    max-height: 280px;
  }
}


</style>

