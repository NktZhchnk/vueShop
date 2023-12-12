<script setup>

</script>

<template>
  <div class="main-header">
    <div class="div-menu">
      <svg xmlns="http://www.w3.org/2000/svg" height="30" width="32" viewBox="0 0 448 512">
        <path fill="#ffffff"
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
      </svg>
    </div>
    <div class="div-img">
      <img class="img-header" src="../../images/header.jpg"/>
    </div>
    <div class="div-inp">
      <input style="height: 30px" placeholder="Я шукаю..."/>
    </div>
    <div class="main-cart">
      <svg xmlns="http://www.w3.org/2000/svg" height="30" width="32" viewBox="0 0 576 512">
        <path fill="#ffffff"
              d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.main-header {
  width: 100%;
  height: 6.2%;
  background: #221f1f;;
  display: flex;
}

.img-header {
  border-radius: 50%;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.div-img{
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.div-menu{
  height: 100%;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-cart{
  height: 100%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.div-inp{
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>