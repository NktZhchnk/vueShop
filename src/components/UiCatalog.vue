<script setup>

import {useMyStore} from "@/store/store.js";

const store = useMyStore()

const images = [
  {srcImg: "https://i.imgur.com/fH4uqUR_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'box200-395'},
  {srcImg: "https://i.imgur.com/ckHcqkV_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'box400-595'},
  {srcImg: "https://i.imgur.com/6U5RNSq_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'box600-995'},
  {srcImg: "https://i.imgur.com/D56WfJX_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'box1000'},
  {srcImg: "https://i.imgur.com/fgtYCkh_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'accessories'},
  {srcImg: "https://i.imgur.com/w5v5Pth_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'decorativeCosmetics'},
  {srcImg: "https://i.imgur.com/XHRX2Fu_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'careCosmetics'},
  {srcImg: "https://i.imgur.com/1CtdHM5_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'cosmeticAccessories'},
  {srcImg: "https://i.imgur.com/NjBvcXd_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'brandSets'},
  {srcImg: "https://i.imgur.com/q80U2zw_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'shadowPalettes'},
  {srcImg: "https://i.imgur.com/jZKyzR0_d.jpg?maxwidth=520&shape=thumb&fidelity=high", value: 'everythingForHair'},
]

store.getCartItems()

</script>

<template>
  <div class="main-div">
    <div v-for="(image, index) in images" :key="index">
      <router-link :to="'/image/' + image.value">
        <img  loading="lazy" :src="image.srcImg" alt="Image"/>
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