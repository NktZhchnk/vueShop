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
  date_item: new Date(),
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
  // Выполняем запрос на получение всех продуктов
  axios.post('https://eseniabila.com.ua/addProduct', newData)
      .then(productResponse => {
        console.log('Продукт добавлен успешно:', productResponse.data);

        // Получаем айдишник добавленного продукта

        // Запрос на получение списка продуктов (обновленный список)
        axios.get('https://eseniabila.com.ua/getProducts')
            .then(productsResponse => {
              const updatedProducts = productsResponse.data;
              const lastId = updatedProducts.length > 0 ? updatedProducts[updatedProducts.length - 1].id : 0;

              // Создаем данные для изображения
              const dataImg = {
                img: imageLinks,
                product_id: lastId,
              };

              // Запрос на добавление изображения продукта
              axios.post('https://eseniabila.com.ua/addProductImg', dataImg, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                  .then(imgResponse => {
                    console.log('Изображение добавлено успешно:', imgResponse.data);

                    // Проверяем наличие данных для addProductVarieties
                    if (store.radioOptions.label && store.radioOptions.price && store.radioOptions.quantity) {
                      const varietyData = {
                        product_id: lastId,
                        variety_name: store.radioOptions.label,
                        variety_quan: store.radioOptions.price,
                        variety_price: store.radioOptions.quantity,
                      };

                      // Запрос на добавление вариаций продукта
                      axios.post('https://eseniabila.com.ua/addProductVarieties', varietyData, {
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      })
                          .then(varietyResponse => {
                            console.log('Вариация добавлена успешно:', varietyResponse.data);

                            // Перезагрузка страницы через 2 секунды после успешного выполнения всех запросов
                            setTimeout(() => {
                              location.reload();
                            }, 2000);
                          })
                          .catch(varietyError => {
                            console.error('Ошибка при добавлении вариации:', varietyError);
                          });
                    } else {
                      // Перезагрузка страницы через 2 секунды после успешного добавления продукта и изображения
                      setTimeout(() => {
                        location.reload();
                      }, 2000);
                    }
                  })
                  .catch(imgError => {
                    console.error('Ошибка при добавлении изображения:', imgError);
                  });
            })
            .catch(productsError => {
              console.error('Ошибка при получении списка продуктов:', productsError);
            });
      })
      .catch(productError => {
        console.error('Ошибка при добавлении продукта:', productError);
      });
};

const test = ()=>{

  console.log(store.radioOptions)
}


</script>

<template>
  <div>
    <!-- Ваш текущий код отображения продуктов -->
    <!-- Форма для добавления нового продукта -->
    <form @submit.prevent="addProduct" class="product-form">
      <button @click="test">test</button>
      <label for="productName">Назва:</label>
      <input v-model="newData.name_item" type="text" id="productName" required>

      <label for="productPrice">Ціна:</label>
      <input v-model="newData.price_item" type="number"  id="productPrice" required>

      <label for="productQuantity">Загальна кількість:</label>
      <input v-model="newData.quan_item" type="number" id="productQuantity" required>

      <!-- Добавление поля для ввода количества изображений -->
      <label for="imageQuantity" v-if="showBtnImg" class="image-quantity-label">Кількість зображень:</label>
      <input v-model="imageQuantity" v-if="showBtnImg" type="number" id="imageQuantity" required
             class="image-quantity-input">

      <!-- Кнопка для запуска процесса ввода ссылок на изображения -->
      <button @click="inputImages" v-if="showBtnImg" class="inpImg">Додати зображення</button>


      <!-- Поля для ввода ссылок на изображения -->
      <div v-for="(image, index) in imageInputs" :key="index" class="image-input-container">
        <label :for="'productImage' + index" class="image-label">Зображення {{ index + 1 }}:</label>
        <input v-model="imageLinks[index]" :id="'productImage' + index" type="text" required class="image-input">
      </div>

      <checkbox></checkbox>

      <add-categories style="margin-bottom: 20px"></add-categories>

      <textarea v-model="newData.text_info" class="text-info" @keydown="handleKeyDown"
                placeholder="Інформація про продукт"></textarea>
      <button type="submit" class="add-product-button">
        Додати продукт
      </button>
    </form>
  </div>
</template>

<style scoped>

/* Main container */
form {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}

/* Form elements styling */
label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #333333;
}

.inpImg {
  height: 30px;
  border-radius: 5px;
  color: white;
  background-color: #1b4c85;
  border: 1px solid #333333;
}

.inpImg:hover {
  background-color: #112f52;
}

.text-info {
  height: 140px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  color: #333333;
}

input[type="text"],
input[type="number"],
input[type="password"] {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #666666;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333333;
}

/* Button styling */
button[type="submit"] {
  padding: 12px 24px;
  background-color: #1b4c85;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

/* Additional styles for specific elements */

.image-input-container {
  margin-bottom: 16px;
}

.image-label {
  color: #333333;
}

/* Media query for responsiveness */
@media screen and (max-width: 600px) {
  form {
    max-width: 100%;
  }
}

</style>
