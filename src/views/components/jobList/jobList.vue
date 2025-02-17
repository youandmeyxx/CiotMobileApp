<template>
  <div class="custom-div-title">装维任务列表</div>
  <div>
    <van-search
      v-model="value"
      show-action
      label="客户名:"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <van-button type="primary"  size="mini" class="custom-button" @click="onClickButton">搜  索</van-button>
      </template>
    </van-search>
  </div>
  <div>
    <van-collapse v-model="activeName" accordion>
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
</template>
<script setup lang="ts" home="JobList">
  import { ref } from 'vue';
  import { showToast } from 'vant';
  import '@/style/custom.css';
  const value = ref('');
  const activeName = ref('1');
  const onSearch = (val:string) => showToast(val);
  const onClickButton = () => showToast(value.value);
  
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
</script>
<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>