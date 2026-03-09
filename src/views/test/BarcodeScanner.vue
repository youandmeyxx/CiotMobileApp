<template>
  <div class="barcode-scanner">
    <h2>条码扫描</h2>
    
    <!-- 扫描区域 -->
    <div class="scanner-container">
      <video ref="videoElement" class="scanner-video"></video>
      <div class="scanner-overlay">
        <div class="scanner-frame"></div>
        <div class="scanner-line"></div>
      </div>
    </div>
    
    <!-- 控制按钮 -->
    <div class="controls">
      <van-button 
        type="primary" 
        @click="startScan" 
        :disabled="isScanning"
      >
        开始扫描
      </van-button>
      <van-button 
        type="default" 
        @click="stopScan" 
        :disabled="!isScanning"
      >
        停止扫描
      </van-button>
    </div>
    
    <!-- 扫描结果 -->
    <div v-if="scanResult" class="result">
      <h3>扫描结果</h3>
      <p>{{ scanResult }}</p>
      <van-button type="primary" @click="copyResult">复制结果</van-button>
    </div>
    
    <!-- 错误提示 -->
    <van-toast 
      v-model:show="showError" 
      type="fail" 
      :message="errorMessage"
      :duration="3000"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Toast } from 'vant';

// 视频元素引用
const videoElement = ref<HTMLVideoElement | null>(null);
// 扫描状态
const isScanning = ref(false);
// 扫描结果
const scanResult = ref<string>('');
// 错误信息
const showError = ref(false);
const errorMessage = ref('');

// 扫码器实例
let codeReader: BrowserQRCodeReader | null = null;
// 扫描定时器
let scanTimer: number | null = null;

// 初始化扫码器
const initScanner = () => {
  codeReader = new BrowserQRCodeReader();
};

// 开始扫描
const startScan = async () => {
  if (!videoElement.value) {
    showError.value = true;
    errorMessage.value = '视频元素未找到';
    return;
  }

  try {
    // 请求摄像头权限
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment' // 使用后置摄像头
      }
    });

    // 设置视频源
    videoElement.value.srcObject = stream;
    await videoElement.value.play();

    isScanning.value = true;
    scanResult.value = '';

    // 开始连续扫描
    startContinuousScan();
  } catch (error) {
    showError.value = true;
    errorMessage.value = '无法访问摄像头，请检查权限设置';
    console.error('摄像头访问错误:', error);
  }
};

// 连续扫描
const startContinuousScan = () => {
  if (!codeReader || !videoElement.value) return;

  const scan = async () => {
    if (!isScanning.value) return;

    try {
      const result = await codeReader!.decodeFromVideoElement(videoElement.value!, (text, error) => {
        if (text) {
          scanResult.value = text.getText();
          stopScan();
          Toast.success('扫描成功');
        }
        if (error && isScanning.value) {
          scanTimer = window.setTimeout(scan, 100);
        }
      });
      scanResult.value = typeof result === 'string' ? result : (result as any)?.getText?.() ?? '';
      stopScan();
      Toast.success('扫描成功');
    } catch (error) {
      // 扫描失败时继续扫描，不显示错误
      if (isScanning.value) {
        scanTimer = window.setTimeout(scan, 100);
      }
    }
  };

  scan();
};

// 停止扫描
const stopScan = () => {
  isScanning.value = false;
  
  // 清除扫描定时器
  if (scanTimer) {
    clearTimeout(scanTimer);
    scanTimer = null;
  }
  
  // 停止视频流
  if (videoElement.value && videoElement.value.srcObject) {
    const stream = videoElement.value.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    videoElement.value.srcObject = null;
  }
};

// 复制结果
const copyResult = async () => {
  if (scanResult.value) {
    try {
      await navigator.clipboard.writeText(scanResult.value);
      Toast.success('复制成功');
    } catch (error) {
      showError.value = true;
      errorMessage.value = '复制失败';
      console.error('复制错误:', error);
    }
  }
};

// 组件挂载时初始化
onMounted(() => {
  initScanner();
});

// 组件卸载时清理
onUnmounted(() => {
  stopScan();
});
</script>

<style scoped>
.barcode-scanner {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.scanner-container {
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0) 20%,
    rgba(0, 0, 0, 0) 80%,
    rgba(0, 0, 0, 0.5) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-frame {
  width: 80%;
  height: 80%;
  border: 2px solid #4CAF50;
  border-radius: 10px;
  position: relative;
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #4CAF50;
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.result {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.result h3 {
  margin-bottom: 10px;
  color: #333;
}

.result p {
  font-size: 18px;
  margin-bottom: 20px;
  word-break: break-all;
}
</style>