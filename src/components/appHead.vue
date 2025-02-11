<template>
  <van-nav-bar
    title="标题"
    class="custom-nav-bar"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  >
  <template #right>
    <van-icon name="search" size="18" />
  </template>
  </van-nav-bar>
  <img src="../assets/head.png" alt="Header Image" class="header-image" />
</template>

<script setup lang="ts" name="AppHead">
import '@/style/head.css';
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
</style>
