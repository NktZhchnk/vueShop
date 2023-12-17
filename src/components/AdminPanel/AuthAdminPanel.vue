<script setup>
import { useMyStore } from "@/store/store.js";
import AdminMenu from "@/components/AdminPanel/AdminMenu.vue";
import {onMounted, ref, watch} from "vue";

const store = useMyStore();

onMounted(async () => {
  await store.AthData();
});

const showAuthA = ref(true);
const showAuthB = ref(false);
const username = ref('');
const password = ref('');
console.log(store.adminLogin);

const showAuth = () => {
  showAuthB.value = !showAuthB.value;
};

const login = () => {
  if (username.value === store.adminLogin && password.value === store.adminPassword) {
    showAuthA.value = true;
    showAuthB.value = false;
  } else {
    console.log(store.adminPassword)
    console.log(store.adminLogin)
    console.log('Неверные учетные данныеу');
  }
};
</script>

<template>
  <div>
    <button @click="showAuth">login</button>
    <div class="auth-admin" v-if="showAuthB">
      <input v-model="username" placeholder="Имя пользователя" />
      <input v-model="password" placeholder="Пароль" type="password" />
      <button @click="login">Войти</button>
    </div>
    <admin-menu v-if="showAuthA"></admin-menu>
  </div>
</template>

<style scoped>
/* Стили для вашего компонента */
.auth-admin {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

input {
  margin-bottom: 10px;
  padding: 8px;
}

button {
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