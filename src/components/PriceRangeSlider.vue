<template>
  <div class="price-range-slider" style="margin-bottom: 10px">
    <div class="slider" ref="slider"></div>
    <div class="price-range">
      <span style="color: white">От: {{ selectedMinPrice }}₴</span>
      <span style="margin-left: 10px;color: white">До: {{ selectedMaxPrice }}₴</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import {useMyStore} from "@/store/store.js";

const store = useMyStore()
const slider = ref(null);
const selectedMinPrice = ref(sessionStorage.getItem('minPrice') || 0);
const selectedMaxPrice = ref(sessionStorage.getItem('maxPrice') || 2000);

const getFilteredProducts = () => {
  store.products = store.products.filter(product => {
    const price = product.price_item; // Предполагается, что в объекте продукта есть поле price_item
    return price >= selectedMinPrice.value && price <= selectedMaxPrice.value;
  });
};
onMounted(() => {
  initializeSlider();
  getFilteredProducts();
});

onBeforeUnmount(() => {
  sessionStorage.setItem('minPrice', selectedMinPrice.value);
  sessionStorage.setItem('maxPrice', selectedMaxPrice.value);
});

watch([selectedMinPrice, selectedMaxPrice], () => {
  getFilteredProducts();
});

function initializeSlider() {
  const sliderElement = slider.value;
  if (!sliderElement) return;

  noUiSlider.create(sliderElement, {
    start: [selectedMinPrice.value, selectedMaxPrice.value],
    connect: true,
    range: {
      min: 0,
      max: 2000,
    },
  });

  sliderElement.noUiSlider.on('update', (values) => {
    const minPrice = parseFloat(values[0]);
    const maxPrice = parseFloat(values[1]);

    // Проверка на минимальное значение не меньше 500
    if (minPrice < selectedMinPrice.value) {
      sliderElement.noUiSlider.set([selectedMinPrice.value , maxPrice]);
      return;
    }
    if (maxPrice > selectedMaxPrice.value) {
      sliderElement.noUiSlider.set([minPrice , selectedMaxPrice.value]);
      return;
    }

    selectedMinPrice.value = minPrice;
    selectedMaxPrice.value = maxPrice;
  });
}

</script>



<style scoped>
.price-range-slider {
  margin: 20px;
}

.slider {
  width: 100%;
  height: 16px;
}

.price-range {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.noUi-connect {
  background-color: #f3f3f3;
}

.noUi-horizontal .noUi-handle {
  width: 16px;
  height: 16px;
  background-color: #ff0040;
  border: 1px solid #ff0042;
  cursor: pointer;
}
</style>
