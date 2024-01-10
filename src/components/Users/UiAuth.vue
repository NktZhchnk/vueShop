<template>
  <form @submit.prevent="loginUser">
    <input type="text" v-model="login" placeholder="Username">
    <input type="password" v-model="password" placeholder="Password">
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const login = ref('');
const password = ref('');

const loginUser = async () => {
  try {
    const response = await fetch('https://eseniabila.com.ua/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: login.value,
        password: password.value
      })
    });

    if (response.ok) {
      const data = await response.json();
      // Обработка успешного входа
      console.log('Успешный вход', data);
    } else {
      // Обработка ошибок входа
      console.error('Ошибка входа');
    }
  } catch (error) {
    // Обработка ошибок связи с сервером
    console.error('Ошибка связи с сервером', error);
  }
};
</script>
