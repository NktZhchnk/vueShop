<script setup>
  import {useMyStore} from "@/store/store.js";

  const store = useMyStore()
  console.log('s', store.productById)
</script>

<template>
  <div v-for="item in store.productById" :key="item">
    <h1>{{item.name_item}}</h1>
    <h2>{{item.text_info}}</h2>
  </div>
</template>

<style scoped>

</style>