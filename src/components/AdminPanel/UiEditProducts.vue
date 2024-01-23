<script setup>
import {onMounted, ref} from "vue";
import {useMyStore} from "@/store/store.js";
import axios from "axios";

const store = useMyStore()

onMounted(async () => {
  await store.fetchData();
});

let varietyQuantities = ref({});
const getProductVarieties = (productId) => {
  return store.productVarieties.filter(variety => variety.product_id === productId)
}
const getTotalQuantity = (productId) => {
  const product = store.products.find(item => item.id === productId);
  if (product) {
    return getProductVarieties(productId).reduce((total, variety) => total + variety.variety_quan, product.quan_item);
  }
}
const saveQuanProduct = async (productId, varietyId) => {
  const values = Object.values(varietyQuantities.value)
  const productQuantity = values.reduce((total, quantity) => total + quantity, 0)

  const varietyResponse2 = await axios.put(
      `https://eseniabila.com.ua/updateProductCount/${productId}`,
      { variety_quan: productQuantity },
      { headers: { 'Content-Type': 'application/json' } }
  );


  console.log('Ответ сервера количество вариации:', varietyResponse2.data);

  varietyId.forEach((variety) => {

    const varietyResponse = axios.put(`https://eseniabila.com.ua/updateVarietyCount/${variety.id}`, {
      variety_quan: varietyQuantities.value[variety.id],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Ответ сервера количество вариации:', varietyResponse.data);

    console.log("Variety ID:", variety.id);
    console.log("Variety Quantity:", variety.variety_quan);
  });
}
</script>

<template>
  <div class="style-products">
    <div v-for="product in store.products" :key="product.id" class="product-container">
      <h2 class="main-name">{{ product.name_item }}</h2>
      <ul class="product-info">
        <li>
          Общее количество: {{ getTotalQuantity(product.id) }}
          <input v-show="false" v-model="qunProduct" />
        </li>
        <li>Вариации:</li>
        <ul class="varieties-list">
          <li v-for="variety in getProductVarieties(product.id)" :key="variety.id" class="variety-item">
            {{ variety.variety_name }} - {{ variety.variety_quan }}
            <input type="number" v-model="varietyQuantities[variety.id]" />
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
.main-name{
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
