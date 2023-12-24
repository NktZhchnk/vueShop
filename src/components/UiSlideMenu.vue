<script setup>
import {useMyStore} from "@/store/store.js";
import AuthAdminPanel from "@/components/AdminPanel/AuthAdminPanel.vue";


const store = useMyStore()

</script>

<template>
  <div class="main-menu" :class="{'slide-in':store.isOpenMenu}">
    <div class="div-menu">
      <div class="div-header">
        <div class="div-header-text">
          <router-link class="rout-header-text" @click="store.swapOpenMenu()" to="/">
            <img alt="error" class="img-header" src="../../images/header.jpg"/>
            <h1 class="main-text-header">Esenia</h1>
          </router-link>
        </div>
        <div class="div-exit-menu" @click="store.swapOpenMenu()">
          X
        </div>
      </div>
      <div class="div-body">
        <p>Здесь будет навигация сайта2</p>
      </div>
      <div class="div-footer">
        <br/>
        <AuthAdminPanel></AuthAdminPanel>
        <h4 class="text-footer" style="margin-left: 70px">реєстрація</h4>
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
  margin-left: 30px;
  margin-block-start: 0.50em;
  margin-block-end: 0.50em;
  font-family: 'Roboto Black', sans-serif;
}

.img-header {
  height: 90%;
  width: 90%;
  border-radius: 50%;
}
.div-footer{
  height: 64px;
  border-top: 1px solid gray;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.div-body {
  height: 84%;
  background: white;
  padding: 10px;
}

.div-header {
  display: flex;
  justify-content: space-between;
  color: white;
  padding: 5px;
  background: rgba(0, 0, 0, 1);
  height: 55px;
}
.main-menu {
  background: white;
  position: fixed;
  width: 320px;
  height: 100%;
  top: 0;
  left: 0;
  border-right: 1px solid black;
  transform: translateX(-105%);
  transition: transform 0.4s ease;
}

.rout-header-text {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none; /* Убирает подчеркивание ссылки */
  color: white; /* Задайте цвет текста, который вы хотите использовать */
}

.div-exit-menu {
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}



.slide-in {
  transform: translateX(0);
}



@media screen and (max-width: 370px) {
  .main-menu {
    width: 100%;
  }
}
@media screen and (max-height: 200px) {
  .div-header{
    height: 65px;
  }

}
</style>