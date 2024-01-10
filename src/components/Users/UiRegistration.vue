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
        <input type="text" v-model="phoneNumber" id="phoneNumber" class="input-field" placeholder="Телефон">
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" v-model="password" id="password" class="input-field" placeholder="Пароль">
      </div>

      <div class="form-group">
        <label for="confirmPassword">Повторіть пароль:</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" class="input-field" placeholder="Повторіть пароль">
      </div>

      <button type="submit" class="submit-btn">Зареєструватися</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import {ref} from 'vue';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const firstname = ref('');
    const lastname = ref('');
    const phoneNumber = ref('');
    const errorMessage = ref('');
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
        if (error.response && error.response.status === 409) {
          // Конфликт: пользователь с таким номером телефона или логином уже существует
          this.errorMessage = 'Пользователь с таким номером телефона или логином уже существует';
        } else {
          // Другие ошибки
          this.errorMessage = 'Произошла ошибка при регистрации пользователя';
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
    };
  }
};
</script>

<style scoped>
.registration-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 3px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.error-message {
  color: #ff0000;
  margin-top: 10px;
}
</style>