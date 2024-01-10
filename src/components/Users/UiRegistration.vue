<template>
  <form class="registration-form" @submit.prevent="registerUser">

    <input type="text" v-model="username" placeholder="Логін" class="input-field">
    <input type="text" v-model="firstname" placeholder="Ім'я" class="input-field">
    <input type="text" v-model="lastname" placeholder="Прізвище" class="input-field">
    <input type="text" v-model="phoneNumber" placeholder="Телефон" class="input-field">
    <input type="password" v-model="password" placeholder="Пароль" class="input-field">
    <input type="password" v-model="confirmPassword" placeholder="Повторіть пароль" class="input-field">

    <button type="submit" class="submit-btn">Register</button>
  </form>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const firstname = ref('');
    const lastname = ref('');
    const phoneNumber = ref('');

    const registerUser = async () => {
      if (password.value !== confirmPassword.value) {
        // Обработка ошибки, если пароли не совпадают
        return;
      }

      try {
        const response = await fetch('https://eseniabila.com.ua/addUsers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone_number: phoneNumber.value,
            login: username.value,
            password: password.value,
            first_name: firstname.value,
            last_name: lastname.value

          })
        });

        if (response.ok) {
          // Регистрация прошла успешно
        } else {
          // Обработка ошибки регистрации
        }
      } catch (error) {
        // Обработка ошибок связи с сервером
      }
    };

    return {
      username,
      password,
      phoneNumber,
      confirmPassword,
      firstname,
      lastname,
      registerUser
    };
  }
};
</script>

<style scoped>
.registration-form {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;

}

.input-field {
  display: block;
  width: 94%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 3px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}
</style>
