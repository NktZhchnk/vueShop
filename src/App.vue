<script setup>
import AdminMenu from "@/components/AdminMenu.vue";
import UiNovaPoshta from "@/components/UiNovaPoshta.vue";
import UiCartItems from "@/components/UiCartItems.vue";

const showCart = false;
</script>

<template>
  <ui-nova-poshta></ui-nova-poshta>
  <AdminMenu></AdminMenu>
  <UiCartItems class="cart"></UiCartItems>
</template>

<style scoped>
.cart{
  position: fixed;
  left: 85%;
  bottom: 2%;
}
</style>

