<script setup>
import {useMyStore} from "@/store/store.js";

import {computed, ref} from 'vue'

const store = useMyStore()

const userLogin = ref(localStorage.getItem('userLogin'));
const firstName = ref(localStorage.getItem('firstName'));
const lastName = ref(localStorage.getItem('lastName'));
const isAdmin = () => {
  return userLogin.value === 'admin';
};
const test = computed(() => {
  return store.orders.filter((item) => item.complete === 1).length
});
const swapMenu = () => {
  store.swapOpenMenu()
  store.isOpenShowPage = false;
  document.body.style.overflow = 'auto';
}

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userLogin');
  location.reload();
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
        <div class="div-exit-menu">
          <span @click="swapMenu" style="width: 100%; display: flex; justify-content: center">X</span>
        </div>
      </div>

      <div v-if="!userLogin"
           style="border-bottom: 1px solid gray; height: 30px; width: 100%; display: flex; justify-content: space-between; align-items: center; background-color: #2a2a2a; color: #fff;">
        <div style="padding-left: 50px; text-align: center;">
          <router-link to="/authLogin" style="color: #fff; text-decoration: none;">Увійти</router-link>
        </div>
        <div style="padding-right: 50px; text-align: center;">
          <router-link to="/registration" style="color: #fff; text-decoration: none;">Реєстрація</router-link>
        </div>
      </div>
      <div v-else
           style="display: flex; justify-content: space-between; align-items: center; padding-left: 15px; padding-right: 15px; border-bottom: 1px solid gray; background-color: #3b3b3b; color: #fff;">
        <div style="padding: 10px; text-align: center;">
          <p class="user-name">{{ firstName }} {{ lastName }}</p>
        </div>
        <div style="padding: 10px;">
          <button @click="logout"
                  style="background-color: #2c3e50; color: #fff; border: none; padding: 8px 15px; cursor: pointer; font-size: 14px; border-radius: 5px;">
            Вийти
          </button>
        </div>
      </div>

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
        <div>

        </div>
        <ul class="nav-menu">
          <li>
            <router-link to="/uiDetailsOrdersUsers">Інформація про замовлення</router-link>
          </li>
          <li>
            <router-link to="/uiInformationForUser">Служба підтримки та доставка</router-link>
          </li>
          <li>
            <router-link to="/uiUserAgreement">Польвозательська угода</router-link>
          </li>
        </ul>
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
  min-height: 90vh;
  display: flex;
  flex-direction: column;
}

.div-footer {
  margin-top: auto;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  overflow: hidden;
  /* Дополнительные стили, если необходимо */
}

.main-text-header {
  margin-left: 30px;
  margin-block-start: 0.50em;
  margin-block-end: 0.50em;
  font-family: 'Roboto Black', sans-serif;
}

.img-header {
  margin-left: 15px;
  height: 90%;
  width: 90%;
  border-radius: 50%;
}

.div-body {
  height: 83%;
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
}
</style>