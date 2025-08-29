<template>
  <div style="padding-bottom:100px;">
    <div class="custom-div-title">我的任务</div>
    <van-cell title="选择单个日期查询" :value="date" @click="show = true" />
    <van-calendar v-model:show="show" @confirm="onConfirm"  :min-date="minDate" :max-date="maxDate"  />
    <div>    
      <van-tabs v-model:active="tabs">
        <van-tab title="待执行" name="toExec">
          <div>
            <van-collapse v-model="collapse" accordion>
              <van-collapse-item v-for="(item, index) in myUnFinishJobData" :key="index" :title="item.jobdate +' '+ item.billcode +  item.ctradername" :name="index">
                <ul>
                  <li>任务类型:{{ item.assigntype }}</li>
                </ul>
                <div>详情:
                <van-text-ellipsis
                  rows="3"
                  :content="item.billto"
                  expand-text="展开"
                  collapse-text="收起"
                />
                </div>
                <ul>
                  <li>装维人员:{{ item.operator }}</li>
                  <li>安装时间:{{ item.jobdate + item.jobtime }}</li>
                </ul>
                <ul>
                  <li>
                    <router-link :to="{name: 'jobDetail',query: { billid: item.billid }}">出货列表</router-link>
                  </li>
                </ul>
                <div class="button-container">
                  <van-button type="primary" size="small" @click="onRecordClick(index)">登  记</van-button>
                  <van-button type="primary" size="small" @click="onRecordChange(index)">改  期</van-button>
                  <van-button type="primary" size="small" @click="onRecordTurnBack(index)">退  回</van-button>
                </div>
              </van-collapse-item>
            </van-collapse>
          </div>
        </van-tab>

        <van-tab title="已完成" name="done">
          <div>
            <van-collapse v-model="collapse" accordion>
            <van-collapse-item v-for="(item, index) in myFinishJobData" :key="index" :title="item.jobdate +' '+ item.billcode +  item.ctradername" :name="index">
              <div>详情:
                <van-text-ellipsis
                  rows="3"
                  :content="item.billto"
                  expand-text="展开"
                  collapse-text="收起"
                />
                </div>
                <ul>
                  <li>装维人员:{{ item.operator }}</li>
                  <li>安装时间:{{ item.jobdate }}</li>
                </ul>
            </van-collapse-item>
          </van-collapse>
          </div>
        </van-tab>
    </van-tabs>
    </div>
    <van-calendar v-model:show="showJobDate" @confirm="onConfirmJobDate"  :min-date="minDate" :max-date="maxDate" />
    <van-dialog v-model:show="showRemark" title="退回原因" show-cancel-button @confirm="onDialogConfirm">
      <div class="button-container">
        <textarea 
          v-model = "remark"
          cols="30" 
          rows="5"
          placeholder="请输入内容..."
          maxlength="200"
        ></textarea>
      </div>
    </van-dialog>

    <!-- <van-popup v-model:show="showTimePicker" destroy-on-close position="bottom">
      <van-time-picker
                  title="选择任务执行时间"
                  :model-value="pickerTimeValue"
                  @confirm="onTimeConfirm"
                  @cancel="showTimePicker = false"
                  />
    </van-popup> -->
  </div>
