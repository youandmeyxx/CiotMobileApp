<!--
 * @Author: youandmeyxx 86011640@qq.com
 * @Date: 2025-09-28 13:05:07
 * @LastEditors: youandmeyxx 86011640@qq.com
 * @LastEditTime: 2025-10-29 09:25:39
 * @FilePath: \CiotMobileApp\src\views\components\myApps\myApps.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="custom-div-title">我的应用</div>
    <van-grid :column-num="4" :gutter="10">
        <van-grid-item 
            v-for="(value, index) in userRouterPath.length" 
            :key="value" 
            :text="userRouterPath[index % userRouterPath.length].title" 
            @click="handleClick(index)"
        >      
            <template  #icon>
                <img :src="userRouterPath[index % userRouterPath.length].iconPath" style="width: 60px; height: 60px;">
            </template>
        </van-grid-item>
    </van-grid>
  </div>
</template>
<script setup lang="ts" name="MyApps">
    import '@/style/custom.css';
    import { iconPath } from '@/views/components/myApps/assets/iconPath';
    import { useRouter } from 'vue-router';
    import { userInfoDetailStore, userInfoStore, userPermissionStore } from '@/stores/userInfoDetail';
    import { onMounted, ref } from 'vue';
import type { forEach } from 'jszip';
import { getUserinfoFromSession } from '../support/function';
    // 图标路径
    const iPath = iconPath;
    const userRouterPath = ref<{ title: string; iconPath: string; routerPath: string }[]>([]);
    const router = useRouter();
    const userInfoDetail = userInfoDetailStore();
    const userInfo = userInfoStore();
    const userPermissions = userPermissionStore();

    onMounted(() => {
        // 从 sessionStorage 中读取 userInfoDetail 和 userInfo
        getUserinfoFromSession();
        checkUseRouter();
    })
    const handleClick = (index: number) => {
        console.log(`Grid item ${index} clicked`);
        // 在这里添加你的点击处理逻辑
        router.push(userRouterPath.value[index].routerPath)
    };

    const checkUseRouter = () => {
        iPath.forEach(item => {
            // console.log('item.routerPath:', item.routerPath);
            if(hasPermission(item.routerPath)){
                // console.log('item.routerPath1:', item.routerPath);
                userRouterPath.value.push(item);
            }
        })
    }

    // 检查用户是否有点击的应用权限
    const hasPermission = (appPath: string) => {
        let hasPerm = false;
        // 检查用户是否有点击的应用权限
        if(userInfoDetail.userInfoDetail.roleName === 'admin'){
            hasPerm = true;
        }
        // console.log('userPermissions.rolePermissions:', userPermissions.rolePermissions);
        userPermissions.rolePermissions.forEach(perm => {
            // console.log('perm.resourcePath:', perm.resourcePath);
            if(perm.resourcePath === appPath){
                hasPerm = true;
            }
        })
        return hasPerm;
    };


</script>
<style scoped>
.van-grid-item  {
    --van-grid-item-icon-size: 60px;
}
</style>