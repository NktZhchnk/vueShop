<script setup>
import {ref, watch} from 'vue';
import axios from 'axios';
import {useMyStore} from "@/store/store.js";
import Checkbox from "@/components/AdminPanel/Checkbox.vue";
import AddCategories from "@/components/AdminPanel/AddCategories.vue";

const store = useMyStore()

const newData = {
  name_item: '',
  price_item: 1, // цена продукта
  quan_item: 1,    // количество продукта
  show_item: 1,
  category_item: null,
  text_info: '',
};

watch(() => store.categoryItem, (newValue) => {
  newData.category_item = newValue;
});
let imageInputs = ref([]); // Массив для хранения полей ввода ссылок на изображения
let imageLinks = []; // Массив для хранения ссылок на изображения
let imageQuantity = ref(0); // Количество изображений, которые пользователь хочет добавить
let showBtnImg = true;
// Функция для добавления полей ввода ссылок на изображения
const inputImages = () => {
  if (imageQuantity.value >= 1) {
    imageInputs.value = new Array(imageQuantity.value).fill('');
    imageLinks = new Array(imageQuantity.value).fill('');
    showBtnImg = false;
  } else {
    const inpImg = document.querySelector('.inpImg')
    inpImg.style.border = "3px solid red"
    setTimeout(() => {
      inpImg.style.border = "1px solid gray"
    }, 2000)
  }
};
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Предотвращаем стандартное действие Enter (перенос строки)
    event.preventDefault();

    // Добавляем символ новой строки в текст
    newData.text_info += '\n';
  }
};
const addProduct = () => {
  store.getRadioPrice()

  const data = {
    product_id: store.lastId,
    variety_name: store.radioName,
    variety_quan: store.radioQuan,
    variety_price: store.radioPrice,
  };
  const dataImg = {
    img: imageLinks,
    product_id: store.lastId,
  }
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
        // Обработка успешного ответа
      })
      .catch(error => {
        console.error('Ошибка при отправке данных на сервер:', error);
        // Обработка ошибки
      });
  axios.post('https://eseniabila.com.ua/addProductImg', dataImg, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log('Ответ сервера:', response.data);
        // Обработка успешного ответа
        setTimeout(()=>{
          location.reload();
        },1500)
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
    <form @submit.prevent="addProduct" class="product-form">

      <label for="productName">Назва:</label>
      <input v-model="newData.name_item" type="text" id="productName" required>

      <label for="productPrice">Ціна:</label>
      <input v-model="newData.price_item" type="number" id="productPrice" required>

      <label for="productQuantity">Кільскість:</label>
      <input v-model="newData.quan_item" type="number" id="productQuantity" required>

      <!-- Добавление поля для ввода количества изображений -->
      <label for="imageQuantity" v-if="showBtnImg" class="image-quantity-label">Количество изображений:</label>
      <input v-model="imageQuantity" v-if="showBtnImg" type="number" id="imageQuantity" required
             class="image-quantity-input">

      <!-- Кнопка для запуска процесса ввода ссылок на изображения -->
      <button @click="inputImages" v-if="showBtnImg" class="inpImg">Добавить изображения</button>


      <!-- Поля для ввода ссылок на изображения -->
      <div v-for="(image, index) in imageInputs" :key="index" class="image-input-container">
        <label :for="'productImage' + index" class="image-label">Зображення {{ index + 1 }}:</label>
        <input v-model="imageLinks[index]" :id="'productImage' + index" type="text" required class="image-input">
      </div>

      <checkbox></checkbox>

      <add-categories></add-categories>

      <textarea v-model="newData.text_info" class="text-info" @keydown="handleKeyDown" placeholder="Информация о продукте"></textarea>
      <button type="submit" class="add-product-button">Добавить продукт</button>
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
.inpImg{
  height: 30px;
  border-radius: 5px;
  background: rgba(255,30,30, 0.1);
  border: 1px solid black;
}
.inpImg:hover{
  background: rgba(255,30,30, 0.3);
  font-size: 18px;
}
.text-info {
  height: 140px;
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
.product-form {
  border: 2px solid black;
  box-shadow: 1px 2px 10px black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}

/* Стили для отдельных элементов формы */

.test-button {
  padding: 8px 16px;
  margin-bottom: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* ... остальные стили для остальных элементов формы ... */

.add-product-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-product-button:hover {
  background-color: #0056b3;
}
</style>