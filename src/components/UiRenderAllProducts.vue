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
const getByIdProduct = (id) => {
  axios.get(`https://eseniabila.com.ua/getProductById/${id}`)
      .then(response => {
        // Данные о товаре с указанным ID
        // Обработка полученных данных о товаре
        store.productById = response.data
        console.log('Информация о товаре:', response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных о товаре:', error);
      });
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
      <router-link @click="getByIdProduct(item.id)" :to="'/product/' + item.id">
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
.style-products {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}

.img {
  width: 140px;
  height: 190px;
}

.div-name-product {
  word-wrap: break-word;
  width: 120px;
}

.div-price-product {
  margin-top: 10px;
}

.style-product {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin-top: 10px;
  margin-left: 15px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  transition: transform 0.3s ease;
}

.style-product:hover {
  transform: scale(1.05);
}

@media screen and (max-width: 600px) {
  .style-product{
    margin-left: 20px;
  }
  .img{
    width: 150px;
    height: 210px;
  }
}



.slider {
  position: relative;
  overflow: hidden;
}

.slides-container {
  display: flex;
  transition: transform 0.3s ease;
}

.slide-item {
  flex: 0 0 100%;
}

button {
  padding: 8px 16px;
  margin-bottom: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Стили для блока с продуктами */
.product {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* Стили для отдельного продукта */
.product-item {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
  background-color: #f9f9f9;
}

.product-info {
  margin-bottom: 10px;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

</style>