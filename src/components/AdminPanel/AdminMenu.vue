<script setup>
import { onMounted, } from 'vue';
import {useMyStore} from "@/store/store.js";

import UiFormAddDataBase from "@/components/AdminPanel/UiFormAddDataBase.vue";
import UiFormRadioCategories from "@/components/AdminPanel/UiFormRadioCategories.vue";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
});


</script>

<template>
  <div>
    <UiFormAddDataBase></UiFormAddDataBase>
    <UiFormRadioCategories></UiFormRadioCategories>
  </div>
</template>


<style scoped>

</style>