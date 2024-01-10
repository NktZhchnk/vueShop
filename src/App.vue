<script setup>
import UiCartItems from "@/components/UiCartItems.vue";
import axios from "axios";
import UiMainHeader from "@/components/UiMainHeader.vue";
import UiSlideMenu from "@/components/UiSlideMenu.vue";
import {useMyStore} from "@/store/store.js";
import UiRegistration from "@/components/Users/UiRegistration.vue";
import UiAuth from "@/components/Users/UiAuth.vue";


const store = useMyStore()

</script>

<template>
  <div>
    <ui-slide-menu class="slide-menu-left"></ui-slide-menu>
    <ui-cart-items v-if="store.checkCart"></ui-cart-items>
    <div class="show-page" @click="store.swapShowPage()" v-if="store.isOpenShowPage"></div>
    <div class="div-header">
      <!-- Выводим хедер за пределами router-view -->
      <ui-main-header class="main-header"></ui-main-header>
    </div>
    <div class="div-body">
      <!-- Отображаем содержимое страницы внутри router-view -->
      <div class="div-catalog">
        <router-link to="/catalog" class="custom-link"><h1>Catalog</h1>
          <svg style="margin-left: 10px" xmlns="http://www.w3.org/2000/svg" height="30" width="32"
               viewBox="0 0 576 512">
            <path fill="#ffffff"
                  d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/>
          </svg>
        </router-link>
      </div>
      gdgd
      <UiRegistration></UiRegistration>
      <UiAuth></UiAuth>
      <router-link to="/adminMenu">adadadad</router-link>
<!--      <router-view></router-view>-->
    </div>
  </div>
</template>
<style>

body {
  overflow-y: scroll; /* Показывать вертикальный скроллбар всегда */
}
</style>
<style scoped>

html {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

body {
  padding: 0;
  margin: 0;
  user-select: none;
}

.show-page {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 3;
  background: rgba(0, 0, 0, 0.3);
}

.slide-menu-left {
  z-index: 4;
}


.div-catalog {
  color: white;
  display: none;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 2px 3px 10px gray;
  border-radius: 20px;
}



.custom-link {
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

h1 {
  margin-block-start: 0.50em;
  margin-block-end: 0.50em;
  font-family: 'Roboto Black', sans-serif;
}

.main-header {
  position: fixed;
  z-index: 2;
}

.div-header {
  height: 77px;
}

.div-body {
  position: relative;
  height: 100%;
}
</style>

