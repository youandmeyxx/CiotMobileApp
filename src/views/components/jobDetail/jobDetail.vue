<!--
 * @Author: youandmeyxx 86011640@qq.com
 * @Date: 2025-09-28 13:05:07
 * @LastEditors: youandmeyxx 86011640@qq.com
 * @LastEditTime: 2025-10-28 08:43:37
 * @FilePath: \CiotMobileApp\src\views\components\jobDetail\jobDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
      <van-nav-bar title="销售详情列表" left-arrow @click-left="$router.back()" />
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in saleBillDetails"
          :key="index"
          :title="item.goodsname"
          :label="`规格: ${item.specs}, 单位: ${item.unitname}, 数量: ${item.unitquantity}, 单价: ${item.unitprice},设备编号:${item.userdef7} ${item.userdef8},备注:${item.remark} `"
        />
      </van-list>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import type { SaleBillDetail } from '@/views/components/support/interface.ts';
    import { useRoute } from 'vue-router';
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
    import axios from 'axios';
import { getUserinfoFromSession } from '../support/function';
    const route = useRoute();
    const billid = route.query.billid; 
    const saleBillDetails = ref<SaleBillDetail[]>([]);
    const loading = ref(false);
    const finished = ref(false);
  
    const onLoad = () => {
        const billid = route.query.billid; 
        console.log('billid:',billid);
    //get请求读取 saleBillDetails 数据
      axios.get(`${DOMAIN_RUL}/workWeChart/jobDetail`,{
      params:{
        billid: billid,
      }
    }).then((response) => {
        console.log(response.data.result);
        saleBillDetails.value = response.data.result.detail1; // 假设返回的数据结构是 { data: { saleBillDetails: SaleBillDetail[] } };
        loading.value = false; // 加载完成
        finished.value = true;
    }).catch((error) => {
      console.log('Error:', error);
    });
    };
  
  onMounted(() => {
    getUserinfoFromSession();
    onLoad();
  });
  </script>
  
  <style scoped>
  /* 可以在这里添加自定义样式 */
  </style>