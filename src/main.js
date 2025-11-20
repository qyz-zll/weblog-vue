// 1. Vue 3 核心导入：替换 Vue 2 的 import Vue from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './route'  // 保持原路由导入路径（你的路由文件在 ./route 文件夹）
import axios from 'axios'  // 保留 axios 导入
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入 Element Plus 图标（可选）
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 2. 创建 Vue 3 应用实例（核心变化）
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 3. 配置生产环境提示（Vue 3 配置方式调整）
app.config.productionTip = false

// 4. 全局挂载（Vue 3 替换 Vue.prototype 为 app.config.globalProperties）
// 全局挂载 axios（组件内仍可通过 this.$axios 使用）
app.config.globalProperties.$axios = axios
// 全局挂载消息提示（保留原逻辑，组件内通过 this.$message 使用）
app.config.globalProperties.$message = {
  success: (msg) => alert(msg),
  error: (msg) => alert(msg)
}
app.use(ElementPlus)
// 5. 注册路由（Vue 3 用 app.use() 注册插件）
app.use(router)

// 6. 挂载应用到 #app（替代 Vue 2 的 new Vue(...).$mount('#app')）
app.mount('#app')