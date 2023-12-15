<script setup>
import AdminMenu from "@/components/AdminMenu.vue";
import UiNovaPoshta from "@/components/UiNovaPoshta.vue";
import UiCartItems from "@/components/UiCartItems.vue";
import axios from "axios";
import UiMainHeader from "@/components/UiMainHeader.vue";

const showCart = false;


const bearerToken = '5b9e48ca-6301-3736-b527-1bcfce3e423c';
const cityId = '29713'; // Идентификатор конкретного города

const apiUrl = `https://www.ukrposhta.ua/address-classifier-ws/get_postoffices_by_city_id?city_id=${cityId}`;

axios.get(apiUrl, {
  headers: {
    'Authorization': `Bearer ${bearerToken}`,
    'Accept': 'application/json'
  }
})
    .then(response => {
      console.log('Ответ сервера:', response.data);
      // Обработка полученных данных
    })
    .catch(error => {
      console.error('Произошла ошибка:', error);
    });


</script>

<template>
  <div>
    <ui-main-header class="main-header"></ui-main-header>
    <router-view></router-view>
    <div>

    </div>

  </div>

</template>

<style scoped>
body {
  padding: 0;
  margin: 0;
}

html {
  padding: 0;
  margin: 0;
}

.main-header {
  z-index: 1;
  padding: 0;
  position: fixed;
}
</style>

