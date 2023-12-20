<script setup>
import axios from "axios";
import {ref} from 'vue'
const images = [
  {srcImg: "../../images/box200.jpg", value: '1'},
  {srcImg: "../../images/box400.jpg", value: '2'},
  {srcImg: "../../images/box600.jpg", value: '3'},
  {srcImg: "../../images/box1000.jpg", value: 'box1000'},
  {srcImg: "../../images/cosmeticAccessories.jpg", value: '5'},
  {srcImg: "../../images/decorativeCosmetic.jpg", value: '6'},
  {srcImg: "../../images/carecosmetic.jpg", value: '7'},
  {srcImg: "../../images/cosmetic.jpg", value: '8'},
  {srcImg: "../../images/firm.jpg", value: '9'},
  {srcImg: "../../images/shadow.jpg", value: '10'},
  {srcImg: "../../images/hair.jpg", value: '11'},
]
const productsCategory = ref([])
const handleImageClick = async (category) => {
  try {
    const response = await axios.get(`https://eseniabila.com.ua/getProducts?category=${category}`);
    if (response.data) {
      productsCategory.value = response.data;
      console.log(response.data)
    }
  } catch (error) {
    console.error('Ошибка при получении данных о товаре:', error);
  }
};


</script>

<template>
  <div class="main-div">
    <div v-for="(image, index) in images" :key="index" @click="handleImageClick(image.value)">
      <img :src="image.srcImg" alt="Image"/>
    </div>
  </div>
</template>

<style scoped>
/* Адаптивность для мобильных устройств */

/* Общие стили для каталога изображений */
.main-div {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

/* Стили для изображений */
img {
  width: 200px;
  height: auto;
  max-width: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
  box-shadow: 2px 2px 5px gray;
}

img:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .main-div {
    padding: 10px;
    width: 100%;
    flex-direction: row;
  }

  div {
    width: calc(50% - 20px);
    margin-bottom: 0px;
  }

  img {
    width: calc(100% - 20px);
    margin-bottom: 0px;
  }
}
</style>