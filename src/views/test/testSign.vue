<template>
  <var-button @click.stop="openSign" class="my-sign" type="primary" text>签字</var-button>
<!--点击签字按钮，弹出如下弹框-->
  <var-popup position="bottom" v-model:show="signPopup" >
        <div class="popup-wrap">
          <div class="popup-title">
            签字
          </div>
          <div class="popup-content">
          <div style="width: 100%;">
          <!--调用插件-->
            <Vue3Esign ref="vueEsignRef" 
            :height="clientHeight" 
            :width="clientWidth" 
            :bgColor="vueEsignBgColor" 
            :is-clear-bg-color="false"
            :is-crop="isCrop" 
            :line-width="lineWidth" 
            :line-color="lineColor" />
            </div>
          </div>
          <div class="popup-buttom">
            <var-button @click.stop="clearCanves" type="default" size="small">清除</var-button>
            <var-button  @click.stop="saveCanves"  type="primary" size="small" style="margin-left:70px">提交</var-button>
          </div>
        </div>
    </var-popup>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { Vue3Esign } from 'vue3-esign'
import { showToast  } from "vant";
// 注册组件
// <script setup> 自动注册引入的组件，无需 components

const signPopup = ref(false)
const vueEsignRef = ref<any>(null)
const vueEsignBgColor = ref<string>('#f7f7f7')
const lineWidth = ref(6)
const lineColor = ref('#000000')
const isCrop = ref(false)
const img = ref('')
const image = ref('');

const clientWidth = ref(400)
const clientHeight = ref(250)

// 打开弹框
const openSign = async () => {
  signPopup.value = true;
  await nextTick();
}

// 清空
function clearCanves(): void {
  vueEsignRef.value?.reset()
}

// 保存
const saveCanves = async () => {
  try {
    const base64Data = await vueEsignRef.value.generate()
    console.log('res', base64Data)
    img.value = base64Data
    const blob = dataURLtoBlob(base64Data);

    const file = blobToFile(blob, "业主签字.png");

    const formData = new FormData();
    formData.append("file", file);

  }
  catch (error) {
    showToast('请先签字');
    img.value = ''
  }
}

// 将base64转换为blob
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : 'image/png';

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 将blob转换为file
function blobToFile(theBlob: any, fileName: string) {
  const file = new File([theBlob], fileName)
  return file;
}

onMounted(() => {
  // 因为我的签字在弹框中，所以整体高度减去了弹框顶部和底部
  clientHeight.value = document.body.clientHeight * 0.5 - 40 - 40;
  clientWidth.value = document.body.clientWidth
  console.log(clientWidth.value, clientHeight.value, "==========");
})
</script>
<style scoped >
 
/* 签字按钮样式 */
.my-sign {
  position: absolute;
  right: 0px;
  top:0;
}
.my-sign>>>.var-button__content {
  color:var(--md-blue-700);
}
 
/* 签字弹框样式 */
.popup-wrap {
  display: flex;
  flex-direction: column;
  height: 50vh;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.popup-title {
  height: 40px;
  font-size: 16px;
  font-family: Source Han Sans SC;
  font-weight: 700;
  color: #333333;
  line-height: 40px;
  padding-left: 10px;
  border-bottom: 1px solid #ccc;
}
.popup-buttom {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.popup-content {
  flex:1px;
}
</style>