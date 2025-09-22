<template>
  <div>
    <van-field v-model="iccid" label="ICCID 号" placeholder="请输入 ICCID 号" />
    <van-button @click="test()">查询</van-button>
    <div v-if="cardStatuInfo">
      <p>ICCID 号: {{ cardInfoMeta.iccidCode }}</p>
      <p>MSISDN 号: {{ cardInfoMeta.accessCode }}</p>
      <p>运营商通道:{{ cardInfoMeta.cardSource }}</p>
      <p>在用套餐:{{ cardInfoMeta.packageName }}</p>
      <p>套餐流量:{{ cardInfoMeta.flowQuota }}</p>
      <p>剩余流量:{{ cardInfoMeta.leftFlow }}</p>
      <p>到期时间:{{ cardInfoMeta.invalidTime }}</p>
      <p>APN 名称: {{ cardStatuInfo.apnName }}</p>
      <p>限速情况: {{ cardStatuInfo.speedLimitStatus }}</p>
      <p>通信状态: {{ cardStatuInfo.serviceStatus }}</p>
      <p>卡状态: {{ cardStatuInfo.cardStatus }}</p>
      <p>停机原因: {{ cardStatuInfo.stopReason}}</p>
      <p>本月用量: {{ cardStatuInfo.monthlyUsage }}</p>
      <p>归属群名称: {{ cardStatuInfo.groupName }}</p>
      <p>区域限制: {{ cardStatuInfo.areaRestriction }}</p>
      <p>限制类型: {{ cardStatuInfo.areaRestrictType }}</p>
      <p>限制状态: {{ cardStatuInfo.restrictionStatus }}</p>
      <p>IMEI 号: {{ cardStatuInfo.IMEI }}</p>
      <p>实名状态: {{ cardStatuInfo.realNameStatus }}</p>
    </div>
  </div>
  <Loading v-if="loading" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Field, Button, showLoadingToast } from 'vant';
import Loading from '@/components/Loading.vue';
import type { CardStatuInfo,CardInfoMeta } from '../support/interface';
import axios from 'axios';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { bytesToSize } from '../support/function';

const loading = ref(false);

// 定义输入的 ICCID 号
const iccid = ref('');
// 定义卡片信息
const cardStatuInfo = ref<CardStatuInfo>({} as CardStatuInfo);
const cardInfoMeta = ref<CardInfoMeta>({} as CardInfoMeta);

const tp = ref<CardStatuInfo>({} as CardStatuInfo);


const test = () => {
   axios.get(`${DOMAIN_RUL}/api/cm/test`,{
      params:{
         iccid: iccid.value, 
      }
    }).then((response) => {
        console.log(response.data.result);

        cardStatuInfo.value.cardStatus = response.data.result; // 假设返回的数据结构是 { data: { cardStatuInfo: CardStatuInfo } };
    }).catch((error) => {
      console.log('Error:', error);
    }); 
}



