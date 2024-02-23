<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useMyStore } from "@/store/store.js";
import LazyLoadImage from "@/LazyLoadImage.vue";

const store = useMyStore();
const productsPerPage = 15;
const initiallyLoadedProducts = ref(productsPerPage);
const totalProducts = ref(0);

const loadMoreProducts = () => {
  initiallyLoadedProducts.value += productsPerPage;
};

onMounted(() => {
  const cachedProducts = loadFromLocalStorage("cachedProducts");

  if (cachedProducts) {
    store.setProducts(cachedProducts);
  } else {
    store.fetchData().then((data) => {
      saveToLocalStorage("cachedProducts", data);
    });
  }

  observeScroll();
});
const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return null;
  }
};
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
    <div v-for="item in store.products.slice(0, initiallyLoadedProducts)" :key="item.id" class="style-product" :class="{ 'out-of-stock': item.quan_item <= 0 }">
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
  width: 300px;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
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

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

  .product-price {
    position: relative;
    bottom: 0;
    font-size: 1rem;
    color: #555;
  }
}
</style>

