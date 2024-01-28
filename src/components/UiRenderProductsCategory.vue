<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import { useMyStore } from "@/store/store.js";
import LazyLoadImage from "@/LazyLoadImage.vue";

const route = useRoute();
const category = ref(route.params.category);
const productsCategory = ref([]);
const store = useMyStore();

const itemImages = (itemId) => {
  return store.productImg.filter(img => img.product_id === itemId).map(img => img.img);
};


const filteredProducts = ref([]);

const fetchProducts = async () => {
  try {
    const response = await axios.get(`https://eseniabila.com.ua/getProductsCategory?category=${category.value}`);
    if (response.data) {
      productsCategory.value = response.data;
      filteredProducts.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка при получении данных о товаре:', error);
  }
};

watch(() => store.searchProduct, (newSearchQuery) => {
  // Фильтрация товаров при изменении поискового запроса
  filteredProducts.value = productsCategory.value.filter(item =>
      item.name_item.toLowerCase().includes(newSearchQuery.toLowerCase())
  );
});

onMounted(() => {
  store.fetchData();
  fetchProducts(); // Fetch products when the component is mounted
});

</script>

<template>
  <div class="style-products">
    <div v-for="item in filteredProducts" :key="item.id" class="style-product">
      <router-link class="custom-link" :to="'/product/' + item.id">
        <div class="image-container">
          <LazyLoadImage class="img" :src="itemImages(item.id)[0]" :alt="item.name_item"></LazyLoadImage>
        </div>
        <div class="product-details">
          <div class="product-name">
            {{ item.name_item }}
          </div>
          <div class="product-price">
            Ціна: {{ item.price_item }} ₴
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.style-products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.style-product {
  width: 300px;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
}

.custom-link {
  text-decoration: none;
  color: inherit;
}

.image-container {
  height: 200px;
  overflow: hidden;
  position: relative;

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-details {
  padding: 15px;
}

.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1rem;
  color: #555;
}
</style>
