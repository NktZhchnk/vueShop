<script setup>
import {ref} from 'vue'
import UiPoshta from "@/components/Poshta/UiPoshta.vue";

let telephone = ref('');
let firstname = ref('');
let lastName = ref('');
</script>

<template>
  <div>
    <div class="div-header">
      <h1>
        Оформлення замовлення
      </h1>
    </div>
    <div class="div-body">
      <div>
        <h3>Ваші контактні дані</h3>
        <label>Мобільний телефон</label>
        <input v-model="telephone" placeholder="+380963567893"/>
        <label>Прізвище</label>
        <input v-model="lastName" placeholder="Прізвище"/>
        <label>Ім'я</label>
        <input v-model="firstname" placeholder="Ім'я"/>
      </div>
      <div>
        <UiPoshta></UiPoshta>
      </div>
    </div>
    <div class="div-footer">
        <button>підтвердити замовлення</button>
    </div>
  </div>
</template>

<style scoped>
/* Стили для контейнера */
.div-header {
  background-color: #f2f2f2;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.div-header h1 {
  margin: 0;
  font-size: 1.5em;
}

.div-body {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.div-body div {
  flex: 1 1 50%; /* При ширине экрана больше 800px каждый блок будет занимать половину */
}

.div-body h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

/* Стили для формы */
input[type="text"] {
  width: calc(100% - 20px); /* Вычитаем отступы для учета полей padding */
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
}

input[type="text"]:focus {
  outline: none;
  border-color: #00a0e4;
}

label {
  font-weight: bold;
  margin-top: 20px;
  display: block;
  font-size: 0.9em;
  color: #444;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #00a0e4;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0083b0;
}
input{
  border-radius: 5px;
  border: 1px solid gray;
  padding: 10px;
}
.div-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}
@media (max-width: 800px) {
  .div-body div {
    flex: 1 1 100%; /* При ширине экрана меньше 800px каждый блок будет занимать 100% */
  }
}
</style>>