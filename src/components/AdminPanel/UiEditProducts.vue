<script setup>
import {onMounted, computed, ref} from "vue";
import {useMyStore} from "@/store/store.js";
import axios from "axios";
import LazyLoadImage from "@/LazyLoadImage.vue";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
});

let varietyQuantities = ref({});
let qunProduct = ref(0)
const getProductVarieties = (productId) => {
  const varieties = store.productVarieties.filter(variety => variety.product_id === productId);
  // Перебираем каждую вариацию и устанавливаем ее значение variety_quan в varietyQuantities
  varieties.forEach(variety => {
    // Если variety_quan для данной вариации уже установлено, то используем его значение
    // В противном случае устанавливаем значение по умолчанию, например, 0
    varietyQuantities.value[variety.id] = typeof varietyQuantities.value[variety.id] !== 'undefined' ? varietyQuantities.value[variety.id] : variety.variety_quan;
  });

  // Возвращаем массив вариаций с установленными значениями variety_quan
  return varieties;
}


const getTotalQuantity = (productId) => {
  const product = store.products.find(item => item.id === productId);
  if (product) {
    return getProductVarieties(productId).reduce((total, variety) => total, product.quan_item);
  }
}
const saveQuanProduct = async (productId, varieties) => {
  try {
    if (varieties.length !== 0) {
      const productQuantity = varieties.reduce((total, variety) => {
        // Проверяем, есть ли значение variety_quan для данной вариации в varietyQuantities
        if (varietyQuantities.value[variety.id] !== undefined) {
          // Если есть, добавляем его к общему количеству
          return total + varietyQuantities.value[variety.id];
        } else {
          // Если значения нет, возвращаем общее количество без изменений
          return total;
        }
      }, 0);

      console.log('Общее количество вариаций:', productQuantity);

      // Запрос на обновление количества продукта
      const varietyResponse2 = await axios.put(
          `https://eseniabila.com.ua/updateProductCount/${productId}`,
          {variety_quan: productQuantity},
          {headers: {'Content-Type': 'application/json'}}
      );

      console.log('Ответ сервера количество продукта:', varietyResponse2.data);

      // Запросы на обновление количества для каждой вариации
      await Promise.all(varieties.map(async (variety) => {
        // Проверяем, есть ли значение variety_quan для данной вариации в varietyQuantities
        if (varietyQuantities.value[variety.id] !== undefined) {
          // Если есть, отправляем запрос на обновление
          const varietyResponse = await axios.put(
              `https://eseniabila.com.ua/updateVarietyCount/${variety.id}`,
              {variety_quan: varietyQuantities.value[variety.id]},
              {headers: {'Content-Type': 'application/json'}}
          );

          console.log('Ответ сервера количество вариации:', varietyResponse.data);
        }
      }));
    } else {
      // Если вариации отсутствуют, используем значение из qunProduct
      console.log('Общее количество продукта без вариаций:', qunProduct.value);

      // Запрос на обновление количества продукта в отсутствие вариаций
      const varietyResponse2 = await axios.put(
          `https://eseniabila.com.ua/updateProductCount/${productId}`,
          {variety_quan: qunProduct.value},
          {headers: {'Content-Type': 'application/json'}}
      );

      console.log('Ответ сервера количество продукта:', varietyResponse2.data);
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

const togglePopularityItem = async (productId) => {
  try {
    // Находим товар в массиве store.products по productId
    const productIndex = store.products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      // Получаем текущее значение popularity_item
      const currentPopularity = store.products[productIndex].popularity_item;

      // Определяем новое значение для popularity_item
      const newPopularity = (currentPopularity === null) ? 1 : null;

      // Локальное обновление значения popularity_item
      store.products[productIndex].popularity_item = newPopularity;

      // Обновление значения popularity_item на сервере
      const updateResponse = await axios.put(
          `https://eseniabila.com.ua/updateProduct/${productId}`,
          {popularity_item: newPopularity},
          {headers: {'Content-Type': 'application/json'}}
      );

      console.log('Ответ сервера обновления popularity_item:', updateResponse.data);

      // Здесь вы можете выполнить дополнительные действия после успешного обновления, если это необходимо
    }

  } catch (error) {
    // Обработка ошибок
    console.error('Произошла ошибка:', error);
  }
};
// Остальной код остается неизменным
// ...
const itemImages = (itemId) => {
  return store.productImg
      .filter((img) => img.product_id === itemId)
      .map((img) => img.img);
};
// Функция для установки порядка сортировки
const sortByQuantity = (order) => {
  sortBy.value = order;
};
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Пошук за назвою" class="search-input"/>

    <!-- Кнопки для сортировки -->
    <div class="sort-buttons">
      <button @click="sortByQuantity('asc')">За зростанням</button>
      <button @click="sortByQuantity('desc')">За зменшенням</button>
    </div>

    <div class="product-list">
      <div v-for="product in sortedProducts" :key="product.id" class="product-card">
        <div style="display: flex;  justify-content: space-between; padding: 5px">
          <h2 class="product-name">{{ product.name_item }} </h2>
          <LazyLoadImage
              class="img"
              :src="itemImages(product.id)[0]"
              :alt="product.name_item"></LazyLoadImage>
        </div>
        <div class="product-details">
          <div class="quantity-section">
            <span class="label">Загальна кількість:  </span>
            <span class="total-quantity">{{ getTotalQuantity(product.id) }}</span>
            <input v-if="getProductVarieties(product.id).length === 0" type="number" v-model="qunProduct"
                   class="quantity-input"/>
          </div>
          <div class="varieties-section">
            <span class="label">Варіації:</span>
            <ul class="varieties-list">
              <li v-for="variety in getProductVarieties(product.id)" :key="variety.id" class="variety-item">
                <span class="variety-info">{{ variety.variety_name }} - {{ variety.variety_quan }}</span>
                <input type="number" v-model="varietyQuantities[variety.id]" class="quantity-input"/>
              </li>
            </ul>
          </div>
          <button @click="saveQuanProduct(product.id, getProductVarieties(product.id))" class="save-button">
            Зберегти
          </button>
          <button style="margin-left: 15px; background: #fffc9e; color: black;" v-show="product.popularity_item === 1"
                  class="save-button" @click="togglePopularityItem(product.id)">Популярний
          </button>
          <button style="margin-left: 15px; background: #0282d9" v-show="product.popularity_item !== 1"
                  class="save-button" @click="togglePopularityItem(product.id)">Непопулярний
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: box-shadow 0.3s;
  /* Тень */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* При наведении добавляется более яркая тень */
button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.img {
  flex-shrink: 0;
  right: 10px;
  width: 120px;
  height: 120px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px gray;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.sort-buttons {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
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
  text-align: center;
  margin-top: 20px;
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
  width: 70%;
  overflow-wrap: break-word;
  height: 110px;
  overflow: hidden;
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
  border-bottom: 1px solid #e0e0e0;

}

.variety-info {
  display: flex;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  height: 40px;
  overflow: hidden;;
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
