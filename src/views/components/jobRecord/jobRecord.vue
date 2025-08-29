<template>
  <div>
    <div class="custom-div-title">装维信息登记</div>
    <div>
        <van-search
        v-model="billcode"
        show-action
        label="订单号:"
        placeholder="请输入搜索关键词"
        >
        <template #action>
            <div @click="getJobInfo(billcode)">搜索</div>
        </template>
        </van-search>
    </div>
    <div v-if="saleBillData.billcode">
        <van-collapse v-model="collapse" accordion>
            <van-collapse-item :title="cusname" name="1">
                <div>详情:
                    <van-text-ellipsis :content="saleBillData.assigntype" />
                    <van-text-ellipsis
                    rows="3"
                    :content="saleBillData.billto"
                    expand-text="展开"
                    collapse-text="收起"
                    />
                    <div>销售员:<van-text-ellipsis :content="saleBillData.empname" /></div>
                    <div>超密:<van-text-ellipsis 
                        :content="saleBillData.userdef1"
                        rows="3"
                        expand-text="展开"
                        collapse-text="收起"
                    /></div>
                </div>
            </van-collapse-item>
        </van-collapse> 
        <van-form @submit="onRecordSubmit">
            <van-field v-model="addr" label="地址:" />
            <van-field v-model="topology" label="网络拓扑:" />
            <van-field
                v-model="carrier"
                is-link
                readonly
                name="carrier"
                label="运营商:"
                placeholder="请选择运营商"
                @click="showPickerOperator = true"
            />
            <van-field
                v-model="realnametype"
                is-link
                readonly
                name="realNameType"
                label="实名类型:"
                placeholder="请选择运营商"
                @click="showPickerRealNameType = true"
            />
            <van-field
                v-model="routertype"
                is-link
                readonly
                name="router"
                label="店铺路由器:"
                placeholder="选择类型"
                @click="showPickerRouterType = true"
            />
            <van-field v-if="routertype==='另安装'" v-model="routername" label="路由器型号:" />
            <van-cell title="安装后应用:" />
            <van-checkbox-group v-model="aftersetup" direction="horizontal">
                <van-checkbox name="收银机">收银机</van-checkbox>
                <van-checkbox name="外卖打印机">外卖打印机</van-checkbox>
                <van-checkbox name="摄像头">摄像头</van-checkbox>
            </van-checkbox-group>
            <van-cell title="安装日期:" :value="setupdate" @click="setupTimeShow = true"  />
            <van-field name="uploader" label="安装验收:">
                <template #input>
                    <van-uploader v-model="picUrl"
                        :multiple="true"
                        :max-count="10"
                    ></van-uploader>
                </template>
            </van-field>
            <van-field name="uploader" label="微信截图:">
                <template #input>
                    <van-uploader v-model="wxPicUrl"
                        :multiple="true"
                        :max-count="5"
                    ></van-uploader>
                </template>
            </van-field>
            <div style="margin: 16px; padding-bottom:100px;">
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
    <van-calendar v-model:show="setupTimeShow" @confirm="onConfirmSetupTime" :min-date="minDate" :max-date="maxDate"/>
    <Loading v-if="loading" />
</template>

<script setup lang="ts" name="JobRecord">
import { DOMAIN_RUL,globalPath } from "@/plugins/globalVariables";
import { ref, onMounted } from 'vue';
import type {SaleBill,CalendarValue, Option,setuprecord } from '@/views/components/support/interface.ts';
import { useRoute } from 'vue-router';
import axios from 'axios';
import {columns,columns1,columns2,afterSetupColumns} from "@/views/components/jobRecord/columns";
import { generateNonce, getUserinfoFromSession } from "../support/function";
import { showToast } from "vant";
import Loading from '@/components/Loading.vue';
import Compressor from 'compressorjs';
const route = useRoute();
const collapse = ref('1');
// 定义需要创建 ref 的变量名数组
const fieldNames = ['billcode','tel', 'addr', 'contact', 'carrier', 'realnametype', 'cusName', 'routertype', 'routername', 'setupdate', 'topology'];
// 使用 Object.fromEntries 批量创建 ref 变量
const { billcode, tel, addr, contact, carrier, realnametype, cusname, routertype, routername, setupdate, topology } = Object.fromEntries(fieldNames.map(name => [name, ref('')]));
const loading = ref(false);
const jobid = ref(0);
const operatorPickerValue = ref<string[]>([]);
const realNameTypePickerValue = ref<string[]>([]);
const routerTypePickerValue = ref<string[]>([]);
const afterSetupPickerValue = ref<string[]>([]);
const aftersetup = ref<string[]>([]);
const showPickerOperator = ref(false);
const showPickerRealNameType = ref(false);
const showPickerRouterType = ref(false);
const showPickerAfterSetupType = ref(false);
const setupTimeShow = ref(false);
const minDate = new Date(2010, 0, 1);
const maxDate = new Date(2099, 11, 31);
//读取路由带进来的参数
billcode.value = route.query.billcode as string;
jobid.value = route.query.jobid as unknown as number;

