<script setup>
import axios from "axios";
import {ref} from "vue"
let ukrRegion = ref(null);

axios.get('/getUkrPoshtaData')
    .then(response => {
      // Обробка отриманих даних з сервера
      console.log('Ответ сервера UkrPoshta:', response.data);
      // Далі можна використовувати ці дані на фронтенді за необхідністю
    })
    .catch(error => {
      // Обробка помилок
      console.error('Произошла ошибка при запросе на сервер UkrPoshta:', error);
    });

axios.get('/getUkrPoshtaRegion')
    .then(response => {
      // Обробка отриманих даних з сервера
      console.log('Ответ сервера UkrPoshtaRegion:', response.data);
      ukrRegion.value = response.data
      // Далі можна використовувати ці дані на фронтенді за необхідністю
    })
    .catch(error => {
      // Обробка помилок
      console.error('Произошла ошибка при запросе на сервер UkrPoshta:', error);
    });

console.log(ukrRegion)
</script>

<template>
  <div>
    <input />
  </div>
</template>

<style scoped>

</style>