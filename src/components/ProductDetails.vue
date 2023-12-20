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
  <div v-if="getProductById" class="product-details">
    <h1>{{ getProductById.name_item }}</h1>
    <p>Price: {{ getProductById.price_item }}</p>
    <p>{{ getProductById.text_info }}</p>
    <div v-if="getImages.length > 0"><h3>Product Images:</h3>
      <div class="image-container"><img v-for="(image, index) in getImages" :key="index" :src="image.img"
                                        alt="Product Image" class="product-image"/></div>
    </div>
    <div v-if="getVarieties">
      <div v-for="item in getVarieties" :key="item.id">
        <p>nameVarieties:{{ item.variety_name }}</p>
        <p>varietyPrice:{{ item.variety_price }}</p>
      </div>
    </div>
    <button>Add to Cart</button>

  </div>

  <div v-else><p>Loading...2</p></div>
</template>

<style>
/* Общие стили */
.product-details {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.product-details h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.product-details p {
  color: #666;
  margin-bottom: 8px;
}

.product-details .image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 15px;
}

.product-details .product-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.product-details button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-details button:hover {
  background-color: #45a049;
}

/* Дополнительные стили для визуализации загрузки */
.product-details > div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #777;
}

.product-details > div p {
  margin: 0;
}
</style>

