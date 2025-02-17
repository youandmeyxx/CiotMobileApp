
<template>
  <header><div><AppHead/></div></header>
  <body><AppBody/></body>
  <footer><AppFoot/></footer>
</template>
<script setup lang="ts">
  import AppHead from '@/components/appHead.vue';
  import AppFoot from '@/components/appFoot.vue';
  import AppBody from './components/appBody.vue';
</script>
<style scoped>

</style>
