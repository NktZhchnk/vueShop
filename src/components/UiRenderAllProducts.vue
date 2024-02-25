<script setup>
import {ref, computed, onMounted, watch, onUnmounted} from "vue";
import {useMyStore} from "@/store/store.js";
import LazyLoadImage from "@/LazyLoadImage.vue";

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

const productImagesMap = computed(() => {
  const map = {};
  store.productImg.forEach((img) => {
    if (!map[img.product_id]) {
      map[img.product_id] = [];
    }
    map[img.product_id].push(img.img);
  });
  return map;
});

const itemImages = (itemId) => {
  return productImagesMap.value[itemId] || [];
};

const observeScroll = () => {
  const handleScroll = () => {
    requestAnimationFrame(() => {
      scrollPosition.value = window.scrollY;
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
const showFilterMenu = ref(false);
const selectedSortOrder = ref(null);

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value;
};
const sortByPrice = (order) => {
  selectedSortOrder.value = order;
  showFilterMenu.value = false;

  // Реализуйте свою логику сортировки в зависимости от выбранного порядка
  if (order === 'asc') {
    store.products.sort((a, b) => a.price_item - b.price_item);
  } else if (order === 'desc') {
    store.products.sort((a, b) => b.price_item - a.price_item);
  }
};
watch(selectedSortOrder, () => {
  // Перезагрузите изначально загруженные товары при изменении порядка сортировки
  initiallyLoadedProducts.value = productsPerPage;
});


</script>


<template>
  <div>
    <div class="div-catalog">
      <div style="display: flex; justify-content: center; align-items: center">
        <div class="filter-button">
          <svg @click="toggleFilterMenu" xmlns="http://www.w3.org/2000/svg" style="position: relative; bottom: 7px" viewBox="0 0 320 512">
            <path fill="#ffffff"
                  d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/>
          </svg>
          <div v-if="showFilterMenu" class="filter-menu">
            <button @click="sortByPrice('asc')">по Убыванию</button>
            <button @click="sortByPrice('desc')">по Возрастанию</button>
          </div>
        </div>
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
            <div class="product-price">
              Ціна: {{ item.price_item }} ₴
            </div>
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
.filter-button {
  -webkit-tap-highlight-color: transparent;
  tap-highlight-color: transparent;
  margin-left: auto;
  margin-right: 10px;
  cursor: pointer; /* Добавлен указатель при наведении */
}


.filter-button svg {
  width: 50px;
  height: 50px;
  fill: #ffffff;
  margin-right: 5px;
}

.filter-menu {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 2px 3px 10px gray;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  z-index: 1;
}

.filter-menu button {
  color: white;
  border: none;
  background: none;
  padding: 5px;
  cursor: pointer;
}

.filter-menu button:hover {
  background: #555;
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
  width: 300px;
  margin: 20px;
  padding: 15px; /* Добавлен внутренний отступ */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Увеличена тень */
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Добавлено свойство для анимации тени */

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3); /* Изменена тень при наведении */
  }

  &.out-of-stock {
    opacity: 0.5;
    pointer-events: none;
  }

  .custom-link {
    text-decoration: none;
    color: inherit;
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

  .product-price {
    position: relative;
    bottom: 0;
    font-size: 1rem;
    color: #555;
  }
}
</style>

