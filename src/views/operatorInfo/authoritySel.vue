<!--
 * @Author: youandmeyxx 86011640@qq.com
 * @Date: 2025-10-16 08:23:03
 * @LastEditors: youandmeyxx 86011640@qq.com
 * @LastEditTime: 2025-10-23 16:02:35
 * @FilePath: \CiotMobileApp\src\views\operatorInfo\operatorRole.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">
    <div class="custom-div-title">权限选择</div>
    
    <!-- 角色信息展示 -->
    <div v-if="currentRole" class="role-info-section">
      <div class="role-header">当前角色: <span class="role-name">{{ currentRole.name }}</span></div>
      <div v-if="currentRole.description" class="role-description">{{ currentRole.description }}</div>
    </div>
    
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <van-button @click="goBack">返回角色管理</van-button>
    </div>
    
    <div class="content-wrapper">
      <!-- 全选功能 -->
      <div class="select-all-section mb-16">
        <div class="card-title">
          <span class="full-select-text">全选</span>
          <van-checkbox v-model="selectAll" @change="handleSelectAll">全选/取消全选</van-checkbox>
        </div>
      </div>

      <!-- 路由列表 -->
      <div v-for="(route, index) in routelist" :key="index" class="route-item mb-16">
        <div class="card-title">
          <span>{{ route.description }}</span>
          <van-checkbox v-model="route.checked" @change="handleRouteSelect">选择</van-checkbox>
        </div>
        <div class="route-info">
          <div class="route-name">名称: {{ route.description }}</div>
          <div class="route-path">路径: {{ route.resourcePath }}</div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="routelist.length === 0" class="empty-tip">暂无路由数据</div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button type="primary" class="w-full" @click="saveSelection">保存选择</van-button>
        <van-button class="w-full mt-10" @click="printSelectedRoutes">查看选中</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import router from '@/router';
import axios from 'axios';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { showToast } from 'vant';
import type { Permission } from '../components/support/interface';
import { generateNonce } from '../components/support/function';
// 获取路由和导航
const route = useRoute();
const routerInstance = useRouter();

// 路由列表
const routelist = ref<RouteItem[]>([]);
// 全选状态
const selectAll = ref(false);
//权限信息
const permissions = ref<Permission>({
  permissionCode: '',
  permissionName: '',
  resourceType: '',
  description: '',
  resourcePath: '',
  parentId: 0,
});

const rolePermissions = ref<Permission[]>([]);

// 当前角色信息
interface Role {
  id: number;
  name: string;
  description: string;
  createTime: string;
}

const currentRole = ref<Role | null>(null);

//重置权限信息
const resetPermission = () => {
  permissions.value = {
    permissionCode: '',
    permissionName: '',
    resourceType: '',
    description: '',
    resourcePath: '',
    parentId: 0,
  };
}
// 定义路由数据类型
interface RouteItem {
  resourcePath: string;
  permissionName: string;
  permissionCode: string;
  description: string;
  checked: boolean;
}

// 初始化角色信息
const initRoleInfo = () => {
  try {
    // 从路由参数中获取角色信息
    const roleName = route.query.roleName as string;
    console.log('roleInfoStr********:', roleName);
    if (roleName) {
      currentRole.value = {
        id: 0,
        name: roleName,
        description: '',
        createTime: ''
      };
      console.log('获取到的角色信息:', currentRole.value.name);
    } else {
      console.warn('未接收到角色信息');
    }
    const rolePermissionsStr = route.query.rolePermissions as string;
    if (rolePermissionsStr) {
      rolePermissions.value = JSON.parse(rolePermissionsStr) as Permission[];
      console.log('获取到的角色权限信息:', rolePermissions.value);
    } else {
      console.warn('未接收到角色权限信息');
    }
  } catch (error) {
    console.error('解析角色信息失败:', error);
    showToast('加载角色信息失败');
  }
}



// 初始化路由列表
const initRoutes = () => {
  try {
    // 从路由器中获取路由配置
    const routerRoutes = router.options.routes;
    // 过滤并转换为可显示的路由列表，添加选中状态
    const validRoutes = routerRoutes
      .filter(route => route.name) // 确保路由有名称
      .map(route => ({
        resourcePath: route.path,
        permissionName: route.name as string,
        permissionCode: route.name as string,
        description: route.meta?.title as string || '',
        checked: false
      }));
    
    // 更新路由列表
    routelist.value = validRoutes;
    console.log('路由列表初始化完成:', routelist.value);
    checkNewRoutes();
    // 检查角色权限并更新路由选中状态
    checkRolePermissions();
  } catch (error) {
    console.error('读取路由列表失败:', error);
  }
};

// 检查角色权限并更新路由选中状态
const checkRolePermissions = () => {
  rolePermissions.value.forEach(permission => {
    routelist.value.forEach(route => {
      if (route.permissionCode === permission.permissionCode) {
        route.checked = true;
      }
    });
  });
}

//异步检查路由列表并保存未记录的新路由信息
const checkNewRoutes = async () => {
  routelist.value.forEach(route => {
    let nonce = generateNonce();
    // 保存未记录的新路由信息
    permissions.value = {
      permissionCode: route.permissionCode,
      permissionName: route.description,
      resourceType: 'page',
      description: route.description,
      resourcePath: route.resourcePath,
      parentId: 0,
    };
    saveNewRoutes(permissions.value,nonce);
  });
}

