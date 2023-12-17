<template>
  <div>
    <label v-if="checkShow">Сколько разновидностей вы хотите создать?</label>
    <input v-if="checkShow" class="inpCheck" type="number" v-model="numRadios" min="0">
    <button v-if="checkShow" type="button" @click="createRadios">Создать разновидности</button>
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
import {ref} from 'vue';
import {useMyStore} from "@/store/store.js";

export default {
  setup() {
    const store = useMyStore();
    const numRadios = ref(0);
    const radioOptions = store.radioOptions; // Используем ref для отслеживания изменений
    const selectedOption = ref('');

    let checkShow = ref(true);

    const createRadios = () => {
      if (numRadios.value >= 1) {
        checkShow.value = false;
        for (let i = 0; i < numRadios.value; i++) {
          let optionLabel = '';
          let optionPrice = 0;

          // Обновленный способ ввода названия и цены через prompt

          radioOptions.push({
            label: optionLabel,
            price: optionPrice,
            quantity: 0,
          });
        }
      }else{
        const inpCheck = document.querySelector('.inpCheck')
        inpCheck.style.border = "3px solid red"
        setTimeout(()=>{
          inpCheck.style.border = "1px solid gray"
        },2000)
      }
    };

    return {
      numRadios,
      radioOptions,
      selectedOption,
      createRadios,
      checkShow,
    };
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 5px;
}

.inpCheck {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  margin-bottom: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.options-container {
  margin-top: 20px;
}

.option {
  margin-bottom: 10px;
}

.input-field {
  padding: 5px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
