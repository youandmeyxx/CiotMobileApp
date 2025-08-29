<template>
    <div>
        <van-tabbar v-model="active">
            <van-tabbar-item name="home" icon="home-o" @click="homeClick">首页</van-tabbar-item>
            <van-tabbar-item name="apps" icon="apps-o" @click="appClick">应用</van-tabbar-item>
            <van-tabbar-item name="message" icon="comment-o" :badge="messageBadge" @click="messageClick">消息</van-tabbar-item>
            <van-tabbar-item name="manager" icon="manager-o" @click="userinfoClick">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script setup lang="ts" name="AppFoot">
    import router from '@/router';
    import '@/style/foot.css';
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';
    const userInfoDetail = userInfoDetailStore();
    const userInfo = userInfoStore();
    const active = ref('home');
    const messageBadge = ref(20);
    
    onMounted(() => {
        fetchMessageCount();
    });

    const homeClick = () => {
        console.log(`Grid item clicked`);
        router.push("/home");
    };

    const appClick = () => {
        console.log(`Grid item clicked`);
        router.push("/home");
    };

    const messageClick = () => {
        console.log(`Grid item clicked`);
        router.push("/message");
    };
    const userinfoClick = () => {
        console.log(`Grid item clicked`);
        router.push("/userinfo"); 
    }

    //读取消息数量
    //fetchMessageCount每 60秒执行一次
    const fetchMessageCount = () => {
        try {
            axios.get(`${DOMAIN_RUL}/workWeChart/newMsgCount`,{
                params: {
                    userName: userInfo.userInfo.name,
                },
            })
            .then((response) => {
                console.log(response.data.result);
                messageBadge.value = Number(response.data.result || 0);
            });
            
        } catch (error) {
            console.error('Failed to fetch message count:', error);
        }
    };
    setInterval(fetchMessageCount, 10000);
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