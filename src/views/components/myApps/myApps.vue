<template>
  <div>
    <div class="custom-div-title">我的应用</div>
    <van-grid :column-num="4" :gutter="10">
        <van-grid-item 
            v-for="(value, index) in iPath.length" 
            :key="value" 
            :icon="iPath[index % iconPath.length].iconPath"
            :text="iPath[index % iconPath.length].title" 
            class="custom-icon"
            @click="handleClick(index)"
        />
    </van-grid>
  </div>
</template>
<script setup lang="ts" name="MyApps">
    import '@/style/custom.css';
    import { ref } from 'vue';
    import { iconPath } from '@/views/components/myApps/assets/iconPath';
    import { useRouter } from 'vue-router';
    // 图标路径
    const iPath = iconPath;
    const router = useRouter();
    const handleClick = (index: number) => {
        console.log(`Grid item ${index} clicked`);
        // 在这里添加你的点击处理逻辑
        router.push('/myjobs')
    };
</script>
<style scoped>
.van-grid-item  {
    --van-grid-item-icon-size: 60px;
}
</style>