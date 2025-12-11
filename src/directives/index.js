import { createApp } from 'vue';
import App from '@/App.vue';
import watermark from './watermark';

const app = createApp(App);

// 全局注册水印指令
app.directive('watermark', watermark);

app.mount('#app');