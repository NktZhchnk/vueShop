<script setup>
import {useMyStore} from "@/store/store.js";
import {ref, watch, onMounted, onUnmounted} from "vue";
import PriceRangeSlider from "@/components/PriceRangeSlider.vue";

const store = useMyStore()

const userLogin = ref(localStorage.getItem('userLogin'));

const swapMenu = () => {
  store.swapOpenMenu()
  if (userLogin.value === 'admin') {
    store.getOrders()
  }
}
const swapCart = () => {
  store.swapOpenCart()
}
// Добавим переменную для хранения запроса поиска


// Добавим переменную для хранения результатов поиска
let searchResults = ref([]);

// Добавим переменную для отображения/скрытия результатов
watch(
    () => store.searchQuery,
    (newSearchQuery, oldSearchQuery) => {
      // Обработка изменений searchQuery
      if (newSearchQuery === '') {
        store.showResults = false;
      }
    }
);

// Добавим метод для выполнения поиска
const sortByDateAndQuantity = (a, b) => {
  const dateA = new Date(a.date_item);
  const dateB = new Date(b.date_item);

  // Сначала сравниваем количество товара
  if (a.quan_item !== b.quan_item) {
    return b.quan_item - a.quan_item;
  }

  // Если количество товара одинаковое, сравниваем по дате
  return dateB - dateA;
};

const performSearch = () => {
  // Простой поиск по названию товара
  searchResults.value = store.products
      .filter((product) =>
          product.name_item.toLowerCase().includes(store.searchQuery.toLowerCase())
      )
      .sort(sortByDateAndQuantity);

  // Показать результаты только если есть совпадения
  store.showResults = searchResults.value.length > 0;
};

// Добавим метод для выбора результата поиска и перехода на страницу товара
const selectResult = () => {
  // Выполните необходимые действия при выборе результата, например, переход на страницу товара
  document.body.style.overflow = 'auto';
  store.checkCart = false;
  store.checkInput = false;
  store.isOpenShowPage = false;
  // Скрыть результаты после выбора
  store.showResults = false;
  // Очистить поле ввода
  store.searchQuery = "";
  location.reload()
};
const showPage = () => {
  if (store.isOpenShowPage === true) {
    if (store.checkInput === false) {
      store.checkCart = false
      store.isOpenMenu = false;
      store.checkInput = true
      document.body.style.overflow = 'hidden';
    }
  } else {
    if (store.checkInput === false) {
      store.checkCart = false
      store.checkInput = true
      store.isOpenMenu = false;
      document.body.style.overflow = 'hidden';
      store.isOpenShowPage = !store.isOpenShowPage
    }
  }
}

const showFilterMenu = ref(false);
const selectedSortOrder = ref(null);

const resetSort = () => {
  sessionStorage.removeItem('selectedSortOrder');
  sessionStorage.removeItem('minPrice');
  sessionStorage.removeItem('maxPrice');
  location.reload()
}
if (!selectedSortOrder.value) {
  selectedSortOrder.value = sessionStorage.getItem('selectedSortOrder') || null;
}

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value;
};
const handleClickOutside = (event) => {
  const filterMenu = document.querySelector('.filter-button');
  if (filterMenu && !filterMenu.contains(event.target)) {
    showFilterMenu.value = false;
  }
};
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
const sortByPrice = (order) => {
  selectedSortOrder.value = order;
  showFilterMenu.value = false;

  // Реализуйте свою логику сортировки в зависимости от выбранного порядка
  if (order === 'asc') {
    store.products.sort((a, b) => a.price_item - b.price_item);
    showFilterMenu.value = false;
  } else if (order === 'desc') {
    store.products.sort((a, b) => b.price_item - a.price_item);
  }

  // Сохраняем выбранный фильтр в состояние
  sessionStorage.setItem('selectedSortOrder', order);
};

const sortByDate = (order) => {
  selectedSortOrder.value = order;
  showFilterMenu.value = false;

  if (order === 'new') {
    store.products.sort((a, b) => new Date(b.date_item) - new Date(a.date_item));
  } else if (order === 'old') {
    store.products.sort((a, b) => new Date(a.date_item) - new Date(b.date_item));
  }

  // Сохраняем выбранный фильтр в состояние
  sessionStorage.setItem('selectedSortOrder', order);
};
</script>

