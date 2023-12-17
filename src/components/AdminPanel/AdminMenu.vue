<script setup>
import {computed, onMounted, ref} from 'vue';
import {useMyStore} from "@/store/store.js";
import axios from "axios";
import UiFormAddDataBase from "@/components/AdminPanel/UiFormAddDataBase.vue";
import UiFormRadioCategories from "@/components/AdminPanel/UiFormRadioCategories.vue";

const store = useMyStore()



</script>

<template>
  <div>
    <UiFormAddDataBase></UiFormAddDataBase>
    <UiFormRadioCategories></UiFormRadioCategories>
  </div>
</template>


<style scoped>

</style>