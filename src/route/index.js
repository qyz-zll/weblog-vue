// 1. 移除 Vue 2 相关导入，改为 Vue Router 4 按需导入
import { createRouter, createWebHashHistory } from 'vue-router'
// 组件导入路径不变（@ 别名在 Vue 3 中仍可用）
import Login from '@/views/Login'
import Register from '@/views/Register'
import HomeView from '@/views/HomeView.vue'
import Vue from "vue";
import UserInfo from "@/views/UserInfo.vue";

// 新增：导入好友功能相关组件（确保路径与你的文件结构一致）
import FriendList from '@/views/Friends/FriendList.vue'       // 我的好友列表
import FriendRequestSend from '@/views/Friends/FriendRequestSend.vue' // 添加好友
import FriendRequestList from '@/views/Friends/FriendRequestList.vue'
import ChatPage from "@/views/ChatPage.vue"; // 好友申请列表

// 2. 路由规则不变（保留原有的 requiresAuth 元信息）
const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    meta: { requiresAuth: true } // 需登录才能访问（逻辑不变）
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/UserInfo',
    component: UserInfo,
    meta: { requiresAuth: true } // 个人中心也需登录（补充完整权限）
  },
  // 新增：好友功能路由（均需登录，添加 requiresAuth: true）
  {
    path: '/friends', // 我的好友列表路径（与首页跳转路径一致）
    name: 'FriendList',
    component: FriendList,
    meta: { requiresAuth: true } // 需登录访问
  },
  {
    path: '/friend-request/send', // 添加好友路径
    name: 'FriendRequestSend',
    component: FriendRequestSend,
    meta: { requiresAuth: true } // 需登录访问
  },
  {
    path: '/friend-request/list', // 好友申请列表路径
    name: 'FriendRequestList',
    component: FriendRequestList,
    meta: { requiresAuth: true } // 需登录访问
  },
  // 404 路由：Vue Router 4 推荐用 path: '/:pathMatch(.*)*'（更规范）
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login' // 未匹配路由跳登录页
  },
  {
    path: '/chat/:friendId', // 动态路由参数：friendId（与跳转路径匹配）
    name: 'ChatPage',
    component: ChatPage, // 对应你的聊天页组件
    props: true, // 允许通过 props 接收 friendId（可选，方便组件内使用）
    meta: {
    requiresAuth: true
    },
  }
]

console.log(11111111111111111111111111111111,Vue)

// 3. 创建路由实例（Vue Router 4 核心变化）
const router = createRouter({
  // 替代原 mode: 'hash' → 用 createWebHashHistory() 实现哈希模式
  history: createWebHashHistory(), 
  routes // 路由规则（与原逻辑一致）
})

// 4. 路由守卫：逻辑完全保留（Vue Router 4 用法不变）
router.beforeEach((to, from, next) => {
  // 判断目标路由是否需要登录认证
  if (to.meta.requiresAuth) {
    // 从本地存储获取 JWT Token（与原逻辑一致）
    const token = localStorage.getItem('accessToken')
    if (token) {
      // 有 Token → 放行
      next()
    } else {
      // 无 Token → 跳转到登录页
      next('/login')
    }
  } else {
    // 不需要认证的路由（登录/注册）→ 直接放行
    next()
  }
})

export default router