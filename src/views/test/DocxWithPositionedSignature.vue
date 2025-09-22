
<template>
  <div>
    <van-uploader
                v-model="contractUrl"
                :after-read="onVantFileChange"
                accept=".docx"
                :max-count="1"
                :preview-image="false"
    />
  </div>

  <div class="docx-preview-container">
    <!-- 缩放控制按钮 -->
    <div class="zoom-controls">
      <button @click="zoomOut">缩小</button>
      <span>{{ zoomLevel * 100 }}%</span>
      <button @click="zoomIn">放大</button>
      <button @click="resetZoom">重置</button>
    </div>

    <!-- 文档预览容器 -->
    <div :style="previewStyle" class="preview-wrapper">
      <VueOfficeDocx
        :src="docxSrc"
        :config="config"
        @rendered="onRendered"
      />
    </div>
  </div>
  
</template>
<script lang="ts" setup>
import VueOfficeDocx from "@vue-office/docx";
import "@vue-office/docx/lib/index.css";

import { ref,computed } from "vue";
const docxSrc = ref("");
const contractUrl = ref([]);

// 缩放级别状态
const zoomLevel = ref(1); // 默认100%
const minZoom = 0.5; // 最小50%
const maxZoom = 2; // 最大200%

const config = {
        zoom: 50, // 初始缩放级别，百分比形式
      };


// 计算缩放样式
const previewStyle = computed(() => ({
  // transform: `scale(0.7)`,
  transformOrigin: 'top center', // 以顶部中心为缩放原点
  transition: 'transform 0.3s ease', // 平滑过渡效果
  width: `100%`, // 调整容器宽度以避免横向滚动
  margin: '0 auto' // 居中显示
}));

// 缩放控制方法
const zoomIn = () => {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value += 0.1;
  }
};

const zoomOut = () => {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value -= 0.1;
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
};

// 文档渲染完成后可以进行额外调整
const onRendered = () => {
  console.log('文档渲染完成');
};

const onVantFileChange = async (fileObj: any) => {
  // vant4 uploader 的 fileObj 结构：{ file: File, ... }
  const file = fileObj.file;
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    docxSrc.value = arrayBuffer;
  }
};

</script>