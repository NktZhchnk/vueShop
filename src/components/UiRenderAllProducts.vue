<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useMyStore} from "@/store/store.js";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
});


const test = () => {
  console.log(store.addProductsInAdmin.poshtaInfo)
}

const currentIndex = ref(0);

const itemImages = (itemId) => {
  return store.productImg.filter(img => img.product_id === itemId).map(img => img.img);
};

const previousSlide = (item) => {
  const imagesCount = itemImages(item).length;
  currentIndex.value = (currentIndex.value - 1 + imagesCount) % imagesCount;
};

const nextSlide = (item) => {
  const imagesCount = itemImages(item).length;
  currentIndex.value = (currentIndex.value + 1) % imagesCount;
};
const deleteProductInDataBase = async (id) => {
  try {
    await axios.delete(`https://eseniabila.com.ua/deleteProduct/${id}`);
    console.log(`Продукт с ID ${id} успешно удален`);
    // После удаления обновите данные, если необходимо
    await store.fetchData();
  } catch (error) {
    console.error(`Ошибка при удалении продукта с ID ${id}:`, error);
  }
}

</script>

<template>
  <!--  <div v-for="item in store.products" :key="item.id" class="product">-->
  <!--    <div v-if="item.show_item" class="product-item">-->
  <!--      &lt;!&ndash;        <button @click="deleteProductInDataBase(item.id)">delete</button>&ndash;&gt;-->
  <!--      <div class="product-info">-->
  <!--        <div class="slider" v-if="itemImages(item.id).length > 1">-->
  <!--          <div class="slides-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">-->
  <!--            <div v-for="(image, index) in itemImages(item.id)" :key="index" class="slide-item">-->
  <!--              <img :src="image" alt="Product Image" class="product-image"/>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <button class="btnSlideLeft" @click="previousSlide(item.id)">Previous</button>-->
  <!--          <button class="btnSlideRight" @click="nextSlide(item.id)">Next</button>-->
  <!--        </div>-->
  <!--        <div v-else>-->
  <!--          <img v-if="itemImages(item.id).length === 1" :src="itemImages(item.id)[0]" alt="Product Image" class="product-image"/>-->
  <!--        </div>-->
  <!--        <h1>price2: {{ item.price_item }}</h1>-->
  <!--        <h1>id: {{ item.id }}</h1>-->
  <!--        <h1>q: {{ item.quan_item }}</h1>-->
  <!--        <h1>name: {{ item.name_item }}</h1>-->
  <!--        <h1>categories:{{ item.category_item }}</h1>-->
  <!--        <h1>show:{{ item.show_item }}</h1>-->
  <!--        <div v-for="prod in store.productVarieties" :key="prod.id">-->
  <!--          <div v-if="prod.product_id === item.id">-->
  <!--            <h3>id_product:{{ prod.product_id }}</h3>-->
  <!--            <h3>name:{{ prod.variety_name }}</h3>-->
  <!--            <h3>price:{{ prod.variety_price }}</h3>-->
  <!--            <h3> quan:{{ prod.variety_quan }}</h3>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--        <h1>Описание:{{ item.text_info }}</h1>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <div class="style-products">
    <div v-for="item in store.products" :key="item.id" class="style-product">
      <router-link :to="'/product/' + item.id">
        <div>
          <img class="img" v-if="itemImages(item.id).length > 0" :src="itemImages(item.id)[0]"/>
        </div>
        <div class="div-name-product">
          {{ item.name_item }}
        </div>
        <div class="div-price-product">
          {{ item.price_item }} ₴
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
  width: 300px;
  transition: transform 0.3s ease-in-out;
}

.style-product:hover {
  transform: scale(1.05);
}

/* Стили для изображения товара */
.img {
  width: 100%;
  height: 200px; /* Высота изображения (можно изменить по необходимости) */
  object-fit: cover;
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
  margin-bottom: 10px;
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