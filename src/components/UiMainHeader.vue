<script setup>

import UiSlideMenu from "@/components/UiSlideMenu.vue";
import {ref, watch} from 'vue'
import {useMyStore} from "@/store/store.js";

const store = useMyStore()
const swapMenu = () => {
  store.swapOpenMenu()
}
const swapCart = () =>{
    store.swapOpenCart()
}
</script>

<template>
  <div class="main-header">
    <div class="div-menu">
      <div class="div-menu-child" style="width: 50%" @click="swapMenu">
        <svg xmlns="http://www.w3.org/2000/svg" height="34" width="36" viewBox="0 0 448 512">
          <path fill="#ffffff"
                d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
        </svg>
      </div>
    </div>

    <div class="div-img">
      <router-link class="img-a" to="/">
        <img class="img-header" src="../../images/header.jpg"/>
      </router-link>
    </div>

    <div class="div-text">
      <router-link to="/" class="custom-link"><h1>Esenia</h1></router-link>
    </div>
    <div class="div-catalog">
      <router-link to="/catalog" class="custom-link"><h1>Catalog</h1>
        <svg style="margin-left: 10px" xmlns="http://www.w3.org/2000/svg" height="30" width="32" viewBox="0 0 576 512">
          <path fill="#ffffff"
                d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/>
        </svg>
      </router-link>
    </div>
    <div class="div-inp">
      <input class="inp-search" style="height: 30px" placeholder="Я шукаю..."/>
    </div>

    <div class="main-cart" @click="swapCart">
        <svg xmlns="http://www.w3.org/2000/svg" height="30" width="32" viewBox="0 0 576 512">
          <path fill="#ffffff"
                d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
        </svg>
    </div>

  </div>

</template>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/roboto');

.img-a {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-header {
  width: 100%;
  height: 65px;
  background: #221f1f;;
  display: flex;
  box-shadow: 2px 2px 5px black;
}

@media screen and (max-height: 700px) {
  .main-header {
    height: 65px;
  }
  .img-a{
    height: 100%;
  }
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

.custom-link:hover {
  color: #cccccc;
  transform: scale(1.1);
}
svg:hover{
  transform: scale(1.2);
}
.img-a:hover{
  transform: scale(1.1);
}

.img-header {
  border-radius: 50%;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-img {
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-menu {
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-menu-child {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-cart {
  height: 100%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-inp {
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-text {
  color: white;
  margin-left: 2%;
}

.div-catalog {
  color: white;
  margin-left: 5%;
}

h1 {
  margin-block-start: 0.50em;
  margin-block-end: 0.50em;
  font-family: 'Roboto Black', sans-serif;
}

.inp-search {
  border-radius: 7px;
  width: 100%;
  padding: 8px;
}

@media screen and (min-width: 650px) {
  .img-header {
    width: 65%;
  }
}

@media screen and (min-width: 900px) {

  .img-header {
    width: 55%;
  }

  .inp-search {
    width: 90%;
  }

  .div-inp {
    width: 70%;
  }

  .main-cart {
    width: 10%;
  }
}

@media screen and (max-width: 1200px) {
  .div-text {
    display: none;
  }

  .img-header {
    width: 70%;
  }

  .div-inp {
    margin-left: 30px;
  }
}

@media screen and (max-width: 700px) {
  .div-catalog {
    display: none;
  }
  .img-header {
    width: 70%;
  }
}

@media screen and (max-width: 500px) {
  .div-catalog {
    display: none;
  }
  .img-header {
    width: 90%;
  }
  .div-inp{
    margin: 0;
  }
}


@media screen and (min-width: 1200px) {

  .img-header {
    width: 50%;
  }

  .div-inp {
    width: 80%;
  }

  .inp-search {
    width: 80%;
  }
}

@media screen and (min-width: 1600px) {

  .div-img {
    width: 5%;
  }

  .inp-search {
    width: 90%;
  }

  .img-header {
    width: 90%;
  }
}
</style>