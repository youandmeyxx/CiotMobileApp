<template>
    <div>
    <div class="custom-div-title">装维登记报表</div>
    <van-cell title="选择单个日期查询" :value="jobDate" @click="showJobDate = true" />
    <van-search
      v-model="ctradername"
      label="客户名:"
      placeholder="请输入搜索关键词"
    >
  </van-search>
    <van-search
      v-model="operator"
      label="装维人员:"
      placeholder="请输入搜索关键词"
    >
    </van-search>
    <div class="button-container">
      <van-button
        plain
        icon="search"
        type="primary"
        @click="getrecordList"
      >
        搜索
      </van-button>
      <van-button
        plain
        icon="search"
        type="primary"
        @click="exportRecordList"
      >
        导出
      </van-button>
    </div>
  </div>

  <a-table :columns="columns" :data-source="assignJobData" :scroll="{ x: 1500 }">
  </a-table>
  <van-calendar v-model:show="showJobDate" type="range" @confirm="onConfirmJobDate"  :min-date="minDate" :max-date="maxDate" />
</template>
 
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import type { CalendarValue,setuprecord } from '../support/interface';
  // Removed invalid import as '@vant/weapp/es/calendar/types' does not exist
  type CalendarV = Date | [Date, Date]; // Define CalendarValue type locally
  import { columns} from './columns';
  import axios from 'axios';
  import { DOMAIN_RUL } from '@/plugins/globalVariables';
  // 引入 xlsx 库
  import * as XLSX from 'xlsx'; 

  const assignJobData = ref<setuprecord[]>([]);
  const  operator = ref('');
  const  ctradername = ref('');
  const showJobDate = ref(false);
  const minDate = new Date(2010, 0, 1);
  const maxDate = new Date(2099, 11, 31);
  const jobDateStart= ref('');
  const jobDateEnd= ref('');
  const jobDate=ref('')

  onMounted(() => {
      getrecordList(); 
  })
  function getrecordList() {
    console.log('执行getrecordList'+jobDateStart.value);
    axios.get(`${DOMAIN_RUL}/workWeChart/reportList`,{
        params: {
            operator: operator.value,
            ctradername: ctradername.value,
            dateStart: jobDateStart.value,
            dateEnd: jobDateEnd.value
        }
    })
    .then(response => {
        if (response.data.code === 200) {
            console.log(response.data.result);
            assignJobData.value = response.data.result;
          }
        })
        .catch(error => {
            console.error('请求失败', error);
            // 在这里处理错误
        });
  }

  const exportRecordList = () => {
    if (assignJobData.value.length === 0) {
      console.log('没有数据可导出');
      return;
    }

    // 将数据转换为 worksheet
    const ws = XLSX.utils.json_to_sheet(assignJobData.value);
        // 修改表头（例如，将第一行的内容改为新的表头）
    const headers = ['id', '销售单号', '电话','地址','联系人','装维人员','客户名称','拓扑','运营商','实名','路由器类型','路由器型号','安装后设备','安装日期','图片文件','登记日期','审核','审核日期','jobid','分配类型','详情','销售员','备注']; // 新的表头内容
    headers.forEach((header, index) => {
      ws[XLSX.utils.encode_cell({r: 0, c: index})].v = header; // 修改第一行的单元格值
    });
    // 创建 workbook 并添加 worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '作业记录');
    // 生成 Excel 文件并下载
    XLSX.writeFile(wb, '装维列表.xlsx');
  }

    const onConfirmJobDate = (value: CalendarV): void => {
      let start: Date | null = null;
      let end: Date | null = null;
      
      if (Array.isArray(value)) {
        [start, end] = value;
      } else {
        start = value;
        end = value;
      }
      showJobDate.value = false;
      jobDateStart.value = formatDate(start);
      jobDateEnd.value = formatDate(end);
      console.log('开始日期:', jobDateStart.value);
      console.log('结束日期:', jobDateEnd.value);
      jobDate.value = jobDateStart.value + '至' + jobDateEnd.value;
    };

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
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-left: 10px;
}
</style>