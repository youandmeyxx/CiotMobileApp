<template>
    <van-tabbar v-model="active">
    <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item name="apps" icon="apps-o">应用</van-tabbar-item>
    <van-tabbar-item name="message" icon="comment-o" :badge="messageBadge">消息</van-tabbar-item>
    <van-tabbar-item name="manager" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
</template>
<script setup lang="ts" name="AppFoot">
    import '@/style/foot.css';
    import { ref } from 'vue';

    const active = ref('home');
    const messageBadge = ref(20);

    // 可以通过修改 messageBadge 的值来动态更新徽标
    // messageBadge.value = 10;
</script>

<style scoped>
</style>