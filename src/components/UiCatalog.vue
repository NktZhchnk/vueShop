<script setup>

import {useMyStore} from "@/store/store.js";

const store = useMyStore()

const images = [
  {srcImg: "https://i.imgur.com/vfNOBYx.jpeg", value: 'box200-395'},
  {srcImg: "https://i.imgur.com/DzyhR57.jpg", value: 'box400-595'},
  {srcImg: "https://i.imgur.com/2EwIeGb.jpg", value: 'box600-995'},
  {srcImg: "https://i.imgur.com/Oyp74N3.jpg", value: 'box1000'},
  {srcImg: "https://i.imgur.com/S48ekRa.jpeg", value: 'accessories'},
  {srcImg: "https://i.imgur.com/vm3imrE.jpg", value: 'decorativeCosmetics'},
  {srcImg: "https://i.imgur.com/wqvtedI.jpg", value: 'careCosmetics'},
  {srcImg: "https://i.imgur.com/UH8d4Lq.jpg", value: 'cosmeticAccessories'},
  {srcImg: "https://i.imgur.com/brCUtao.jpg", value: 'brandSets'},
  {srcImg: "https://i.imgur.com/FRxabgS.jpg", value: 'shadowPalettes'},
  {srcImg: "https://i.imgur.com/RrjAaMP.jpg", value: 'everythingForHair'},
]

store.getCartItems()

</script>

<template>
  <div class="main-div">
    <div v-for="(image, index) in images" :key="index">
      <router-link :to="'/image/' + image.value">
        <img loading="lazy" :src="image.srcImg" alt="Image"/>
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