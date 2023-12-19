<script setup>
import {useMyStore} from "@/store/store.js";
import {ref, computed, watch, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import axios from "axios";

const route = useRoute();
const productId = ref(route.params.id); // Используем реактивную переменную

const store = useMyStore();

const product = ref(null); // Создаем реактивную переменную для информации о продукте
const images = ref([]); // Создаем реактивную переменную для изображений
const varieties = ref([]);

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
    console.error('Ошибка при получении данных о картинках:', error);
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

console.log(varieties.value)

</script>

<template>
  <div v-if="getProductById" class="product-details"><h1>{{ getProductById.name_item }}</h1>
    <p>Price: {{ getProductById.price_item }}</p>
    <p>{{ getProductById.text_info }}</p>
    <div v-if="getImages.length > 0"><h3>Product Images:</h3>
      <div class="image-container"><img v-for="(image, index) in getImages" :key="index" :src="image.img"
                                        alt="Product Image" class="product-image"/></div>
    </div>
    <button>Add to Cart</button>
  </div>
  <div v-if="getVarieties">
    {{getVarieties.variety_name}}
  </div>
  <div v-else><p>Loading...</p></div>
</template>

<style>

</style>

