<template>
  <div>
    <div class="custom-div-title">套餐工作</div>
    <div style="margin: 16px; padding-bottom:100px;">
        <van-button round block type="primary"  @click="AihuaTransferPackage">
            大华套餐转移
        </van-button> 
        <br />
        
        <van-button round block type="primary"  @click="AihuaBatchAddPackage">
            大华批量补充套餐
        </van-button>
        <br />
    
        <van-button round block type="primary"  @click="V3BatchRecharge">
            新系统批量充值
        </van-button>
        <br />
        <van-button round block type="primary"  @click="V3UpgradePackage">
            新系统套餐升级
        </van-button>
        <br />
    </div>
  </div>
</template>
<script setup lang="ts">
    import { DOMAIN_RUL } from '@/plugins/globalVariables';
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import Loading from '@/components/Loading.vue';
import router from '@/router';
    const loading = ref(false);

    /* 大华套餐转移 */
    const AihuaTransferPackage = () => {
        //网页跳转至http://iotv3.iot-chuanglin.com/workTool/taocanzhuanyi.html
        window.open('http://iotv3.iot-chuanglin.com/workTool/taocanzhuanyi.html');
    }
    /* 大华批量补充套餐 */
    const AihuaBatchAddPackage = () => {
        //跳转至 路由 aihuaPLCZ
        router.push({ path:'/aihuaPLCZ' });
    }
    /* 新系统批量充值 */
    const V3BatchRecharge = () => {
        //跳转至路由 /PLCY
        router.push({ path:'/PLCY' });
    }
    /* 新系统套餐升级 */
    const V3UpgradePackage = () => {
        //跳转至路由 /PackageUpgrade
        router.push({ path:'/PackageUpgrade' });  
    }

    /**
     * 页面加载时运行
     */
    onMounted(() => {
    });


</script>
<style scoped>
</style>