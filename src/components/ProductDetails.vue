<script setup>
import {useMyStore} from "@/store/store.js";
import {ref, computed, watch} from 'vue';
import {useRoute} from 'vue-router';
import axios from "axios";

const route = useRoute();
const productId = ref(route.params.id); // Используем реактивную переменную

const store = useMyStore();

const product = ref(null); // Создаем реактивную переменную для информации о продукте
const images = ref([]); // Создаем реактивную переменную для изображений
const varieties = ref([]);
const selectedVariety = ref(null);

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
    const newCartProduct = {
      selectedVariety: selectedVariety.value,
      product: product.value,
      images: images.value[0]
    };

    // Добавление нового товара в массив корзины
    store.cartProducts.push(newCartProduct);
    // Сохранение обновленной корзины в sessionStorage
    sessionStorage.setItem('cartProducts', JSON.stringify(store.cartProducts));
    console.log('Товар добавлен в корзину:', newCartProduct);
  } else {
    console.warn('Пожалуйста, выберите вариант товара перед добавлением в корзину.');
  }
};

</script>

<template>
  <div v-if="getProductById" class="product-details">

    <h1>{{ getProductById.name_item }}</h1>

    <p>Price: {{ getProductById.price_item }}</p>
    <p>{{ getProductById.text_info }}</p>

    <div v-if="getImages.length > 0" class="image-container">
      <h3>Product Images:</h3>
      <div class="image-wrapper">
        <img v-for="(image, index) in getImages" :key="index" :src="image.img" alt="Product Image"
             class="product-image"/>
      </div>
    </div>

    <div v-if="getVarieties.length > 0">
      <h3>Varieties:</h3>
      <div class="varieties-wrapper">
        <label v-for="item in getVarieties" :key="item.id" class="variety-item">
          <input
              type="radio"
              :value="item"
              v-model="selectedVariety"
              name="variety"
          />
          <span>Name: {{ item.variety_name }} - Price: {{ item.variety_price }}</span>
        </label>
      </div>
    </div>

    <button @click="addToCart">Add to Cart</button>
  </div>

  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
/* Общие стили */
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

.image-container {
  margin-top: 15px;
}

.image-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.varieties-wrapper {
  display: flex;
  flex-direction: column;
}
h1{
  font-size: 18px;
  font-weight: bold;
  word-wrap: break-word;
  height: 60px;
  overflow: hidden;
}
.variety-item {
  margin-bottom: 10px;
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

/* Дополнительные стили для визуализации загрузки */
.product-details > div {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 18px;
  color: #777;
}

.product-details > div p {
  margin: 0;
}

/* Медиа-запросы для адаптивности */
@media (min-width: 768px) {
  .product-details {
    max-width: 600px;
    margin: 0 auto;
  }

  .product-image {
    width: 150px;
    height: 150px;
  }
}
</style>

