<template>
  <div class="docx-editor">
    <h2>Word 文档编辑器</h2>
    
    <!-- 文件上传区域 -->
    <div class="upload-area" :class="{ dragOver: isDragging }">
      <label for="docx-file">
        <i class="fas fa-file-word"></i>
        <p>上传 .docx 文件进行编辑</p>
        <input 
          id="docx-file" 
          type="file" 
          accept=".docx" 
          @change="handleFileUpload"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
      </label>
    </div>
    
    <!-- 编辑区域 (文件加载后显示) -->
    <div v-if="fileLoaded" class="editor-controls">
      <h3>编辑操作</h3>
      
      <!-- 文本替换 -->
      <div class="operation-group">
        <h4>替换文本</h4>
        <div class="input-group">
          <label>查找:</label>
          <input 
            type="text" 
            v-model="searchText" 
            placeholder="输入要替换的文本"
          >
        </div>
        <div class="input-group">
          <label>替换为:</label>
          <input 
            type="text" 
            v-model="replaceText" 
            placeholder="输入替换后的文本"
          >
        </div>
        <button 
          @click="replaceTextInDoc" 
          :disabled="!searchText"
          class="btn replace-btn"
        >
          <i class="fas fa-exchange-alt"></i> 执行替换
        </button>
      </div>
      
      <!-- 添加段落 -->
      <div class="operation-group">
        <h4>添加段落</h4>
        <div class="input-group full-width">
          <label>段落内容:</label>
          <textarea 
            v-model="newParagraph" 
            placeholder="输入要添加的段落内容"
            rows="3"
          ></textarea>
        </div>
      </div>
      
      <!-- 状态提示 -->
      <div v-if="statusMessage" :class="statusType" class="status-message">
        {{ statusMessage }}
      </div>
      
      <!-- 下载按钮 -->
      <button 
        @click="downloadModifiedDoc" 
        class="btn download-btn"
      >
        <i class="fas fa-download"></i> 下载修改后的文档
      </button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="status loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>{{ loadingText }}</p>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="errorMessage" class="status error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ errorMessage }}</p>
      <button @click="resetEditor" class="btn reset-btn">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JSZip from 'jszip';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// 状态管理
const isDragging = ref(false);
const loading = ref(false);
const loadingText = ref('加载文档中...');
const errorMessage = ref('');
const fileLoaded = ref(false);
const statusMessage = ref('');
const statusType = ref<'success' | 'info' | 'error'>('info');

// 编辑数据
const searchText = ref('');
const replaceText = ref('');
const newParagraph = ref('');
const originalFileName = ref('');
const zip = ref<JSZip | null>(null);
const documentXml = ref('');

// 处理文件上传
const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    originalFileName.value = file.name;
    loadAndParseDocx(file);
  }
};

// 处理拖拽
const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];
    originalFileName.value = file.name;
    loadAndParseDocx(file);
  }
};

