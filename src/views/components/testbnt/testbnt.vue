<template>
  <div>
<input type="file" id="uploadfiles" name="files[]" multiple />
    <div class="button-container">

      <!-- 添加点击事件绑定 -->
      <van-button @click="test" type="primary" size="small">测试</van-button>
    </div>
  </div>
</template>
<script setup lang="ts" name="Testbnt">
import { ref } from 'vue';
import '@/style/custom.css';
import axios from 'axios';
import { ElUpload, ElButton } from 'element-plus';
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import type { SendModel } from '../support/interface';

const sendmodel = ref<SendModel[]>([
  { 
    touser: '',
    toparty: '',
    totag: '',
    msgtype: '',
    agentid: 0,
    text: {content :'测试发送信息'},
    safe: 0,
    enable_id_trans: 0,
    enable_duplicate_check: 0,
    duplicate_check_interval: 1800,
  },
]);



const test = () => {
  let messageModel = {
    touser: 'ChuangLinShouHou-YaYa',
    toparty: '',
    totag: '',
    msgtype: 'text',
    agentid: 1000028,
    text: {
      content: '测试发送信息',
    },
    safe: 0,
    enable_id_trans: 0,
    enable_duplicate_check: 0,
    duplicate_check_interval: 1800
  }
  axios.post(`${DOMAIN_RUL}/workWeChart/messageSend`,messageModel).then((response) => {
    console.log(response.data.result);
  }).catch((error) => {
    console.log('Error:', error);
  });
}

function wechatLogin() {
  const appId = 'wx5644681ceb8bd702'; // 替换为你的 AppID
      const redirectUri = encodeURIComponent('https://appl.chuangliniot.cn/workWeChart/wxlogincallback'); // 替换为你的回调地址
      const scope = 'snsapi_userinfo';
      const state = 'STATE';
      const wechatAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
      window.location.href = wechatAuthUrl;
}

const fileInput = document.getElementById('fileInput');
if (fileInput) {
  fileInput.addEventListener('change', function(event) {
    var files = (event.target as HTMLInputElement)?.files; // 获取选中的文件列表
    if (!files) return; // 如果 files 为 null，则直接返回
    for (var i = 0; i < files.length; i++) {
      console.log(files[i].name); // 输出每个文件的名称
    }
  });
}


</script>
<style scoped>
</style>