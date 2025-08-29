<template>
  <div class="imagerun-example">
    <h3>ImageRun 用法示例</h3>
    <div class="button-group">
      <button @click="createBasicImage" class="btn">基础图片插入</button>
      <button @click="createStyledImage" class="btn">带样式的图片</button>
    </div>
    <div v-if="loading" class="status">正在生成文档...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  ImageRun,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  TextDirection
} from 'docx';
import { ref } from 'vue';

// 状态管理
const loading = ref(false);
const error = ref('');

/**
 * 将图片转换为Base64格式（docx库要求的格式）
 */
const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`图片加载失败: ${response.status}`);
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // 提取Base64数据（移除data URI前缀）
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('图片转换失败'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('图片处理错误:', err);
    throw err;
  }
};

/**
 * 基础图片插入示例
 * 展示ImageRun的最基本用法
 */
const createBasicImage = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 获取图片Base64数据
    const imageData = await getImageAsBase64('logo.jpg');
    
    // 创建ImageRun实例
    const imageRun = new ImageRun({
      data: imageData,
      type: 'jpg',
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
    const blob = await Packer.toBlob(doc);
    saveAs(blob, '基础图片示例.docx');
  } catch (err) {
    error.value = '生成文档失败，请重试';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

/**
 * 带样式的图片示例
 * 展示ImageRun的高级属性
 */
const createStyledImage = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const imageData = await getImageAsBase64('logo.jpg');
    
    // 带样式的ImageRun配置
    const styledImage = new ImageRun({
      data: imageData,
      type: 'jpg',
      transformation: {
        width: 300,
        height: 200,

      },
      floating: {
        horizontalPosition: {
          offset: 1000,  // 水平偏移
        },
        verticalPosition: {
          offset: 500,   // 垂直偏移
        },
        wrap: {
          type:1,  // 文字环绕方式
        }
      }
    });
    
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: '带样式的图片示例', bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun('这是一张带有旋转效果和文字环绕的图片：'),
              styledImage,
              new TextRun('图片周围的文字会按照设置的环绕方式排列，这在需要图文混排的场景中非常有用。可以通过调整rotation属性改变图片的旋转角度，通过floating属性控制图片的位置和环绕方式。')
            ]
          })
        ]
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, '带样式的图片示例.docx');
  } catch (err) {
    error.value = '生成文档失败，请重试';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
.imagerun-example {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}

.btn {
  padding: 0.6rem 1.2rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #4338ca;
}

.status {
  color: #64748b;
  padding: 1rem;
  text-align: center;
}

.error {
  color: #dc2626;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 4px;
  text-align: center;
}
</style>
    