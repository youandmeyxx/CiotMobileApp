<template>
  <div class="converter-container">
    <h2>Word 转 PDF 转换器</h2>
    
    <!-- 文件上传区域 -->
    <div class="upload-area" :class="{ dragOver: isDragging }">
      <label for="file-upload" class="upload-label">
        <i class="fas fa-file-word"></i>
        <p>点击或拖拽 Word 文件到此处</p>
        <input 
          id="file-upload" 
          type="file" 
          accept=".docx" 
          @change="handleFileUpload"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
      </label>
    </div>
    
    <!-- 转换状态和进度 -->
    <div v-if="status !== 'idle'" class="status-container">
      <div v-if="status === 'converting'" class="converting">
        <i class="fas fa-spinner fa-spin"></i>
        <p>{{ progressText }}</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      
      <div v-if="status === 'success'" class="success">
        <i class="fas fa-check-circle"></i>
        <p>转换成功！</p>
        <button @click="downloadPdf" class="btn download-btn">
          <i class="fas fa-download"></i> 下载 PDF
        </button>
      </div>
      
      <div v-if="status === 'error'" class="error">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ errorMessage }}</p>
        <button @click="resetConverter" class="btn reset-btn">重试</button>
      </div>
    </div>
    
    <!-- 预览区域 -->
    <div v-if="showPreview" class="preview-section">
      <h3>预览</h3>
      <div class="preview-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activePreview === 'html' }"
          @click="activePreview = 'html'"
        >
          HTML 预览
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activePreview === 'pdf' }"
          @click="activePreview = 'pdf'"
        >
          PDF 预览
        </button>
      </div>
      
      <div v-if="activePreview === 'html'" class="html-preview" v-html="htmlContent"></div>
      <div v-if="activePreview === 'pdf'" class="pdf-preview">
        <embed :src="pdfUrl" type="application/pdf" width="100%" height="600px">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

// 状态管理
const isDragging = ref(false);
const status = ref<'idle' | 'converting' | 'success' | 'error'>('idle');
const progress = ref(0);
const progressText = ref('准备转换...');
const errorMessage = ref('');
const htmlContent = ref('');
const pdfUrl = ref('');
const showPreview = ref(false);
const activePreview = ref<'html' | 'pdf'>('html');

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    convertWordToPdf(target.files[0]);
  }
};

// 处理拖拽文件
const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    convertWordToPdf(event.dataTransfer.files[0]);
  }
};

// 转换主函数
const convertWordToPdf = async (file: File) => {
  // 检查文件类型
  if (!file.name.endsWith('.docx')) {
    setError('请上传 .docx 格式的 Word 文件');
    return;
  }

  try {
    // 初始化状态
    status.value = 'converting';
    progress.value = 0;
    progressText.value = '正在解析 Word 文件...';
    
    //第一步
    let appId = 'c8267880755a883adead5bb5b2827b8b';
    let appSecret= 'dc8792ae68a49a8ff6a5b754bf550748';
    let url = 'https://api.textin.com/ai/service/v1/file-convert/word-to-pdf';
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload= function (e) 
    {
        axios.post(url, reader.result, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'x-ti-app-id': appId,
                    'x-ti-secret-code': appSecret
                }
            })
            .then(response => {
                // if (response.data.code === 200) {
                    console.log('请求成功', response.data.result);
                //转换base64 为zip 格式
                pdfUrl.value = `data:application/pdf;base64,${response.data.result}`;

            })
            .catch(error => {
                console.error('请求失败', error);
            });
    };

    // // 第一步：Word 转 HTML
    // const arrayBuffer = await readFileAsArrayBuffer(file);
    // progress.value = 30;
    // progressText.value = '正在转换为 HTML...';
    
    // const result = await mammoth.convertToHtml({ arrayBuffer });
    // htmlContent.value = result.value;
    // console.log('转换后的 HTML:', htmlContent.value);

    // progress.value = 60;
    // progressText.value = '正在转换为 PDF...';
    
    // // 第二步：HTML 转 PDF
    // const pdfBlob = await convertHtmlToPdf(result.value);
    // pdfUrl.value = URL.createObjectURL(pdfBlob);
    
    // // 完成转换
    progress.value = 100;
    status.value = 'success';
    showPreview.value = true;
  } catch (error) {
    console.error('转换失败:', error);
    setError(error instanceof Error ? error.message : '转换过程中发生错误');
  }
};

// 读取文件为 ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('无法读取文件内容'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// 将 HTML 转换为 PDF
const convertHtmlToPdf = (html: string): Promise<Blob> => {
  return new Promise((resolve) => {
    // 创建临时 DOM 元素
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);
    
    // 配置 html2pdf
    const opt = {
      margin: 10,
      filename: 'converted.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // 生成 PDF 并获取 Blob
    html2pdf().from(tempDiv).set(opt).output('blob').then((blob: Blob) => {
      // 清理临时元素
      document.body.removeChild(tempDiv);
      resolve(blob);
    });
  });
};

// 下载 PDF 文件
const downloadPdf = () => {
  if (pdfUrl.value) {
    const a = document.createElement('a');
    a.href = pdfUrl.value;
    a.download = 'converted.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

// 设置错误状态
const setError = (message: string) => {
  status.value = 'error';
  errorMessage.value = message;
};

// 重置转换器
const resetConverter = () => {
  status.value = 'idle';
  errorMessage.value = '';
  htmlContent.value = '';
  pdfUrl.value = '';
  showPreview.value = false;
  progress.value = 0;
  
  // 重置文件输入
  const input = document.getElementById('file-upload') as HTMLInputElement;
  if (input) input.value = '';
};
</script>

<style scoped lang="scss">
.converter-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  h2 {
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.dragOver {
    border-color: #42b983;
    background-color: rgba(66, 185, 131, 0.1);
  }
  
  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    
    i {
      font-size: 3rem;
      color: #666;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      margin: 0;
    }
    
    input {
      display: none;
    }
  }
}

.status-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.converting {
  background-color: #f8f9fa;
  text-align: center;
  
  i {
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 1rem;
  }
  
  .progress-bar {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    margin-top: 1rem;
    overflow: hidden;
    
    .progress {
      height: 100%;
      background-color: #007bff;
      transition: width 0.3s ease;
    }
  }
}

.success {
  background-color: rgba(40, 167, 69, 0.1);
  border: 1px solid #c3e6cb;
  text-align: center;
  
  i {
    font-size: 2rem;
    color: #28a745;
    margin-bottom: 1rem;
  }
}

.error {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid #f5c6cb;
  text-align: center;
  
  i {
    font-size: 2rem;
    color: #dc3545;
    margin-bottom: 1rem;
  }
}

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &.download-btn {
    background-color: #28a745;
    color: white;
    
    &:hover {
      background-color: #218838;
    }
  }
  
  &.reset-btn {
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
}

.preview-section {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
  }
}

.preview-tabs {
  display: flex;
  margin-bottom: 1rem;
  
  .tab-btn {
    padding: 0.5rem 1rem;
    background-color: #f8f9fa;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
    
    &.active {
      background-color: #42b983;
      color: white;
    }
  }
}

.html-preview {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1.5rem;
  max-height: 600px;
  overflow-y: auto;
  
  /* 基础样式重置，使预览更接近原文档 */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
}

.pdf-preview {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
}
</style>