// 保存未记录的新路由信息
const saveNewRoutes = async (permission: Permission, nonce: string) => {
        axios.post(`${DOMAIN_RUL}/workWeChart/rolePermissions/savePermission`, permission, {
            params: {
                nonce: nonce,
                roleName: currentRole.value?.name || ''
            }
        })
        .then(response => {
            if (response.data.code === 200) {
                console.log('修改该role请求成功', response.data.result);
                //回到前一页
                
            }else{
                console.log('请求失败', response.data.message);
            }
        })
        .catch(error => {
            console.error('请求失败', error);
        });
}


// 处理全选/取消全选
const handleSelectAll = () => {
  routelist.value.forEach(route => {
    route.checked = selectAll.value;
  });
};

// 处理单个路由选择
const handleRouteSelect = () => {
  // 检查是否所有路由都被选中
  const allChecked = routelist.value.every(route => route.checked);
  // 检查是否有任何路由被选中
  const anyChecked = routelist.value.some(route => route.checked);
  
  // 更新全选状态
  if (allChecked) {
    selectAll.value = true;
  } else if (!anyChecked) {
    selectAll.value = false;
  } else {
    // 部分选中状态可以通过设置为null来实现，这里简单处理为false
    selectAll.value = false;
  }
};

// 获取选中的路由
const getSelectedRoutes = () => {
  return routelist.value.filter(route => route.checked);
};

// 保存选择
const saveSelection = () => {
  const selectedRoutes = getSelectedRoutes();
  if (selectedRoutes.length === 0) {
    alert('请至少选择一个路由');
    return;
  }
  
  // 这里可以添加保存到后端或本地存储的逻辑
  saveSelectedRoutes(selectedRoutes);

  console.log('保存选中的路由:', selectedRoutes);
  alert(`已保存 ${selectedRoutes.length} 个路由选择`);
};

const saveSelectedRoutes = (selectedRoutes: RouteItem[]) => {
  // 这里可以添加保存到后端或本地存储的逻辑
  // 例如，使用axios发送POST请求保存选中的路由
  let nonce = generateNonce();
  axios.post(`${DOMAIN_RUL}/workWeChart/rolePermissions/saveRolePermissions`, selectedRoutes,{
    params: {
      nonce: nonce,  
      roleName: currentRole.value?.name || ''
    }
  })
    .then(response => {
      if (response.data.code === 200) {
        console.log('请求成功', response.data.result);
        showToast('路由选择保存成功');
        routerInstance.back();
      }else{
        console.log('请求失败', response.data.message);
        showToast('路由选择保存失败');
      }
    })
    .catch(error => {
      console.error('请求失败', error);
      showToast('路由选择保存失败');
    });
}

// 打印选中的路由
const printSelectedRoutes = () => {
  const selectedRoutes = getSelectedRoutes();
  if (selectedRoutes.length === 0) {
    alert('没有选中的路由');
    return;
  }
  
  console.log('选中的路由:', selectedRoutes);
  alert(`选中了 ${selectedRoutes.length} 个路由:\n${selectedRoutes.map(r => `${r.description}: ${r.resourcePath}`).join('\n')}`);           
};

// 返回角色管理页面
const goBack = () => {
  routerInstance.push('/roleSetup');
};

// 组件挂载时初始化数据
onMounted(() => {
  initRoleInfo();
  initRoutes();
});
</script>

<style scoped>
.container {
  padding: 12px;
  padding-bottom: 80px; /* 为底部留出空间 */
}

.custom-div-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.role-info-section {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.role-header {
  font-size: 14px;
  margin-bottom: 6px;
}

.role-name {
  font-weight: bold;
  color: #1989fa;
}

.role-description {
  font-size: 13px;
  color: #666;
  margin-left: 8px;
}

.back-button-container {
  margin-bottom: 12px;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* 减小卡片间距 */
.mb-16 {
  margin-bottom: 2px;
}

/* 调整卡片标题样式 */
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.full-select-text {
  font-weight: bold;
  font-size: 14px;
}

/* 减小路由信息区域的内边距和高度 */
.route-info {
  padding: 4px 8px;
  background-color: #f8f8f8;
  border-radius: 4px;
  line-height: 1.2;
}

/* 减小字体大小和边距 */
.route-name {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 2px;
}

.route-path {
  font-size: 12px;
  color: #666;
}

/* 减小操作按钮区域的上边距 */
.action-buttons {
  margin-top: 16px;
}

.w-full {
  width: 100%;
}

.mt-10 {
  margin-top: 8px;
}

/* 调整空状态样式 */
.empty-tip {
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 14px;
}

/* 路由项样式 */
.select-all-section {
  padding: 6px 12px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
}

.route-item {
  padding: 6px 12px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .container {
    padding: 8px;
  }
  
  .custom-div-title {
    font-size: 14px;
  }
  
  .route-name {
    font-size: 12px;
  }
  
  .route-path {
    font-size: 11px;
  }
}
</style>