</template>
<script setup lang="ts" name="MyJob">
    import { DOMAIN_RUL,globalPath } from "@/plugins/globalVariables";
    import { onMounted, ref } from 'vue';
    import '@/style/custom.css';
    import type { setuprecord, CalendarValue,Option,SaleBill} from '@/views/components/support/interface.ts';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { userInfoDetailStore, userInfoStore } from "@/stores/userInfoDetail";
    import { generateNonce, getUserinfoFromSession } from "../support/function";
    const router = useRouter();
    const tabs = ref('toExec');
    const collapse = ref('1');
    const remark = ref('');
    const date = ref('');
    const show = ref(false);
    const minDate = new Date(2010, 0, 1);
    const maxDate = new Date(2099, 11, 31);
    const showJobDate = ref(false);
    const showRemark = ref(false);
    const currentIndex = ref(0);
    const userInfoDetail = userInfoDetailStore();
    const userInfo = userInfoStore();
        //装维单数据
    const myUnFinishJobData = ref<SaleBill[]>([]);
    const myFinishJobData = ref<SaleBill[]>([]);
    onMounted(() => {
      // 从 sessionStorage 中读取 userInfoDetail 和 userInfo
      getUserinfoFromSession();
      console.log(userInfoDetail.userInfoDetail);
      console.log(userInfo.userInfo);
      getUnfinishJobList();
      getHasfinishJobList();
    });

    function getUnfinishJobList(){
      console.log('执行getMyJobList');
      axios.get(`${DOMAIN_RUL}/workWeChart/myJobList`, {
      // axios.get('/workWeChart/myJobList', {
          params: {
            operator: userInfo.userInfo.name ,
            jobDate: date.value,
            hasfinish:0
          } 
        })
      .then(function (response) {
        myUnFinishJobData.value = response.data.result;
        console.log(myUnFinishJobData.value);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    function getHasfinishJobList(){
      axios.get(`${DOMAIN_RUL}/workWeChart/myJobList`, {
      // axios.get('/workWeChart/myJobList', {
          params: {
            operator: userInfo.userInfo.name,
            jobDate: date.value,
            hasfinish:1
          } 
        })
      .then(function (response) {
        myFinishJobData.value = response.data.result;
        console.log(myFinishJobData.value);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    const formatDate = (date: CalendarValue) => {
        const year = date.getFullYear();
        // 确保月份为两位数
        const month = String(date.getMonth() + 1).padStart(2, '0');
        // 确保日期为两位数
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };


    const onConfirm = (value: CalendarValue): void => {
      show.value = false;
      date.value = formatDate(value);
      getUnfinishJobList();
      getHasfinishJobList();
    };

    function onRecordClick(index: number){
      //跳转到登记页面并传入参数 billcode
      console.log('执行onRecordClick');
      router.push({path:'/jobrecord',query:{
        billcode:myUnFinishJobData.value[index].billcode,
        jobid:myUnFinishJobData.value[index].jobid
      }});
    }

    function onRecordChange(index: number){
      showJobDate.value = true;
      currentIndex.value = index;
      //跳转到登记页面并传入参数 billcode
      console.log('执行onRecordChange');
    }

    function onRecordTurnBack(index: number){
      showRemark.value = true;
      currentIndex.value = index;
    }

    // const onTimeConfirm = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
    //   console.log('选中的时间:', selectedValues.join(':'),currentIndex.value);
    //   assignJobData.value[currentIndex.value].jobtime =selectedValues.join(':');
    //   pickerTimeValue.value = selectedValues;
    //   showTimePicker.value = false;
    // };

    const onConfirmJobDate = (value: CalendarValue): void => {
      showJobDate.value = false;
      myUnFinishJobData.value[currentIndex.value].jobdate= formatDate(value);
      console.log('选中的日期:',myUnFinishJobData.value[currentIndex.value].jobdate);
      //保存修改的日期数据
      const jobInfo = myUnFinishJobData.value[currentIndex.value];
      console.log(jobInfo);
      // 发送 POST 请求
      axios.post(`${DOMAIN_RUL}/workWeChart/jobEdit`, jobInfo,{
        params: {
                nonce: generateNonce() 
            }
      })
        .then(response => {
          if (response.data.code === 200) {
            console.log('请求成功', response.data); 
          }
          getUnfinishJobList();
        })
        .catch(error => {
          console.error('请求失败', error);
          // 在这里处理错误
        });
    };

    const onDialogConfirm = (): void => {
      console.log('退回原因:',remark.value);
             //退回任务
       let recordInfo = { 
            billcode: myUnFinishJobData.value[currentIndex.value].billcode, 
            tel:  '',
            addr:  '', 
            contact:  '', 
            operator: myUnFinishJobData.value[currentIndex.value].operator,
            realnametype: '', 
            cusname: myUnFinishJobData.value[currentIndex.value].ctradername, 
            routertype: '', 
            routername: '', 
            aftersetup: '', 
            setupdate: myUnFinishJobData.value[currentIndex.value].jobdate, 
            topology:'',
            carrier: '', 
            picurl: '[]',
            jobid: myUnFinishJobData.value[currentIndex.value].jobid,
            assigntype: myUnFinishJobData.value[currentIndex.value].assigntype,
            verifytype: '退回',
            remark: remark.value,
                // 新增 nonce 参数，这里假设 nonce 是通过一个函数生成
        }
                // 发送 POST 请求
        axios.post(`${DOMAIN_RUL}/workWeChart/recordTrunback`, recordInfo,{
            params: {
                nonce: generateNonce() 
            }
        })
            .then(response => {
                if (response.data.code === 200) {
                    console.log('请求成功', response.data); 
                    getUnfinishJobList();
                    getHasfinishJobList();
                }
            })
            .catch(error => {
            console.error('请求失败', error);
            });
      showRemark.value = false;
    };





</script>
<style scoped>
</style>