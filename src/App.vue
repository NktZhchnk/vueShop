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
      <label for="searchQuery">Введите адрес или номер отделения:</label>
      <input placeholder="Введите адрес или номер отделения" v-model="searchQuery" @input="searchWarehouses"/>
      <ul class="warehouse-list">
        <li v-for="(place, index) in displayedWarehouses" :key="index" class="warehouse-item">
          {{ place.Description }} ({{ place.DescriptionRu }})
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup>
import axios from "axios";
import { ref, computed } from "vue";

const apiKey = '770afdf2b97510753a2e96d099d53e1a';
const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

const infoPoshta = ref([]);
const searchQuery = ref('');
const selectedCity = ref('');
const cities = ref([]); // Список доступных городов

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
  return filteredWarehouses.value.slice(0, 20);
});
</script>

<style scoped>
.container {
  margin: 20px;
  font-family: Arial, sans-serif;
}

label {
  font-weight: bold;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.warehouse-list {
  list-style: none;
  padding: 0;
}

.warehouse-item {
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
}

.warehouse-item:last-child {
  border-bottom: none;
}
</style>
