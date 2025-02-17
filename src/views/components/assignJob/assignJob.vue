<template>
  <div>
    <div class="custom-div-title">任务分配</div>
    <van-form @submit="onSubmit">
        <div  v-for="(item, index) in assignJobData" :key="index">
            <van-cell>
                <template #title>
                    <span class="custom-title">{{item.cusName}}</span>
                </template>
                <template #right-icon>
                    <van-button type="primary"  size="mini" class="custom-button">分  配</van-button>
                </template>
            </van-cell>
            <van-cell-group inset>
                <van-field v-model="addr" label="地址:" />
                <van-field
                    v-model="item.operator"
                    is-link
                    readonly
                    name="picker"
                    label="装维人员:"
                    placeholder="点击选择装维人员"
                    @click="showPicker = true"
                />
                <van-field v-model="contact" type="tel" label="联系人:" />
                <van-field v-model="tel" type="tel" label="联系电话:" />
            </van-cell-group>
            <van-divider />
        </div>
    </van-form>
  </div>

    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
                <van-picker
                    :columns="columns"
                    :model-value="pickerValue"
                    @confirm="onConfirm"
                    @cancel="showPicker = false"
                />
    </van-popup>

</template>
<script setup lang="ts" home="AssignJob">
    import { ref } from 'vue';
    import '@/style/custom.css';

    const operator = ref('');
    const pickerValue = ref<string[]>([]);

    const tel = ref('');
    const addr = ref('');
    const contact = ref('');
    const showPicker = ref(false);
    const cusName = ref('穿堂风');

    interface FormValues {
        tel: string;
        addr: string;
        contact: string;
        operator: string;
        cusName: string;
    }

    interface Option{
        text:string,
        value:string,
    }
    // 装维人员数据
    const columns = [
      { text: '小张', value: '小张' },
      { text: '小马', value: '小马' },
      { text: '小李', value: '小李' },
      { text: '小赵', value: '小赵' },
      { text: '小胡', value: '小胡' },
    ];
    //装维单数据
    const assignJobData = [
      {
        id: 1,
        cusName: '穿堂风',
        addr: '北京市海淀区',
        contact: '张三',
        tel: '13888888888',
        operator: '小张',
      }, 
      {
        id: 2,
        cusName: '杨国福',
        addr: '上海市嘉定区',
        contact: '李四',
        tel: '13888888888',
        operator: '小李',
      }, 
      {
        id: 2,
        cusName: '杨国福',
        addr: '上海市嘉定区',
        contact: '李四',
        tel: '13888888888',
        operator: '小李',
      }, 
    ]

    // 点击选择装维人员
    const onConfirm = ({ selectedValues, selectedOptions }: { selectedValues: string[], selectedOptions: Option[] }) => {
      console.log(selectedValues, selectedOptions[0].text);
      operator.value = selectedOptions[0].text;
      pickerValue.value = selectedValues;
      showPicker.value = false;
    };

    const onSubmit = (values: FormValues) => {
      console.log('submit', values);
    };


</script>
<style scoped>
</style>