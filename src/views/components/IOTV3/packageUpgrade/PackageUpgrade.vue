<template>
  <div>
    <!-- 第一个多行文本输入框 -->
    <van-field
      v-model="iccidList"
      type="textarea"
      label="ICCID列表"
      placeholder="请输入ICCID号 (每行一个)"
      rows="8"
      style="border:1px; border-color: black; background-color: aliceblue;"
    />
    <van-button round block type="primary"  @click="getPackageList">
            查询
    </van-button> 
    <br>
    <!-- 第二个多行文本输入框 -->
    <van-field
      v-model="packageName"
      type="textarea"
      label="套餐选择"
      placeholder="套餐选择"
      rows="1"
      style="border:1px; border-color: black; background-color:aliceblue;"
    />
    <van-button round block type="primary"  @click="upgradePackage">
            升级
    </van-button> 
  </div>

  <van-popup v-model:show="showPackageList" destroy-on-close position="bottom">
                <van-picker
                    :columns="packages"
                    :model-value="packageValue"
                    @confirm="onConfirm"
                    @cancel="showPackageList = false"
                />
  </van-popup>
</template>

<script setup lang="ts">
import { DOMAIN_RUL } from '@/plugins/globalVariables';
import type { cardFlowPackage, Option} from '@/views/components/support/interface.ts';
import axios from 'axios';
import { ref } from 'vue';

// 定义两个响应式变量来存储文本输入框的值
const iccidList = ref('');
const iccidArr = ref<string[]>([]);
const packageValue = ref<string[]>([]);
const showPackageList = ref(false);
const packageName = ref('');
const packageFlowValue = ref('');
    //套餐包列表
const packages = ref([]);


//定义一个函数来处理套餐查询
  const getPackageList = () => {
    //读取iccid列表
    iccidArr.value = iccidList.value.split("\n");
    let iccid = iccidArr.value[0]; // 取第一个iccid作为参数
    console.log(iccid);
    axios.get(`${DOMAIN_RUL}/workWeChart/PLCZ/getCardFlowPackages`, {
      params: {
        iccid: iccid, // 使用第一个文本输入框的值作为参数
      },  
    }).then((response) => {
      console.log(response.data.result);
      // 处理返回的数据
      packages.value = response.data.result; // 假设返回的数据结构是 { data: { cardStatuInfo: CardStatuInfo } };
      showPackageList.value = true; // 显示套餐列表
    }).catch((error) => {
      console.log('Error:', error);
    });
  }

    // 点击按钮时，获取套餐列表
  const onConfirm = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log(selectedValues, selectedOptions[0].text);
      packageName.value= selectedOptions[0].text;
      packageValue.value = selectedValues;
      console.log(packageValue.value);
      packageFlowValue.value=packageValue.value[0];
      showPackageList.value = false;
  };
  
  // 定义一个函数来处理套餐订购
  const upgradePackage = () => {
    const formData = new FormData();
    formData.append('dstIccids',  iccidList.value);
    formData.append('packageId',  packageFlowValue.value);
    axios.post(`${DOMAIN_RUL}/workWeChart/PLCZ/upgradePackage`,formData)
    .then((response) => {
      console.log(response.data.result);
      // 处理返回的数据
      if (response.data.code === 200) {
        alert("升级成功！");
      } else {
        alert("升级失败！");
      }
    }).catch((error) => {
      console.log('Error:', error);
    });

  }

</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
