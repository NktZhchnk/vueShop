<template>
  <div class="div-container">
    <div>
      <label for="cityInput">Введіть населений пункт:</label>
      <input :style="{border: selectedCity === '' ? '1px solid red': '1px solid gray'}" id="cityInput" type="text" v-model="selectedCity" @input="getWarehouses" list="cities">
      <datalist id="cities">
        <option v-for="(city, index) in cities" :value="city.Description" :key="index">
          {{ city.Description }} ({{ city.DescriptionRu }})
        </option>
      </datalist>
    </div>

    <div style="display: flex;  align-items: center" v-if="selectedCity !== ''">
      <input type="radio" id="newPost" value="newPost" v-model="selectedPostType">
      <label style="margin-bottom: 0" for="newPost">Нова Пошта</label>
      <input style="margin-left: 20px" type="radio" id="ukrPost" value="ukrPost" v-model="selectedPostType">
      <label style="margin-bottom: 0" for="ukrPost">Укрпошта</label>
    </div>

    <div v-if="selectedPostType === 'newPost'">
      <label for="searchQuery">Введіть адресу або номер відділення:</label>
      <input :style="{border: searchQuery === '' ? '1px solid red': '1px solid gray'}" type="text" placeholder="Введіть адресу або номер відділення" v-model="searchQuery"
             @input="searchWarehouses"/>
      <ul v-if="showListPoshta" class="warehouse-list">
        <li @click="checkInfoPoshta(place.Description)" v-for="(place, index) in displayedWarehouses" :key="index"
            class="warehouse-item">
          {{ place.Description }} ({{ place.DescriptionRu }})
        </li>
      </ul>
    </div>

    <div v-if="selectedPostType === 'ukrPost'">
      <label for="postIndex">Введіть поштовий індекс:</label>
      <input :style="{border: postIndex === null ? '1px solid red': '1px solid gray'}" placeholder="11111" id="postIndex" type="number" v-model="postIndex">
    </div>
  </div>

</template>


<script setup>
import axios from "axios";
import {ref, computed, watch} from "vue";
import {useMyStore} from "@/store/store.js";

const store = useMyStore()


const apiKey = '770afdf2b97510753a2e96d099d53e1a';
const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

let showListPoshta = false;
const infoPoshta = ref([]);
const searchQuery = ref('');
const selectedCity = ref('');
const cities = ref([]); // Список доступных городов
let selectedPostType = ref('');
let postIndex = ref('');

watch([postIndex, searchQuery, selectedCity], ([newPostIndex, newSearchQuery, newSelectedCity]) => {
  store.selectPoshta.cities = newSelectedCity
  store.selectPoshta.searchQuery = newSearchQuery
  store.selectPoshta.postIndex = newPostIndex
  if (selectedPostType.value === 'newPost') {
    postIndex.value = ''
  } else if (selectedPostType.value === 'ukrPost') {
    searchQuery.value = ''
  } else {
    return
  }
});
const checkInfoPoshta = (item) => {
  showListPoshta = false
  searchQuery.value = item
  store.updatePoshtaInfo(item)
}

// Получение списка доступных городов
axios.post(apiUrl, {apiKey, modelName: 'Address', calledMethod: 'getCities', methodProperties: {}})
    .then(response => {
      cities.value = response.data.data;
    })
    .catch(error => {
      console.error('Ошибка при получении списка городов:', error);
    });

const getWarehouses = () => {
  selectedCity.value = selectedCity.value.replace(/[^а-яА-ЯёЁіІїЇґҐєЄ0-9\s]/g, '');
  selectedCity.value = selectedCity.value.replace(/^\s+/, '');

  if (selectedCity.value) {
    axios.post(apiUrl, {
      apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {CityName: selectedCity.value}
    })
        .then(response => {
          infoPoshta.value = response.data.data;
          console.log('Адреса для введенного населенного пункта:', infoPoshta.value);
        })
        .catch(error => {
          console.error('Ошибка при получении адресов:', error);
        });
  }
};
const searchWarehouses = () => {
  showListPoshta = true
  searchQuery.value = searchQuery.value.replace(/[^\sа-яА-ЯёЁіІїЇґҐєЄ0-9]/g, '');
  searchQuery.value = searchQuery.value.replace(/^\s+/, '');

  filteredWarehouses.value = infoPoshta.value.filter(warehouse =>
      warehouse.Description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      warehouse.DescriptionRu.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const filteredWarehouses = computed(() => {
  return searchQuery.value
      ? infoPoshta.value.filter(warehouse =>
          warehouse.Description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          warehouse.DescriptionRu.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      : infoPoshta.value;
});

const displayedWarehouses = computed(() => {
  return filteredWarehouses.value.slice(0, 5);
});
</script>

<style scoped>
.container {
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: start;
  flex-direction: column;

}

/* Стили для элементов формы */
label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

input[type="text"], input[type="number"] {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;

  box-sizing: border-box;
  margin-bottom: 10px;
}

/* Стили для списка городов */
.warehouse-list {
  list-style: none;
  padding: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Стили для элементов списка */
.warehouse-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* При наведении */
.warehouse-item:hover {
  background-color: #f9f9f9;
}

/* Убираем нижнюю границу у последнего элемента списка */
.warehouse-item:last-child {
  border-bottom: none;
}

/* Стили для радио-кнопок */
input[type="radio"] {
  margin: 15px;
}

/* Медиа-запрос для адаптивности */
@media screen and (min-width: 768px) {
  .container {
    max-width: 600px;
    padding: 0;
  }

  /* Дополнительные стили для больших экранов */
}

@media screen and (min-width: 768px) {

  label {
    font-size: 18px; /* Увеличение размера текста меток */
  }

  input[type="text"],
  input[type="number"] {
    width: 100%; /* Уменьшение ширины полей ввода для большего пространства */
    max-width: 100%;
    /* Центрирование и увеличение отступа снизу */
  }

  /* Убираем стили ограничения высоты списка на больших экранах */
  .warehouse-list {
    max-height: none;
    overflow-y: visible;
  }

  /* Увеличиваем размер шрифта и отступы в списке */
  .warehouse-item {
    padding: 12px;
    font-size: 16px;
  }
}

@media screen and (max-width: 767px) {
  .container {
    margin: 10px; /* Уменьшаем отступы для маленьких экранов */
    padding: 0;
  }

  label {
    font-size: 14px; /* Уменьшаем размер текста меток */
  }

  input[type="text"],
  input[type="number"] {
    width: 100%; /* Растягиваем поля ввода на всю ширину экрана */
    max-width: 100%;
    margin: 0 0 8px; /* Уменьшаем отступ снизу */
  }

  /* Уменьшаем высоту списка для лучшей видимости на маленьких экранах */
  .warehouse-list {
    max-height: 150px;
  }

  /* Уменьшаем размер шрифта и отступы в списке */
  .warehouse-item {
    padding: 8px;
    font-size: 14px;
  }

  /* Располагаем радио-кнопки в столбец на маленьких экранах */
  input[type="radio"] {
    display: block;
    margin: 8px 0;
  }
}
</style>
