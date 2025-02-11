<template>
  <div class="header">
    <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      class=""
    >
      <template #right>
        <van-icon name="search" size="18" @click="onClickRight" />
      </template>
    </van-nav-bar>
    <img src="../assets/head.png" alt="Header Image" class="header-image" />
  </div>
</template>

<script setup lang="ts" name="AppHead">
import { NavBar, Icon, showToast } from 'vant';

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
.header {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}

.van-nav-bar{
  background-color: #4296ED;
}
.van-nav-bar .van-nav-bar_title{
  color: #fff;
}

.header-background {
  width: 375px;
  height: 180px;
  background-color: #4296ED;
}

.header-image {
  width: 100%;
  height: auto;
}
</style>