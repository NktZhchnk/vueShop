<script>
import {ref} from 'vue';
import {useMyStore} from "@/store/store.js";

export default {
  setup() {
    const store = useMyStore()
    const numRadios = ref(0);
    const radioOptions = store.radioOptions
    const selectedOption = ref('');

    const createRadios = () => {
      radioOptions.value = []; // Очищаем предыдущие радиокнопки

      for (let i = 0; i < numRadios.value; i++) {
        let optionLabel = prompt(`Введите название для радиокнопки ${i + 1}:`);
        radioOptions.push(optionLabel || `Option ${i + 1}`);
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
    <input type="number" v-model="numRadios" min="1">
    <button type="button" @click="createRadios">Создать радиокнопки</button>
    <div v-if="radioOptions.length">
      <div v-for="(option, index) in radioOptions" :key="index">
        <input type="radio" :id="'radio-' + index" :value="option" v-model="selectedOption">
        <label :for="'radio-' + index">{{ option }}</label>
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
