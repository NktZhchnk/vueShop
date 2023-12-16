<script setup>
import AdminMenu from "@/components/AdminMenu.vue";
import UiNovaPoshta from "@/components/UiNovaPoshta.vue";
import UiCartItems from "@/components/UiCartItems.vue";
import axios from "axios";
import UiMainHeader from "@/components/UiMainHeader.vue";
import UiSlideMenu from "@/components/UiSlideMenu.vue";
import {useMyStore} from "@/store/store.js";

const store = useMyStore()

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
      <!-- Отображаем содержимое страницы внутри router-view -->
      .
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
body {
  padding: 0;
  margin: 0;
}
.show-page{
  position: absolute;
  width: 100%;
  z-index: 2;
  height: 100%;
  background: rgba(0,0,0,0.3);
}
.slide-menu-left{

  z-index: 34;
}
html {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.main-header {
  z-index: 1;
  padding: 0;
  margin: 0;
  position: absolute;
}
.div-body{
  position: relative;
  top: 65px;
  height: 1000px;
}
</style>

