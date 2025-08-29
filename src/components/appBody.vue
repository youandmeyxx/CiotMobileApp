<template>
  <div>
    <RouterView/>
  </div>
</template>
<script setup lang="ts" home="AppBody">
  import { onMounted, ref } from 'vue';
  import { RouterView } from 'vue-router';
    // 定义一个响应式变量来存储是否为移动设备的状态
  const isMobile = ref(false);

  onMounted(() => {
  // 获取用户代理字符串
  const userAgent = navigator.userAgent;
  // 定义常见移动设备的正则表达式
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  // 判断用户代理是否匹配移动设备的正则表达式
  isMobile.value = mobileRegex.test(userAgent);
  console.log('isMobile:', isMobile.value);
  });
</script>
<style scoped>
  /* 电脑页面适配样式 */
  @media (min-width: 768px) {
    .desktop-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      font-size: 32px;
    }
    p {
      font-size: 18px;
    }
  }
</style>