<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from 'vue-router';
import { useMyStore } from "@/store/store.js";
import LazyLoadImage from "@/LazyLoadImage.vue";

const route = useRoute();
const category = ref(route.params.category);
const store = useMyStore();
const productsPerPage = 15;
const initiallyLoadedProducts = ref(productsPerPage);


const loadMoreProducts = () => {
  initiallyLoadedProducts.value += productsPerPage;
};

const itemImages = (itemId) => {
  return store.productImg.filter(img => img.product_id === itemId).map(img => img.img);
};

const filteredProducts = computed(() => {
  return store.products
      .filter(item => item.category_item === category.value && item.quan_item > 0)
      .sort((a, b) => (b.quan_item > 0 ? 1 : 0) - (a.quan_item > 0 ? 1 : 0));
});

onMounted(() => {
  store.fetchData();
  observeScroll();
});

const observeScroll = () => {
  const handleScroll = () => {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const contentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= contentHeight - 200) {
        loadMoreProducts();
      }
    });
  };

  window.addEventListener("scroll", handleScroll);

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
};
</script>

<template>
  <div class="style-products">
    <div v-for="item in filteredProducts.slice(0, initiallyLoadedProducts)" :key="item.id" class="style-product" :class="{ 'out-of-stock': item.quan_item <= 0 }">
      <router-link class="custom-link" :to="'/product/' + item.id">
        <div class="image-container">
          <LazyLoadImage class="img" :src="itemImages(item.id)[0]" :alt="item.name_item"></LazyLoadImage>
          <div v-if="item.quan_item <= 0" class="out-of-stock-overlay">
            Товар закінчився
          </div>
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
  position: relative;
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
    justify-content: space-between;
    bottom: 15px;
    left: 30px;
    width: 95%;
    font-size: 1rem;
    color: #555;
  }
}


.image-container {
  height: 200px;
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

  &:hover .img {
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3); /* Изменение тени при наведении */
  }
}


.product-details {
  padding: 15px;

  .product-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
}

</style>
