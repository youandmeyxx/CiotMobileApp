<template>
  <div class="electronic-signature">
    <!-- 签名画布区域 -->
    <div class="signature-container">
      <canvas ref="canvasRef" class="signature-canvas" 
              :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
    </div>
    
    <!-- 操作按钮 -->
    <div class="signature-actions">
      <el-button size="small" type="primary" @click="saveSignature" 
                 :disabled="!state.hasSignature">保存签名</el-button>
      <el-button size="small" type="danger" @click="clearSignature" 
                 :disabled="!state.hasSignature">清除签名</el-button>
    </div>
    
    <!-- 保存成功提示 -->
    <div v-if="state.showSuccessMessage" class="success-message">
      <i class="el-icon-check"></i> 签名已保存
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, defineProps, defineEmits, onBeforeUnmount } from 'vue';

const props = defineProps<{
  value: string
  width?: number
  height?: number
}>();

const emit = defineEmits<{
  (e: 'input', value: string): void
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const state = reactive({
  isDrawing: false,
  lastX: 0,
  lastY: 0,
  hasSignature: false,
  showSuccessMessage: false,
});

const canvasWidth = props.width ?? 400;
const canvasHeight = props.height ?? 150;

// 初始化画布
function initCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx.value = canvas.getContext('2d');
  if (!ctx.value) return;

  // 设置画布分辨率以适配高DPI屏幕
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  ctx.value.scale(ratio, ratio);

  // 设置画布样式
  ctx.value.lineJoin = 'round';
  ctx.value.lineCap = 'round';
  ctx.value.lineWidth = 2;
  ctx.value.strokeStyle = '#333';

  // 绑定事件
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // 触摸设备支持
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);

  // 阻止触摸事件冒泡
  canvas.addEventListener('touchmove', (e: TouchEvent) => {
    e.preventDefault();
  }, { passive: false });
}

function cleanupCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.removeEventListener('mousedown', startDrawing);
  canvas.removeEventListener('mousemove', draw);
  canvas.removeEventListener('mouseup', stopDrawing);
  canvas.removeEventListener('mouseout', stopDrawing);
  canvas.removeEventListener('touchstart', startDrawing);
  canvas.removeEventListener('touchmove', draw);
  canvas.removeEventListener('touchend', stopDrawing);
}

// 开始绘制
function startDrawing(e: MouseEvent | TouchEvent) {
  state.isDrawing = true;
  const coords = getCoordinates(e);
  state.lastX = coords.x;
  state.lastY = coords.y;
}

// 绘制过程
function draw(e: MouseEvent | TouchEvent) {
  if (!state.isDrawing) return;
  if (!ctx.value) return;

  const coords = getCoordinates(e);
  const x = coords.x;
  const y = coords.y;

  ctx.value.beginPath();
  ctx.value.moveTo(state.lastX, state.lastY);
  ctx.value.lineTo(x, y);
  ctx.value.stroke();

  state.lastX = x;
  state.lastY = y;
  state.hasSignature = true;
}

// 停止绘制
function stopDrawing() {
  state.isDrawing = false;
}

// 清除签名
function clearSignature() {
  if (!ctx.value) return;
  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);
  state.hasSignature = false;
  emit('input', '');
}

// 保存签名
function saveSignature() {
  if (!state.hasSignature) return;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const dataUrl = canvas.toDataURL('image/png');
  emit('input', dataUrl);

  // 显示成功提示
  state.showSuccessMessage = true;
  setTimeout(() => {
    state.showSuccessMessage = false;
  }, 2000);
}

// 加载已有签名
function loadSignature() {
  if (!ctx.value) return;
  if (props.value) {
    const img = new window.Image();
    img.onload = () => {
      ctx.value?.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.value?.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      state.hasSignature = true;
    };
    img.src = props.value;
  } else {
    ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);
    state.hasSignature = false;
  }
}

// 获取坐标（支持鼠标和触摸）
function getCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();

  if ('type' in event && event.type.includes('mouse')) {
    const mouseEvent = event as MouseEvent;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  } else if ('type' in event && event.type.includes('touch')) {
    const touchEvent = event as TouchEvent;
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }
  return { x: 0, y: 0 };
}

onMounted(() => {
  initCanvas();
  loadSignature();
});

onBeforeUnmount(() => {
  cleanupCanvas();
});

watch(() => props.value, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    loadSignature();
  }
});
</script>

<style scoped>
.electronic-signature {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.signature-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}

.signature-canvas {
  cursor: crosshair;
  width: 100%;
  height: 150px;
}

.signature-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.success-message {
  color: #67c23a;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 12px;
}
</style>  
