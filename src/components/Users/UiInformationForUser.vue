<script setup>

</script>

<script setup>

</script>

<template>
  <div class="contact-container">
    <div class="info-block working-hours">
      <h2>Графік роботи</h2>
      <p>ПН-ПТ: 9:00-18:00</p>
      <p>СБ: 12:00-18:00</p>
      <p>НД: Вихідний</p>
    </div>

    <div class="info-block order-shipping">
      <h2>Відправка замовлень</h2>
      <p><strong>Нова пошта:</strong></p>
      <p>ПН-ПТ: 12:00 та 18:00</p>
      <p>СБ: 15:00</p>
      <p>НД: 12:00</p>
      <p><strong>Укрпошта:</strong></p>
      <p>ПН-СБ: 12:00</p>
    </div>

    <div class="info-block payment-delivery">
      <h2>Оплата та Доставка</h2>
      <p><strong>Доставка:</strong> 📦 Нова пошта та Укрпошта</p>
      <p><strong>Оплата:</strong></p>
      <ul>
        <li>- За повною передоплатою (100%)</li>
        <li>- Післяплата, без передоплати (оплата при отриманні)</li>
      </ul>
      <p><strong>❗ Тільки для замовлень від 200 грн, замовлення до 200 тільки за повною передоплатою ❗</strong></p>
    </div>

    <div class="info-block contact-info">
      <h2>Телефон для зв'язку</h2>
      <p>Вайбер/телеграм: 0933707109</p>
    </div>
  </div>
</template>

<style scoped>
.contact-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
  padding: 20px;
}

.info-block {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.info-block:hover {
  transform: translateY(-5px);
}

h2 {
  color: #333;
  font-size: 1.9em;
  margin-bottom: 10px;
}

p {
  color: #555;
  margin-bottom: 10px;
  line-height: 1.4;
}

ul {
  list-style: none;
  padding: 0;
  margin-bottom: 10px;
}

li {
  margin-bottom: 5px;
}

@media screen and (max-width: 600px) {
  .contact-container {
    flex-direction: column;
    align-items: center;
  }
  .info-block{
    width: 300px;
  }
}
@media screen and (max-width: 350px) {
  .info-block{
    width: 220px;
  }
}
</style>

