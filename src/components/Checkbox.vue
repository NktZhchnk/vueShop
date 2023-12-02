<template>
  <div>
    <label>Сколько радиокнопок вы хотите создать?</label>
    <input type="number" v-model="numRadios" min="0">
    <button type="button" @click="createRadios">Создать радиокнопки</button>
    <div v-if="radioOptions.length" class="options-container">
      <div v-for="(option, index) in radioOptions" :key="index" class="option">
        <input type="radio" :id="'radio-' + index" :value="option.label" v-model="selectedOption">
        <label :for="'radio-' + index" class="option-label">
          {{ option.label }} - Цена: {{ option.price }} - Количество: {{ option.quantity }}
        </label>
        <input type="text" v-model="option.label" placeholder="Введите название" class="input-field">
        <input type="number" v-model.number="option.price" min="0" placeholder="Введите цену" class="input-field">
        <input type="number" v-model.number="option.quantity" min="0" class="input-field">
        <br>
      </div>
    </div>

    <p>Выбранная опция: {{ selectedOption }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useMyStore } from "@/store/store.js";

export default {
  setup() {
    const store = useMyStore();
    const numRadios = ref(0);
    const radioOptions = store.radioOptions; // Используем ref для отслеживания изменений
    const selectedOption = ref('');

    const createRadios = () => {
      radioOptions.value = []; // Очищаем предыдущие радиокнопки

      for (let i = 0; i < numRadios.value; i++) {
        let optionLabel = '';
        let optionPrice = 0;

        // Обновленный способ ввода названия и цены через prompt
        optionLabel = prompt(`Введите название для радиокнопки ${i + 1}:`) || `Option ${i + 1}`;
        optionPrice = parseFloat(prompt(`Введите цену для радиокнопки ${optionLabel}:`)) || 0;

        radioOptions.push({
          label: optionLabel,
          price: optionPrice,
          quantity: 0,
        });
      }
    };

    return {
      numRadios,
      radioOptions,
      selectedOption,
      createRadios,
    };
  },
};
</script>

<style scoped>
/* Стили для улучшения внешнего вида */

.options-container {
  margin-top: 20px;
}

.option {
  margin-bottom: 10px;
}

.option-label {
  font-weight: bold;
}

.input-field {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>