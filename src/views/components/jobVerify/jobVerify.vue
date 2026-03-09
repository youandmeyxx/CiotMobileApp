<template>
  <div style="padding-bottom:100px;">
    <div class="custom-div-title">装维审核</div>
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
          <li v-if="item.assigntype === '维修更换'">更换设备SN号:{{ item.devicesn }}</li>
          <li v-if="item.assigntype === '维修更换'">更换路由器SN号:{{ item.routersn }}</li>
          <li>安装后应用:{{ item.aftersetup }}</li>
          <li>安装日期:{{ item.setupdate }}</li>
          <li>审核类型:{{ item.verifytype }}</li>
          <li>备注:{{ item.remark }}</li>
          <li>
              <!-- <router-link to="" @click="(event: MouseEvent) => handleLinkClick(index, event)" >出货列表</router-link> -->
              <van-button type="primary" size="small" @click="getBillIdByBillcode(item.billcode)">出货列表</van-button>
              <!-- <router-link :to="{name: 'jobDetail',query: { billid: getBillIdByBillcode(item.billcode) }}">出货列表</router-link> -->
          </li>
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
          <van-button type="primary" size="small" @click="verifyRecord(item.jobid)">审核</van-button>
          <van-button type="primary" size="small" @click="unVerifyRecord(item.jobid)">驳回</van-button>
        </div>
      </van-collapse-item>
    </van-collapse> 
  </div>
</template>
<script setup lang="ts">
    import '@/style/custom.css';
    import { onMounted, ref } from 'vue';
    import { showToast } from 'vant';
    import { showImagePreview } from 'vant';
    import type {setuprecord} from '@/views/components/support/interface.ts';
    import axios from 'axios';
    import {FULL_DOMAIN_RUL, DOMAIN_RUL, SETUP_MANAGER } from '@/plugins/globalVariables';
    import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';
    import { getUserinfoFromSession } from '../support/function';
import router from '@/router';
    const activeName = ref('1');
    //装维单数据
    const assignJobData = ref<setuprecord[]>([]);

    const userInfoDetail = userInfoDetailStore();
    const userInfo = userInfoStore();
    const billid = ref('');
    onMounted(() => {
        getUserinfoFromSession();
        getrecordList();
    });

        //装维单数据
    const setupData = ref<setuprecord[]>([
      {
        billcode: '',
        cusname: '',
        addr: '',
        contact: '',
        tel: '',
        operator: '',
        routersn: '',
        devicesn: '',
        topology: '',
        routertype: '',
        routername: '',
        aftersetup: '',
        setupdate: '',
        picurl: '',
        wxpicurl: '',
        realnametype: '',
        carrier: '',
        jobid: 0,
        assigntype: '',
        verifytype: '',
        remark: '',
        recorddate: '',
        billto: '',
        empname: ''
      }, 
    ]);
    function handleImageClick(url: string) {
        showImagePreview([url]);
    }

    function getrecordList() {
      axios.get(`${DOMAIN_RUL}/workWeChart/verifyList`)
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
    
    const verifyRecord = (jobid:number) => {
      axios.get(`${DOMAIN_RUL}/workWeChart/verifyRecord`,{
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
    
    const unVerifyRecord = (jobid:number) => {
      axios.get(`${DOMAIN_RUL}/workWeChart/unVerifyRecord`,{
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
/* 列表样式 */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

/* 图片样式 */
.van-image {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 16px;
}
</style>