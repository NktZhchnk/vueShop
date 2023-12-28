<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import {useMyStore} from "@/store/store.js";

const route = useRoute();
const category = ref(route.params.category);
const productsCategory = ref([]);
const store = useMyStore()
const itemImages = (itemId) => {
  return store.productImg.filter(img => img.product_id === itemId).map(img => img.img);
};
const fetchProducts = async () => {
  try {
    const response = await axios.get(`https://eseniabila.com.ua/getProductsCategory?category=${category.value}`);
    if (response.data) {
      productsCategory.value = response.data;
      console.log(response.data);
    }
  } catch (error) {
    console.error('Ошибка при получении данных о товаре:', error);
  }
};

onMounted(() => {
  store.fetchData()
  fetchProducts(); // Fetch products when the component is mounted
});


</script>

<template>
  <div class="style-products">
    <div v-for="item in productsCategory" :key="item.id" class="style-product">
      <router-link :to="'/product/' + item.id">
        <div style="height: 200px">
          <img alt="error" class="img" v-if="itemImages(item.id).length > 0" :src="itemImages(item.id)[0]"/>
        </div>
        <div class="div-name-product">
          {{ item.name_item }}
        </div>
        <div class="div-price-product">
          Ціна: {{ item.price_item }} ₴
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* Общие стили для всех элементов */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

/* Стили для контейнера товаров */
.style-products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

/* Стили для карточек товаров */
.style-product {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  width: 250px;
  transition: transform 0.3s ease-in-out;
}

.style-product:hover {
  transform: scale(1.05);
}

/* Стили для изображения товара */
.img {
  width: 100%;
  height: 100%; /* Высота изображения (можно изменить по необходимости) */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

/* Стили для контента товара */
.div-name-product,
.div-price-product {
  padding: 15px 20px;
}

/* Стили для названия товара */
.div-name-product {
  font-size: 18px;
  font-weight: bold;
  word-wrap: break-word;
  height: 25px;
  overflow: hidden;

}

/* Стили для цены товара */
.div-price-product {
  font-size: 16px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .style-products {
    padding: 10px;
  }
  .style-product {
    width: calc(50% - 40px);
    margin: 10px;
  }
}

</style>