<script setup>
import UiCartItems from "@/components/UiCartItems.vue";
import UiMainHeader from "@/components/UiMainHeader.vue";
import UiSlideMenu from "@/components/UiSlideMenu.vue";
import { useMyStore } from "@/store/store.js";

import io from 'socket.io-client';
import {onMounted} from "vue";

const socket = io('http://localhost:3000');

// Используйте `onMounted` вместо `created` в `<script setup>`
onMounted(() => {
  socket.on('connect', () => {
    console.log('Подключено к серверу Socket.io');
  });

  socket.on('disconnect', () => {
    console.log('Отключено от сервера Socket.io');
  });

  // Отслеживаем обновления онлайн-пользователей
  socket.on('onlineUsers', (count) => {
    store.usersCountOnline = count
    console.log(`Количество онлайн-пользователей: ${count}`);
    // Здесь вы можете обновлять ваше состояние Vue.js в соответствии с онлайн-пользователями
  });
});

// Объявляем хранилище вне блока `<script setup>`
const store = useMyStore();
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
      {{store.usersCountOnline}}
      <!-- Отображаем содержимое страницы внутри router-view -->
      <router-view ></router-view>
    </div>
  </div>
</template>

<style>

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
  z-index: 5;
}

h1 {
  margin-block-start: 0.50em;
  margin-block-end: 0.50em;
  font-family: 'Roboto Black', sans-serif;
}

.main-header {
  position: fixed;
  z-index: 4;
}

.div-header {
  height: 77px;
}

.div-body {
  position: relative;
  height: 100%;
}
</style>

