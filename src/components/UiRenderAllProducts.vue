<script setup>
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import {useMyStore} from "@/store/store.js";
import LazyLoadImage from "@/LazyLoadImage.vue";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
  console.log(store.searchProduct)
});
const itemImages = (itemId) => {
  return store.productImg.filter(img => img.product_id === itemId).map(img => img.img);
};
const filteredProduct = ref([])

setTimeout(() => {
  filteredProduct.value = ([...store.products]);
}, 150)


watch(() => store.searchProduct, (newSearchProduct) => {
  if (newSearchProduct === '') {
    // Если searchProduct пуст, отображаем все продукты
    filteredProduct.value = [...store.products];
  } else {
    // Фильтруем продукты в зависимости от новой строки поиска
    filteredProduct.value = store.products.filter(item => {
      return item.name_item.toLowerCase().includes(newSearchProduct.toLowerCase());
    });
  }
})

</script>

<template>
  <div class="style-products">
    <div v-for="item in filteredProduct" :key="item.id" class="style-product">
      <router-link class="custom-link" :to="'/product/' + item.id">
        <div style="height: 200px">
          <!--          <img class="img" v-if="itemImages(item.id).length > 0" :src="itemImages(item.id)[0]" loading="lazy"/> Старая реализация рендера картинок-->
          <LazyLoadImage :src="itemImages(item.id)[0]" :alt="item.name_item"></LazyLoadImage>
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
  justify-content: center;
  gap: 20px;
  padding: 20px;
  margin: 0 auto;
  max-width: 100%;
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
  transition: opacity 0.3s ease-in-out;
}

.img[data-loaded='false'] {
  opacity: 0;
}

.img[data-loaded='true'] {
  opacity: 1;
}

/* Стили для контента товара */
.div-name-product,
.div-price-product {
  padding: 15px 20px;
}

.custom-link {
  text-decoration: none; /* Убирает подчеркивание ссылки */
  color: black; /* Задайте цвет текста, который вы хотите использовать */
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
@media (max-width: 660px) {
  .style-products {
    padding: 0px;
  }

  .style-product {
    width: calc(50% - 40px);
    margin: 0px;
    margin-top: 10px;
  }

  .img {
    height: 100%;
  }
}

</style>