<template>
    <div>
        <div class="custom-div-title">合同列表</div>
        <div>
            <van-search
            v-model="ctradername"
            show-action
            label="客户名:"
            placeholder="请输入搜索关键词"
            >
            </van-search>
            <van-search
            v-model="billcode"
            show-action
            label="销售单号:"
            placeholder="请输入搜索关键词"
            >
            </van-search>
            <van-search
            v-model="contracttype"
            show-action
            label="合同类型:"
            placeholder="请输入搜索关键词"
            >
            </van-search>
            <div>
                <van-button
                    plain
                    icon="search"
                    type="primary"
                    @click="onSearch"
                >
                    搜索
                </van-button>
            </div>
            <div>
                <van-collapse v-model="activeName" accordion>
                    <van-collapse-item v-for="(item, index) in contractData" :key="index" :title="item.billcode + ' ' + item.ctradername + ' ' + item.contracttype" :name="index">
                        <div>
                        <ul>
                            <li>合同类型:{{ item.contracttype }}</li>
                        </ul>
                        <ul>
                            <li>客户名:{{ item.ctradername }}</li>
                        </ul>
                        <ul>
                            <li>销售单号:{{ item.billcode }}</li>
                        </ul>
                        </div>
                        <van-button type="primary" size="small" @click="contractReview(item.contracturl)">合同预览</van-button>
                    </van-collapse-item>
                </van-collapse> 
            </div>
        </div>
  </div>
    <van-popup
        v-model:show="showPopup"
        position="center"
        :overlay="true"
        :close-on-click-overlay="false"
        :style="{backgroundColor: '#f5f5f5', padding: '20px', width: '90%', height: '70%' }"
        class="popup-center"
      >
        <div ref="signContainerRef" class="popup-content">
          <h3 class="title">合同预览</h3>
            <!-- 文档内容容器 -->
            <div
            ref="previewContainer"></div>
            <div class="button-group">
            <van-button @click="saveAsDocx(contractPath)">下载</van-button>
            <van-button @click="showPopup = false">关闭</van-button>
            </div>
        </div>
    </van-popup>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import { showToast, Toast } from 'vant';
    import '@/style/custom.css';
    import axios from 'axios';
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
    import type { contractInfo } from '../support/interface';
    import { renderAsync } from 'docx-preview';
    import { saveAs } from 'file-saver';

    const ctradername =ref(''); 
    const activeName = ref('1');
    const billcode = ref('');
    const contracttype = ref('');
    const contractData = ref<contractInfo[]>([]);
    const arrayBuffer = ref<ArrayBuffer | null>(null);
    const previewContainer = ref<HTMLDivElement | null>(null);
    const contractPath = ref('');
// 控制Popup显示状态
    const showPopup = ref(false);
    const docBlob = ref<Blob | null>(null)

    const onSearch = () =>{
        axios.get(`${DOMAIN_RUL}/workWeChart/contractList`,{
        params: {
            ctradername: ctradername.value,
            billcode: billcode.value,
            contracttype: contracttype.value,
        }
        })
        .then(response => {
                    if (response.data.code === 200) {
                    console.log(response.data.result);
                        contractData.value = response.data.result;
                    }
                })
        .catch(error => {
                console.error('请求失败', error);
                // 在这里处理错误
                });
    }; 

    const contractReview = (path: string) => {
        showPopup.value = true;
        axios.get(`${DOMAIN_RUL}/contract/${path}.docx`,{
        responseType: 'blob',
        headers: {
            // 若后端需要特定请求头（如 Authorization），可在此添加
            'Content-Type': 'application/octet-stream'
        }
        })
        .then(response => {
                    // 2. 验证文件类型
                    const contentType = response.headers['content-type'];
                    console.log('contentType:',contentType);
                    if (!contentType || !contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                    throw new Error('下载的文件不是docx格式');
                    }
                    // 3. 读取blob内容,将blob转换为arrayBuffer

                    docBlob.value = response.data;
                    arrayBuffer.value = response.data.arrayBuffer();
                    previewDocx(arrayBuffer.value as ArrayBuffer);
                    contractPath.value = path;
        })
        .catch(error => {
                console.error('请求失败', error);
                // 在这里处理错误
                });
    }

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
        await renderAsync(arrayBuffer, previewContainer.value);
        return true;
    }
    return false;
    };

    // 下载合同
    const saveAsDocx = async (contractPath: string) => {
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


</script>
<style scoped>
.popup-content {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>