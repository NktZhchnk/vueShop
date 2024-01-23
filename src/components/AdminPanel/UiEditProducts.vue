<script setup>
import {onMounted,computed, ref} from "vue";
import {useMyStore} from "@/store/store.js";
import axios from "axios";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
});


let varietyQuantities = ref({});
let qunProduct = ref(0)
const getProductVarieties = (productId) => {
  return store.productVarieties.filter(variety => variety.product_id === productId)
}
const getTotalQuantity = (productId) => {
  const product = store.products.find(item => item.id === productId);
  if (product) {
    return getProductVarieties(productId).reduce((total, variety) => total, product.quan_item);
  }
}
const saveQuanProduct = async (productId, varietyId) => {

  try {
    if (varietyId.length !== 0) {
      const values = Object.values(varietyQuantities.value);
      const productQuantity = values.reduce((total, quantity) => total + quantity, 0);

      // Запрос на обновление количества продукта
      const varietyResponse2 = await axios.put(
          `https://eseniabila.com.ua/updateProductCount/${productId}`,
          {variety_quan: productQuantity},
          {headers: {'Content-Type': 'application/json'}}
      );

      console.log('Ответ сервера количество вариации:', varietyResponse2.data);

      // Запросы на обновление количества для каждой вариации
      await Promise.all(varietyId.map(async (variety) => {
        const varietyResponse = await axios.put(
            `https://eseniabila.com.ua/updateVarietyCount/${variety.id}`,
            {variety_quan: varietyQuantities.value[variety.id]},
            {headers: {'Content-Type': 'application/json'}}
        );

        console.log('Ответ сервера количество вариации:', varietyResponse.data);
        console.log("Variety ID:", variety.id);
        console.log("Variety Quantity:", variety.variety_quan);
      }));
    } else {
      console.log('h', qunProduct.value);

      // Запрос на обновление количества продукта в отсутствие вариаций
      const varietyResponse2 = await axios.put(
          `https://eseniabila.com.ua/updateProductCount/${productId}`,
          {variety_quan: qunProduct.value},
          {headers: {'Content-Type': 'application/json'}}
      );

      console.log('Ответ сервера количество вариации:', varietyResponse2.data);
    }
  } catch (error) {
    // Обработка ошибок
    console.error('Произошла ошибка:', error);
  } finally {
    // Перезагрузка страницы вне зависимости от того, были ли ошибки или нет
    window.location.reload();
  }
};
const searchQuery = ref('');
const sortBy = ref(null);

// Вычисляемое свойство для фильтрации продуктов по запросу поиска и сортировке
const sortedProducts = computed(() => {
  let filtered = store.products.filter(product => product.name_item.toLowerCase().includes(searchQuery.value.toLowerCase()));

  if (sortBy.value === 'asc') {
    filtered = filtered.sort((a, b) => getTotalQuantity(a.id) - getTotalQuantity(b.id));
  } else if (sortBy.value === 'desc') {
    filtered = filtered.sort((a, b) => getTotalQuantity(b.id) - getTotalQuantity(a.id));
  }

  return filtered;
});

// Остальной код остается неизменным
// ...

// Функция для установки порядка сортировки
const sortByQuantity = (order) => {
  sortBy.value = order;
};
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Поиск по названию" class="search-input" />

    <!-- Кнопки для сортировки -->
    <div class="sort-buttons">
      <button @click="sortByQuantity('asc')">По возрастанию</button>
      <button @click="sortByQuantity('desc')">По убыванию</button>
    </div>

    <div class="product-list">
      <div v-for="product in sortedProducts" :key="product.id" class="product-card">
        <h2 class="product-name">{{ product.name_item }}</h2>
        <div class="product-details">
          <div class="quantity-section">
            <span class="label">Общее количество:</span>
            <span class="total-quantity">{{ getTotalQuantity(product.id) }}</span>
            <input v-if="getProductVarieties(product.id).length === 0" type="number" v-model="qunProduct"
                   class="quantity-input"/>
          </div>
          <div class="varieties-section">
            <span class="label">Вариации:</span>
            <ul class="varieties-list">
              <li v-for="variety in getProductVarieties(product.id)" :key="variety.id" class="variety-item">
                <span class="variety-info"> вариация: {{ variety.variety_name }} - количетсво: {{ variety.variety_quan }}</span>
                <input type="number" v-model="varietyQuantities[variety.id]" class="quantity-input"/>
              </li>
            </ul>
          </div>
          <button @click="saveQuanProduct(product.id, getProductVarieties(product.id))" class="save-button">Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}
.sort-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.sort-buttons button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.sort-buttons button:hover {
  background-color: #45a049;
}
.search-input {
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: calc(50% - 20px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-name {
  font-size: 1.5rem;
  margin: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-details {
  padding: 15px;
}

.quantity-section,
.varieties-section {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
}

.total-quantity {
  margin-left: 5px;
  font-weight: bold;
}

.varieties-list {
  list-style: none;
  padding: 0;
  margin-top: 5px;
}

.variety-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.variety-info {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quantity-input {
  width: 60px;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.save-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .product-card {
    width: calc(100% - 20px);
  }
}
</style>
