<template>
  <div>
    <!-- 预览区域 -->
    <div class="preview-title">
      <van-cell title="合同预览" />
    </div>
        <!-- 预览容器 -->
      <!-- 文档内容容器 -->
      <div ref="previewContainer"></div>
      <!-- <div>
        <PdfView :pdf="jspdf" style="width: 100%;height:100%;"></PdfView>
      </div> -->
       <!-- 触发按钮 -->
    <div class="button-container">
        <van-button
          plain
          type="primary"
          size="small"
          @click="showPopup=true"
        >
          签名
      </van-button>
      <van-button
          plain
          type="primary"
          size="small"
          @click="saveAsDocx"
        >
          下载
      </van-button>
    </div>
  </div>
    <!-- 错误提示 -->
    <van-toast id="van-toast" />
    <Loading v-if="loading" />
    <van-popup
        v-model:show="showPopup"
        position="center"
        :overlay="true"
        :close-on-click-overlay="false"
        :style="{backgroundColor: '#f5f5f5', padding: '20px', width: '90%', height: '70%' }"
        class="popup-center"
      >
        <div ref="signContainerRef" class="popup-content">
          <h3 class="title">请完成签名</h3>
          <!-- Vue3Esign 签名组件 -->
          <Vue3Esign ref="vueEsignRef" 
            :height="clientHeight" 
            :width="clientWidth" 
            :bgColor="vueEsignBgColor" 
            :is-clear-bg-color="false"
            :is-crop="isCrop" 
            :line-width="lineWidth" 
            :line-color="lineColor" />
            <div class="button-group">
            <van-button @click="clearCanves">清除</van-button>
            <van-button type="primary" @click="saveCanves">确认签名</van-button>
          </div>
        </div>
    </van-popup>
</template>
<script setup lang="ts">
//******* */
import '@/style/custom.css';
import { nextTick, onMounted, onUnmounted, ref, watchEffect, type Ref } from 'vue';
import Loading from '@/components/Loading.vue';
import {  showToast, Toast  } from 'vant';
import { generateNonce, getUserinfoFromSession } from '../support/function';
import { renderAsync } from 'docx-preview';
import axios from 'axios';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { useRoute } from 'vue-router';
import { Vue3Esign } from 'vue3-esign'
import ImageModule from 'docxtemplater-image-module-free';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

//****************************************************************
const route = useRoute();
const loading = ref(false);
const isDocumentLoaded = ref(false);

const contractPath = route.query.contractPath as string;
const isLoading = ref(false);
const isPreviewVisible = ref(false);
const previewContainer = ref<HTMLDivElement | null>(null);
const arrayBuffer = ref<ArrayBuffer | null>(null);
const docBlob = ref<Blob | null>(null);

const img = ref('');
const clientWidth = ref(400);
const clientHeight = ref(250);
const vueEsignBgColor = ref<string>('#f7f7f7');
const lineWidth = ref(6);
const lineColor = ref('#000000');
const isCrop = ref(false);
const jspdf = ref<string>('');

// 签名容器引用
const signContainerRef = ref<HTMLDivElement | null>(null);
// 控制Popup显示状态
const showPopup = ref(false);
// 签名组件引用
const vueEsignRef = ref<InstanceType<typeof Vue3Esign>>();
//****************************************************************
// 初始化尺寸监听
onMounted(() => {
  getUserinfoFromSession();
  // jspdf.value = `${DOMAIN_RUL}/contract/${contractPath}.pdf`;
  //下载合同
  downloadAndDocx();
})
// 清理监听
onUnmounted(() => {
});

// 下载合同
const saveAsDocx = async () => {
    let docxUrl = `${DOMAIN_RUL}/contract/${contractPath}.docx`;
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
    // 3. 读取blob内容,将blob转换为arrayBuffer
    docBlob.value = response.data;
  if (!docBlob.value) {
    Toast.fail('请先下载文档');
    return;
  }
  saveAs(docBlob.value, contractPath);
}

const downloadAndPdf = async () => {
  let pdfUrl = `${DOMAIN_RUL}/contract/${contractPath}.pdf`;

}


/**
 * 从服务器下载docx文档并预览
 * 假设服务器接口为 /downloadDocx，需要传入文档ID等参数
 */
const downloadAndDocx = async () => {
  isLoading.value = true;
  isPreviewVisible.value = false;
  let docxUrl = `${DOMAIN_RUL}/contract/${contractPath}.docx`;
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
    // 3. 读取blob内容,将blob转换为arrayBuffer

    docBlob.value = response.data;
    arrayBuffer.value = await response.data.arrayBuffer();
    isDocumentLoaded.value = await previewDocx(arrayBuffer.value as ArrayBuffer);

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
    return false;
  }
  if (previewContainer.value) {
    previewContainer.value.innerHTML = '';
    isPreviewVisible.value = true;
    await renderAsync(arrayBuffer, previewContainer.value);
    return true;
  }
  return false;
};

