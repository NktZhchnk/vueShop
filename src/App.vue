<script setup>
import AdminMenu from "@/components/AdminPanel/AdminMenu.vue";
import UiNovaPoshta from "@/components/Poshta/UiNovaPoshta.vue";
import UiCartItems from "@/components/UiCartItems.vue";
import axios from "axios";
import UiMainHeader from "@/components/UiMainHeader.vue";
import UiSlideMenu from "@/components/UiSlideMenu.vue";
import {useMyStore} from "@/store/store.js";

const store = useMyStore()
const test = () =>{
  console.log(store.products)
}
// Приклад виклику API-шляху з фронтенду (Vue.js)
axios.get('/getUkrPoshtaData')
    .then(response => {
      // Обробка отриманих даних з сервера
      console.log('Ответ сервера UkrPoshta:', response.data);
      // Далі можна використовувати ці дані на фронтенді за необхідністю
    })
    .catch(error => {
      // Обробка помилок
      console.error('Произошла ошибка при запросе на сервер UkrPoshta:', error);
    });

</script>

<template>
  <div>
    <ui-slide-menu class="slide-menu-left"></ui-slide-menu>
    <div class="show-page" @click="store.swapOpenMenu()" v-if="store.isOpenMenu"></div>
    <div class="div-header">
      <!-- Выводим хедер за пределами router-view -->
      <ui-main-header class="main-header"></ui-main-header>
    </div>
    <div class="div-body">
      <button @click="test">gfdgdfgfd</button>
      <!-- Отображаем содержимое страницы внутри router-view -->
      .Здесь будет основной товар
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
body {
  padding: 0;
  margin: 0;
}
.show-page{
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(0,0,0,0.3);
}
.slide-menu-left{
  z-index: 4;
}
html {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.main-header {
  position: fixed;
  z-index: 1;
  padding: 0;
  margin: 0;
}
.div-header{
  height: 77px;
}
.div-body{
  position: relative;
  height: 100%;
}
</style>

