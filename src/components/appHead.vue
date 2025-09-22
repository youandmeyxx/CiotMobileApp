<template>
  <div style="margin: 0 auto">
  <van-nav-bar
    title="上海创临"
    class="custom-nav-bar"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
  <template #right>
    <van-icon name="search" size="18" />
  </template>
  </van-nav-bar>
  
  <img src="../assets/head.png" alt="Header Image" class="header-image" />
  </div>

</template>

<script setup lang="ts" name="AppHead">
import '@/style/headStyle.css';
import { showToast } from 'vant';
const onClickLeft = () => {
  // 返回按钮点击事件处理
  window.history.back();
};

const onClickRight = () => {
  // 搜索按钮点击事件处理
  showToast('搜索按钮点击');
};
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
