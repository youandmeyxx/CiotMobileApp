<template>

      <!-- 签名区域 -->
    <van-image v-if="image" :src="image" />

  <div class="docx-container">
    <!-- 下载按钮 -->
    <van-button 
      type="primary"
      round
      class="download-btn"
      @click="downloadAndPreviewDocx"
      :loading="isLoading"
    >
      下载合同签名并预览
    </van-button>

    <div style="width: 100%;">
      <!--调用插件-->
      <Vue3Esign ref="vueEsignRef" 
        :height="clientHeight" 
        :width="clientWidth" 
        :bgColor="vueEsignBgColor" 
        :is-clear-bg-color="false"
        :is-crop="isCrop" 
        :line-width="lineWidth" 
        :line-color="lineColor" />
    </div>
    <div>
      <van-button @click="clearCanves" type="default" size="small">清除</van-button>
      <van-button  @click="saveCanves"  type="primary" size="small" style="margin-left:70px">提交</van-button>
    </div>

    <!-- 预览区域 -->
    <div class="preview-title" v-if="isPreviewVisible">
      <van-cell title="合同预览" />
    </div>
    <div ref="previewContainer"></div>

    <!-- 错误提示 -->
    <van-toast id="van-toast" />
  </div>
</template>

<script setup lang="ts">
//******* */
import { ref } from 'vue';
import { Button, Cell, showToast, Toast,Signature  } from 'vant';
import { renderAsync } from 'docx-preview';
import axios from 'axios';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { useRoute } from 'vue-router';
import { Vue3Esign } from 'vue3-esign'
import {Document,Packer,Paragraph,ImageRun,TextRun,Table,TableRow,TableCell,AlignmentType,WidthType,TextDirection} from 'docx';

//****************************************************************
const route = useRoute();
const contractPath = route.query.contractPath
const isLoading = ref(false);
const isPreviewVisible = ref(false);
const previewContainer = ref<HTMLDivElement | null>(null);
const arrayBuffer = ref<ArrayBuffer | null>(null);
const vueEsignRef = ref<any>(null)
const vueEsignBgColor = ref<string>('#f7f7f7')
const lineWidth = ref(6)
const lineColor = ref('#000000')
const isCrop = ref(false)
const img = ref('')
const image = ref('');
const clientWidth = ref(400)
const clientHeight = ref(250)
//****************************************************************


/**
 * 从服务器下载docx文档并预览
 * 假设服务器接口为 /downloadDocx，需要传入文档ID等参数
 */
const downloadAndPreviewDocx = async () => {
  isLoading.value = true;
  isPreviewVisible.value = false;
  let docxUrl = `${DOMAIN_RUL}/contract/${contractPath}`;
  console.log('docxUrl:',docxUrl);
  try {
    // 1. 从服务器下载docx文件（这里需要根据实际情况修改参数）
    const response = await axios.get(docxUrl, {
      responseType: 'blob',
      headers: {
        // 若后端需要特定请求头（如 Authorization），可在此添加
        'Content-Type': 'application/octet-stream'
      }
    });
    // 2. 验证文件类型
    const contentType = response.headers['content-type'];
    console.log('contentType:',contentType);
    if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      throw new Error('下载的文件不是docx格式');
    }
    // 3. 将blob转换为arrayBuffer
    arrayBuffer.value = await response.data.arrayBuffer();
    previewDocx(arrayBuffer.value as ArrayBuffer);

  } catch (error) {
    console.error('下载或预览失败:', error);
    Toast.fail({
      message: error instanceof Error ? error.message : '下载或预览文档失败',
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

/**
 * 预览docx文档
 * @param arrayBuffer 
 */
const previewDocx = async (arrayBuffer: ArrayBuffer) => {

  if (!arrayBuffer) {
    Toast.fail('请先下载文档');
    return;
  }
  if (previewContainer.value) {
    previewContainer.value.innerHTML = '';
    isPreviewVisible.value = true;
    await renderAsync(arrayBuffer, previewContainer.value);
  }
};

const getSignPic = async () => {

};

// 清空
function clearCanves(): void {
  vueEsignRef.value?.reset()
}

// 保存
const saveCanves = async () => {
  try {
    const base64Data = await vueEsignRef.value.generate()
    console.log('res', base64Data)
    img.value = base64Data
    // 创建ImageRun实例
    const imageRun = new ImageRun({
      data: img.value,
      type: 'png',
      transformation: {
        width: 200,  // 图片宽度（像素）
        height: 100, // 图片高度（像素）
      },
    });
    
    // 创建文档
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: '基础图片插入示例', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [imageRun],  // 将ImageRun添加到段落中
            alignment: AlignmentType.CENTER
          })
        ]
      }]
    });


    const docblob = await Packer.toBlob(doc);
    arrayBuffer.value = await docblob.arrayBuffer();
    previewDocx(arrayBuffer.value as ArrayBuffer);
  }
  catch (error) {
    showToast('请先签字');
    img.value = ''
  }
}

// 将base64转换为blob
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : 'image/png';

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 将blob转换为file 
function blobToFile(theBlob: any, fileName: string) {
  const file = new File([theBlob], fileName)
  return file;
}


/**
 * 基础图片插入示例
 * 展示ImageRun的最基本用法
 */
const createBasicImage = async () => {
  
  try {
    // 获取图片Base64数据
    const imageData = await vueEsignRef.value.generate()
    
    // 创建ImageRun实例
    const imageRun = new ImageRun({
      data: imageData,
      type: 'png',
      transformation: {
        width: 400,  // 图片宽度（像素）
        height: 300, // 图片高度（像素）
      },
    });
    
    // 创建文档
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: '基础图片插入示例', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [imageRun],  // 将ImageRun添加到段落中
            alignment: AlignmentType.CENTER
          })
        ]
      }]
    });
    
    // 生成并下载文档
    // const blob = await Packer.toBlob(doc);
    // saveAs(blob, '基础图片示例.docx');
  } catch (err) {
    showToast('生成文档失败，请重试');
    console.error(err);
  } finally {
    // loading.value = false;
  }
};



</script>

<style scoped>
.docx-container {
  padding: 16px;
}

.download-btn {
  margin-bottom: 20px;
}

.preview-title {
  margin: 10px 0;
}

.preview-content {
  width: 100%;
  min-height: 500px;
  border: 1px solid #eee;
  padding: 10px;
  box-sizing: border-box;
}

/* 自定义docx-preview样式 */
::v-deep .docx-preview {
  width: 100%;
  height: 100%;
}
</style>