// 模拟查询卡片信息的函数
const fetchCardInfo = async () => {
  initInfo();

  loading.value = true;
  
await axios.get(`${DOMAIN_RUL}/api/cm/getCardInfoDetail`,{
      params:{
         iccid: iccid.value, 
      }
    }).then((response) => {
        console.log(response.data.result);
        cardInfoMeta.value.iccidCode = response.data.result.cardInfoMeta.iccidCode; 
        cardInfoMeta.value.cardSource = response.data.result.cardInfoMeta.cardSource; 
        cardInfoMeta.value.accessCode = response.data.result.cardInfoMeta.accessCode; 
        cardInfoMeta.value.packageName = response.data.result.cardInfoMeta.packageName; 
        cardInfoMeta.value.invalidTime = response.data.result.cardInfoMeta.invalidTime;
        cardInfoMeta.value.flowQuota = bytesToSize(response.data.result.cardInfoMeta.flowQuota); 
        cardInfoMeta.value.leftFlow = bytesToSize(response.data.result.cardInfoMeta.leftFlow); 
        cardStatuInfo.value.cardStatus = response.data.result.cardStatuInfo.cardStatus; 
        cardStatuInfo.value.IMEI = response.data.result.cardStatuInfo.imei;
        cardStatuInfo.value.monthlyUsage =bytesToSize(response.data.result.cardStatuInfo.monthlyUsage); 
        cardStatuInfo.value.serviceStatus = response.data.result.cardStatuInfo.serviceStatus;
        cardStatuInfo.value.stopReason = response.data.result.cardStatuInfo.stopReason;
        cardStatuInfo.value.apnName = response.data.result.cardStatuInfo.apnName;
        cardStatuInfo.value.realNameStatus = response.data.result.cardStatuInfo.realNameStatus; 
        cardStatuInfo.value.groupName = response.data.result.cardStatuInfo.groupName;  
        cardStatuInfo.value.areaRestriction = response.data.result.cardStatuInfo.areaRestriction;   
        if(response.data.result.cardStatuInfo.areaRestrictType==="1"){
            cardStatuInfo.value.areaRestrictType = "手动录入";
        }else if(response.data.result.cardStatuInfo.areaRestrictType==="2"){
            cardStatuInfo.value.areaRestrictType = "首话激活";
        }else{
            cardStatuInfo.value.areaRestrictType = "未知";
        }
        cardStatuInfo.value.speedLimitStatus = response.data.result.cardStatuInfo.speedLimitStatus; 
        loading.value = false;

    }).catch((error) => {
      console.log('Error:', error);
      loading.value = false;
    });


// //读取卡状态
// await axios.get(`${DOMAIN_RUL}/api/cm/getCardStatus`,{
//       params:{
//          iccid: iccid.value, 
//       }
//     }).then((response) => {
//         console.log(response.data.result);

//         cardStatuInfo.value.cardStatus = response.data.result; // 假设返回的数据结构是 { data: { cardStatuInfo: CardStatuInfo } };
//     }).catch((error) => {
//       console.log('Error:', error);
//     });
//     //读取imei号
// await axios.get(`${DOMAIN_RUL}/api/cm/getImei`,{
//       params:{
//          iccid: iccid.value, 
//       }
//     }).then((response) => {
//         console.log(response.data.result);
//         cardStatuInfo.value.IMEI = response.data.result; // 假设返回的数据结构是 { data: { cardStatuInfo: CardStatuInfo } };
//     }).catch((error) => {
//       console.log('Error:', error);
//     });
//     //读取停机状态
// await axios.get(`${DOMAIN_RUL}/api/cm/stopReason`,{
//         params:{
//              iccid: iccid.value, 
//         }
//         }).then((response) => {
//             console.log(response.data.result);
//             cardStatuInfo.value.stopReason = response.data.result; // 假设返回的数据结构是 { data: { cardStatuInfo: CardStatuInfo } };
//         }).catch((error) => {
//         console.log('Error:', error);
        
//     });
//     //读取当月流量
// await axios.get(`${DOMAIN_RUL}/api/cm/queryRealTimeFlowData`,{
//         params:{
//              iccid: iccid.value, 
//         }
//         }).then((response) => {
//                 console.log(response.data.result);
//                 cardStatuInfo.value.monthlyUsage = response.data.result.used; 
//             }).catch((error) => {
//             console.log('Error:', error);
//     });
//     //读取通信状态
// await axios.get(`${DOMAIN_RUL}/api/cm/getCommunicationFunctionStatus`,{
//         params:{
//              iccid: iccid.value, 
//         }
//         }).then((response) => {
//                 console.log(response.data.result);
//                 cardStatuInfo.value.serviceStatus = response.data.result.result[0].serviceTypeList[0].serviceStatus;
//                 cardStatuInfo.value.apnName = response.data.result.result[0].serviceTypeList[0].apnName;
//               }).catch((error) => {
//             console.log('Error:', error);
//     });
//     //读取实名状态
// await  axios.get(`${DOMAIN_RUL}/api/cm/isRealNameCertified`,{
//         params:{
//              iccid: iccid.value,
//         }
//         }).then((response) => {
//                 console.log(response.data.result);   
//                 cardStatuInfo.value.realNameStatus = response.data.result;  
//         }).catch((error) => {
//             console.log('Error:', error);
//         });
//         //读取群组名称
//   await axios.get(`${DOMAIN_RUL}/api/cm/groupByMember`,{
//         params:{
//              iccid: iccid.value, 
//         }
//         }).then((response) => {
//                 console.log(response.data.result);   
//                 cardStatuInfo.value.groupName = response.data.result;  
//         }).catch((error) => {
//             console.log('Error:', error);
//         });
//     //读取区域限制
//     await axios.get(`${DOMAIN_RUL}/api/cm/regionLimitArea`,{
//         params:{
//              iccid: iccid.value,
//         }
//         }).then((response) => {
//                 console.log(response.data.result);   
//                 cardStatuInfo.value.areaRestriction = response.data.result.restrictedArea;   
//                 cardStatuInfo.value.areaRestrictType = response.data.result.areaRestrictType=="1"?"手动录入":"首话激活"; 
//         }).catch((error) => {
//             console.log('Error:', error);
//         });
//         //读取限速状态
//         await axios.get(`${DOMAIN_RUL}/api/cm/simDataDiagnosis`,{
//         params:{
//              iccid: iccid.value,
             
//         }
//         }).then((response) => {
//                 console.log(response.data.result);   
//                 cardStatuInfo.value.speedLimitStatus = response.data.result;    
//         });


};

const initInfo = () => {
  cardStatuInfo.value = {
    iccid: '',
    MSISDN:'' ,
    IMEI: '',
    apnName: '',
    speedLimitStatus:   '',
    serviceStatus:  '',
    monthlyUsage:   '',
    groupName:  '',
    areaRestriction:  '',
    areaRestrictType:   '',
    restrictionStatus:    '',
    cardSeparationStatus:   '',
    iotStatus:  '',
    cardStatus:  '',
    realNameStatus:   '',
    stopReason:  '',
  };
} 



function bytesToSizeflow() {
  throw new Error('Function not implemented.');
}
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
