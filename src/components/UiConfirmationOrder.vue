<script setup>
import {onMounted, ref} from 'vue'
import UiPoshta from "@/components/Poshta/UiPoshta.vue";
import {useMyStore} from "@/store/store.js";
import axios from "axios";

const store = useMyStore()
let telephone = ref('4242424');
let firstname = ref('test');
let lastName = ref('test');
let surname = ref('test');
let comment = ref('');
const loadCartProducts = () => {
  const savedCartProducts = sessionStorage.getItem('cartProducts');
  if (savedCartProducts) {
    store.cartProducts = JSON.parse(savedCartProducts);
    console.log('Загружена корзина товаров в офор:', store.cartProducts);
  }
};
const validateTelephone = () => {
  let maxLength = 10
  telephone.value = telephone.value.replace(/\D/g, '');
  if (telephone.value.length > maxLength) {
    telephone.value = telephone.value.slice(0, maxLength);
  }
}
const validateText = () => {
  lastName.value = lastName.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
  firstname.value = firstname.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
  surname.value = surname.value.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
}
const updateProductCount = async (cartProduct) => {
  try {
    const productId = cartProduct.product.id;
    const newVarietyQuan = cartProduct.product.quan_item - cartProduct.countProduct;
    cartProduct.product.quan_item = newVarietyQuan
    console.log('q', cartProduct.product.quan_item)
    // let newCount = JSON.parse(sessionStorage.getItem('cartProducts'))
    // newCount.product.quan_item = newVarietyQuan
    // console.log('newCountPro4242d', newCount)
    // sessionStorage.setItem('cartProducts', JSON.stringify(newCount))

    const response = await axios.put(`https://eseniabila.com.ua/updateProductCount/${productId}`, {
      variety_quan: newVarietyQuan

    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Ответ сервера продукта:', response.data);
    // Обработка успешного ответа
  } catch (error) {
    console.error('Ошибка при отправке данных на сервер продукта:', error);
    // Обработка ошибки
  }
}
const addOrders = async () => {
  try {
    if (store.cartProducts.length !== 0) {
      if (
          telephone.value !== '' &&
          lastName.value !== '' &&
          firstname.value !== '' &&
          surname.value !== '' &&
          store.selectPoshta.cities !== '' &&
          (store.selectPoshta.searchQuery !== '' || store.selectPoshta.postIndex !== '')
      ) {
        // Если все поля заполнены, формируем заказ и отправляем данные
        let order = {
          order_date: new Date(),
          telephone: telephone.value,
          last_name: lastName.value,
          first_name: firstname.value,
          middle_name: surname.value,
          comment: comment.value,
          city: store.selectPoshta.cities,
          address: store.selectPoshta.searchQuery,
          postal_code: store.selectPoshta.postIndex,
          total_price: store.allPriceProducts,
          complete: true,
        };

        // Отправка данных на сервер
        const orderResponse = await axios.post('https://eseniabila.com.ua/addOrders', order, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Ответ сервера:', orderResponse.data);

        for (const cartProduct of store.cartProducts) {
          let orderItem = {
            order_id: store.lastIdOrders,
            quantity: cartProduct.countProduct,
            image_url: cartProduct.images.img,
            price: cartProduct.product.price_item,
            variety_price: cartProduct.selectedVariety ? cartProduct.selectedVariety.variety_price : null,
            item_name: cartProduct.product.name_item,
            variety_name: cartProduct.selectedVariety ? cartProduct.selectedVariety.variety_name : null,
            order_product_id: cartProduct.product.id,
            order_variety_id: cartProduct.selectedVariety.id ? cartProduct.selectedVariety.id : null,
          };

          if (cartProduct.selectedVariety !== null) {
            let varietyId = cartProduct.selectedVariety.id;
            let newVarietyQuan = cartProduct.selectedVariety.variety_quan - cartProduct.countProduct;
            cartProduct.selectedVariety.variety_quan = newVarietyQuan
            console.log('v',  cartProduct.selectedVariety.variety_quan = newVarietyQuan)

            // let newCount = JSON.parse(sessionStorage.getItem('cartProducts'))
            // newCount.selectedVariety.variety_quan = newVarietyQuan
            // console.log('newCountVar', newCount)
            // sessionStorage.setItem('cartProducts', JSON.stringify(newCount))


            console.log(varietyId);
            console.log('h', newVarietyQuan);

            // Обновление количества вариации
            const varietyResponse = await axios.put(`https://eseniabila.com.ua/updateVarietyCount/${varietyId}`, {
              variety_quan: newVarietyQuan,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('Ответ сервера количество вариации:', varietyResponse.data);

            let productId = cartProduct.product.id;
            let newProductQuan = cartProduct.product.quan_item - cartProduct.countProduct;
            store.cartProducts.forEach((item)=>{
              item.product.quan_item = newProductQuan
              console.log('hello')
            })

            const varietyResponse2 = await axios.put(`https://eseniabila.com.ua/updateProductCount/${productId}`, {
              variety_quan: newProductQuan,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

          console.log('Ответ сервера количество вариации:', varietyResponse2.data);
            // Обновление количества продукта
            // await updateProductCount(cartProduct);
          } else if (cartProduct.selectedVariety === null) {
            // Обновление количества продукта
            let productId = cartProduct.product.id;
            let newProductQuan = cartProduct.product.quan_item - cartProduct.countProduct;
            store.cartProducts.forEach((item)=>{
              item.product.quan_item = newProductQuan
              console.log('hello')
            })

            const varietyResponse2 = await axios.put(`https://eseniabila.com.ua/updateProductCount/${productId}`, {
              variety_quan: newProductQuan,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log('Ответ сервера количество вариации:', varietyResponse2.data);
          } else {
            console.log('ты лох');
            return;
          }

          // Добавление товара в заказ
          const itemResponse = await axios.post('https://eseniabila.com.ua/addItemOrders', orderItem, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Ответ сервера:', itemResponse.data);
        }
         store.cartProducts = []
         sessionStorage.removeItem('cartProducts');
      } else {
        // Если какое-то поле не заполнено, добавляем класс error для подсветки
        if (telephone.value === '') {
          fnRedBorder('.inp-telephone');
        }
        if (firstname.value === '') {
          fnRedBorder('.inp-firstName');
        }
        if (lastName.value === '') {
          fnRedBorder('.inp-lastName');
        }
        if (surname.value === '') {
          fnRedBorder('.inp-surname');
        }
        if (store.selectPoshta.cities === '') {
          return;
        }
        if (store.selectPoshta.postIndex === '' || store.selectPoshta.searchQuery === '') {
          return;
        }
        console.log('Не все поля заполнены');
      }
    } else {
      console.log('Ошибка');
      fnRedBorder('.order-summary');
    }
  } catch (error) {
    console.error('Ошибка при выполнении заказа:', error);
    // Обработка ошибки
  }
}

const fnRedBorder = (item) => {
  const inp = document.querySelector(item)
  inp.style.border = "1px solid red";
  setTimeout(() => {
    inp.style.border = "1px solid gray";
  }, 2000)
}

onMounted(loadCartProducts, store.getOrders());
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Оформлення замовлення</h1>
    </div>
    <div class="body">
      <div class="contact-info">
        <h3 style="font-size: 22px">Ваші контактні дані</h3>
        <div class="input-group">
          <label>Мобільний телефон</label>
          <input class="inp-telephone" @input="validateTelephone" v-model="telephone" placeholder="0963567893"/>
        </div>
        <div class="input-group">
          <label>Призвище</label>
          <input class="inp-lastName" v-model="lastName" @input="validateText" placeholder="Прізвище"/>
        </div>
        <div class="input-group">
          <label>Ім'я</label>
          <input class="inp-firstName" v-model="firstname" @input="validateText" placeholder="Ім'я"/>
        </div>
        <div class="input-group">
          <label>По-батькові</label>
          <input class="inp-surname" v-model="surname" @input="validateText" placeholder="По-батькові"/>
        </div>
        <div class="input-group">
          <label>Коментерій(за бажанням)</label>
          <input v-model="comment" placeholder="Коментерій"/>
        </div>
      </div>
      <div class="delivery-info">
        <UiPoshta></UiPoshta>
      </div>

    </div>
    <div class="order-summary">
      <h2>Замовлення</h2>
      <button @click="console.log(store.cartProducts)">test</button>
      <div class="product-list">
        <div style="width: 100%; box-shadow: 2px 2px 5px gray" class="product-item" v-for="item in store.cartProducts"
             :key="item.id">
          <img style="border-radius: 5px" :src="item.images.img"/>
          <div class="product-details">
            <span style=" word-break: break-word; height: 58px;  overflow: hidden">{{ item.product.name_item }}</span>
            <span>Кількість: {{ item.countProduct }}</span>
            <span style="margin-top: 10px">Ціна {{ item.product.price_item * item.countProduct }} ₴</span>
          </div>
        </div>
      </div>
      <div class="edit-cart-button">
        <button @click="store.swapOpenCart()">Редагувати товари</button>
      </div>
    </div>
    <div class="order-total">
      <h2>Разом</h2>
      <h4>{{ store.cartProducts.length }} Товару на суму: {{ store.allPriceProducts }} ₴</h4>
      <h4>Вартість доставки згідно з тарифами перевізника</h4>
      <button @click="addOrders">Підтвердити замовлення</button>
    </div>
  </div>
</template>

<style scoped>
/* Общие стили */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  color: #333;
}

.error {
  border: 1px solid red;
}

/* Стили для заголовка */
.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 1.8em;
  margin: 0;
}

/* Стили для блоков контактной информации и доставки */
.body {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contact-info,
.delivery-info {
  flex: 1 1 50%;
}

.contact-info h3,
.delivery-info h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

/* Стили для полей ввода */
.input-group {
  margin-top: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 5px;
}

/* Стили для списка товаров */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.product-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.product-item img {
  width: 150px;
  height: 150px;
}

.product-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Стили для кнопки редактирования корзины */
.edit-cart-button {
  text-align: center;

  margin-top: 15px;
}

.edit-cart-button button {
  padding: 10px 20px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #fdd8b4;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-cart-button button:hover {
  background-color: #fdd8b4;
}

/* Стили для блока суммарной информации по заказу */
.order-summary {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  background-color: #f5f5f5;
  margin-top: 20px;
}

.order-summary h2 {
  margin-top: 0;
  font-size: 1.5em;
}

.order-summary h4 {
  margin-bottom: 10px;
}

.order-summary button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #fcc79f;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.order-summary button:hover {
  background-color: #f8a86d;
}

.order-total {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  background-color: #f5f5f5;
  margin-top: 20px;
  text-align: center;
}

.order-total h2 {
  margin-top: 0;
  font-size: 1.8em;
  color: #333;
}

.order-total h4 {
  margin-bottom: 15px;
  font-size: 1.1em;
  color: #777;
}

.order-total button {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  background-color: #fcc79f;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.1em;
  text-transform: uppercase;
}

.order-total button:hover {
  background-color: #f8a86d;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 960px) {
  .body {
    flex-direction: column;
  }

  .contact-info,
  .delivery-info {
    flex: 1 1 100%;
  }
}
</style>
