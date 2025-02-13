<template>
  <body>

    <div class="custom-div-title">我的任务</div>
    <van-cell title="选择单个日期查询" :value="date" @click="show = true" />
    <van-calendar v-model:show="show" @confirm="onConfirm" />
    <div>    
      <van-tabs v-model:active="tabs">
        <van-tab title="待执行" name="toExec">
          <div>
            <van-collapse v-model="collapse" accordion>
              <van-collapse-item title="穿堂风" name="1">
                <ul>
                  <li>编号:123</li>
                  <li>标题:新闻</li>
                  <li>内容:大家佛额外i金额哦及</li>
                </ul>
              </van-collapse-item>
              <van-collapse-item title="标题2" name="2">
                <ul>
                  <li>编号:123</li>
                  <li>标题:新闻</li>
                  <li>内容:大家佛额外i金额哦及</li>
                </ul>
              </van-collapse-item>
              <van-collapse-item title="标题3" name="3">
                <ul>
                  <li>编号:123</li>
                  <li>标题:新闻</li>
                  <li>内容:大家佛额外i金额哦及</li>
                </ul>
              </van-collapse-item>
            </van-collapse>
          </div>
        </van-tab>
        <van-tab title="进行中" name="executing">
          <div>
              <van-collapse v-model="collapse" accordion>
                <van-collapse-item title="杨国福" name="1">
                  <ul>
                    <li>编号:123</li>
                    <li>标题:新闻</li>
                    <li>内容:大家佛额外i金额哦及</li>
                  </ul>
                </van-collapse-item>
                <van-collapse-item title="标题2" name="2">
                  <ul>
                    <li>编号:123</li>
                    <li>标题:新闻</li>
                    <li>内容:大家佛额外i金额哦及</li>
                  </ul>
                </van-collapse-item>
                <van-collapse-item title="标题3" name="3">
                  <ul>
                    <li>编号:123</li>
                    <li>标题:新闻</li>
                    <li>内容:大家佛额外i金额哦及</li>
                  </ul>
                </van-collapse-item>
              </van-collapse>
          </div>
        </van-tab>
        <van-tab title="已完成" name="done">
          <div>
              <van-collapse v-model="collapse" accordion>
                <van-collapse-item title="吴老幺" name="1">
                  <ul>
                    <li>编号:123</li>
                    <li>标题:新闻</li>
                    <li>内容:大家佛额外i金额哦及</li>
                  </ul>
                </van-collapse-item>
                <van-collapse-item title="标题2" name="2">
                  <ul>
                    <li>编号:123</li>
                    <li>标题:新闻</li>
                    <li>内容:大家佛额外i金额哦及</li>
                  </ul>
                </van-collapse-item>
                <van-collapse-item title="标题3" name="3">
                  <ul>
                    <li>编号:123</li>
                    <li>标题:新闻</li>
                    <li>内容:大家佛额外i金额哦及</li>
                  </ul>
                </van-collapse-item>
              </van-collapse>
          </div>
        </van-tab>
    </van-tabs>
    </div>
  </body>
</template>
<script setup lang="ts" name="MyJob">
  import { ref } from 'vue';
  import '@/style/custom.css';
  const tabs = ref('toExec');
  const collapse = ref('1');
  const date = ref('');
  const show = ref(false);
  const formatDate = (date:CalendarValue) => {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };
  interface CalendarValue {
    getFullYear: () => number;
    getMonth: () => number;
    getDate: () => number;
  }

  const onConfirm = (value: CalendarValue): void => {
    show.value = false;
    date.value = formatDate(value);
  };
</script>
<style scoped>
</style>