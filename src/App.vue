
<template>
  <header><div><AppHead/></div></header>
  <RouterView />
  <footer><AppFoot/></footer>
</template>
<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import AppHead from '@/components/appHead.vue';
  import AppFoot from '@/components/appFoot.vue';
</script>
<style scoped>

</style>
