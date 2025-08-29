<template>
    <div>
    <div class="custom-div-title">装维登记报表</div>
    <van-cell title="选择日期查询" :value="jobDate" @click="showDate = true" />

    <div class="button-container">
      <van-button
        plain
        icon="search"
        type="primary"
        @click="getKaiDanList"
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
  <a-table :columns="columns" :data-source="reportData" :scroll="{ x: 3000 }">
  </a-table>
  <van-calendar v-model:show="showDate" type="range" @confirm="onConfirmDate"  :min-date="minDate" :max-date="maxDate" />
  <Loading v-if="loading" />
</template>
<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import type { CalendarValue, kaiDanReport } from '../support/interface';
    import axios from 'axios';
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
    import { columns} from './columns';
    import Loading from '@/components/Loading.vue';
    type CalendarV = Date | [Date, Date];
    const showDate = ref(false);
    const minDate = new Date(2010, 0, 1);
    const maxDate = new Date(2099, 11, 31);
    const dateStart= ref('');
    const dateEnd= ref('');
    const jobDate=ref('');
    const reportData = ref<kaiDanReport[]>([]);
    const loading = ref(false);

    // 引入 xlsx 库
    import * as XLSX from 'xlsx'; 
    
    const getKaiDanList = () => {
        loading.value = true;
        axios.get(`${DOMAIN_RUL}/workWeChart/kaidanDetailReport`,{
            params:{
                dateStart:dateStart.value,
                dateEnd:dateEnd.value,
            }
        }).then(res=>{
            if (res.data.code === 200) {
                console.log(res.data.result);
                reportData.value = res.data.result; // 假设返回的数据结构与 reportData 相匹配
                // 处理返回的数据
            } else {
                console.error('获取数据失败:', res.data.message);
            }
             loading.value = false;
        }).catch(error => {
            console.error('请求失败:', error);
            loading.value = false;
        });
    }

  const exportRecordList = () => {
    if (reportData.value.length === 0) {
      console.log('没有数据可导出');
      return;
    }

    // 将数据转换为 worksheet
    const ws = XLSX.utils.json_to_sheet(reportData.value);
        // 修改表头（例如，将第一行的内容改为新的表头）
    const headers = ['类型', '单据日期', '单据编号','结算单位','业务员','货物名称','规格','数量','单价','货款','已结算金额','客户欠款','摘要','备注','收款单编号','部门']; // 新的表头内容
    headers.forEach((header, index) => {
      ws[XLSX.utils.encode_cell({r: 0, c: index})].v = header; // 修改第一行的单元格值
    });
    // 创建 workbook 并添加 worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '销售开单明细表');
    // 生成 Excel 文件并下载
    XLSX.writeFile(wb, '销售开单明细表.xlsx');
  }

    const onConfirmDate = (value: CalendarV): void => {
      let start: Date | null = null;
      let end: Date | null = null;
      
      if (Array.isArray(value)) {
        [start, end] = value;
      } else {
        start = value;
        end = value;
      }
      showDate.value = false;
      dateStart.value = formatDate(start);
      dateEnd.value = formatDate(end);
      console.log('开始日期:', dateStart.value);
      console.log('结束日期:', dateEnd.value);
      jobDate.value = dateStart.value + '至' + dateEnd.value;
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
</style>