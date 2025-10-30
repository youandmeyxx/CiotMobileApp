<template>
  <div>
    <div class="custom-div-title">运营商卡池报警查询</div>
    <div style="margin: 16px; padding-bottom:100px;">
        <van-button round block type="primary"  @click="getGroupInfo1">
            查询超量
        </van-button> 
        <br />
        <br />
        <van-button round block type="primary"  @click="getGroupInfoDetail1">
            查询全部
        </van-button>
        <br />
        <br />
        <van-button round block type="primary"  @click="exportToExcel">
            导出数据到Excel
        </van-button>
        <br />
    </div>
    <van-collapse style="padding-bottom:100px;" v-model="activeName" accordion>
      <van-collapse-item v-for="(item, index) in groupDatas1" :key="index" :title="item.offeringName+' ' +((item.useAmount/item.totalAmount)*100).toFixed(2) +'%'" :name="index"> 
        <ul>
            <li>卡池群组编号:{{ item.offeringId }}</li>
            <li>卡池群组名称:{{ item.offeringName }}</li>
            <li>已用比例:{{ ((item.useAmount/item.totalAmount)*100).toFixed(2) }}%</li>
            <li>剩余流量:{{ (item.remainAmount/1024).toFixed(2) }}MB</li>
            <li>已用流量:{{ (item.useAmount/1024).toFixed(2) }}MB</li>
            <li>总流量:{{ (item.totalAmount/1024).toFixed(2) }}MB</li>
          </ul>
      </van-collapse-item>
      <br />
      <van-collapse-item v-for="(item, index) in groupDatas2" :key="index" :title="item.offeringName+' ' +((item.useAmount/item.totalAmount)*100).toFixed(2) +'%'" :name="index">
        <ul>
            <li>卡池群组编号:{{ item.offeringId }}</li>
            <li>卡池群组名称:{{ item.offeringName }}</li>
            <li>已用比例:{{ ((item.useAmount/item.totalAmount)*100).toFixed(2) }}%</li>
            <li>剩余流量:{{ (item.remainAmount/1024).toFixed(2) }}MB</li>
            <li>已用流量:{{ (item.useAmount/1024).toFixed(2) }}MB</li>
            <li>总流量:{{ (item.totalAmount/1024).toFixed(2) }}MB</li>
          </ul>
      </van-collapse-item>
    </van-collapse> 
  </div>
  <Loading v-if="loading" />
</template>
<script setup lang="ts">
    import '@/style/custom.css';
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import type { GroupInfo } from '../support/interface';
    import Loading from '@/components/Loading.vue';
    import * as XLSX from 'xlsx';
    import { saveAs } from 'file-saver';
    const activeName = ref('1');
    const value2 = ref('10');
    const sourceList = ref([])
    const groupDatas1 = ref<GroupInfo[]>([]);
    const groupDatas2 = ref<GroupInfo[]>([]);
    const loading = ref(false);

    onMounted(() => {
        
    });

    const getCardSourceList = () => {
        axios.get(`${DOMAIN_RUL}/api/getCardSourceList`, {
        }).then((response) => {
            console.log(response.data.result);
            sourceList.value = response.data.result
        }).catch((error) => {
            console.log('Error:', error);
        });
    }
    const getGroupInfo1 = () => {
        loading.value = true;
        axios.get(`${DOMAIN_RUL}/api/cm/groupInfo`, {
            params: {
                offeringType: 1,
            }
        }).then((response) => {
            console.log(response.data.result);
            groupDatas1.value = response.data.result;
            // loading.value = false;
        }).catch((error) => {
            console.log('Error:', error);
            loading.value = false;
        });
        getGroupInfo2();
    }

    const getGroupInfo2 = () => {
        loading.value = true;
        axios.get(`${DOMAIN_RUL}/api/cm/groupInfo`, {
            params: {
                offeringType: 2,
            }
        }).then((response) => {
            console.log(response.data.result);
            groupDatas2.value = response.data.result;
            loading.value = false;
        }).catch((error) => {
            console.log('Error:', error);
            loading.value = false;
        });
    }
    const getGroupInfoDetail1 = () => {
        loading.value = true;
        axios.get(`${DOMAIN_RUL}/api/cm/groupInfoDetail`, {
            params: {
                offeringType: 1,
            }
        }).then((response) => {
            console.log(response.data.result);
            groupDatas1.value = response.data.result;
            // loading.value = false;
        }).catch((error) => {
            console.log('Error:', error);
            loading.value = false;
        });
        getGroupInfoDetail2();
    }

    const getGroupInfoDetail2 = () => {
        loading.value = true;
        axios.get(`${DOMAIN_RUL}/api/cm/groupInfoDetail`, {
            params: {
                offeringType: 2,
            }
        }).then((response) => {
            console.log(response.data.result);
            groupDatas2.value = response.data.result;
            loading.value = false;
        }).catch((error) => {
            console.log('Error:', error);
            loading.value = false;
        });
    }

    // 导出数据到Excel
    const exportToExcel = () => {
        if (groupDatas1.value.length === 0 && groupDatas2.value.length === 0) {
            alert('暂无数据可导出');
            return;
        }

        // 合并两个数据源
        const allData = [...groupDatas1.value, ...groupDatas2.value];

        // 准备导出的数据格式
        const exportData = allData.map(item => ({
            '卡池群组编号': item.offeringId,
            '卡池群组名称': item.offeringName,
            '已用比例': `${((item.useAmount / item.totalAmount) * 100).toFixed(2)}%`,
            '剩余流量(MB)': (item.remainAmount / 1024).toFixed(2),
            '已用流量(MB)': (item.useAmount / 1024).toFixed(2),
            '总流量(MB)': (item.totalAmount / 1024).toFixed(2)
        }));

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(exportData);
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '运营商卡池数据');
        // 生成Excel文件
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        // 保存文件
        saveAsExcelFile(excelBuffer, '运营商卡池数据');
    }

    // 保存Excel文件的辅助函数
    const saveAsExcelFile = (buffer: any, fileName: string) => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_' + new Date().toLocaleDateString() + EXCEL_EXTENSION);
    }

</script>
<style scoped>
</style>