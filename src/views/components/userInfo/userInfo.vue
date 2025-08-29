<template>
    <van-cell-group inset>
        <van-image
    round
    width="60px"
    height="60px"
    :src="userInfoDetail.userInfoDetail.avatar"
    />
    <van-cell title="用户名:" :value="userInfoDetail.userInfoDetail.userid" size="large" />
    <van-cell title="姓名:" :value="userInfo.userInfo.name" size="large" />
    <van-cell title="手机号:" :value="userInfoDetail.userInfoDetail.mobile" size="large" />
    <van-cell title="email:" :value="userInfoDetail.userInfoDetail.email" size="large" />
    <van-cell title="性  别:" :value="userInfoDetail.userInfoDetail.gender" size="large" />
    <van-image
        width="6rem"
        height="6rem"
        fit="cover"
        position="center"
        :src="userInfoDetail.userInfoDetail.qrCode"
    />
    </van-cell-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';

const userInfoDetail = userInfoDetailStore();
const userInfo = userInfoStore();

console.log('userInfoDetail User info:', userInfo.userInfo);
</script>

<style scoped>
/* Add your styles here */
</style>