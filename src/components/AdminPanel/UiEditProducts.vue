<script setup>
import {onMounted, ref} from "vue";
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

</script>

<template>
  <div class="style-products">
    <div v-for="product in store.products" :key="product.id" class="product-container">
      <h2 class="main-name">{{ product.name_item }}</h2>
      <ul class="product-info">
        <li>
          Общее количество: {{ getTotalQuantity(product.id) }}
          <input v-if="getProductVarieties(product.id).length === 0" type="number" v-model="qunProduct"/>
        </li>
        <li>Вариации:</li>
        <ul class="varieties-list">
          <li v-for="variety in getProductVarieties(product.id)" :key="variety.id" class="variety-item">
            {{ variety.variety_name }} - {{ variety.variety_quan }}
            <input type="number" v-model="varietyQuantities[variety.id]"/>
          </li>
          <button @click="saveQuanProduct(product.id, getProductVarieties(product.id))">сохранить</button>
        </ul>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.style-products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

input {
  width: 50px;
}

.product-container {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin: 15px;
  width: 300px;
}

.product-container h2 {
  margin-bottom: 10px;
}

.product-info {
  list-style-type: none;
  padding: 0;
}

.varieties-list {
  list-style-type: none;
  padding: 0;
  margin-top: 5px;
}

.main-name {
  word-wrap: break-word;
  height: 90px;
  overflow: hidden;
}

.variety-item {
  margin-bottom: 5px;
}

@media screen and (max-width: 768px) {
  .style-products {
    flex-direction: column;
    align-items: center;
  }

  .product-container {
    width: 80%;
  }
}
</style>
