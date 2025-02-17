<template>
  <div>
    <div class="custom-div-title">装维信息登记</div>
    <div>
        <van-collapse v-model="collapse" accordion>
            <van-collapse-item :title="cusName" name="1">
                <ul>
                <li>地址:{{ jobData.addr }}</li>
                <li>装维人员:{{ jobData.operator }}</li>
                <li>联系人:{{ jobData.contact }}</li>
                <li>联系电话:{{ jobData.tel }}</li>
                </ul>
            </van-collapse-item>
        </van-collapse> 
    </div>
    <div>
        <van-form @submit="onSubmit">
            <van-field v-model="addr" label="地址:" />
            <van-field v-model="topology" label="网络拓扑:" />
            <van-field
                v-model="operator"
                is-link
                readonly
                name="realNameType"
                label="运营商:"
                placeholder="请选择运营商"
                @click="showPickerOperator = true"
            />
            <van-field
                v-model="realNameType"
                is-link
                readonly
                name="realNameType"
                label="实名类型:"
                placeholder="请选择运营商"
                @click="showPickerRealNameType = true"
            />
            <van-field
                v-model="routerType"
                is-link
                readonly
                name="router"
                label="店铺路由器:"
                placeholder="选择类型"
                @click="showPickerRouterType = true"
            />
            <van-field v-if="routerType==='自备'" v-model="routerName" label="路由器型号:" />
            <van-field
                v-model="afterSetup"
                is-link
                readonly
                name="afterSetup"
                label="安装后应用:"
                placeholder="选择类型"
                @click="showPickerAfterSetupType = true"
            />
            <van-cell title="安装日期:" :value="setupDate" @click="setupTimeShow = true" />
            <van-field name="uploader" label="安装验收:">
                <template #input>
                    <van-uploader v-model="picValue" />
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    登记提交
                </van-button>
            </div>
        </van-form>
    </div>
  </div>

    <van-popup v-model:show="showPickerOperator" position="bottom">
                    <van-picker
                        :columns="columns"
                        :model-value="operatorPickerValue"
                        @confirm="onConfirmOperator"
                        @cancel="showPickerOperator = false"
                    />
    </van-popup>

    <van-popup v-model:show="showPickerRealNameType" position="bottom">
                    <van-picker
                        :columns="columns1"
                        :model-value="realNameTypePickerValue"
                        @confirm="onConfirmRealNameType"
                        @cancel="showPickerRealNameType = false"
                    />
    </van-popup>

    <van-popup v-model:show="showPickerRouterType" position="bottom">
                    <van-picker
                        :columns="columns2"
                        :model-value="routerTypePickerValue"
                        @confirm="onConfirmRouterType"
                        @cancel="showPickerRouterType = false"
                    />
    </van-popup>
    <van-popup v-model:show="showPickerAfterSetupType" position="bottom">
                    <van-picker
                        :columns="afterSetupColumns"
                        :model-value="afterSetupPickerValue"
                        @confirm="onConfirmAfterSetupType"
                        @cancel="showPickerAfterSetupType = false"
                    />
    </van-popup>

    <van-calendar v-model:show="setupTimeShow" @confirm="onConfirmSetupTime" />

</template>

<script setup lang="ts" name="JobRecord">
import { ref } from 'vue';

const collapse = ref('1');
const tel = ref('');
const addr = ref('');
const contact = ref('');
const operator = ref('');
const realNameType = ref('');
const cusName = ref('穿堂风');
const routerType = ref('');
const routerName = ref('');
const afterSetup = ref('');
const setupDate = ref('');
const topology = ref('');
const operatorPickerValue = ref<string[]>([]);
const realNameTypePickerValue = ref<string[]>([]);
const routerTypePickerValue = ref<string[]>([]);
const afterSetupPickerValue = ref<string[]>([]);
const showPickerOperator = ref(false);
const showPickerRealNameType = ref(false);
const showPickerRouterType = ref(false);
const showPickerAfterSetupType = ref(false);
const setupTimeShow = ref(false);

interface Option{
        text:string,
        value:string,
}
interface FormValues {
    tel: string;
    addr: string;
    contact: string;
    operator: string;
    cusName: string;
}

interface CalendarValue {
    getFullYear: () => number;
    getMonth: () => number;
    getDate: () => number;
  }

const columns = [
      { text: '移动', value: '移动' },
      { text: '电信', value: '联通' },
      { text: '联通', value: '联通' },
      { text: '广电', value: '广电' },
    ];
    const columns1 = [
      { text: '移动', value: '移动' },
      { text: '电信', value: '联通' },
      { text: '联通', value: '联通' },
    ];

const columns2 = [
      { text: '自备', value: '自备' },
      { text: '另安装', value: '另安装' },
    ];
const afterSetupColumns = [
      { text: '收银机', value: '收银机' },
      { text: '外卖打印机', value: '外卖打印机' },
      { text: '摄像头', value: '摄像头' },
    ];
const picValue = ref([
      { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
    ]);
const jobData = ref<FormValues>({
    cusName: '穿堂风',
    addr: '北京市海淀区',
    contact: '张三',
    tel: '13888888888',
    operator: '小张',
});



const onConfirmOperator = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log(selectedValues, selectedOptions[0].text);
      operator.value = selectedOptions[0].text;
      operatorPickerValue.value = selectedValues;
      showPickerOperator.value = false;
    };

const onConfirmRealNameType = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log(selectedValues, selectedOptions[0].text);
      realNameType.value = selectedOptions[0].text;
      realNameTypePickerValue.value = selectedValues;
      showPickerRealNameType.value = false;
    };


const onConfirmRouterType = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log(selectedValues, selectedOptions[0].text);
      routerType.value = selectedOptions[0].text;
      routerTypePickerValue.value = selectedValues;
      showPickerRouterType.value = false;
    };
const onConfirmAfterSetupType = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log(selectedValues, selectedOptions[0].text);
      afterSetup.value = selectedOptions[0].text;
      afterSetupPickerValue.value = selectedValues;
      showPickerAfterSetupType.value = false;
    };
const onConfirmSetupTime = (value: CalendarValue): void => {
    setupTimeShow.value = false;
    setupDate.value = formatDate(value);
  };
const formatDate = (date:CalendarValue) => {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };  
  
const onSubmit = () => {
    // handle form submission
    console.log('Form submitted');
};
</script>

<style >
</style>
