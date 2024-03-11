<script setup>
import {ref, computed, onMounted, watch, onUnmounted} from "vue";
import {useMyStore} from "@/store/store.js";
import LazyLoadImage from "@/LazyLoadImage.vue";
import { throttle } from 'lodash';


const store = useMyStore();
const productsPerPage = 15;
// const initiallyLoadedProducts = ref(productsPerPage);
const totalProducts = ref(0);
const scrollPosition = ref(0);

const INITIAL_PRODUCTS_PER_PAGE = 15;
const sessionStorageKey = 'initiallyLoadedProducts';


const initiallyLoadedProducts = ref(sessionStorage.getItem(sessionStorageKey) || INITIAL_PRODUCTS_PER_PAGE);

const loadMoreProducts = () => {
  initiallyLoadedProducts.value += productsPerPage;
  sessionStorage.setItem(sessionStorageKey, initiallyLoadedProducts.value); // Заменено на sessionStorage
};

onMounted(() => {
  totalProducts.value = store.products.length;
  observeScroll();
  window.scrollTo(0, scrollPosition.value);
  store.fetchData()
});

const itemImages = (itemId) => {
  const images = store.productImg
      .filter(img => img.product_id === itemId)
      .map(img => img.img);

  return images.length > 0 ? images : [];
};


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
  }, 1000);

  window.addEventListener("scroll", handleScroll);
  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);

  });
};
const sortProductsByDate = () => {
  store.products.sort(sortByDate);
};

const sortByDate = (a, b) => {
  if (a.popularity_item !== b.popularity_item) {
    // Если у a значение popularity_item равно 1, он идет первым
    return b.popularity_item - a.popularity_item;
  }

  // Если значения popularity_item одинаковы, сравниваем по дате
  const dateA = new Date(a.date_item);
  const dateB = new Date(b.date_item);

  if (a.quan_item !== b.quan_item) {
    return b.quan_item - a.quan_item;
  }

  return dateB - dateA;
};

// Используйте watch для слежения за изменениями в store.products
watch(() => store.products, () => {
  sortProductsByDate();
});

const selectedSortOrder = ref(sessionStorage.getItem('selectedSortOrder'));

if (selectedSortOrder.value === '') {
  sortProductsByDate()
}

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
            <LazyLoadImage class="img" :src="itemImages(item.id)[0]" :alt="item.name_item"></LazyLoadImage>
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
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.div-catalog-header {
  display: flex;
  align-items: center;
}

.hit-badge {
  position: absolute;
  top: 10px; /* Позиция от верхнего края */
  left: 10px; /* Позиция от левого края */
  background: black;
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
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
    margin-bottom: 10px;
  }
}

</style>

