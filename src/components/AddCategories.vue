<script setup>
import { ref, watch } from "vue";
import { useMyStore } from "@/store/store.js";

const store = useMyStore();
const localCategoryItem = ref(null);

watch(localCategoryItem, (newValue, oldValue) => {
  store.updateCategoryItem(newValue); // Предположим, что у вас есть метод обновления в хранилище
}, { deep: true });
</script>

<template>
  <div>
    <input v-model="localCategoryItem" type="radio" id="option1" name="choice" value="box200-395">
    <label for="option1">Бокс 200-395</label><br>
    <input v-model="localCategoryItem" type="radio" id="option2" name="choice" value="box400-595">
    <label for="option2">Бокс 400-595</label><br>
    <input v-model="localCategoryItem" type="radio" id="option3" name="choice" value="box600-995">
    <label for="option3">Бокс 600-995</label><br>
    <input v-model="localCategoryItem" type="radio" id="option4" name="choice" value="box1000">
    <label for="option4">Бокс 1000+</label><br>
    <input v-model="localCategoryItem" type="radio" id="option5" name="choice" value="careCosmetics">
    <label for="option5">Доглядова косметика</label><br>
    <input v-model="localCategoryItem" type="radio" id="option6" name="choice" value="decorativeCosmetics">
    <label for="option6">Декоративна косметика</label><br>
    <input v-model="localCategoryItem" type="radio" id="option7" name="choice" value="everythingForHair">
    <label for="option7">Все для волосся</label><br>
    <input v-model="localCategoryItem" type="radio" id="option8" name="choice" value="brandSets">
    <label for="option8">Фірмові набори</label><br>
    <input v-model="localCategoryItem" type="radio" id="option9" name="choice" value="accessories">
    <label for="option9">Аксесуари</label><br>
    <input v-model="localCategoryItem" type="radio" id="option10" name="choice" value="shadowPalettes">
    <label for="option10">Палітри тіней</label><br>
    <input v-model="localCategoryItem" type="radio" id="option11" name="choice" value="cosmeticAccessories">
    <label for="option11">Космітичне приладдя</label><br>
  </div>
</template>

<style scoped>
  input{
    margin-bottom: 10px;
  }
</style>
