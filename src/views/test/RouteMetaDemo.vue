<!--
 * @Author: youandmeyxx 86011640@qq.com
 * @Date: 2025-10-21 17:00:00
 * @LastEditors: youandmeyxx 86011640@qq.com
 * @LastEditTime: 2025-10-22 08:03:47
 * @FilePath: \CiotMobileApp\src\views\test\RouteMetaDemo.vue
 * @Description: 路由meta信息访问示例组件
-->
<template>
  <div class="route-meta-demo">
    <h1>路由Meta信息访问示例</h1>
    
    <div class="meta-info-section">
      <h2>当前路由Meta信息</h2>
      <div class="meta-item">
        <span class="meta-label">页面标题:</span>
        <span class="meta-value">{{ route.meta.title || '未设置' }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">路由路径:</span>
        <span class="meta-value">{{ route.path }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">路由名称:</span>
        <span class="meta-value">{{ route.name || '未设置' }}</span>
      </div>
    </div>
    
    <div class="code-example">
      <h2>访问Meta信息的代码示例</h2>
      <div class="code-block">
        <pre><code>import { useRoute } from 'vue-router';

// 获取路由实例
const route = useRoute();

// 访问meta信息的几种方式:
// 1. 直接访问特定属性
const pageTitle = route.meta.title;

// 2. 检查是否存在某个meta属性
const requiresAuth = !!route.meta.requiresAuth;

// 3. 获取整个meta对象
const allMetaInfo = route.meta;</code></pre>
      </div>
    </div>
    
    <div class="practical-usage">
      <h2>实际应用场景</h2>
      <ul>
        <li><strong>权限控制:</strong> 可以通过meta设置权限要求，然后在路由守卫中检查</li>
        <li><strong>动态标题:</strong> 根据meta.title设置页面标题</li>
        <li><strong>自定义配置:</strong> 为不同路由设置特定的配置项</li>
        <li><strong>过渡动画:</strong> 为不同页面设置不同的过渡效果</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

// 获取路由实例
const route = useRoute();

// 组件挂载时打印meta信息
onMounted(() => {
  console.log('当前路由的完整meta信息:', route.meta);
  console.log('页面标题:', route.meta.title);
  
  // 演示如何检查自定义meta属性
  if (route.meta.requiresAuth) {
    console.log('该页面需要身份验证');
  }
  
  if (route.meta.transition) {
    console.log('页面过渡效果:', route.meta.transition);
  }
});
</script>

<style scoped>
.route-meta-demo {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

h2 {
  font-size: 18px;
  margin-top: 24px;
  margin-bottom: 12px;
  color: #555;
}

.meta-info-section {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
}

.meta-label {
  font-weight: bold;
  width: 100px;
  color: #666;
}

.meta-value {
  color: #1989fa;
  font-size: 14px;
}

.code-example {
  margin-bottom: 24px;
}

.code-block {
  background-color: #f0f2f5;
  border-radius: 6px;
  overflow: hidden;
}

pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
}

.practical-usage {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
}

ul {
  padding-left: 20px;
  margin: 0;
}

li {
  margin-bottom: 8px;
  color: #666;
  line-height: 1.4;
}

li strong {
  color: #333;
}
</style>