<!--
 * @Author: youandmeyxx 86011640@qq.com
 * @Date: 2025-10-17 16:45:05
 * @LastEditors: youandmeyxx 86011640@qq.com
 * @LastEditTime: 2025-10-23 16:52:38
 * @FilePath: \CiotMobileApp\src\views\operatorInfo\roleSetup.vue
 * @Description: 角色管理界面
-->
<template>
  <div class="role-management-container">
    <!-- 页面标题 -->
    <div class="page-title">角色管理</div>
    
    <!-- 添加角色按钮 -->
    <div class="add-role-btn-container">
      <van-button type="primary" @click="showAddRoleDialog = true">添加角色</van-button>
    </div>
    
    <!-- 角色列表 -->
    <div class="role-list">
      <div v-for="(role, index) in rolesList" :key="index" class="role-item">
        <div class="role-info">
          <div class="role-name">{{ role.roleName }}</div>
          <div class="role-description">{{ role.description || '暂无描述' }}</div>
          <div class="role-create-time">创建时间: {{ formatDate(role.createdAt) }}</div>
          <div class="role-create-time">更新时间: {{ formatDate(role.updatedAt) }}</div>
        </div>
        <div class="role-actions">
          <van-button size="small" @click="handleEditRole(role)">修改</van-button>
          <van-button size="small" type="danger" @click="handleDeleteRole(role)" v-if="role.roleName !== 'admin'">删除</van-button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="rolesList.length === 0" class="empty-state">
        <van-empty description="暂无角色数据" />
      </div>
    </div>
    
    <!-- 添加/编辑角色对话框 -->
    <van-dialog
      v-model:show="showRoleDialog"
      :title="isEditMode ? '修改角色' : '添加角色'"
      @confirm="handleRoleSave"
      @cancel="handleDialogCancel"
      show-cancel-button
    >
      <div class="dialog-content">
        <van-field
          v-model="formData.roleName"
          label="角色名称"
          placeholder="请输入角色名称"
          :rules="[{ required: true, message: '请输入角色名称' }]"
          :disabled="isEditMode && formData.roleName === 'admin'"
        />
        <van-field
          v-model="formData.description"
          label="角色描述"
          placeholder="请输入角色描述"
          type="textarea"
          :rows="3"
        />
      </div>
    </van-dialog>
    
    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除确认"
      theme="round-button"
      @confirm="confirmDeleteRole"
      @cancel="handleDeleteCancel"
      show-cancel-button
    >
      <p>确定要删除角色「{{ roleToDelete?.roleName }}」吗？此操作不可撤销。</p>
    </van-dialog>
  </div>
  <Loading v-if="loading" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import type { SetupRoles } from '@/views/components/support/interface';
import axios from 'axios';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import { generateNonce } from '../components/support/function';
import Loading from '@/components/Loading.vue';
const loading = ref(false);
// 路由列表
const rolesList = ref<SetupRoles[]>([]);
// 表单数据
const formData = ref<SetupRoles>({
  roleName: '',
  description: '',
  status: '',
  createdAt: '',
  updatedAt: ''
});
// 获取路由
const router = useRouter();
// 角色列表
const roles = ref<SetupRoles[]>([]);
// 角色权限
const rolePermissions = ref<Permissions[]>([]);

// 对话框状态
const showRoleDialog = ref(false);
const showAddRoleDialog = ref(false);
const showDeleteDialog = ref(false);
const isEditMode = ref(false);
const roleToDelete = ref<SetupRoles | null>(null);

// 监听添加角色对话框状态
watch(showAddRoleDialog, (newVal) => {
  if (newVal) {
    isEditMode.value = false;
    resetForm();
    showRoleDialog.value = true;
  }
});

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};


//从后端数据库读取roles列表信息
const getRolesList = async () => {
    // 通过get请求获取角色列表
    axios.get(`${DOMAIN_RUL}/workWeChart/rolePermissions/getRoleList`).then((response) => {
      rolesList.value = response.data.result;
    }).catch((error) => {
      console.log('Error:', error);
    });

};

// 重置表单数据
const resetForm = () => {
  formData.value.roleName = '';
  formData.value.description = '';
  formData.value.status = '';
  formData.value.createdAt = '';
  formData.value.updatedAt = '';
};

// 打开编辑角色对话框
const handleEditRole = (role: SetupRoles) => {
  isEditMode.value = true;
  // 深拷贝角色数据到表单
  Object.assign(formData.value, { ...role });
  console.log('handleEditRole formData2:', formData.value);
  showRoleDialog.value = true;
};

