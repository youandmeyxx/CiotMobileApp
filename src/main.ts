// 引入样式
import './assets/main.css'
import 'vant/lib/index.css';
// 引入vue
import { createApp } from 'vue';
// 引入pinia
import { createPinia } from 'pinia';
// 引入vant
import Vant from 'vant';
// 引入App.vue
import App from './App.vue';
// 引入router
import router from './router';
import "amfe-flexible";
import Antd from 'ant-design-vue';
import Vue3Esign from 'vue3-esign';


// 创建app
const app = createApp(App)
// 使用pinia
app.use(createPinia())
// 使用router
app.use(router)
// 使用vant
app.use(Vant);
// 使用antd
app.use(Antd);
app.use(Vue3Esign);
// 挂载app
app.mount('#app')