<template>
  <div class="main-header">
    <div class="div-menu">
      <div class="div-menu-child" style="width: 50%" @click="swapMenu">
        <svg xmlns="http://www.w3.org/2000/svg" height="34" width="36" viewBox="0 0 448 512">
          <path fill="#ffffff"
                d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
        </svg>
      </div>
    </div>
    <div class="div-img">
      <router-link class="img-a" to="/">
        <img class="img-header" alt="error" src="../../images/header.jpg"/>
      </router-link>
    </div>

    <div class="div-text">
      <router-link to="/" class="custom-link"><h1>Esenia</h1></router-link>
    </div>
    <div class="div-catalog">
      <router-link to="/catalog" class="custom-link"><h1>Catalog</h1>
        <svg style="margin-left: 10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path fill="#ffffff"
                d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/>
        </svg>
      </router-link>
    </div>

    <div class="div-inp">
      <input @click="showPage" v-model="store.searchQuery" class="inp-search" style="height: 30px"
             placeholder="Я шукаю..."
             @input="performSearch"/>
      <!-- Отображение результатов поиска -->
      <div v-show="true" class="search-results" :class="{ active: store.showResults }">
        <div class="search-text-div" v-for="result in searchResults" :key="result.id" @click="selectResult(result)">
          <router-link v-if="result.quan_item > 0" class="search-text-link" :to="'/product/' + result.id">
            <div style="display: flex; margin-top: 10px">
              <div style="flex-shrink: 0; margin-right: 10px;">
                <img
                    style="width: 75px; height: 75px; border-radius: 3px;"
                    v-if="store.productImg.some(img => img.product_id === result.id)"
                    :src="store.productImg.find(img => img.product_id === result.id).img"
                    alt="Product Image"
                />
              </div>
              <div style="flex-grow: 1;">
                <p class="search-text">
                  {{ result.name_item }}
                </p>
              </div>
            </div>
          </router-link>
          <div v-else>
            <div style="display: flex; margin-top: 10px; cursor: not-allowed; background-color: rgba(0, 0, 0, 0.2);">
              <div style="flex-shrink: 0; margin-right: 10px;">
                <img
                    style="width: 75px; height: 75px; border-radius: 3px; position: relative;"
                    v-if="store.productImg.some(img => img.product_id === result.id)"
                    :src="store.productImg.find(img => img.product_id === result.id).img"
                    alt="Product Image"
                />
                <span style="position: absolute; background: red;  color: white; margin-left: 10px;font-size: 20px;">
            Товар закінчився
        </span>
              </div>
              <div style="flex-grow: 1;">
                <p class="search-text">
                  {{ result.name_item }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-left: 10px;"
         class="filter-button">
      <svg @click="toggleFilterMenu" xmlns="http://www.w3.org/2000/svg" height="30" width="32" viewBox="0 0 576 512"
           style="display: flex; position: relative; height: 100%;">
        <path fill="#ededed"
              d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
      </svg>
      <div v-if="showFilterMenu" class="filter-menu">
        <button @click="sortByPrice('asc')">Від дешевих ₴</button>
        <button @click="sortByPrice('desc')">Від дорогих ₴</button>
        <button @click="sortByDate('new')">Нові</button>
        <button @click="sortByDate('old')">Старі</button>
        <PriceRangeSlider></PriceRangeSlider>
        <button @click="resetSort" class="btn-reset-filter">скинути</button>
      </div>
    </div>

    <div class="main-cart" @click="swapCart">
      <svg xmlns="http://www.w3.org/2000/svg" height="30" width="32" viewBox="0 0 576 512">
        <path fill="#ffffff"
              d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
      </svg>
      <div v-if="store.cartProducts.length !== 0"
           class="cart-count">
        <h3 style="user-select: none">{{ store.cartProducts.length }}</h3>
      </div>
    </div>

  </div>

</template>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/roboto');

.cart-count {
  position: relative;
  padding: 5px;
  bottom: 10px;
  right: 10px;
  width: 14px;
  height: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #505050;
  background: rgba(37, 37, 37, 0.8);
  color: #ffffff;
}

.filter-button {
  -webkit-tap-highlight-color: transparent;
  tap-highlight-color: transparent;
  cursor: pointer; /* Добавлен указатель при наведении */
}

.filter-button svg {
  width: 32px;
  height: 30px;
  fill: #ffffff;
}

.filter-menu {
  position: absolute;
  right: 80px;
  min-width: 220px;
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 2px 3px 10px gray;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  z-index: 11;
}

.filter-menu button {
  color: white;
  background-color: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s; /* Плавные переходы цвета при наведении */
}

.filter-menu button:hover {
  background-color: #555;
  color: #fff; /* Белый цвет текста при наведении */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Тень для кнопки при наведении */
}



.btn-reset-filter {
  padding: 8px 16px; /* Увеличиваем отступы для более удобного восприятия */
  font-size: 16px;
  background: rgba(0, 0, 0, 0.5); /* Прозрачный черный цвет для фона */
  color: white; /* Цвет текста белый */
  border: 1px solid rgba(255, 255, 255, 0.5); /* Полупрозрачная белая рамка */
  border-radius: 5px; /* Закругляем углы */
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s; /* Плавный переход цвета при наведении */
}

.btn-reset-filter:hover {
  background: rgba(255, 255, 255, 0.3); /* Чуть более светлый фон при наведении */
  border-color: rgba(255, 255, 255, 0.7); /* Более яркая рамка при наведении */
}

.search-results {
  padding: 10px;
  position: absolute;
  top: calc(100% + 5px); /* Расположите блок ниже инпута с небольшим отступом */
  left: 0;
  width: 100%;
  background-color: white;
  max-height: 320px;
  overflow-y: auto;
  z-index: 10;
  display: none; /* Скрываем блок изначально */
  border-bottom: 1px solid gray;
  box-shadow: 2px 2px 3px gray;
}

.search-text-link {
  text-decoration: none;
  color: black;
}

.search-text {
  font-size: 24px;
}

.search-text-div:hover {
  border-radius: 10px;
  background: rgb(236, 236, 236);
}

.search-results.active {
  z-index: 999;
  display: block; /* Показываем блок при наличии активных результатов */
}

.img-a {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-header {
  width: 100%;
  height: 65px;
  background: #221f1f;
  display: flex;
  box-shadow: 2px 2px 5px black, 0 0 10px rgba(0, 0, 0, 0.5); /* Added shadow for volume from the bottom */
}

@media screen and (max-height: 700px) {
  .main-header {
    height: 65px;
  }

  .img-a {
    height: 100%;
  }
}

.custom-link {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  text-decoration: none; /* Убирает подчеркивание ссылки */
  color: white; /* Задайте цвет текста, который вы хотите использовать */
}

.custom-link:hover {
  color: #cccccc;
  transform: scale(1.1);
}

svg:hover {
  transform: scale(1.2);
}

.img-a:hover {
  transform: scale(1.1);
}

.img-header {
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-img {
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-menu {
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-menu-child {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-cart {
  height: 100%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-inp {
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.div-text {
  color: white;
  margin-left: 2%;
}

.div-catalog {
  color: white;
  margin-left: 5%;
}

h1 {
  margin-block-start: 0.50em;
  margin-block-end: 0.50em;
  font-family: 'Roboto Black', sans-serif;
}

.inp-search {
  border-radius: 7px;
  width: 100%;
  padding: 8px;
}

@media screen and (min-width: 650px) {


  .search-text {
    font-size: 24px;
  }
}

@media screen and (min-width: 900px) {

  .inp-search {
    width: 90%;
  }

  .div-inp {
    width: 70%;
  }

  .main-cart {
    width: 10%;
  }
}

@media screen and (max-width: 1200px) {
  .div-text {
    display: none;
  }


  .div-inp {
    margin-left: 30px;
  }
}

@media screen and (max-width: 700px) {
  .div-catalog {
    display: none;
  }


}

@media screen and (max-width: 500px) {
  .div-catalog {
    display: none;
  }

  .div-inp {
    margin: 0;
    margin-left: 10px;
  }

  .search-text {
    font-size: 14px;
  }
}


@media screen and (min-width: 1200px) {


  .div-inp {
    width: 80%;
  }

  .inp-search {
    width: 80%;
  }
}

@media screen and (min-width: 1600px) {

  .div-img {
    width: 5%;
  }

  .inp-search {
    width: 90%;
  }

}

</style>