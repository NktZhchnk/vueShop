<script setup>
import {ref, watch} from 'vue';
import axios from 'axios';
import {useMyStore} from "@/store/store.js";
import Checkbox from "@/components/Checkbox.vue";
import AddCategories from "@/components/AddCategories.vue";

const store = useMyStore()
const newData = {
  name_item: 'Шар',
  price_item: 105, // цена продукта
  quan_item: 5,    // количество продукта
  image_item: 'https://example.com/product.jpg', // ссылка на изображение продукта
  show_item: 1,
  category_item: null,
  text_info: '',
};

watch(() => store.categoryItem, (newValue, oldValue) => {
  newData.category_item = newValue;
});
const addProduct = () => {
  store.getRadioPrice()
  const data = {
    product_id: store.lastId,
    variety_name: store.radioName,
    variety_quan: store.radioQuan,
    variety_price: store.radioPrice,
  };
  console.log(data)

  axios.post('https://eseniabila.com.ua/addProduct', newData)
      .then(response => {
        console.log('Ответ сервера:', response.data);
        setTimeout(() => {
          store.fetchData()
        }, 2000)
        // Обработка успешного ответа
      })
      .catch(error => {
        console.error('Ошибка при отправке данных на сервер Писос:', error);
        // Обработка ошибки
      });
  axios.post('https://eseniabila.com.ua/addProductVarieties', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log('Ответ сервера:', response.data);
        setTimeout(() => {
          store.fetchData();
        }, 2000);
        // Обработка успешного ответа
      })
      .catch(error => {
        console.error('Ошибка при отправке данных на сервер:', error);
        // Обработка ошибки
      });
};
const test = () =>{
  console.log(
      newData
  )
}
</script>

<template>
  <div>
    <!-- Ваш текущий код отображения продуктов -->
    <!-- Форма для добавления нового продукта -->
    <form @submit.prevent="addProduct">
      <button type="button" @click="test">test</button>
      <label for="productName">Назва:</label>
      <input v-model="newData.name_item" type="text" id="productName" required>

      <label for="productPrice">Ціна:</label>
      <input v-model="newData.price_item" type="number" id="productPrice" required>

      <label for="productQuantity">Кільскість:</label>
      <input v-model="newData.quan_item" type="number" id="productQuantity" required>

      <label for="productImage">Зображення:</label>
      <input v-model="newData.image_item" type="text" id="productImage" required>

      <checkbox></checkbox>


      <add-categories></add-categories>

      <textarea v-model="newData.text_info" class="text-info" placeholder="Информация о продукте"></textarea>
      <button type="submit">Добавить продукт</button>

    </form>
  </div>
</template>

<style scoped>


form {
  border: solid 2px black;
  box-shadow: 1px 2px 10px black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}
.text-info{
  box-shadow: 1px 1px 2px black;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
input[type="text"],
input[type="number"] {
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="radio"] {
  margin-right: 5px;
}

button[type="submit"] {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>