//初始化页面后调用函数
const picUrl = ref([]);
const wxPicUrl = ref([]);

const saleBillData = ref<SaleBill>({
    billcode: '',
    billdate: '',
    billid:    '',
    billstatusname  : '',
    billto: '',
    ctradername: '',
    depname: '',
    empname: '',
    operator : '',
    jobdate: '',
    assigntype: '',
    jobid: 0,
    jobtime: '',
    userdef1: ''
    });
  

    // 在页面初始化后调用 getJobInfo 函数
    onMounted(() => {
        console.log('onMounted执行getJobInfo');
        getUserinfoFromSession();
        getJobInfo(billcode.value);
    });



    const onConfirmOperator = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
        console.log(selectedValues, selectedOptions[0].text);
        carrier.value = selectedOptions[0].text;
        operatorPickerValue.value = selectedValues;
        showPickerOperator.value = false;
    };

    const onConfirmRealNameType = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
        console.log(selectedValues, selectedOptions[0].text);
        realnametype.value = selectedOptions[0].text;
        realNameTypePickerValue.value = selectedValues;
        showPickerRealNameType.value = false;
    };

    const onConfirmRouterType = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
        console.log(selectedValues, selectedOptions[0].text);
        routertype.value = selectedOptions[0].text;
        routerTypePickerValue.value = selectedValues;
        showPickerRouterType.value = false;
    };
    const onConfirmSetupTime = (value: CalendarValue): void => {
        setupTimeShow.value = false;
        setupdate.value = formatDate(value);
    };
    const formatDate = (date: CalendarValue) => {
      const year = date.getFullYear();
      // 确保月份为两位数
      const month = String(date.getMonth() + 1).padStart(2, '0');
      // 确保日期为两位数
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const getJobInfo = (code: string) => {
        loading.value = true;
        saleBillData.value = {
            billcode: '',
            billdate: '',
            billid:    '',
            billstatusname  : '',
            billto: '',
            ctradername: '',
            depname: '',
            empname: '',
            operator : '',
            jobdate: '',
            assigntype: '',
            jobid: 0,
            jobtime: '',
            userdef1: ''
        };
    // 根据 billcode 作为参数，获取 job 信息
    loading.value = true;
    axios.get(`${DOMAIN_RUL}/workWeChart/getJobInfo`, { params: { jobid: jobid.value } })
        .then(response => {
        if (response.data.code === 200) {
            console.log('请求成功', response.data);
            saleBillData.value = response.data.result;
            loading.value = false;
        }
        })
        .catch(error => {
        console.error('请求失败', error);
        });
    };

    const onRecordSubmit = () => {
        loading.value = true;
        let picpath = '';
        let wxpicpath= '';
        const formData = new FormData();
        picUrl.value.forEach((file: { file: File }) => {
            formData.append('file', file.file);
            
        });
        console.log(formData);
        const formDataWx = new FormData();
        wxPicUrl.value.forEach((file: { file: File }) => {
            formDataWx.append('file', file.file);
            
        });

    //         // 压缩并添加验收图片
    //     const compressAndAppendPic = () => {
    //             let count = 0;
    //             picUrl.value.forEach(({ file }, index) => {
    //                 new Compressor(file, {
    //                     quality: 0.6, // 压缩质量，范围 0 - 1
    //                     success(result: string | Blob) {
    //                         console.error('图片压缩成功', result);
    //                         formData.append('file', result);
    //                         count++;
    //                         if (count === picUrl.value.length) {
    //                         }
    //                     },
    //                     error(err: any) {
    //                         console.error('图片压缩失败', err);
    //                     }
    //                 });
    //             });
    //             if (picUrl.value.length === 0) {
    //             }
    //     };

    // // 压缩并添加微信截图
    // const compressAndAppendWxPic = () => {
    //         let count = 0;
    //         wxPicUrl.value.forEach(({ file }, index) => {
    //             new Compressor(file, {
    //                 quality: 0.6, // 压缩质量，范围 0 - 1
    //                 success(result: string | Blob) {
    //                     console.error('图片压缩成功', result);
    //                     formDataWx.append('file', result);
    //                     count++;
    //                     if (count === wxPicUrl.value.length) {
    //                     }
    //                 },
    //                 error(err: any) {
    //                     console.error('图片压缩失败', err);
    //                 }
    //             });
    //         });
    //         if (wxPicUrl.value.length === 0) {
    //         }
    // };

        let nonce = generateNonce();
        axios.post(`${DOMAIN_RUL}/workWeChart/recordWxUpload`, formDataWx, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.data.code === 200) {
                console.log('请求成功', response.data);
                wxpicpath = response.data.result;
            }
        })
        .catch(error => {
            console.error('请求失败', error);
        });

        // 发送 POST 请求
        axios.post(`${DOMAIN_RUL}/workWeChart/recordUpload`, formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
                if (response.data.code === 200) {
                    console.log('请求成功', response.data); 
                    picpath = response.data.result;
                    if (picpath === '') {
                        showToast('验收图片出错，请上传安装验收图片');
                        loading.value = false;
                        return;
                    }
                    recordAdd(JSON.stringify(picpath),JSON.stringify(wxpicpath),nonce);
                }
                loading.value = false;
            })
        .catch(error => {
            console.error('请求失败', error);
            if (picpath === '') {
                    showToast('验收图片出错，请上传安装验收图片');
                    loading.value = false;
                    return;
                }
            recordAdd(JSON.stringify(picpath),JSON.stringify(wxpicpath),nonce);
            loading.value = false;
            });
        
    };

    const recordAdd = (picpath:string,wxPicPath:String,nonce:string) => {
        loading.value = true;
        console.log('picpath',picpath);
        let recordInfo = { 
            billcode: billcode.value, 
            tel: tel.value, 
            addr: addr.value, 
            contact: contact.value, 
            operator: saleBillData.value.operator,
            realnametype: realnametype.value, 
            cusname: saleBillData.value.ctradername, 
            routertype: routertype.value, 
            routername: routername.value, 
            aftersetup: JSON.stringify(aftersetup.value), 
            setupdate: setupdate.value, 
            topology: topology.value,
            carrier: carrier.value,  // Add default value for carrier
            picurl: picpath, 
            wxpicurl: wxPicPath,
            jobid: jobid.value,
            assigntype: saleBillData.value.assigntype,
            verifytype: '完成',
                // 新增 nonce 参数，这里假设 nonce 是通过一个函数生成
            
        }

        if(validateData(recordInfo)===false){
            loading.value = false;
            return;
        }

                // 发送 POST 请求
        axios.post(`${DOMAIN_RUL}/workWeChart/recordAdd`, recordInfo,{
            params: {
                nonce: nonce
            }
        })
            .then(response => {
                if (response.data.code === 200) {
                    console.log('请求成功', response.data); 
                    //返回上一页
                    window.history.go(-1);
                }
                loading.value = false;
            })
            .catch(error => {
            console.error('请求失败', error);
            loading.value = false;
            // 在这里处理错误
            });
    };


    //数据完整性校验
const validateData = (data: { billcode?: string; tel?: string; addr?: string; contact?: string; operator?: string; realnametype?: string; cusname?: string; routertype?: string; routername?: string; aftersetup?: string; setupdate?: string; topology?: string; carrier?: string; picurl?: string; jobid?: number; assigntype?: string; verifytype?: string; userid?: any; password?: any; name?: any; mobile?: any; email?: any; }) => {
    console.log(data);
    let flog = true;
    if (!data.billcode || !data.operator ||!data.realnametype ||!data.cusname ||!data.routertype ||!data.setupdate ||!data.carrier ||!data.jobid ||!data.assigntype ||!data.verifytype) {
        showToast("有字段为空填请检查!");
        flog =false;
    }
    return flog;
};

</script>

<style >
</style>
