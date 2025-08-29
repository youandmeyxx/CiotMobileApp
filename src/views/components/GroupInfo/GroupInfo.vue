<template>
  <div>
    <div class="custom-div-title">运营商卡池报警查询</div>
    <div style="margin: 16px; padding-bottom:100px;">
        <van-button round block type="primary"  @click="getGroupInfo">
            查询超量
        </van-button> 
        <br />
        <van-button round block type="primary"  @click="getGroupInfoDetail">
            查询全部
        </van-button>
    </div>
    <van-collapse style="padding-bottom:100px;" v-model="activeName" accordion>
      <van-collapse-item v-for="(item, index) in groupDatas" :key="index" :title="item.offeringName+' ' +((item.useAmount/item.totalAmount)*100).toFixed(2) +'%'" :name="index">
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
    const activeName = ref('1');
    const value2 = ref('10');
    const sourceList = ref([])
    const groupDatas = ref<GroupInfo[]>([]);
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
    const getGroupInfo = () => {
        loading.value = true;
        axios.get(`${DOMAIN_RUL}/api/cm/groupInfo`, {
        }).then((response) => {
            console.log(response.data.result);
            groupDatas.value = response.data.result;
            loading.value = false;
        }).catch((error) => {
            console.log('Error:', error);
            loading.value = false;
        });
    }

    const getGroupInfoDetail = () => {
        loading.value = true;
        axios.get(`${DOMAIN_RUL}/api/cm/groupInfoDetail`, {
        }).then((response) => {
            console.log(response.data.result);
            groupDatas.value = response.data.result;
            loading.value = false;
        }).catch((error) => {
            console.log('Error:', error);
            loading.value = false;
        });
    }

</script>
<style scoped>
</style>