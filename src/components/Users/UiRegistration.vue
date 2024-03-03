<template>
  <div>
    <form class="registration-form" @submit.prevent="registerUser">
      <div class="form-group">
        <label for="username">Логін:</label>
        <input type="text" v-model="username" id="username" class="input-field" placeholder="Логін">
      </div>

      <div class="form-group">
        <label for="firstname">Ім'я:</label>
        <input type="text" v-model="firstname" id="firstname" class="input-field" placeholder="Ім'я">
      </div>

      <div class="form-group">
        <label for="lastname">Прізвище:</label>
        <input type="text" v-model="lastname" id="lastname" class="input-field" placeholder="Прізвище">
      </div>

      <div class="form-group">
        <label for="phoneNumber">Телефон:</label>
        <input type="text" @input="checkNumber" v-model="phoneNumber" id="phoneNumber" class="input-field"
               placeholder="Телефон">
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" v-model="password" id="password" class="input-field" placeholder="Пароль">
      </div>

      <div class="form-group">
        <label for="confirmPassword">Повторіть пароль:</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" class="input-field"
               placeholder="Повторіть пароль">
      </div>

      <button type="submit" class="submit-btn">Зареєструватися</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }} <br/>
        <router-link to="/login">войти</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import {computed, ref} from 'vue';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const firstname = ref('');
    const lastname = ref('');
    const phoneNumber = ref('');
    let errorMessage = ref('');

    const checkNumber = () => {
      let maxLength = 10
      phoneNumber.value = phoneNumber.value.replace(/\D/g, '');
      if (phoneNumber.value.length > maxLength) {
        phoneNumber.value = phoneNumber.value.slice(0, maxLength);
      }
    };
    const registerUser = async () => {
      // Проверка на количество цифр в номере телефона
      if (!/^\d{1,10}$/.test(phoneNumber.value)) {
        errorMessage.value = 'Номер телефона должен содержать не более 10 цифр';
        return;
      }

      // Проверка на минимальное количество символов в логине и пароле
      if (username.value.length < 5 || password.value.length < 5) {
        errorMessage.value = 'Логин и пароль должны содержать не менее 5 символов';
        return;
      }

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
          errorMessage.value = 'Пользователь с таким номером телефона или логином уже существует';
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // Конфликт: пользователь с таким номером телефона или логином уже существует

          errorMessage.value = 'Пользователь с таким номером телефона или логином уже существует';
        } else {
          // Другие ошибки
          errorMessage.value = 'Произошла ошибка при регистрации пользователя';
        }
      }
    };

    return {
      username,
      password,
      phoneNumber,
      confirmPassword,
      firstname,
      lastname,
      errorMessage,
      registerUser,
      checkNumber,
    };
  }
};
</script>
s
<style scoped>
/* Основной контейнер формы */
.registration-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Общие стили для всех полей ввода */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

/* Кнопка отправки */
.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Стили для сообщения об ошибке */
.error-message {
  color: red;
  margin-top: 10px;
}

/* Медиазапросы для различных размеров экранов */
@media screen and (max-width: 600px) {
  .registration-form {
    max-width: 100%;
  }
}

/* Дополнительные стили можно добавить для других размеров экранов при необходимости */

</style>