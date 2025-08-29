<template>
  <div class="word-modifier">
    <van-uploader
      accept=".docx"
      :after-read="handleFileRead"
      :before-read="beforeFileRead"
      class="uploader"
    />

    <div v-if="fileLoaded" class="modification-tools">
      <!-- 移除查找文本框，添加图片上传区域 -->
      <van-uploader
        accept="image/*"
        :after-read="handleImageUpload"
        :before-read="beforeImageRead"
        class="image-uploader"
        :multiple="false"
        placeholder="点击上传签名图片"
      />
      <van-button @click="modifyDocument" type="primary" block>
        执行修改并下载
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Document, Packer, Paragraph, ImageRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { showToast } from 'vant';
import { readFile } from 'docx/lib/docx/fileReader';

// 状态管理
const fileLoaded = ref(false);
const originalFile = ref<File | null>(null);
const signatureImage = ref<string | null>(null);
const documentContent = ref<any>(null);

// DOCX文件上传前校验
const beforeFileRead = (file: File | File[]) => {
  const files = Array.isArray(file) ? file : [file];
  const allDocx = files.every(f => /\.docx$/i.test(f.name));
  if (!allDocx) {
    showToast('请上传 .docx 文件');
    return false;
  }
  return true;
};

// 读取DOCX文件内容
const handleFileRead = async (file: any) => {
  try {
    originalFile.value = file.file;
    const arrayBuffer = await file.file.arrayBuffer();
    // 使用docx库读取文档内容
    const doc = await readFile(new Uint8Array(arrayBuffer));
    documentContent.value = doc;
    fileLoaded.value = true;
    showToast('文档加载成功');
  } catch (error) {
    showToast('文档读取失败');
    console.error('文档上传错误:', error);
  }
};

// 图片上传前校验
const beforeImageRead = (file: File | File[]) => {
  const files = Array.isArray(file) ? file : [file];
  const allImage = files.every(f => /^image\//.test(f.type));
  const allLt2M = files.every(f => f.size / 1024 / 1024 < 2);
  if (!allImage) {
    showToast('请上传图片文件');
    return false;
  }
  if (!allLt2M) {
    showToast('图片大小不能超过 2MB');
    return false;
  }
  return true;
};

// 处理图片上传
const handleImageUpload = async (file: any) => {
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      signatureImage.value = e.target?.result as string;
      showToast('签名图片上传成功');
    };
    reader.readAsDataURL(file.file);
  } catch (error) {
    showToast('图片读取失败');
    console.error('图片上传错误:', error);
  }
};

// 修改文档内容 - 使用ImageRun在末尾插入图片
const modifyDocument = async () => {
  if (!documentContent.value || !originalFile.value || !signatureImage.value) {
    showToast('请上传文档和签名图片');
    return;
  }

  showToast('正在处理文档...');
  try {
    // 1. 准备图片数据
    const base64Data = signatureImage.value.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 2. 创建ImageRun
    const imageRun = new ImageRun({
      data: imageBuffer,
      type: 'png',
      transformation: {
        width: 200,
        height: 100,
      },
    });

    // 3. 在文档末尾添加新段落和图片
    documentContent.value.addSection({
      children: [
        new Paragraph({}), // 空段落作为分隔
        new Paragraph({
          children: [imageRun],
          alignment: AlignmentType.CENTER,
        })
      ]
    });

    // 4. 生成修改后的文档
    const blob = await Packer.toBlob(documentContent.value);

    // 5. 下载文件
    const originalName = originalFile.value.name.replace('.docx', '');
    saveAs(blob, `${originalName}_with_signature.docx`);
    showToast('文档处理成功');
  } catch (error) {
    showToast('文档处理失败');
    console.error('修改错误:', error);
  }
};
</script>


<style scoped>
.uploader, .image-uploader {
  margin: 20px;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
.modification-tools {
  padding: 0 20px;
}
</style>

