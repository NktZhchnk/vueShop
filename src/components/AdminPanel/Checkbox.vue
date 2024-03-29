<template>
  <div class="container">
    <label v-if="checkShow" class="label">Скільки варіантів ви хочете створити?</label>
    <input v-if="checkShow" class="inpCheck" type="number" v-model="numRadios" min="0">
    <button v-if="checkShow" type="button" @click="createRadios" class="btn">Створити варіанти</button>
    <div v-if="radioOptions.length" class="options-container">
      <div v-for="(option, index) in radioOptions" :key="index" class="option">
        <input v-show="false" type="radio" :id="'radio-' + index" :value="option.label" v-model="selectedOption">
        <label style="margin-bottom: 5px" :for="'radio-' + index" class="option-label">
          <div class="div-label">{{ option.label }}</div>
          <div class="div-label"><span style="color: #281010;">Ціна</span>: {{ option.price }} ₴</div>
          <div><span style="color: #383807;">Кількість</span>: {{ option.quantity }}</div>
        </label>
        <div>
          <input type="text" v-model="option.label" placeholder="Введіть назву" class="input-field" @input="handleLabelChange(index, $event.target.value)">
          <input type="number" v-model.number="option.price" min="0" placeholder="Введіть ціну" class="input-field" @input="handlePriceChange(index, $event.target.value)">
          <input type="number" v-model.number="option.quantity" min="0" class="input-field" @input="handleQuantityChange(index, $event.target.value)">
        </div>
        <br>
      </div>
    </div>
    <p v-show="false">Выбран вариант: {{ selectedOption }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useMyStore } from "@/store/store.js";

export default {
  setup() {
    const store = useMyStore();
    const numRadios = ref(0);
    const radioOptions = ref([]);
    const selectedOption = ref('');
    const checkShow = ref(true);

    const createRadios = () => {
      if (numRadios.value >= 1) {
        checkShow.value = false;
        for (let i = 0; i < numRadios.value; i++) {
          const optionLabel = '';
          const optionPrice = 0;
          const optionQuantity = 0;

          // Добавление варианта в хранилище
          store.radioName.push(optionLabel);
          store.radioPrice.push(optionPrice);
          store.radioQuan.push(optionQuantity);

          // Добавление варианта в radioOptions
          radioOptions.value.push({
            label: optionLabel,
            price: optionPrice,
            quantity: optionQuantity,
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

    // Обработчик изменения названия варианта
    const handleLabelChange = (index, value) => {
      store.radioName[index] = value;
    };

    // Обработчик изменения цены варианта
    const handlePriceChange = (index, value) => {
      store.radioPrice[index] = value;
    };

    // Обработчик изменения количества варианта
    const handleQuantityChange = (index, value) => {
      store.radioQuan[index] = value;
    };

    return {
      numRadios,
      radioOptions,
      selectedOption,
      createRadios,
      checkShow,
      handleLabelChange,
      handlePriceChange,
      handleQuantityChange,
    };
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #ececec;
  color: #000000;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); /* более красивая тень */
}

.div-label{
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  background-color: #313131;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.btn:hover {
  background-color: #232323;
}

.options-container {
  margin-top: 20px;
}

.option {
  margin-bottom: 15px;
}
.option-label{
  display: flex;
}
.input-field {
  padding: 10px;
  margin-right: 10px;
  border: 2px solid #d2d2d2;
  border-radius: 4px;
  width: calc(33.33% - 10px);
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s; /* добавляем плавный переход */
}

/* добавляем стиль при фокусировке */
.input-field:focus {
  border-color: #494949; /* изменяем цвет рамки */
  box-shadow: 0 0 0 2px rgba(38, 38, 38, 0.25); /* добавляем мягкую тень */
}

</style>
