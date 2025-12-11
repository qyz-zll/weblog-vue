// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './route'

// 1. 全局创建并导出 Pinia 实例（核心：提前创建，全局可用）
export const pinia = createPinia()

// 2. 创建 App 实例
const app = createApp(App)

// 3. 挂载插件（严格顺序：Pinia → 路由 → ElementPlus）
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 4. 延迟挂载 App（给 Pinia 足够的初始化时间）
setTimeout(() => {
  app.mount('#app')
}, 0)