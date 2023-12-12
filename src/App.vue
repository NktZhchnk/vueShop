<script setup>
import AdminMenu from "@/components/AdminMenu.vue";
import UiNovaPoshta from "@/components/UiNovaPoshta.vue";
import UiCartItems from "@/components/UiCartItems.vue";
import axios from "axios";
import UiMainHeader from "@/components/UiMainHeader.vue";

const showCart = false;


// const regionNameUA = 'Київ'; // Название области на украинском
// const regionNameEN = 'Kyiv'; // Название области на английском
// const bearerToken = '5b9e48ca-6301-3736-b527-1bcfce3e423c'; // Ваш Bearer Token
//
// const apiUrl = `https://dev.ukrposhta.ua/get_regions_by_region_ua?region_name=${regionNameUA}&region_name_en=${regionNameEN}`;
//
// axios.get(apiUrl, {
//   headers: {
//     'Authorization': `Bearer ${bearerToken}`
//   }
// })
//     .then(response => {
//       console.log('Ответ от API Укрпочты:', response.data);
//       // Здесь можно обрабатывать полученные данные
//     })
//     .catch(error => {
//       console.error('Ошибка при получении данных:', error);
//     });
</script>

<template>
  <div>
    <ui-main-header class="main-header"></ui-main-header>
    <div style="padding: 5px; position: relative; top: 60px">
      <ui-nova-poshta v-if="false"></ui-nova-poshta>
      <AdminMenu></AdminMenu>
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

