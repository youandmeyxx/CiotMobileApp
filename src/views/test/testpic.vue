<template>
  <div class="word-image-inserter">
    <h3>Word文档图片插入工具</h3>
    
    <div class="input-group">
      <label class="file-label">
        选择Word模板
        <input 
          type="file" 
          accept=".docx" 
          @change="handleTemplateUpload"
          class="file-input"
        >
      </label>
    </div>
    
    <div v-if="templateName && imageName" class="options">
      <p>模板: {{ templateName }}</p>
      <p>图片: {{ imageName }}</p>
      
      <div class="placeholder-input">
        <label>图片占位符 (模板中使用的标签):</label>
        <input 
          type="text" 
          v-model="imagePlaceholder" 
          placeholder="例如: {signature}"
          class="text-input"
        >
      </div>
      
      <button 
        @click="insertImageIntoWord" 
        :disabled="isProcessing"
        class="generate-btn"
      >
        <span v-if="!isProcessing">生成新文档</span>
        <span v-if="isProcessing">处理中...</span>
      </button>
    </div>
    
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import ImageModule from 'docxtemplater-image-module-free';

// 状态管理
const templateFile = ref<File | null>(null);
const templateName = ref('');
const imageFile = ref<File | null>(null);
const imageName = ref('');
const imagePlaceholder = ref('{signature}');
const isProcessing = ref(false);
const errorMessage = ref('');

// 处理模板文件上传
const handleTemplateUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    templateFile.value = target.files[0];
    templateName.value = target.files[0].name;
    errorMessage.value = '';
  }
};

// 处理图片上传
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
    imageName.value = target.files[0].name;
    errorMessage.value = '';
  }
};

// 读取文件的工具函数
const loadFile = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        reject(new Error('文件读取失败'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// 将图片转换为适合docxtemplater的格式
const convertImage = (file: File): Promise<{ data: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
        
        img.onload = () => {
          // 计算图片尺寸，保持比例
          const maxWidth = 150; // 最大宽度(mm)
          const maxHeight = 100; // 最大高度(mm)
          
          let width = img.width;
          let height = img.height;
          
          // 计算缩放比例
          const scale = Math.min(maxWidth / width, maxHeight / height);
          
          // 应用缩放
          width *= scale;
          height *= scale;
          
          // 提取base64数据
          const base64Data = img.src.split(',')[1];
          
          resolve({
            data: base64Data,
            width: Math.round(width),
            height: Math.round(height)
          });
        };
        
        img.onerror = () => reject(new Error('图片加载失败'));
      } else {
        reject(new Error('图片转换失败'));
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

// 插入图片到Word文档
const insertImageIntoWord = async () => {
  if (!templateFile.value || !imageFile.value) {
    errorMessage.value = '请选择Word模板和图片';
    return;
  }
  
  if (!imagePlaceholder.value.trim()) {
    errorMessage.value = '请输入图片占位符';
    return;
  }
  
  isProcessing.value = true;
  errorMessage.value = '';
  
  try {
    // 1. 读取Word模板文件
    const content = await loadFile(templateFile.value);
    const zip = new PizZip(content);
    
    // 2. 配置图片模块
    const imageOpts = {
      centered: false, // 图片是否居中
      getImage: (tagValue: { data: string }) => {
        // 将base64转换为Uint8Array
        console.log(tagValue.data);
        console.log(atob(tagValue.data));
        return Uint8Array.from(atob(tagValue.data), c => c.charCodeAt(0));
      },
      getSize: (tagValue: { width: number; height: number }) => {
        // 返回图片尺寸(mm)
        return [tagValue.width, tagValue.height];
      }
    };
    
    // 3. 转换图片
    const imageData = await convertImage(imageFile.value);
    
    // 4. 创建docxtemplater实例
    const doc = new Docxtemplater()
      .loadZip(zip)
      .attachModule(new ImageModule(imageOpts))
      .compile();
    
    // 5. 设置数据 - 使用用户指定的占位符
    const data: Record<string, any> = {};
    const placeholderKey = imagePlaceholder.value.replace(/{|}/g, ''); // 移除{}
    data[placeholderKey] = imageData.data;
    console.log('Data for template:', data);
    // 6. 渲染文档
    doc.render(data);
    
    // 7. 生成并下载新文档
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    // 生成新文件名
    const originalName = templateFile.value.name.replace('.docx', '');
    saveAs(out, `${originalName}_带图片.docx`);
    
  } catch (error) {
    console.error('处理失败:', error);
    errorMessage.value = '处理文档时出错，请重试';
    if (error instanceof Error) {
      errorMessage.value += `: ${error.message}`;
    }
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.word-image-inserter {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h3 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.file-label {
  flex: 1;
  min-width: 250px;
  padding: 1rem;
  border: 2px dashed #ccc;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.file-label:hover {
  border-color: #42b983;
  background-color: #f8fff8;
}

.file-input {
  display: none;
}

.options {
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.placeholder-input {
  margin: 1rem 0;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.generate-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generate-btn:disabled {
  background-color: #a0cfa0;
  cursor: not-allowed;
}

.generate-btn:not(:disabled):hover {
  background-color: #359e75;
}

.error-message {
  color: #dc2626;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 6px;
  text-align: center;
}
</style>
    