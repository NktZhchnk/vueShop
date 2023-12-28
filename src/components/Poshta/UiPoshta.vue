<template>
  <div class="container">
    <div>
      <label for="cityInput">Введите населенный пункт:</label>
      <input id="cityInput" type="text" v-model="selectedCity" @input="getWarehouses" list="cities">
      <datalist id="cities">
        <option v-for="(city, index) in cities" :value="city.Description" :key="index">
          {{ city.Description }} ({{ city.DescriptionRu }})
        </option>
      </datalist>
    </div>

    <div v-if="infoPoshta.length">
      <input type="radio" id="newPost" value="newPost" v-model="selectedPostType">
      <label for="newPost">Новая Почта</label>
      <input style="margin-left: 100px" type="radio" id="ukrPost" value="ukrPost" v-model="selectedPostType">
      <label for="ukrPost">Укрпочта</label>
    </div>

    <div v-if="selectedPostType === 'newPost'">
      <label for="searchQuery">Введите адрес или номер отделения:</label>
      <input type="text" placeholder="Введите адрес или номер отделения" v-model="searchQuery" @input="searchWarehouses"/>
      <ul v-if="showListPoshta" class="warehouse-list">
        <li @click="checkInfoPoshta(place.Description)" v-for="(place, index) in displayedWarehouses" :key="index"
            class="warehouse-item">
          {{ place.Description }} ({{ place.DescriptionRu }})
        </li>
      </ul>
    </div>

    <div v-if="selectedPostType === 'ukrPost'">
      <label for="postIndex">Введите почтовый индекс:</label>
      <input placeholder="11111" id="postIndex" type="number" v-model="postIndex">
    </div>
  </div>

</template>


<script setup>
import axios from "axios";
import {ref, computed} from "vue";
import {useMyStore} from "@/store/store.js";

const store = useMyStore()


const apiKey = '770afdf2b97510753a2e96d099d53e1a';
const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

let showListPoshta = false;
const infoPoshta = ref([]);
const searchQuery = ref('');
const selectedCity = ref('');
const cities = ref([]); // Список доступных городов
let selectedPostType = ref(null);
const checkInfoPoshta = (item) => {
  showListPoshta = false
  searchQuery.value = item
  store.updatePoshtaInfo(item)
}

// Получение списка доступных городов
axios.post(apiUrl, {apiKey, modelName: 'Address', calledMethod: 'getCities', methodProperties: {}})
    .then(response => {
      cities.value = response.data.data;
      console.log('Список городов:', cities.value); // Убедитесь, что данные приходят в нужном формате
    })
    .catch(error => {
      console.error('Ошибка при получении списка городов:', error);
    });

const getWarehouses = () => {
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
  margin: 20px;
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

input[type="text"], input[type="number"]{
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
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
input[type="radio"]{
  margin: 15px;
}

/* Медиа-запрос для адаптивности */
@media screen and (min-width: 768px) {
  .container {
    max-width: 600px;
  }

  /* Дополнительные стили для больших экранов */
}
</style>
