<template>
  <body>
    <div><MyApps/></div>
  </body>
</template>
<script setup lang="ts" name="Home">
import MyApps from '@/views/components/myApps/myApps.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';
import router from '@/router';
import { setUserInfoToSession } from '../components/support/function';

const route = useRoute();
const userTicket = route.query.userTicket; // 
const accessToken = route.query.access_token; // 
console.log('Home:', userTicket, accessToken);
const userInfoDetail = userInfoDetailStore();
const userInfo = userInfoStore();



onMounted( () => {
  // Get user info
  if(userInfoDetail.userInfoDetail.userid == '') {
      axios.get(`${DOMAIN_RUL}/workWeChart/userInfoDetail`, {
        params: {
          userTicket: userTicket,
          accessToken: accessToken
        }
      }).then((response) => {
        userInfoDetail.userInfoDetail = response.data.result.userInfoDetail;
        userInfo.userInfo = response.data.result.userInfo;
        console.log('User info:', userInfo.userInfo);
              // 将 userInfoDetail 存入 sessionStorage
        setUserInfoToSession();
      }).catch((error) => {
        console.log('Error:', error);
        //读取用户信息失败显示登录界面
        router.push("/login");
      });
  }
});


</script>
<style scoped>
</style>













