<template>
  <div class="container">
    <label v-if="checkShow" class="label">Сколько вариантов вы хотите создать?</label>
    <input v-if="checkShow" class="inpCheck" type="number" v-model="numRadios" min="0">
    <button v-if="checkShow" type="button" @click="createRadios" class="btn">Создать варианты</button>
    <div v-if="radioOptions.length" class="options-container">
      <div v-for="(option, index) in radioOptions" :key="index" class="option">
        <input type="radio" :id="'radio-' + index" :value="option.label" v-model="selectedOption">
        <label :for="'radio-' + index" class="option-label">
          {{ option.label }} - <span style="color: #f83434">Цена</span>: {{ option.price }} |||| <span style="color: greenyellow">Количество</span>: {{ option.quantity }}
        </label>
        <div>
          <input type="text" v-model="option.label" placeholder="Введите название" class="input-field">
          <input type="number" v-model.number="option.price" min="0" placeholder="Введите цену" class="input-field">
          <input type="number" v-model.number="option.quantity" min="0" class="input-field">
        </div>
        <br>
      </div>
    </div>
    <p>Выбран вариант: {{ selectedOption }}</p>
  </div>
</template>

<script>
import {ref} from 'vue';
import {useMyStore} from "@/store/store.js";

export default {
  setup() {
    const store = useMyStore();
    const numRadios = ref(0);
    const radioOptions = store.radioOptions;
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
      } else {
        const inpCheck = document.querySelector('.inpCheck');
        inpCheck.style.border = "3px solid red";
        setTimeout(() => {
          inpCheck.style.border = "1px solid gray";
        }, 2000);
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
.container {
  padding: 20px;
  background-color: #333;
  color: #fff;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px auto;
}

.label {
  display: block;
  margin-bottom: 10px;
}

.inpCheck {
  padding: 10px;
  border: 2px solid #555;
  border-radius: 4px;
  margin-bottom: 15px;
  width: 93%;
}

.btn {
  padding: 12px;
  background-color: #1b4c85;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  background-color: #0056b3;
}

.options-container {
  margin-top: 20px;
}

.option {
  margin-bottom: 15px;
}

.input-field {
  padding: 10px;
  margin-right: 10px;
  border: 2px solid #555;
  border-radius: 4px;
  width: calc(33.33% - 10px);
  box-sizing: border-box;
}

</style>
