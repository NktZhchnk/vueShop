<template>
  <div class="price-range-slider" style="margin-bottom: 10px">
    <div class="slider" ref="slider"></div>
    <div class="price-range">
      <span style="color: white">Від: {{ selectedMinPrice }}₴</span>
      <span style="margin-left: 10px;color: white">До: {{ selectedMaxPrice }}₴</span>
    </div>
  </div>
</template>

<script>
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { ref, onMounted, defineComponent, watch } from 'vue';
import { useMyStore } from "@/store/store.js";

export default defineComponent({
  name: 'PriceRangeSlider',
  props: {
    minPrice: {
      type: Number,
      default: 0,
    },
    maxPrice: {
      type: Number,
      default: 2000,
    },
  },
  setup(props) {
    const store = useMyStore(); // Получаем экземпляр хранилища из Pinia
    const slider = ref(null);
    const selectedMinPrice = ref(props.minPrice);
    const selectedMaxPrice = ref(props.maxPrice);// Отфильтрованный массив товаров

    const getFilteredProducts = () => {
      store.products = store.products.filter(product => {
        const price = product.price_item; // Предполагается, что в объекте продукта есть поле price_item
        return price >= selectedMinPrice.value && price <= selectedMaxPrice.value;
      });
    };

    onMounted(() => {
      const sliderElement = slider.value;
      noUiSlider.create(sliderElement, {
        start: [props.minPrice, props.maxPrice],
        connect: true,
        range: {
          min: props.minPrice,
          max: props.maxPrice,
        },
      });

      sliderElement.noUiSlider.on('update', (values) => {
        selectedMinPrice.value = parseFloat(values[0]);
        selectedMaxPrice.value = parseFloat(values[1]);
      });

      getFilteredProducts();
    });

    watch([selectedMinPrice, selectedMaxPrice], () => {
      getFilteredProducts();
    });

    return { slider, selectedMinPrice, selectedMaxPrice };
  },
});
</script>


<style scoped>
.price-range-slider {
  margin: 20px;
}

.slider {
  width: 100%; /* Ширина ползунков */
  height: 16px; /* Высота ползунков */
}

.price-range {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

/* Добавляем стили для ползунков */
.noUi-connect {
  background-color: #4CAF50; /* Цвет ползунков */
}

.noUi-horizontal .noUi-handle {
  width: 16px; /* Ширина ползунков */
  height: 16px; /* Высота ползунков */
  background-color: #4CAF50; /* Цвет ползунков */
  border: 1px solid #4CAF50; /* Обводка ползунков */
  cursor: pointer;
}
</style>