// 加载并解析 docx 文件
const loadAndParseDocx = async (file: File) => {
  try {
    loading.value = true;
    errorMessage.value = '';
    loadingText.value = '加载文档中...';
    
    // 1. 读取文件内容
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    // 2. 解压 ZIP 包
    loadingText.value = '解析文档结构...';
    const docxZip = await JSZip.loadAsync(arrayBuffer);
    zip.value = docxZip;
    
    // 3. 获取核心文档 XML
    const contentFile = docxZip.file('word/document.xml');
    if (!contentFile) {
      throw new Error('无效的 .docx 文件，未找到文档内容');
    }
    
    documentXml.value = await contentFile.async('text');
    fileLoaded.value = true;
    showStatus('文档加载成功，可以开始编辑', 'success');
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载文档失败';
  } finally {
    loading.value = false;
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

// 替换文档中的文本
const replaceTextInDoc = async () => {
  if (!zip.value || !documentXml.value || !searchText.value) return;
  
  try {
    loading.value = true;
    loadingText.value = '正在替换文本...';
    
    // 1. 解析 XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXml.value, 'application/xml');
    const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    
    // 2. 查找所有文本节点并替换
    const textNodes = xmlDoc.getElementsByTagNameNS(ns, 't');
    let replaceCount = 0;
    
    for (let i = 0; i < textNodes.length; i++) {
      const node = textNodes[i];
      if (node.textContent && node.textContent.includes(searchText.value)) {
        node.textContent = node.textContent.replace(searchText.value, replaceText.value);
        replaceCount++;
      }
    }
    
    // 3. 更新 XML 内容
    const serializer = new XMLSerializer();
    documentXml.value = serializer.serializeToString(xmlDoc);
    zip.value.file('word/document.xml', documentXml.value);
    
    showStatus(`成功替换 ${replaceCount} 处匹配内容`, 'success');
  } catch (err) {
    showStatus(err instanceof Error ? err.message : '替换文本失败', 'error');
  } finally {
    loading.value = false;
  }
};

// 向文档添加段落
// const addParagraphToDoc = async () => {
//   if (!zip.value || !documentXml.value || !newParagraph.value.trim()) return;
  
//   try {
//     loading.value = true;
//     loadingText.value = '正在添加段落...';
    
//     // 1. 使用 docx 库创建新段落
//     const newPara = new Paragraph({
//       children: [
//         new TextRun({
//           text: newParagraph.value,
//           size: 24, // 1/72 英寸
//           font: 'Arial',
//         }),
//       ],
//     });
    
//     // 2. 生成段落 XML
//     const paraDoc = new Document({
//       sections: [{
//         children: [newPara],
//       }],
//     });
    
//     const paraXml = await Packer.toXML(paraDoc);
//     const paraParser = new DOMParser();
//     const paraXmlDoc = paraParser.parseFromString(paraXml, 'application/xml');
//     const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    
//     // 3. 提取段落节点
//     const newParaNode = paraXmlDoc.getElementsByTagNameNS(ns, 'p')[0];
//     if (!newParaNode) {
//       throw new Error('创建段落失败');
//     }
    
//     // 4. 插入到原文档
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(documentXml.value, 'application/xml');
//     const bodyNode = xmlDoc.getElementsByTagNameNS(ns, 'body')[0];
    
//     if (bodyNode) {
//       // 克隆节点并插入到文档末尾
//       const importedNode = xmlDoc.importNode(newParaNode, true);
//       bodyNode.appendChild(importedNode);
      
//       // 5. 更新 XML 内容
//       const serializer = new XMLSerializer();
//       documentXml.value = serializer.serializeToString(xmlDoc);
//       zip.value.file('word/document.xml', documentXml.value);
      
//       showStatus('段落添加成功', 'success');
//       newParagraph.value = '';
//     } else {
//       throw new Error('找不到文档主体');
//     }
//   } catch (err) {
//     showStatus(err instanceof Error ? err.message : '添加段落失败', 'error');
//   } finally {
//     loading.value = false;
//   }
// };

// 下载修改后的文档
const downloadModifiedDoc = async () => {
  if (!zip.value) return;
  
  try {
    loading.value = true;
    loadingText.value = '正在生成文档...';
    
    // 生成修改后的 ZIP 包
    const content = await zip.value.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    // 下载文件
    const newFileName = originalFileName.value.replace('.docx', '_modified.docx');
    saveAs(content, newFileName);
    showStatus('文档已成功生成并下载', 'success');
  } catch (err) {
    showStatus(err instanceof Error ? err.message : '生成文档失败', 'error');
  } finally {
    loading.value = false;
  }
};

// 显示状态消息
const showStatus = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
  statusMessage.value = message;
  statusType.value = type;
  
  setTimeout(() => {
    statusMessage.value = '';
  }, 3000);
};

// 重置编辑器
const resetEditor = () => {
  errorMessage.value = '';
  fileLoaded.value = false;
  zip.value = null;
  documentXml.value = '';
  originalFileName.value = '';
  searchText.value = '';
  replaceText.value = '';
  newParagraph.value = '';
  
  // 重置文件输入
  const input = document.getElementById('docx-file') as HTMLInputElement;
  if (input) input.value = '';
};
</script>

<style scoped lang="scss">
.docx-editor {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

h2 {
  color: #2d3748;
  text-align: center;
  margin-bottom: 2rem;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 3rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  
  &.dragOver {
    border-color: #48bb78;
    background-color: rgba(72, 187, 120, 0.05);
  }
  
  i {
    font-size: 3rem;
    color: #718096;
    margin-bottom: 1rem;
  }
  
  p {
    color: #718096;
    margin: 0;
  }
  
  input {
    display: none;
  }
}

.editor-controls {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

h3 {
  color: #2d3748;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.operation-group {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 1rem;
  }
  
  h4 {
    color: #4a5568;
    margin-top: 0;
    margin-bottom: 1rem;
  }
}

.input-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    width: 100%;
  }
  
  label {
    color: #4a5568;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  input, textarea {
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #48bb78;
      box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.2);
    }
  }
  
  textarea {
    resize: vertical;
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &.replace-btn {
    background-color: #3182ce;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #2b6cb0;
    }
    
    &:disabled {
      background-color: #a0aec0;
      cursor: not-allowed;
    }
  }
  
  &.add-btn {
    background-color: #48bb78;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #38a169;
    }
    
    &:disabled {
      background-color: #a0aec0;
      cursor: not-allowed;
    }
  }
  
  &.download-btn {
    background-color: #805ad5;
    color: white;
    margin-top: 1rem;
    
    &:hover {
      background-color: #6b46c1;
    }
  }
  
  &.reset-btn {
    background-color: #e53e3e;
    color: white;
    margin-top: 1rem;
    
    &:hover {
      background-color: #c53030;
    }
  }
}

.status-message {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  color: white;
  font-size: 0.95rem;
  
  &.success {
    background-color: #48bb78;
  }
  
  &.info {
    background-color: #3182ce;
  }
  
  &.error {
    background-color: #e53e3e;
  }
}

.status {
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
  
  i {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    color: inherit;
  }
  
  &.loading {
    background-color: #edf2f7;
    color: #4a5568;
  }
  
  &.error {
    background-color: #fff5f5;
    color: #e53e3e;
  }
}
</style>