// 清空
function clearCanves(): void {
  vueEsignRef.value?.reset()
  showPopup.value = false;
}

// 保存
const saveCanves = async () => {
  try {
    const base64Data = await vueEsignRef.value.generate()
    console.log('res', base64Data)
    img.value = base64Data
    //
    if (!docBlob.value || !img.value) {
      alert('请上传模板和图片');
      return;
    }
    arrayBuffer.value = await docBlob.value.arrayBuffer();
    const zip = new PizZip(arrayBuffer.value);

    // 配置图片模块
    const imageModule = new ImageModule({
      centered: false, // 图片是否居中
    getImage: function (tagValue: string) {
      // 添加base64前缀并转换为Uint8Array
      const base64Data = tagValue.replace(/^data:image\/\w+;base64,/, '');
      const binaryData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      return uint8Array;
    },
      getSize: () => [150, 75], // 图片尺寸 [宽度, 高度]
    });

    // 加载文档和模块
    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
      paragraphLoop: true,
      linebreaks: true,
    });

        // 设置模板数据（模板中需有 {image} 占位符）
    doc.setData({
      image: img.value,
    });

      // 渲染文档
    doc.render();
    //预览文件
    isDocumentLoaded.value = await  previewDocx(doc.toArrayBuffer());

    //保存签名文件。
    const output = doc.getZip().generate({ type: 'blob',mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    signedContractUpload(output);
    clearCanves();
  }
  catch (error) {
    console.error('渲染文档失败:', error);
    showToast('请先签字');
    img.value = ''
  }
}


/**
 * 上传签名后的文件
 * @param output 签名后的文件
 */
const signedContractUpload =(output:Blob) => {
    loading.value = true;
    let nonce = generateNonce();
    const formData = new FormData();
    console.log('contractPath:',contractPath);
    formData.append('file', blobToFile(output,contractPath));
    formData.append('contractPath', contractPath);
        // 发送 POST 请求
    axios.post(`${DOMAIN_RUL}/workWeChart/signedContractUpload`, formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('请求返回', response.data); 

            if (response.data.code === 200) {
                console.log('请求成功', response.data); 
            if (contractPath === '') {
                showToast('合同上传出错，请重新上传');
                loading.value = false;
                return;
                }
            }
            else{
              console.log('合同已签过字了！', response.data); 
                showToast('合同已签过字了！');
                loading.value = false;
                return;
            }
            // contractUpdate(contractPath,nonce);
            loading.value = false;
        })
        .catch(error => {
            console.error('请求失败', error);
            if (contractPath === '') {
                showToast('合同上传出错，请重新上传');
                loading.value = false;
                return;
            }
            loading.value = false;
    });
};

/**
 * 更新合同信息
 * @param contractPath 合同路径
 * @param nonce 随机数
 */
const contractUpdate = (contractPath: string,nonce:string) => {
        loading.value = true;
        let contractInfo = { 
            billcode: '', 
            contracturl: contractPath,
            issigned:1,
            createtime: '',
            signtime: ''
        }
        // 发送 POST 请求
        axios.post(`${DOMAIN_RUL}/workWeChart/contractUpdate`, contractInfo,{
            params: {
                nonce: nonce
            }
        })
            .then(response => {
                if (response.data.code === 200) {
                    console.log('签名成功'); 
                    //返回上一页
                    // window.history.go(-1);     
                }
                loading.value = false;
            })
            .catch(error => {
            console.error('请求失败', error);
            loading.value = false;
            // 在这里处理错误
            });
};


/**
 * 将base64转换为blob
 * @param dataurl base64字符串
 * @returns blob对象
 */
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

/**
 * 将blob转换为file 
 * @param theBlob blob对象
 * @param fileName 文件名
 * @returns file对象
 */
function blobToFile(theBlob: any, fileName: string) {
  const file = new File([theBlob], fileName)
  return file;
}


</script>

<style scoped>
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
.popup-content {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.popup-center .popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px; /* 根据需要调整 */
}
:deep(.docx-wrapper) {
  background-color: #fff;
  padding: 0;
}
:deep(.docx-wrapper > section.docx) {
  width: 100% !important;
  padding: 2em 1em 0!important;
  min-height: auto !important;
  box-shadow: none;
  margin-bottom: 0;
}
</style>
