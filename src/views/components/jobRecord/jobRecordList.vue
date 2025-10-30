<template>
  <div style="padding-bottom:100px;">
    <div class="custom-div-title">装维登记列表</div>
    <div>
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
    </div>
  </div>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item v-for="(item, index) in assignJobData" :key="index" :title="item.cusname" :name="index">
        <ul>
          <li>任务类型:{{ item.assigntype }}</li>
          <li>地址:{{ item.addr }}</li>
          <li>装维人员:{{ item.operator }}</li>
          <li>联系人:{{ item.contact }}</li>
          <li>联系电话:{{ item.tel }}</li>
          <li>网络拓扑:{{ item.topology }}</li>
          <li>运营商:{{ item.carrier }}</li>
          <li>实名类型:{{ item.realnametype }}</li>
          <li>店铺路由器:{{ item.routertype }}</li>
          <li>路由器型号:{{ item.routername }}</li>
          <li>安装后应用:{{ item.aftersetup }}</li>
          <li>安装日期:{{ item.setupdate }}</li>
          <li>审核类型:{{ item.verifytype }}</li>
          <li>备注:{{ item.remark }}</li>
          <li><van-button type="primary" size="small" @click="getBillIdByBillcode(item.billcode)">出货列表</van-button></li>
          <li>装维图片</li>
          <van-image v-for="(pic, index) in JSON.parse(item.picurl)" :key="index"
            width="100"
            height="100"
            :src="'https://appl.chuangliniot.cn/images/small'+ pic"
            @click="handleImageClick('https://appl.chuangliniot.cn/images/'+ pic)"
          />
          <li>微信图片</li>
          <van-image v-for="(picwx, index) in JSON.parse(item.wxpicurl)" :key="index"
            width="100"
            height="100"
            :src="'https://appl.chuangliniot.cn/images/small'+ picwx"
            @click="handleImageClick('https://appl.chuangliniot.cn/images/'+ picwx)"
          />
        </ul>
        <div class="button-container">
          <van-button type="primary" size="small" @click="deVerifyRecord(item.jobid)">反审核</van-button>
        </div>
      </van-collapse-item>
    </van-collapse> 
  </div>
</template>
<script setup lang="ts">
    import '@/style/custom.css';
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import type { setuprecord } from '../support/interface';
    import { showImagePreview } from 'vant';
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';
import router from '@/router';
import { getUserinfoFromSession } from '../support/function';
    const assignJobData = ref<setuprecord[]>([]);
    const  operator = ref('');
    const  ctradername = ref('');
    const activeName = ref('1');
    const billid = ref('');
    const userInfoDetail = userInfoDetailStore();
    const userInfo = userInfoStore();

    onMounted(() => {
      // 从 sessionStorage 中读取 userInfoDetail 和 userInfo
      getUserinfoFromSession();
      console.log("userInfoDetail:",userInfoDetail.userInfoDetail);
    });

    function handleImageClick(url: string) {
        showImagePreview([url]);
    }

    const deVerifyRecord = (jobid:number) => {
      axios.get(`${DOMAIN_RUL}/workWeChart/deVerifyRecord`,{
        params: {
          jobid: jobid
        }
      })
            .then(response => {
                if (response.data.code === 200) {
                  console.log(response.data.result);
                  getrecordList();
                }
            })
            .catch(error => {
            console.error('请求失败', error);
            // 在这里处理错误
            });

    }
    function getrecordList() {
      console.log("operator:",operator.value);
      console.log("ctradername:",ctradername.value);
      console.log("userInfoDetail:",userInfoDetail.userInfoDetail);
      axios.get(`${DOMAIN_RUL}/workWeChart/recordList`,{
        params: {
            operator: operator.value,
            ctradername: ctradername.value,
            empname: userInfo.userInfo.name,
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
</style>