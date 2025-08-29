<template>
  <div>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="(item, index) in messages" :key="index">
        <van-cell
          :title="item.msgType"
          :label="item.msgContent"
        >
          <div v-if="item.msgReadStatus==0">
            <a :href="item.msgUrl" @click.prevent="onclick(item.msgUrl)">查看详情</a>
          </div>
        </van-cell>
        <van-cell title="日期" :value="item.msgDate" />
      </div>
    </van-list>
  </div>
</template>

<script setup lang="ts">
import {DOMAIN_RUL } from '@/plugins/globalVariables';
import axios from 'axios';
import { ref } from 'vue';
import type { Message } from '../support/interface';
import router from '@/router';
import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';
const userInfoDetail = userInfoDetailStore();
const userInfo = userInfoStore();
// 用户名需要动cookie中获取
const userName = ref('严良');
const messages = ref<Message[]>([]);
const loading = ref(false);
const finished = ref(false);



const onLoad = () => {
  loading.value = true;
  //get请求访问msg数据
  axios.get(`${DOMAIN_RUL}/workWeChart/msgList`,{
    params: {
      userName: userInfo.userInfo.name,
    },
  })
  .then((response) => {
    messages.value = response.data.result;
    console.log(response.data.result);
    loading.value = false;
    finished.value = true
  });
};

const onclick = (url:string) => {
  console.log('查看详情');
  router.push(url);
};

</script>

<style scoped>
</style>
