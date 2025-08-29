<template>
  <div>
    <div class="custom-div-title">电签合同登记</div>
    <van-form @submit="onSubmit">
        <van-field v-model="billcode" label="开单编号:" />
        <van-field name="uploader" label="上传合同:">
            <template #input>
                <van-uploader
                v-model="contractUrl"
                :after-read="onVantFileChange"
                accept=".docx"
                :max-count="1"
                :preview-image="false"
            />
            </template>
        </van-field>
        <div style="margin: 16px; padding-bottom:100px;">
            <van-button round block type="primary" native-type="submit">
                登记提交
            </van-button>
        </div>
    </van-form>
    <van-cell title="合同预览:" />
    <div ref="previewContainer"></div>
  </div>
</template>
<script setup lang="ts">
import '@/style/custom.css';
import { ref } from 'vue';
const fieldNames = ['billcode','tel', 'addr', 'contact', 'carrier', 'realnametype', 'cusName', 'routertype', 'routername', 'setupdate', 'topology'];
// 使用 Object.fromEntries 批量创建 ref 变量
const { billcode, tel, addr, contact, carrier, realnametype, cusname, routertype, routername, setupdate, topology } = Object.fromEntries(fieldNames.map(name => [name, ref('')]));
// @ts-ignore
import { renderAsync } from 'docx-preview';
import loading from 'vant/lib/loading';
import { showToast } from 'vant';
import axios from 'axios';
import { generateNonce } from '../support/function';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import router from '@/router';

const contractUrl = ref([]);
const previewContainer = ref<HTMLDivElement | null>(null);
const contractPath = ref('');

const onVantFileChange = async (fileObj: any) => {
  // vant4 uploader 的 fileObj 结构：{ file: File, ... }
  const file = fileObj.file;
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    if (previewContainer.value) {
      previewContainer.value.innerHTML = '';
      renderAsync(arrayBuffer, previewContainer.value);
    }
  }
};

const contractAdd = (contractPath: string,nonce:string) => {
        loading.value = true;
        let contractInfo = { 
            billcode: billcode.value, 
            contracturl: contractPath,
            createtime: '',
            signtime: ''
        }
        if(validateData(contractInfo)===false){
            loading.value = false;
            return;
        }
        // 发送 POST 请求
        axios.post(`${DOMAIN_RUL}/workWeChart/contractAdd`, contractInfo,{
            params: {
                nonce: nonce
            }
        })
            .then(response => {
                if (response.data.code === 200) {
                    console.log('请求成功', response.data); 
                    //返回上一页
                    // window.history.go(-1);
                    router.push({
                    name: 'getWebSignUrl',
                    query: { contractPath: contractPath } // 假设 item.billid 是你要传递的参数
          });        
                }
                loading.value = false;
            })
            .catch(error => {
            console.error('请求失败', error);
            loading.value = false;
            // 在这里处理错误
            });
};

const onSubmit = () => {
    loading.value = true;   
        const formData = new FormData();
        let contractPath= '';
        // 这里可以添加提交逻辑，例如将表单数据发送到服务器
        let nonce = generateNonce();
        contractUrl.value.forEach((file: { file: File }) => {
            formData.append('file', file.file);
        });
        console.log(formData);
        // 发送 POST 请求
        axios.post(`${DOMAIN_RUL}/workWeChart/contractUpload`, formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.data.code === 200) {
                console.log('请求成功', response.data); 
                contractPath = response.data.result;
            if (contractPath === '') {
                showToast('合同上传出错，请重新上传');
                loading.value = false;
                return;
                }
            }
            contractAdd(contractPath,nonce);
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

    //数据完整性校验
const validateData = (data: { billcode?: string; contracturl?: string; }) => {
    console.log(data);
    let flog = true;
    if (!data.billcode || !data.contracturl) {
        showToast("有字段为空填请检查!");
        flog =false;
    }
    return flog;
};


</script>
<style scoped>
/* 可根据需要自定义 docx-preview 的样式 */
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
</style>