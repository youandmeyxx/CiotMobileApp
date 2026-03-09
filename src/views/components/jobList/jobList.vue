<template>
  <div style="padding-bottom:100px;">
  <div class="custom-div-title">装维任务列表</div>
  <div>
    <van-search
      v-model="ctradername"
      label="客户名:"
      placeholder="请输入搜索关键词"
    >
  </van-search>
  <van-search
      v-model="userdef1"
      label="品牌名称:"
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
        @click="onClickButton"
      >
        搜索
      </van-button>
    </div>
  </div>
  <div>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item v-for="(item, index) in jobData" :key="index" :title="item.ctradername + ' ' + item.userdef1 + ' ' + item.assigntype + ' ' + item.jobdate + ' ' + item.empname" :name="index">
        <div>
          <ul>
            <li>任务类型:{{ item.assigntype }};</li>
          </ul>
          详情:
          <van-text-ellipsis
          rows="3"
          :content="item.billto"
          expand-text="展开"
          collapse-text="收起"
          />
          <ul>
            <li>客户铺名:{{ item.ctradername }}</li>
          </ul>
        </div>
          <ul>
            <li>销售单号:{{ item.billcode }}</li>
            <li>销售时间:{{ item.billdate }}</li>
            <li>装维人员:{{ item.operator }}</li>
            <li>安装时间:{{ item.jobdate }}</li>
            <li>销售员:{{ item.empname }}</li>
            <li>品牌名称:{{ item.userdef1 }}</li>
            <li>安装时间:{{ item.userdef2 }}</li>
            <li>沉默期:{{ item.userdef3 }}</li>
            <li>设备sn号1:{{ item.userdef4 }}</li>
            <li>设备sn号2:{{ item.userdef5 }}</li>
            <li>套餐编号:{{ item.userdef6 }}</li>
            <li>路由器:{{ item.userdef7 }}</li>
            <li>卡号1:{{ item.userdef8 }}</li>
            <li>卡号2:{{ item.userdef9 }}</li>
            <li>其他:{{ item.userdef10 }}</li>
            <li>卡号3:{{ item.userdef11 }}</li>
            <li>卡号4:{{ item.userdef12 }}</li>
          </ul>
          <van-button type="primary" size="small" @click="getBillIdByBillcode(item.billcode)">出货列表</van-button>
      </van-collapse-item>
    </van-collapse> 
  </div>
</div>
</template>
<script setup lang="ts" home="JobList">
  import { onMounted, ref } from 'vue';
  import { showToast } from 'vant';
  import '@/style/custom.css';
  import type { setuprecord, CalendarValue,Option,SaleBill} from '@/views/components/support/interface.ts';
import axios from 'axios';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import router from '@/router';
import { getUserinfoFromSession } from '../support/function';
import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';
  const operator = ref('');
  const ctradername =ref(''); 
  const activeName = ref('1');
  const billid = ref('');
  const userdef1 = ref('');
  const userInfoDetail = userInfoDetailStore();
  const userInfo = userInfoStore();
      //装维单数据
  const jobData = ref<SaleBill[]>([]);
  
  onMounted(() => {
    // 从 sessionStorage 中读取 userInfoDetail 和 userInfo
    getUserinfoFromSession();
  });


  const onSearch = () =>{

  };
  const onClickButton = () =>{
    axios.get(`${DOMAIN_RUL}/workWeChart/jobList`,{
      params: {
        operator: operator.value,
        tradername: ctradername.value,
        userdef1: userdef1.value,
        empname: userInfo.userInfo.name,
      }
    })
    .then(response => {
                if (response.data.code === 200) {
                  console.log(response.data.result);
                    jobData.value = response.data.result;
                    
                }
            })
    .catch(error => {
            console.error('请求失败', error);
            // 在这里处理错误
            });
  }; 

  function getBillIdByBillcode(billcode: string) {
      axios.get(`${DOMAIN_RUL}/workWeChart/getBillIdByBillcode`,{
        params: {
          billcode: billcode
        }
      }).then(response => {
        if (response.data.code === 200) {
          console.log("getBillIdByBillcode:",response.data.result);
          billid.value = response.data.result;
          console.log("billid:",billid.value);
          router.push({
          name: 'jobDetail',
          query: { billid: billid.value } // 假设 item.billid 是你要传递的参数
          });        
        }
      }).catch(error => {
            console.error('请求失败', error);
            // 在这里处理错误
      });
      return billid.value;
    }

</script>
<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>