<template>
  <div style="padding-bottom:100px;">
    <!-- 添加用户按钮 -->
    <van-button  type="primary" @click="openAddModal">添加用户</van-button>
    <!-- 用户列表 -->
    <van-list
      v-model:loading="loading"
      v-model:finished="finished"
      :immediate-check="false"
      @load="onLoad"
    >
        <van-cell-group v-for="(item, index) in users" :key="index" :title="item.name">
          <van-cell :title="`用户 ID: ${item.userid}`" />
          <van-cell :title="`密码: ${item.password}`" />
          <van-cell :title="`姓名: ${item.name}`" />
          <van-cell :title="`手机: ${item.mobile}`" />
          <van-cell :title="`邮箱: ${item.email}`" />
          <van-cell>
            <!-- 修改用户按钮 -->
            <van-button type="warning" @click="openEditModal(item)">修改</van-button>
            <!-- 删除用户按钮 -->
            <van-button type="danger" @click="deleteUser(item.userid)">删除</van-button>
          </van-cell>
        </van-cell-group>
    </van-list>

    <!-- 添加用户模态框 -->
    <van-popup v-model:show="addModalVisible" position="bottom">
      <div style="padding: 16px">
        <h3>添加用户</h3>
        <van-field name="userid" v-model="newUser.userid" label="用户 ID" required  />
        <van-field name="password" v-model="newUser.password" label="密码" required />
        <van-field name="name" v-model="newUser.name" label="姓名" required />
        <van-field name="mobile" v-model="newUser.mobile" label="手机" required />
        <van-field name="email" v-model="newUser.email" label="邮箱" required />
        <van-button type="primary" @click="addUser">确定</van-button>
        <van-button @click="addModalVisible = false">取消</van-button>
      </div>
    </van-popup>

    <!-- 修改用户模态框 -->
    <van-popup v-model:show="editModalVisible" position="bottom">
      <div style="padding: 16px">
        <h3>修改用户</h3>
        <van-field v-model="editedUser.userid" label="用户 ID" disabled />
        <van-field v-model="editedUser.password" label="密码" required />
        <van-field v-model="editedUser.name" label="姓名" required />
        <van-field v-model="editedUser.mobile" label="手机" required />
        <van-field v-model="editedUser.email" label="邮箱" required />
        <van-button type="primary" @click="updateUser">确定</van-button>
        <van-button @click="editModalVisible = false">取消</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { DOMAIN_RUL, OPERATORS_MANAGER, SETUP_MANAGER } from '@/plugins/globalVariables';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import type { userDetail } from '../components/support/interface';
import { showToast } from 'vant';
import { userInfoDetailStore, userInfoStore } from '@/stores/userInfoDetail';

const userInfoDetail = userInfoDetailStore();
const userInfo = userInfoStore();

// 用户数据
const users = ref<userDetail[]>([]);

// 加载状态
const loading = ref(false);
// 加载完成状态
const finished = ref(false);
// 添加用户模态框显示状态
const addModalVisible = ref(false);
// 修改用户模态框显示状态
const editModalVisible = ref(false);
// 新用户对象
const newUser = ref({ userid: '', password: '', name: '', mobile: '', email: '',gender:0,avatar:'',qrCode:'' });
// 编辑中的用户对象
const editedUser = ref({ userid: '', password: '', name: '', mobile: '', email: '',gender:0,avatar:'',qrCode:'' });
onMounted( () => {
    getuserInfoList();
});
// 加载数据
const onLoad = () => {
};
//读取用户信息
const getuserInfoList = () => {
    // 通过get请求获取用户列表
    axios.get(`${DOMAIN_RUL}/workWeChart/getOperatorInfoListUpdate`).then((response) => {
      users.value = response.data.result;
      console.log('response:', response.data.result);
    }).catch((error) => {
      console.log('Error:', error);
    });
}

// 打开添加用户模态框
const openAddModal = () => {
  addModalVisible.value = true;
  newUser.value = { userid: '', password: '', name: '', mobile: '', email: '',gender:0,avatar:'',qrCode:'' };
};
// 添加用户
const addUser = () => {

  if(validateData(newUser.value)===false){
    console.log('用户 ID 已被注册');
    addModalVisible.value = false;
    return;
  }

  // 生成新的用户 ID
  let opertaors = { 
      userid: newUser.value.userid,
      password: newUser.value.password,
      name: newUser.value.name,
      mobile: newUser.value.mobile,
      email: newUser.value.email,
      gender:0,
      avatar: '',
      qrCode: ''
    }
  console.log('提交的数据:', opertaors);
  //发送post请求 添加信息
  axios.post(`${DOMAIN_RUL}/workWeChart/addOperatorInfo`,opertaors)
    .then(res => {
      getuserInfoList();
      showToast('添加成功!');
    })
    .catch(err => {
      console.error(err);
    });
  addModalVisible.value = false;
};

// 打开修改用户模态框
const openEditModal = (user: any) => {
  editedUser.value = { ...user };
  editModalVisible.value = true;
};

// 修改用户
const updateUser = () => {
  const index = users.value.findIndex(user => user.userid === editedUser.value.userid);
  if (index !== -1) {
    users.value[index] = { ...editedUser.value };
  }
  let opertaors = { 
      userId: editedUser.value.userid,
      password: editedUser.value.password,
      name: editedUser.value.name,
      mobile: editedUser.value.mobile,
      email: editedUser.value.email,
      gender:0,
      avatar: '',
      qrCode: ''
    }
    //发送post请求 修改信息
  axios.post(`${DOMAIN_RUL}/workWeChart/modOperatorInfo`,users.value[index])
    .then(res => {
      getuserInfoList();
      showToast('修改成功!');
    })
    .catch(err => {
      console.error(err);
    });
  editModalVisible.value = false;
};

// 删除用户
const deleteUser = (userid: string) => {
  users.value = users.value.filter(user => user.userid !== userid);
  //发送post请求 删除信息
  axios.get(`${DOMAIN_RUL}/workWeChart/delOperatorInfo`,{
    params: {
      userid: userid
    }
  })
   .then(res => {
      getuserInfoList();
      showToast('删除成功!');
    })
   .catch(err => {
      console.error(err);
    });
};

//数据完整性校验
const validateData = (data: any) => {
  let flog = true;
  if (!data.userid || !data.password || !data.name || !data.mobile || !data.email) {
    showToast('所有字段都必须填写!');
    flog =false;
  }

    // 验证 userid 只能使用英文和数字
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphaNumericRegex.test(data.userid)) {
    showToast('用户 ID 只能使用英文和数字');
    flog =false;
  }
  //验证userid是否已被注册
  axios.get(`${DOMAIN_RUL}/workWeChart/checkOperatorInfo`,{
    params: {
      userid: newUser.value.userid
    } 
  }).then(res => {
    if (res.data.code === 200) {
      if(res.data.result===true){
        console.log('用户 ID 已被注册:', res.data.result);
        showToast('用户 ID 已被注册');
        flog =false;
      }
    }
  })
  return flog;
};

</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
