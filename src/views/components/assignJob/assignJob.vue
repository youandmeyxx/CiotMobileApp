<template>
  <div style="padding-bottom:100px;">
  <div>
        <van-search
        v-model="date"
        show-action
        label="搜索日期:"
        @click="showDate = true"
        placeholder="请输入搜索关键词"
        >
        </van-search>
        <van-search
        v-if="assignType != '新装'"
        v-model="billcode"
        show-action
        label="销售单号:"
        placeholder="请输入搜索关键词"
        >
        </van-search>
        <van-search
        v-model="ctradername"
        show-action
        label="客户名称:"
        placeholder="请输入搜索关键词"
        >
        </van-search>
        <div class="button-container">
        <van-button
          plain
          icon="search"
          type="success"
          size="small"
          @click="getSaleList"
        >
          搜索
        </van-button>
    </div>
  <div class="custom-div-title">任务分配</div>



    <van-form @submit="onSubmit">
      <van-radio-group v-model="assignType" direction="horizontal">
        <van-radio name="新装" :checked="assignType === '新装'">新装</van-radio>
        <van-radio name="维修更换">维修更换</van-radio>
        <van-radio name="拆机">拆机</van-radio>
        <van-radio name="已分配">已分配</van-radio>
      </van-radio-group>
        <div  v-for="(item, index) in assignJobData" :key="index">
            <van-cell>
                <template #title>
                    <span class="custom-title">{{item.billcode}}</span>
                </template>
                <template #right-icon>
                    <van-button v-if="assignType != '已分配'" type="primary"  size="mini" class="custom-button" @click="jobAdd(index)">分  配</van-button>
                    <van-button v-if="assignType === '已分配'" type="primary"  size="mini" class="custom-button" @click="jobEdit(index)">修  改</van-button>
                  </template>
            </van-cell>
            <van-cell-group inset>
              <div>详情:
                <van-text-ellipsis
                  rows="3"
                  :content="item.billto"
                  expand-text="展开"
                  collapse-text="收起"
                />
                <van-button type="primary" size="small" @click="getBillIdByBillcode(item.billid)">出货列表</van-button>
                <div>详细信息:<van-text-ellipsis 
                  rows="3"
                  :content="'品牌名称:' +(item.userdef1===null?'':item.userdef1) + 
                            '安装时间:' +(item.userdef2===null?'':item.userdef2) + 
                            '沉默期:' +(item.userdef3===null?'':item.userdef3) +
                            '设备sn号1:' +(item.userdef4===null?'':item.userdef4) +
                            '设备sn号2:' +(item.userdef5===null?'':item.userdef5) +
                            '套餐编号:' +(item.userdef6===null?'':item.userdef6) +
                            '路由器:' +(item.userdef7===null?'':item.userdef7) +
                            '卡号1:' +(item.userdef8===null?'':item.userdef8) +
                            '卡号2:' +(item.userdef9===null?'':item.userdef9) +
                            '其他:' +(item.userdef10===null?'':item.userdef10) +
                            '卡号3:' +(item.userdef11===null?'':item.userdef11) +
                            '卡号4:' +(item.userdef12===null?'':item.userdef12)"
                  expand-text="展开"
                  collapse-text="收起"
                  /></div>
              </div>
              <div>客户铺名:
                <van-text-ellipsis
                  rows="3"
                  :content="item.ctradername"
                  expand-text="展开"
                  collapse-text="收起"
                />
              </div>
              <div>销售人员:
                <van-text-ellipsis
                  rows="2"
                  :content="item.empname"
                  expand-text="展开"
                  collapse-text="收起"
                />
              </div>
                <van-field
                    v-model="assignJobData[index].operator"
                    is-link
                    readonly
                    name="picker"
                    label="装维人员:"
                    placeholder="点击选择装维人员"
                    @click="beforeShow(index)"
                />
                <!-- 新增时间选择栏位 -->
                <van-field
                v-model="assignJobData[index].jobtime"
                is-link
                readonly
                clickable
                label="任务执行时间"
                @click="showTimePicker = true; currentIndex = index"
                />
                <van-cell title="安装日期" :value="jobDate" @click="showJobDate = true" />
                
            </van-cell-group>
            <van-divider />
        </div>
    </van-form>
  </div>
</div>
    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
                <van-picker
                    :columns="columns"
                    :model-value="pickerValue"
                    @confirm="onConfirm"
                    @cancel="showPicker = false"
                />
    </van-popup>
    <van-calendar v-model:show="showDate" @confirm="onConfirmDate" :min-date="minDate" :max-date="maxDate" />
    <van-calendar v-model:show="showJobDate" @confirm="onConfirmJobDate"  :min-date="minDate" :max-date="maxDate" />
    <van-popup v-model:show="showTimePicker" destroy-on-close position="bottom">
      <van-time-picker
                  title="选择任务执行时间"
                  :model-value="pickerTimeValue"
                  @confirm="onTimeConfirm"
                  @cancel="showTimePicker = false"
                  />
    </van-popup>
     <Loading v-if="loading" />