// 处理角色保存
const handleRoleSave = () => {
  loading.value = true;
  // 简单验证
  if (!formData.value.roleName.trim()) {
    showToast('请输入角色名称');
    return;
  }
  const roleName = formData.value.roleName;

  if (isEditMode.value) {
    // 修改角色
    console.log('修改角色*************',formData.value);
    editRole(roleName);
    showToast('角色修改成功');
  } else {
    // 添加新角色
    const newRole: SetupRoles = {
      ...formData.value,
      status: 'active'
    };
    addRole(newRole);
    showToast('角色添加成功');
  }
  loading.value = false;
  resetForm();
};



const routerPush = (roleName: string) =>{
  // 跳转到权限选择页面并传递角色信息
  console.log('roleName1 :', roleName);
  const rolePermissionsStr = JSON.stringify(rolePermissions.value);
  
  router.push({
    path: '/authoritySel',
    query: { roleName: roleName, rolePermissions: rolePermissionsStr }
  });
}


  //向后端数据库修改角色权限
const editRole =  (roleName: string) =>{
        // 简单验证
    if (!formData.value.roleName.trim()) {
      showToast('请输入角色名称');
      return;
    }
    let nonce = generateNonce();
    // 发送POST请求到后端
     axios.post(`${DOMAIN_RUL}/workWeChart/rolePermissions/editRole`, formData.value,{
            params: {
                nonce: nonce  
            }
    })
      .then((response) => {
        //保存返回的角色权限
        rolePermissions.value = response.data.result;
        // 把后端返回的权限数据存起来
        rolePermissions.value = response.data.result;
        // 注意：这里 formData 里已经有值（editRole 之前已 Object.assign）
        // 如果要在后续跳转时使用，直接调用 routerPush 即可
        routerPush(roleName);
        console.log('roleName.value1111:', roleName);
        // 关闭对话框
        showAddRoleDialog.value = false;
        
      })
      .catch((error) => {
        console.error('Error:', error);
        showToast('角色添加失败');
      });
      //跳转页面
      // routerPush();
  }
  //向后端数据库添加新角色
  const addRole = (roleInfo: SetupRoles) => {
    // 简单验证
    if (!roleInfo.roleName.trim()) {
      showToast('请输入角色名称');
      return;
    }
    let nonce = generateNonce();
    // 发送POST请求到后端
    axios.post(`${DOMAIN_RUL}/workWeChart/rolePermissions/addRole`, roleInfo,{
            params: {
                nonce: nonce  
            }
    })
      .then((response) => {
        showToast('角色添加成功');
        // 刷新角色列表
        getRolesList();
        // 关闭对话框
        showAddRoleDialog.value = false;
      })
      .catch((error) => {
        console.error('Error:', error);
        showToast('角色添加失败');
      });
  }

// 处理对话框取消
const handleDialogCancel = () => {
  showRoleDialog.value = false;
  showAddRoleDialog.value = false;
  resetForm();
};

// 处理删除角色
const handleDeleteRole = (role: SetupRoles) => {
  roleToDelete.value = role;
  showDeleteDialog.value = true;
};

// 确认删除角色
const confirmDeleteRole = () => {
  if (roleToDelete.value) {
    const index = rolesList.value.findIndex(r => r.roleName === roleToDelete.value?.roleName);  
    //发送请求删除角色
    let nonce = generateNonce();
    axios.post(`${DOMAIN_RUL}/workWeChart/rolePermissions/deleteRole`,{},{
            params: {
                nonce: nonce,
                roleName: roleToDelete.value.roleName  
            }
    })
    .then((response) => {
      if (index !== -1) {
        rolesList.value.splice(index, 1);
        showToast('角色删除成功');
      }
      showDeleteDialog.value = false;
      roleToDelete.value = null;
    })
    .catch((error) => {
      console.error('Error:', error);
      showToast('角色删除失败');
      showDeleteDialog.value = false;
    });


  }
};

// 取消删除
const handleDeleteCancel = () => {
  showDeleteDialog.value = false;
  roleToDelete.value = null;
};

// 组件挂载时初始化数据
onMounted(() => {
  getRolesList();
});
</script>

<style scoped>
.role-management-container {
  padding: 16px;
  padding-bottom: 80px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.add-role-btn-container {
  margin-bottom: 16px;
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.role-info {
  flex: 1;
}

.role-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.role-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.role-create-time {
  font-size: 12px;
  color: #999;
}

.role-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  padding: 40px 0;
}

.dialog-content {
  padding-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .role-management-container {
    padding: 12px;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .role-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .role-actions {
    flex-direction: row;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>