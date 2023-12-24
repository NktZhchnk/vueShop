<script setup>
import { useMyStore } from "@/store/store.js";
import AdminMenu from "@/components/AdminPanel/AdminMenu.vue";
import {onMounted, ref} from "vue";
import router from "@/router/router.js";
const store = useMyStore();

onMounted(async () => {
  await store.AthData();
});

const username = ref('');
const password = ref('');
console.log(store.adminLogin);

const showAuth = () => {
  store.swapOpenAuth()
};

const login = () => {
  if (username.value === store.adminLogin && password.value === store.adminPassword) {
    store.showCheckAuth.showAuthA = true;
    store.showCheckAuth.showAuthB = false;
    store.swapShowPage()
    router.push('/adminMenu')
  } else {
    console.log(store.adminPassword)
    console.log(store.adminLogin)
    console.log('Неверные учетные данные');
  }
};
</script>

<template>
  <div class="div-main">
    <button @click="showAuth">login</button>
    <div class="div-auth-admin" v-if="store.showCheckAuth.showAuthB">
      <h1>Авторизація</h1>
      <input v-model="username" placeholder="Имя пользователя" />
      <input v-model="password" placeholder="Пароль" type="password" />
      <button @click="login">Войти</button>
    </div>
  </div>
</template>

<style scoped>
/* Стили для вашего компонента */
.div-main{
}
.div-auth-admin {
  position: absolute;
  top: 38%;
  border-radius: 5px;
  height: 200px;
  width: 300px;
  left: 330%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 5px black;
}
@media (max-width: 600px) {
  .div-auth-admin{
    left: 120%;
  }

}
h1 {
  font-size: 30px;
  margin: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  font-family: 'Roboto Black', sans-serif;
}
input {
  margin-top: 10px;
  padding: 8px;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>