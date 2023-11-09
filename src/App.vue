<script setup>
import {onMounted} from 'vue';
import {useMyStore} from "@/store/store.js";

const store = useMyStore()

onMounted(async () => {
  // Вызовите `fetchData` и дождитесь завершения запроса
  await store.fetchData();

  // Теперь можно безопасно получить данные
  console.log(store.data[0]);
});

const fn = () => {
  console.log(store.data)
}

</script>


<template>
  <div>
    <button @click="fn">323</button>
    <div v-for="item in store.data" :key="item.id">
      <h1>price2: {{ item.price_item }}</h1>
      <h1>id: {{ item.id }}</h1>
      <h1>q: {{ item.quan_item }}</h1>
      <h1>name: {{ item.name_item }}</h1>
      <img alt="error" :src="'/images/' + item.image_item"/>
    </div>
  </div>
</template>

<style >
 img{
   width: 200px;
   height: 200px;
 }
</style>
