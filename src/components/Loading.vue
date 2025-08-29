<template>
    <div class="title">
      <div class="war">
        <van-loading type="spinner" />
      </div>
    </div>
</template>
  
  <style lang="less" scoped>
  .title {
    transition: 0.4s;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    .war {
      width: 100px;
      height: 100px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  </style>
  