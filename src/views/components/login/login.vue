<!--
 * @Author: youandmeyxx 86011640@qq.com
 * @Date: 2025-09-28 13:05:07
 * @LastEditors: youandmeyxx 86011640@qq.com
 * @LastEditTime: 2025-10-30 14:46:20
 * @FilePath: \CiotMobileApp\src\views\components\login\login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="login-container">
        <van-form @submit="onSubmit">
            <van-field
                v-model="username"
                name="username"
                label="用户名"
                placeholder="手机号码"
                required
            />
            <van-field
                v-model="password"
                name="password"
                label="密码"
                type="password"
                placeholder="请输入密码"
                required
            />
            <div class="forgot-password" @click="onForgotPassword">
                忘记密码？
            </div>
            <van-button round block type="primary" native-type="submit">
                登录
            </van-button>
            <!-- 新增企业微信登录按钮 -->
            <!-- <div style="display: flex; justify-content: center; align-items: center; margin-top: 20px;">
                <van-icon name="https://img3.downza.cn/xueyuan/201905/5448525bf215b89c442ed72d1f142540.png" size="80" @click="onWeComLogin" />
            </div> -->
        </van-form>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { showToast } from 'vant';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import axios from 'axios';
import router from '@/router';
import { userInfoDetailStore, userInfoStore, userPermissionStore } from '@/stores/userInfoDetail';
import { setUserInfoToSession } from '../support/function';
import { useRoute } from 'vue-router';
const route = useRoute();
const userInfoDetail = userInfoDetailStore();
const userInfo = userInfoStore();
const userPermission = userPermissionStore();

const userTicket = route.query.userTicket; // 
const accessToken = route.query.access_token; // 



const username = ref('');
const password = ref('');

const onSubmit = () => {
    if (!username.value || !password.value) {
        showToast('请输入用户名和密码');
        return;
    }
    // 在这发送 post 请求
    const loginInfo = {
        username: username.value,
        password: password.value,
    };
    axios.get(`${DOMAIN_RUL}/workWeChart/login`, { params: loginInfo })
        .then((res) => {
            if (res.data.code === 200) {
                console.log(res.data.result);
                //登录成功 保存logininfo
                userInfoDetail.userInfoDetail = res.data.result.userInfoDetail;
                userInfo.userInfo = res.data.result.userInfo;
                // 将 userInfoDetail 存入 sessionStorage
                userPermission.rolePermissions = res.data.result.setupPermissions;
                console.log('User rolePermissions:', userPermission.rolePermissions);
                setUserInfoToSession();
                // 登录成功，跳转到其他页面
                router.push("/home");
            } else {
                showToast(res.data.Message);
            }
        })
        .catch((err) => {
            console.error(err);
            showToast('登录失败');
        });

    showToast('登录成功');
    // Add your login logic here
};

const onForgotPassword = () => {
    showToast('跳转到忘记密码页面');
    // Add your forgot password logic here
};

onMounted( () => {
    
  // Get user info detail 需要返回权限信息。
  if(userInfoDetail.userInfoDetail.userid == '') {
      axios.get(`${DOMAIN_RUL}/workWeChart/userInfoDetail`, {
        params: {
          userTicket: userTicket,
          accessToken: accessToken
          
        }
      }).then((response) => {
        userInfoDetail.userInfoDetail = response.data.result.userInfoDetail;
        userInfo.userInfo = response.data.result.userInfo;
        userPermission.rolePermissions = response.data.result.setupPermissions;
        console.log('User rolePermissions:', userPermission.rolePermissions);
        console.log('User info:', userInfo.userInfo);
              // 将 userInfoDetail 存入 sessionStorage
        setUserInfoToSession();
        router.push("/home");
      }).catch((error) => {
        console.log('Error:', error);
        //读取用户信息失败显示登录界面
        router.push("/login");
      });
  }
});


</script>

<style scoped>
.login-container {
    padding: 20px;
}

.forgot-password {
    margin: 10px 0;
    color: #1989fa;
    text-align: right;
    cursor: pointer;
}
</style>