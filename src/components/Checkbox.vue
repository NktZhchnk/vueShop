<script>
import { ref } from 'vue';
import { useMyStore } from "@/store/store.js";

export default {
  setup() {
    const store = useMyStore();
    const numRadios = ref(0);
    const radioOptions = store.radioOptions // Используем ref для отслеживания изменений
    const selectedOption = ref('');

    const createRadios = () => {
      radioOptions.value = []; // Очищаем предыдущие радиокнопки

      for (let i = 0; i < numRadios.value; i++) {
        let optionLabel = prompt(`Введите название для радиокнопки ${i + 1}:`);
        let optionPrice = prompt(`Введите цену для радиокнопки ${optionLabel}:`);
        radioOptions.push({ label: optionLabel || `Option ${i + 1}`, price: optionPrice || 0, quantity: 0 });
      }
    };

    return {
      numRadios,
      radioOptions,
      selectedOption,
      createRadios,
    };

  }
};
</script>

<template>
  <div>
    <label>Сколько радиокнопок вы хотите создать?</label>
    <input type="number" v-model="numRadios" min="0">
    <button type="button" @click="createRadios">Создать радиокнопки</button>
    <div v-if="radioOptions.length">
      <div v-for="(option, index) in radioOptions" :key="index">
        <input type="radio" :id="'radio-' + index" :value="option.label" v-model="selectedOption">
        <label :for="'radio-' + index">
          {{ option.label }} - Цена: {{ option.price }} - Количество: {{ option.quantity }}
        </label>
        <input type="number" v-model="option.quantity" min="0">
        <br>
      </div>
    </div>

    <p>Выбранная опция: {{ selectedOption }}</p>
  </div>
</template>

<style scoped>
/* Стили для улучшения внешнего вида */

label {
  margin-right: 10px;
}
</style>
