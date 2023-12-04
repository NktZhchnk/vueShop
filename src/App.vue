<script setup>
import {onMounted, ref} from 'vue';
import {useMyStore} from "@/store/store.js";
import axios from "axios";
import UiFormAddDataBase from "@/components/UiFormAddDataBase.vue";
import UiFormRadioCategories from "@/components/UiFormRadioCategories.vue";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
});
const test = () => {
  store.getRadioPrice()
  console.log(store.radioPrice)
  console.log(store.radioName)
  console.log(store.radioQuan)
}

const deleteProductInDataBase = async (id) => {
  try {
    await axios.delete(`https://eseniabila.com.ua/deleteProduct/${id}`);
    console.log(`Продукт с ID ${id} успешно удален`);
    // После удаления обновите данные, если необходимо
    await store.fetchData();
  } catch (error) {
    console.error(`Ошибка при удалении продукта с ID ${id}:`, error);
  }
}

</script>


<template>
  <div>
    <UiFormAddDataBase></UiFormAddDataBase>
    <button @click="test">click</button>
    <UiFormRadioCategories></UiFormRadioCategories>
    <div v-for="item in store.products" :key="item.id" class="product">
      <div v-if="item.show_item" class="product-item">
        <button @click="deleteProductInDataBase(item.id)">delete</button>
        <div class="product-info">
          <h1>price2: {{ item.price_item }}</h1>
          <h1>id: {{ item.id }}</h1>
          <h1>q: {{ item.quan_item }}</h1>
          <h1>name: {{ item.name_item }}</h1>
          <h1>categories:{{ item.category_item }}</h1>
          <h1>show:{{ item.show_item }}</h1>
          <div v-for="prod in store.productVarieties" :key="prod.id">
            <div v-if="prod.product_id === item.id">
              <h3>id:{{ prod.product_id }}</h3>
              <h3>name:{{ prod.variety_name}}</h3>
              <h3>price:{{ prod.variety_price}}</h3>
             <h3> quan:{{ prod.variety_quan}}</h3>
            </div>
          </div>
          <img alt="error" :src="'/images/' + item.image_item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Стили для кнопки */
button {
  padding: 8px 16px;
  margin-bottom: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Стили для блока с продуктами */
.product {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* Стили для отдельного продукта */
.product-item {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
  background-color: #f9f9f9;
}

.product-info {
  margin-bottom: 10px;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}
</style>