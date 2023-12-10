<script setup>
import axios from "axios";
// import AuthAdminPanel from "@/components/AuthAdminPanel.vue";

// Выполнение запроса к API "Нова пошта"
const apiKey = '770afdf2b97510753a2e96d099d53e1a';
const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

// Параметры запроса
const requestData = {
  apiKey: apiKey,
  modelName: 'Address',
  calledMethod: 'getCities',
  methodProperties: {}
};

// Отправка POST-запроса с использованием Axios
axios.post(apiUrl, requestData)
    .then(response => {
      console.log('Ответ от Nova Poshta API:', response.data);
      // Обработка ответа от сервера
    })
    .catch(error => {
      console.error('Ошибка запроса к Nova Poshta API:', error);
      // Обработка ошибок
    });
</script>

<template>
  <div>
    <button></button>

  </div>
</template>

<style scoped>
button {
  align-items: center;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url();
  background-position: right 12px center;
  background-repeat: no-repeat,repeat;
  background-size: 14px 9px;
  border: 1px solid #d2d2d2;
  border-radius: 8px;
  box-sizing: border-box;
  color: #221f1f;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  height: 32px;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  padding-left: 12px;
  padding-right: 40px;
  text-align: left;
  width: 100%;
}
</style>
