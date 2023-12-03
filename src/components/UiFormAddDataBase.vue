<script setup>
import {ref, watch} from 'vue';
import axios from 'axios';
import {useMyStore} from "@/store/store.js";
import Checkbox from "@/components/Checkbox.vue";

const store = useMyStore()
const newData = {
  name_item: 'Шар',
  price_item: 105, // цена продукта
  quan_item: 5,    // количество продукта
  image_item: 'https://example.com/product.jpg', // ссылка на изображение продукта
  show_item: 1,
  category_item: ref(null),
};

const data = ref({
  product_id: null,
  variety_name: [],
  variety_quan: [],
  variety_price: []
});
const test2 = {
  product_id: 122,
  variety_name: 'gaga',
  variety_quan: 53,
  variety_price: 2
};



// watch(() => store.productVarieties, (newValue) => {
//   data.value.product_id = newValue.product_id;
//   data.value.variety_name = newValue.variety_name;
//   data.value.variety_quan = newValue.variety_quan;
//   data.value.variety_price = newValue.variety_price;
// });

// const test = () => {
//   store.getRadioPrice();
//
//   // Обращение к геттеру для получения актуальных данных
//   console.log(data)
// };

const addProduct = () => {
  // store.getRadioPrice();
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
  axios.post('https://eseniabila.com.ua/addProductVarieties', test2, {
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

</script>

<template>
  <div>
    <!-- Ваш текущий код отображения продуктов -->
    <!-- Форма для добавления нового продукта -->
    <form @submit.prevent="addProduct">
      <button type="button" @click="test">test</button>
      <label for="productName">Название:</label>
      <input v-model="newData.name_item" type="text" id="productName" required>

      <label for="productPrice">Цена:</label>
      <input v-model="newData.price_item" type="number" id="productPrice" required>

      <label for="productQuantity">Количество:</label>
      <input v-model="newData.quan_item" type="number" id="productQuantity" required>

      <label for="productImage">Изображение:</label>
      <input v-model="newData.image_item" type="text" id="productImage" required>

      <checkbox></checkbox>
      <input v-model="newData.category_item" type="radio" id="option1" name="choice" value="item">
      <label for="option1">Вещи</label><br>
      <input v-model="newData.category_item" type="radio" id="option2" name="choice" value="cosmetics">
      <label for="option2">Косметика</label><br>
      <input v-model="newData.category_item" type="radio" id="option3" name="choice" value="accessories">
      <label for="option3">Принадлежности</label><br>
      <h1>{{ newData.category_item }}</h1>
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