</template>
<script setup lang="ts" home="AssignJob">
  import { DOMAIN_RUL,globalPath, SETUP_MANAGER } from "@/plugins/globalVariables";
  import { onMounted, ref } from 'vue';
  import '@/style/custom.css';
  import type { setuprecord, CalendarValue,Option,SaleBill} from '@/views/components/support/interface.ts';
  import axios from 'axios';
  import { generateNonce, nowDate } from "../support/function";
  import { userInfoDetailStore, userInfoStore } from "@/stores/userInfoDetail";
  import router from "@/router";
  import { showToast } from "vant";
  import Loading from '@/components/Loading.vue';
    const loading = ref(false);
    const date = ref('');
    const billcode = ref('');
    const ctradername = ref('');
    const jobDate= ref('');
    const pickerValue = ref<string[]>([]);
    const pickerTimeValue = ref<string[]>([]);
    const zwIndex = ref(0);
    const assignType = ref('');
    const showPicker = ref(false);
    const showDate = ref(false);
    const showJobDate = ref(false);
    const showTimePicker = ref(false);
    const currentIndex = ref(0);
    const minDate = new Date(2010, 0, 1);
    const maxDate = new Date(2099, 11, 31);
    const billid = ref('');
    const userInfoDetail = userInfoDetailStore();
    const userInfo = userInfoStore();
    // 装维人员数据
    const columns = ref([]);
    //装维单数据
    const assignJobData = ref<SaleBill[]>([]);

    onMounted(() => {
      assignType.value = '新装';
      date.value = nowDate();
      getSaleList();
    });
    
    // 点击选择装维人员
    const onConfirm = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log(selectedValues, selectedOptions[0].text);
      assignJobData.value[zwIndex.value].operator = selectedOptions[0].text;
      pickerValue.value = selectedValues;
      showPicker.value = false;
    };

    const onSubmit = (values: setuprecord) => {
      console.log('submit', values);
    };

    // 在 van-popup 显示前执行的函数
    const beforeShow = (a:number) => {
      console.log('Popup is about to show');
      zwIndex.value = a;
      // 发送 GET 请求
      axios.get(`${DOMAIN_RUL}/workWeChart/getOperatorInfoList`)
        .then(response => {
          console.log('请求成功', response.data.result);
          columns.value = response.data.result
          //充data中获取装维人员数据
          showPicker.value = true
          // 在这里处理响应数据
        })
        .catch(error => {
          console.error('请求失败', error);
          // 在这里处理错误
        });
    };

    const formatDate = (date: CalendarValue) => {
      const year = date.getFullYear();
      // 确保月份为两位数
      const month = String(date.getMonth() + 1).padStart(2, '0');
      // 确保日期为两位数
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const onTimeConfirm = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log('选中的时间:', selectedValues.join(':'),currentIndex.value);
      assignJobData.value[currentIndex.value].jobtime =selectedValues.join(':');
      pickerTimeValue.value = selectedValues;
      showTimePicker.value = false;
    };



    const onConfirmDate = (value: CalendarValue): void => {
      showDate.value = false;
      date.value = formatDate(value);
    };

    const onConfirmJobDate = (value: CalendarValue): void => {
      showJobDate.value = false;
      jobDate.value = formatDate(value);
    };

    // 定义 getSaleList 函数
    const getSaleList = () => {
      // if(SETUP_MANAGER===userInfoDetail.userInfoDetail.name){
        const resultDate = date.value;
        console.log(date.value);
        loading.value = true;
        // 发送 GET 请求

        axios.get(`${DOMAIN_RUL}/workWeChart/saleList`, {
          params: {
            resultDate: resultDate,
            assignType: assignType.value,
            ctradername: ctradername.value,
            billcode: billcode.value
          }
        })
          .then(response => {
            console.log('请求成功', response.data);
            assignJobData.value = response.data.result;
            loading.value = false;
            //充data中获取装维人员数据
            // 在这里处理响应数据
          })
          .catch(error => {
            console.error('请求失败', error);
            // 在这里处理错误
          });
      // }else{
        // console.log('您没有权限查看此页面!');
      // }
    };

    const jobAdd = (index:number) => {
      let nonce = generateNonce();
      console.log('执行${index} jobAdd 函数');
      assignJobData.value[index].jobdate = jobDate.value;
      assignJobData.value[index].assigntype= assignType.value;
      const jobInfo = assignJobData.value[index];
      console.log(jobInfo);
      if(validateData(jobInfo)===false){
        console.log('执行 jobAdd validateData 函数');
        return;
      }
      // 发送 POST 请求
      axios.post(`${DOMAIN_RUL}/workWeChart/jobAdd`, jobInfo,{
        params: {
                nonce: nonce
            }
      })
        .then(response => {
          if (response.data.code === 200) {
            showToast('分配成功!');
            console.log('请求成功', response.data); 
          }
          getSaleList();
        })
        .catch(error => {
          console.error('请求失败', error);
          // 在这里处理错误
        });
      
    };

    const jobEdit = (index:number) => {
      let nonce = generateNonce();
      console.log('执行${index} jobAdd 函数');
      assignJobData.value[index].jobdate = jobDate.value;
      assignJobData.value[index].assigntype= assignType.value;
      const jobInfo = assignJobData.value[index];
      console.log(jobInfo);
      // 发送 POST 请求
      axios.post(`${DOMAIN_RUL}/workWeChart/jobEdit`, jobInfo,{
        params: {
                nonce: nonce
            }
      })
        .then(response => {
          if (response.data.code === 200) {
            console.log('请求成功', response.data); 
          }
          getSaleList();
        })
        .catch(error => {
          console.error('请求失败', error);
          // 在这里处理错误
        });
    }
    
    function getBillIdByBillcode(billcode: string) {
      router.push({
            name: 'jobDetail',
            query: { billid: billcode } // 假设 item.billid 是你要传递的参数
          });
    }


//数据完整性校验
const validateData = (data: any) => {
  let flog = true;
  console.log(data.jobdate);
  if(data.operator===undefined || data.jobtime===undefined || data.jobdate===undefined){
    showToast('所空字段为填请检查!');
    flog =false;
  }
  return flog;
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