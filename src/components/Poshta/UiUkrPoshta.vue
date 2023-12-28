<script setup>
import axios from "axios";
import {ref, onMounted} from "vue"
let ukrRegion = ref(null);
let ukrCity = ref(null);

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

onMounted(async () => {
  try {
    const response = await axios.get('/getUkrPoshtaRegion');
    ukrRegion.value = response.data;
    console.log('Ответ сервера UkrPoshtaRegion:', response.data);
  } catch (error) {
    console.error('Произошла ошибка при запросе на сервер UkrPoshta:', error);
  }
  try {
    const response = await axios.get('/getUkrPoshtaCity');
    ukrCity.value = response.data;
    console.log('Ответ сервера UkrPoshtaRegion:', response.data);
  } catch (error) {
    console.error('Произошла ошибка при запросе на сервер UkrPoshta:', error);
  }
});

console.log(ukrRegion.value)
</script>

<template>
  <div>
    <input />
  </div>
</template>

<style scoped>

</style>