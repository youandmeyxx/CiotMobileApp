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
            <van-cell title="选择日期范围查询" :value="signDate" @click="showSignDate = true" />
            <div class="radio-group-container">
                <span class="radio-group-label">是否已签订合同:</span>
                <van-radio-group v-model="issigned" direction="horizontal">
                    <van-radio name="">全部</van-radio>
                    <van-radio name="1">已签订</van-radio>
                    <van-radio name="0">未签订</van-radio>
                </van-radio-group>
            </div>
            <div>
                <van-button
                    plain
                    icon="search"
                    type="primary"
                    @click="onSearch"
                >
                    搜索
                </van-button>
                <van-button
                    plain
                    icon="search"
                    type="primary"
                    @click="exportToExcel"
                >
                    导出
                </van-button>
            </div>
            <div>
                <van-collapse v-model="activeName" accordion>
                    <van-collapse-item v-for="(item, index) in contractData" :key="index" :title="item.billcode + ' ' + item.ctradername + ' ' + item.contracttype + ' ' + item.signtime" :name="index">
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
                        <ul>
                            <li>签订时间:{{ item.signtime }}</li>
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
            <van-button v-if="userInfoDetail.userInfoDetail.roleName === 'admin'||userInfoDetail.userInfoDetail.roleName === '售后运营'" @click="saveAsDocx(contractPath)">下载</van-button>
            <van-button @click="showPopup = false">关闭</van-button>
            </div>
        </div>
    </van-popup>
    <van-calendar v-model:show="showSignDate" type="range" @confirm="onConfirmSignDate"  :min-date="minDate" :max-date="maxDate" />
</template>
<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { showToast, Toast } from 'vant';
    import '@/style/custom.css';
    import axios from 'axios';
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
    import type { CalendarValue, contractInfo } from '../support/interface';
    import { renderAsync } from 'docx-preview';
    import { saveAs } from 'file-saver';
    import { getUserinfoFromSession } from '../support/function';
    import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';
    type CalendarV = Date | [Date, Date]; // Define CalendarValue type locally
    import * as XLSX from 'xlsx';
    const ctradername =ref(''); 
    const activeName = ref('1');
    const billcode = ref('');
    const contracttype = ref('');
    const contractData = ref<contractInfo[]>([]);
    const arrayBuffer = ref<ArrayBuffer | null>(null);
    const previewContainer = ref<HTMLDivElement | null>(null);
    const contractPath = ref('');
    const showSignDate = ref(false);
    const minDate = new Date(2010, 0, 1);
    const maxDate = new Date(2099, 11, 31);
    const issigned = ref('');
    const signDateStart= ref('');
    const signDateEnd= ref('');
    const signDate=ref('')
// 控制Popup显示状态
    const showPopup = ref(false);
    const docBlob = ref<Blob | null>(null)
    const userInfoDetail = userInfoDetailStore();
    const userInfo = userInfoStore();


    onMounted(() => {
        getUserinfoFromSession();
    });
    
    /**
     * 
     * @param value 签订时间范围
     */
    const onConfirmSignDate = (value: CalendarV): void => {
      let start: Date | null = null;
      let end: Date | null = null;
      
      if (Array.isArray(value)) {
        [start, end] = value;
      } else {
        start = value;
        end = value;
      }
      showSignDate.value = false;
      signDateStart.value = formatDate(start);
      signDateEnd.value = formatDate(end);
      console.log('开始日期:', signDateStart.value);
      console.log('结束日期:', signDateEnd.value);
      signDate.value = signDateStart.value + '至' + signDateEnd.value;
    };

    // 导出数据到Excel
    const exportToExcel = () => {
        if (contractData.value.length === 0) {
            alert('暂无数据可导出');
            return;
        }

        // 合并两个数据源
        const allData = [...contractData.value];

        // 准备导出的数据格式
        const exportData = allData.map(item => ({
            '单据编号': item.billcode,
            '客户名': item.ctradername,
            '合同类型': item.contracttype,
            '是否签订': item.issigned === 1 ? '是' : '否',
            '创建时间': item.createtime,
            '签订时间': item.signtime,
        }));

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(exportData);
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '合同列表');
        // 生成Excel文件
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        // 保存文件
        saveAsExcelFile(excelBuffer, '合同列表');
    }

    // 保存Excel文件的辅助函数
    const saveAsExcelFile = (buffer: any, fileName: string) => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_' + new Date().toLocaleDateString() + EXCEL_EXTENSION);
    }

    const onSearch = () =>{
        axios.get(`${DOMAIN_RUL}/workWeChart/contractList`,{
        params: {
            ctradername: ctradername.value,
            billcode: billcode.value,
            contracttype: contracttype.value,
            dateStart: signDateStart.value,
            dateEnd: signDateEnd.value,
            empname: userInfo.userInfo.name,
            issigned: issigned.value,
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
    
    const formatDate = (date: CalendarValue) => {
      const year = date.getFullYear();
      // 确保月份为两位数
      const month = String(date.getMonth() + 1).padStart(2, '0');
      // 确保日期为两位数
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

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