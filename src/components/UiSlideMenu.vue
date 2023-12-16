<script setup>
import {useMyStore} from "@/store/store.js";


const store = useMyStore()

</script>

<template>
  <div class="main-menu" :class="{'slide-in':store.isOpenMenu}">
    <div class="div-menu">
      <div class="div-header">
        <div class="div-header-text">
          <router-link class="rout-header-text" @click="store.swapOpenMenu()" to="/">
            <img class="img-header" src="../../images/header.jpg"/>
            <h1 class="main-text-header">Esenia</h1>
          </router-link>
        </div>
        <div class="div-exit-menu" @click="store.swapOpenMenu()">
          X
        </div>
      </div>
      <div class="div-body">
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/roboto');

.div-menu {
  width: 100%;
  height: 100%;
}

.main-text-header {
  margin-left: 9px;
  margin-block-start: 0.50em;
  margin-block-end: 0.50em;
  font-family: 'Roboto Black', sans-serif;
}

.img-header {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

.main-menu {
  background: white;
  position: absolute;
  width: 320px;
  height: 100%;
  top: 0;
  left: 0;
  border-right: 1px solid black;
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}
.rout-header-text{
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none; /* Убирает подчеркивание ссылки */
  color: white; /* Задайте цвет текста, который вы хотите использовать */
}
@media screen and (max-width: 370px) {
.main-menu{
  width: 100%;
}
}
.div-exit-menu {
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.div-header {
  display: flex;
  justify-content: space-between;
  color: white;
  background: rgba(0, 0, 0, 1);
  height: 7%;
  box-shadow: 2px 2px 5px black;
}

.slide-in {
  transform: translateX(0);
}

.div-body {
  height: 95%;
  background: white;
}
</style>