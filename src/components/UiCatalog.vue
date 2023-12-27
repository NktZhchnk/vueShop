<script setup>

import {useMyStore} from "@/store/store.js";

const store = useMyStore()

const images = [
  {srcImg: "../../images/box200.jpg", value: 'box200-395'},
  {srcImg: "../../images/box400.jpg", value: 'box400-595'},
  {srcImg: "../../images/box600.jpg", value: 'box600-995'},
  {srcImg: "../../images/box1000.jpg", value: 'box1000'},
  {srcImg: "../../images/accessories.jpg", value: 'accessories'},
  {srcImg: "../../images/decorativeCosmetic.jpg", value: 'decorativeCosmetics'},
  {srcImg: "../../images/careCosmetic.jpg", value: 'careCosmetics'},
  {srcImg: "../../images/cosmeticAccessories.jpg", value: 'cosmeticAccessories'},
  {srcImg: "../../images/brandSets.jpg", value: 'brandSets'},
  {srcImg: "../../images/shadowPalettes.jpg", value: 'shadowPalettes'},
  {srcImg: "../../images/everythingForHair.jpg", value: 'everythingForHair'},
]

store.getCartItems()

</script>

<template>
  <div class="main-div">
    <div v-for="(image, index) in images" :key="index">
      <router-link :to="'/image/' + image.value">
        <img :src="image.srcImg" alt="Image"/>
      </router-link>
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
    width: 93%;
    flex-direction: row;
  }

  div {
    width: calc(50% - 20px);
    margin-bottom: 0;
  }

  img {
    width: calc(100%);
    margin-bottom: 0;
  }
}
</style>