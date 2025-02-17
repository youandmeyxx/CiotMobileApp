<template>
  <body>

    <div class="custom-div-title">我的任务</div>
    <van-cell title="选择单个日期查询" :value="date" @click="show = true" />
    <van-calendar v-model:show="show" @confirm="onConfirm" />
    <div>    
      <van-tabs v-model:active="tabs">
        <van-tab title="待执行" name="toExec">
          <div>
            <van-collapse v-model="collapse" accordion>
              <van-collapse-item v-for="(item, index) in jobData" :key="index" :title="item.cusName" :name="index">
                <ul>
                  <li>地址:{{ item.addr }}</li>
                  <li>装维人员:{{ item.operator }}</li>
                  <li>联系人:{{ item.contact }}</li>
                  <li>联系电话:{{ item.tel }}</li>
                </ul>
                <div class="button-container">
                  <van-button type="primary" size="small">登  记</van-button>
                </div>
              </van-collapse-item>
            </van-collapse>
          </div>
        </van-tab>
        <van-tab title="进行中" name="executing">
          <div>
              <van-collapse v-model="collapse" accordion>
                <van-collapse-item v-for="(item, index) in jobData" :key="index" :title="item.cusName" :name="index">
                  <ul>
                    <li>地址:{{ item.addr }}</li>
                    <li>装维人员:{{ item.operator }}</li>
                    <li>联系人:{{ item.contact }}</li>
                    <li>联系电话:{{ item.tel }}</li>
                  </ul>
                  <div class="button-container">
                    <van-button type="primary" size="small">登  记</van-button>
                  </div>
                </van-collapse-item>
              </van-collapse>
          </div>
        </van-tab>
        <van-tab title="已完成" name="done">
          <div>
            <van-collapse v-model="collapse" accordion>
            <van-collapse-item v-for="(item, index) in jobData" :key="index" :title="item.cusName" :name="index">
              <ul>
                <li>地址:{{ item.addr }}</li>
                <li>装维人员:{{ item.operator }}</li>
                <li>联系人:{{ item.contact }}</li>
                <li>联系电话:{{ item.tel }}</li>
              </ul>
            </van-collapse-item>
          </van-collapse>
          </div>
        </van-tab>
    </van-tabs>
    </div>
  </body>
</template>
<script setup lang="ts" name="MyJob">
  import { ref } from 'vue';
  import '@/style/custom.css';
  const tabs = ref('toExec');
  const collapse = ref('1');
  const date = ref('');
  const show = ref(false);


  const tel = ref('');
  const addr = ref('');
  const contact = ref('');
  const operator = ref('');
  const cusName = ref('穿堂风');

  interface FormValues {
        tel: string;
        addr: string;
        contact: string;
        operator: string;
        cusName: string;
    }
  interface CalendarValue {
    getFullYear: () => number;
    getMonth: () => number;
    getDate: () => number;
  }

        //装维单数据
        const jobData = [
      {
        id: 1,
        cusName: '穿堂风',
        addr: '北京市海淀区',
        contact: '张三',
        tel: '13888888888',
        operator: '小张',
      }, 
      {
        id: 2,
        cusName: '杨国福',
        addr: '上海市嘉定区',
        contact: '李四',
        tel: '13888888888',
        operator: '小李',
      }, 
      {
        id: 2,
        cusName: '吴老幺',
        addr: '上海市嘉定区',
        contact: '李四',
        tel: '13888888888',
        operator: '小李',
      },
    ];


  const formatDate = (date:CalendarValue) => {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };


  const onConfirm = (value: CalendarValue): void => {
    show.value = false;
    date.value = formatDate(value);
  };
</script>
<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>