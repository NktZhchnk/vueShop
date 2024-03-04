<template>
  <form class="login-form" @submit.prevent="loginUser">
    <div class="form-group">
      <label for="login">Логин или номер телефона:</label>
      <input type="text" v-model="login" id="login" placeholder="Ваш логин или номер телефона">
    </div>

    <!-- Existing password input -->
    <div class="form-group">
      <label for="password">Пароль:</label>
      <input type="password" v-model="password" id="password" placeholder="Ваш пароль">
    </div>

    <button type="submit">Войти</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import {useRouter} from "vue-router";

let login = ref('');
let password = ref('');
let errorMessage = ref('');
const router = useRouter();
const loginUser = async () => {
  try {
    const response = await fetch('https://eseniabila.com.ua/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: login.value,
        phone_number: login.value, // Assuming the phone number is entered in the login field
        password: password.value
      })
    });

    if (response.ok) {
      const data = await response.json();
      // Сохранение токена в localStorage после успешного входа
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userLogin', data.login);
      localStorage.setItem('phoneNumber', data.phoneNumber);
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName', data.lastName);
      router.push({name: 'RenderProducts'})
      setTimeout(()=>{
        location.reload()
      },200);
      // например, перенаправление пользователя на другую страницу
      console.log('Успешный вход', data);
    }else if (response.status === 401) {
      errorMessage.value = 'Неправильный логин или пароль'
          console.error();
      // Дополнительные действия при неправильном логине или пароле
    } else if (response.status === 404) {
      errorMessage.value = 'Пользователь не найден'
          console.error();
      // Дополнительные действия при отсутствии пользователя
    } else {
      errorMessage.value = 'Ошибка входа'
          console.error();
      // Дополнительные действия при других ошибках
    }
  } catch (error) {
    // Обработка ошибок связи с сервером
    console.error('Ошибка связи с сервером', error);
  }
};
</script>

<style scoped>
/* Общие стили для формы */
.login-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Стили для группы полей ввода */
.form-group {
  margin-bottom: 15px;
}

/* Стили для полей ввода */
input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.error-message {
  color: red;
  margin-top: 10px;
}
/* Стили для кнопки */
button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Медиазапросы для различных размеров экранов */
@media screen and (max-width: 600px) {
  .login-form {
    width: 90%;
  }
}
</style>