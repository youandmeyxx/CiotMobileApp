<template>
  <div class="qr-code-container">
    <!-- 二维码显示区域 -->
    <div class="qr-code-wrapper">
      <qrcode-vue
        :value="shareUrl"
        :size="160"
        level="H"
        class="qr-code"
      />
    </div>

    <!-- 链接显示和复制区域 -->
    <div class="link-container">
      <van-text class="link-text" :ellipsis="true">{{ shareUrl }}</van-text>
      <van-button
        class="copy-button"
        type="primary"
        size="small"
        @click="copyToClipboard"
        :loading="copyLoading"
      >
        {{ copyLoading ? '复制中...' : '复制链接' }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { showToast } from 'vant';
import QrcodeVue from 'qrcode.vue';
import { useRoute } from 'vue-router';
import { DOMAIN_RUL, FULL_DOMAIN_RUL, globalPath } from '@/plugins/globalVariables';
import axios from 'axios';
const route = useRoute();
const contractPath = route.query.contractPath; // 
// 共享链接 (实际使用时可替换为动态链接)
const shareUrl = ref<string>('');
// 复制按钮加载状态
const copyLoading = ref<boolean>(false);

/**
 * 复制链接到剪贴板
 */
const copyToClipboard = async () => {
  try {
    copyLoading.value = true;
    // 使用浏览器剪贴板API复制文本
    await navigator.clipboard.writeText(shareUrl.value);
    showToast({
      message: '链接已复制',
      type: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('复制失败:', error);
    showToast({
      message: '复制失败，请手动复制',
      type: 'fail',
      duration: 2000
    });
  } finally {
    copyLoading.value = false;
  }
};


const initShareUrl = () => {
    //get请求读取 saleBillDetails 数据
    shareUrl.value = `${FULL_DOMAIN_RUL}${globalPath}#/contractwebsign?contractPath=${contractPath}`
};

onMounted(initShareUrl);



</script>

<style scoped>
.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.qr-code-wrapper {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.link-container {
  width: 100%;
  max-width: 320px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.link-text {
  flex: 1;
  font-size: 14px;
  color: #646566;
  word-break: break-all;
}

.copy-button {
  min-width: 100px;
}
</style>
