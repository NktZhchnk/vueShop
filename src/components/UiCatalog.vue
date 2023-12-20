<script setup>

</script>

<template>
  <div class="main-div">
    <div><img src="../../images/box200.jpg"></div>
    <div><img src="../../images/box400.jpg"></div>
    <div><img src="../../images/box600.jpg"></div>
    <div><img src="../../images/box1000.jpg"></div>
    <div><img src="../../images/cosmeticAccessories.jpg"></div>
    <div><img src="../../images/decorativeCosmetic.jpg"></div>
    <div><img src="../../images/carecosmetic.jpg"></div>
    <div><img src="../../images/cosmetic.jpg"></div>
    <div><img src="../../images/firm.jpg"></div>
    <div><img src="../../images/shadow.jpg"></div>
    <div><img src="../../images/hair.jpg"></div>
  </div>
</template>

<style scoped>
/* Адаптивность для мобильных устройств */

/* Общие стили для каталога изображений */
.main-div {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

/* Стили для изображений */
img {
  width: 200px;
  height: auto;
  max-width: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
  box-shadow: 2px 2px 5px gray;
}

img:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .main-div {
    padding: 10px;
    width: 100%;
    flex-direction: row;
  }
  div{
    width: calc(50% - 20px);
    margin-bottom: 0px;
  }
  img {
    width: calc(100% - 20px);
    margin-bottom: 0px;
  }
}
</style>