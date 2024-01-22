<!-- OrderDetails.vue -->

<template>
  <div class="order-details">
    <h2>Order Details</h2>
    <svg @click.prevent="removeOrder()" xmlns="http://www.w3.org/2000/svg" height="28" width="26"
         viewBox="0 0 448 512">
      <path
          d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
    </svg>
    <p v-if="orderId" class="order-id">Order ID: {{ orderId }}</p>

    <!-- Используем v-for для перебора элементов в массиве order -->
    <div v-for="item in order" :key="item.id" class="order-item">

      <!-- Проверка наличия вариаций -->
      <template v-if="item.variety_name !== null">
        <div style="display: flex">
          <div>
            <img v-if="item.image_url" :src="item.image_url" alt="Product Image" class="variety-image"/>
          </div>
          <div style="margin-left: 20px">
            <p class="variety-info">Variety Name: {{ item.variety_name }}</p>
            <p class="variety-info">Variety Price: {{ item.variety_price }}</p>
            <p class="variety-info">Variety quantity: {{ item.quantity }}</p></div>
        </div>
      </template>

      <!-- Проверка отсутствия вариаций -->
      <template v-else>
        <div style="display: flex">
          <div><img v-if="item.image_url" :src="item.image_url" alt="Product Image" class="item-image"/></div>
          <div style="margin-left: 20px">
            <p class="item-info">Item Name: {{ item.item_name }}</p>
            <p class="item-info">Price: {{ item.price }}</p>
            <p class="item-info">Quantity: {{ item.quantity }}</p>
          </div>
        </div>


      </template>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const orderId = ref(null);
const order = ref(null);


onMounted(async () => {
  // Используем useRoute для получения доступа к $route
  const route = useRoute();

  // Получаем orderId из параметров маршрута
  orderId.value = route.params.orderId;

  // Проверяем наличие orderId перед запросом к серверу
  if (orderId.value) {
    try {
      // Загружаем подробную информацию о заказе
      const response = await axios.get(`https://eseniabila.com.ua/getItemOrder/${orderId.value}`);
      console.log(response.data)
      order.value = response.data;
    } catch (error) {
      console.error('Ошибка при получении подробной информации о заказе:', error);
    }
  }
});

const removeOrder = async () => {
  for(const item of order.value){
    let quanProduct = 0;
    let orderId = item.order_id;
    let quanVariety = 0;

    if(item.order_product_id){
      const productId = item.order_product_id
      console.log(productId)
      const productResponse = await axios.get(`https://eseniabila.com.ua/getProductById/${productId}`);

      quanProduct = productResponse.data.quan_item
      console.log('productResponse', productResponse.data)

      let newProductQuan = quanProduct + item.quantity

      const productResponsePut = await axios.put(`https://eseniabila.com.ua/updateProductCount/${productId}`, {
        variety_quan: newProductQuan,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Ответ сервера количество вариации:', productResponsePut.data);

      await axios.delete(`https://eseniabila.com.ua/deleteOrder/${orderId}`);
    }
    if(item.order_variety_id){

      const productId = item.order_variety_id

      const varietyResponse = await axios.get(`https://eseniabila.com.ua/getVarietiesId/${productId}`);

      quanVariety = varietyResponse.data.variety_quan

      console.log('varietyResponse', varietyResponse.data)

      let newVarietyQuan = quanVariety + item.quantity

      const varietyResponsePut = await axios.put(`https://eseniabila.com.ua/updateVarietyCount/${productId}`, {
        variety_quan: newVarietyQuan,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Ответ сервера количество вариации:', varietyResponsePut.data);

      await axios.delete(`https://eseniabila.com.ua/deleteOrder/${orderId}`);
    }
  }
}

</script>

<style scoped>
/* Ваши стили для подробной информации о заказе */

.order-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
}

.order-id {
  font-size: 18px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 10px;
}

.order-item {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
}

.order-item:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.variety-info, .item-info {
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

.variety-info {
  color: #e74c3c;
}

img {
  height: 150px;
  width: 150px;
}

.item-image, .variety-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.item-image:hover, .variety-image:hover {
  transform: scale(1.05);
}
</style>
