<template>
  <div class="desktop-page" >
    <van-form @submit="onSubmit">
      <van-field
        v-model="opertaor.userId"
        label="用户 ID"
        placeholder="请输入用户 ID"
        required
      />
      <van-field
        v-model="opertaor.password"
        label="密码"
        placeholder="请输入密码"
        type="password"
        required
      />
      <van-field
        v-model="opertaor.name"
        label="姓名"
        placeholder="请输入姓名"
        required
      />
      <van-field
        v-model="opertaor.mobile"
        label="手机号码"
        placeholder="请输入手机号码"
        type="tel"
        required
      />
      <van-field
        v-model="opertaor.email"
        label="邮箱"
        placeholder="请输入邮箱"
        type="email"
        required
      />
      <van-button type="primary" native-type="submit">提交</van-button>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import axios from 'axios';
import { showToast } from 'vant';
import { ref } from 'vue';

// 定义表单数据类型
interface FormData {
  userId: string;
  password: string;
  name: string;
  mobile: string;
  email: string;
  gender : string;
  avatar : string;
  qrCode : string;
}

// 初始化表单数据
const opertaor = ref<FormData>({
  userId: '',
  password: '',
  name: '',
  mobile: '',
  email: '',
  gender: '',
  avatar: '',
  qrCode: ''
});




// 提交表单的处理函数
const onSubmit = () => {

  let opertaors = { 
      opid: 0,
      userId: opertaor.value.userId,
      password: opertaor.value.password,
      name: opertaor.value.name,
      mobile: opertaor.value.mobile,
      email: opertaor.value.email,
      gender:0,
      avatar: '',
      qrCode: ''
    }
  console.log('提交的数据:', opertaors);
  //发送post请求 添加信息
  axios.post(`${DOMAIN_RUL}/workWeChart/addOperatorInfo`,opertaors)
    .then(res => {
      showToast('添加成功!');
      initOpertaor();
    })
    .catch(err => {
      console.error(err);
    });

};
// 初始化表单数据
const initOpertaor = () => {
  opertaor.value = {
    userId: '',
    password: '',
    name: '',
    mobile: '',
    email: '',
    gender: '',
    avatar: '',
    qrCode: ''
  };
};
</script>

<style scoped>
/* 电脑页面适配样式 */
@media (min-width: 768px) {
  .desktop-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  h1 {
    font-size: 32px;
  }
  p {
    font-size: 18px;
  }
}
</style>
