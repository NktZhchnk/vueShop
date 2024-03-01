<script setup>
import {useMyStore} from "@/store/store.js";

import {computed, ref} from 'vue'

const store = useMyStore()

const userLogin = ref(localStorage.getItem('userLogin'));

const isAdmin = () => {
  return userLogin.value === 'admin';
};
const test = computed(() => {
  return store.orders.filter((item) => item.complete === 1).length
});
const swapMenu = () =>{
  store.swapOpenMenu()
  store.isOpenShowPage = false
}
</script>

<template>
  <div class="main-menu" :class="{'slide-in':store.isOpenMenu}">
    <div class="div-menu">
      <div class="div-header">
        <div class="div-header-text">
          <router-link class="rout-header-text" @click="swapMenu" to="/">
            <img alt="error" class="img-header" src="../../images/header.jpg"/>
            <h1 class="main-text-header">Esenia</h1>
          </router-link>
        </div>
        <div class="div-exit-menu" >
          <span @click="swapMenu" style="width: 100%; display: flex; justify-content: center">X</span>
        </div>
      </div>
      <div
          style="border-bottom: 1px solid gray; height: 30px; width: 100%; display: flex; justify-content: space-between; align-items: center;">
        <div style="padding: 50px; pointer-events: none;">
          <router-link style="pointer-events: auto" to="/authLogin">Увійти</router-link>
        </div>
        <div style="padding: 50px; pointer-events: none;">
          <router-link  style="pointer-events: auto" to="/registration">Реєстрація</router-link>
        </div>
      </div>
<!--      <div style="padding: 10px">-->
<!--        <p>Для отримання технічної підтримки з питань, пов'язаних з функціональністю цього сайту,-->
<!--          а також для висловлення пропозицій щодо його вдосконалення та надання ідей,-->
<!--          просимо звертатися до нашого Telegram-каналу:</p>-->
<!--        <a href="https://t.me/Nikita58766">Технічна підтримка в Telegram</a>-->
<!--      </div>-->

      <div class="div-body">
        <div v-if="isAdmin()">
          <ul class="nav-menu">
            <li>
              <router-link to="/adminMenu">Додавання товару</router-link>
            </li>
            <li>
              <router-link to="/uiOrders">Замовлення<span
                  style="margin-left: 5px; font-size: 18px; color: red">{{ test }}</span></router-link>
            </li>
            <li>
              <router-link to="/uiOrdersComplete">Виконані замовлення</router-link>
            </li>
            <li>
              <router-link to="/uiEditProducts">Редагувати товари</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="div-footer">
        <!--        <br/>-->
        <!--        <AuthAdminPanel></AuthAdminPanel>-->
        <!--        <h4 class="text-footer" style="margin-left: 70px">реєстрація</h4>-->
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
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.6); /* Тень слева */
  transform: translateX(-105%);
  transition: transform 0.4s ease;
}

/* Добавление градиента для эффекта глубины */

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

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin: 0;
}

/* Стили для ссылок в списке */
.nav-menu a {
  text-decoration: none;
  color: #050303; /* Цвет текста ссылок */
  display: block;
  padding: 15px 20px; /* Отступы внутри элемента списка */
  transition: background-color 0.3s ease; /* Плавное изменение цвета фона */
}

.nav-menu a:hover {
  background-color: #f2f2f2; /* Цвет фона при наведении */
  color: rgba(70, 70, 70, 0.8); /* Изменение цвета текста при наведении */
}

@media screen and (max-width: 370px) {
  .main-menu {
    width: 100%;
    overflow: auto;
  }
}

@media screen and (max-height: 200px) {
  .div-header {
    height: 65px;
  }

  .div-footer {
    height: 64px;
  }
}
</style>