<template>
  <!-- 根容器添加动态水印，绑定数据库username -->
  <div class="home-container" v-watermark="watermarkConfig">
    <div class="content">
      <h1>动态水印演示</h1>
      <p>当前登录用户：{{ userStore.userInfo.username }}</p>
      <el-button type="primary" @click="handleLogout()">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

// 动态水印配置（响应式，username变化自动更新）
const watermarkConfig = computed(() => ({
  text: userStore.isLogin ? `${userStore.userInfo.username} © 内部系统` : '未登录',
  fontSize: '16px',
  color: 'rgba(120,120,120,0.12)',
  rotate: -18,
  spacing: 70,
  zIndex: 9999
}));

// 退出登录
const handleLogout = () => {
  userStore.logout();
  ElMessage.success('退出成功，水印已重置');
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10000;  /* 高于水印层级，避免被遮挡 */
}

h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

p {
  font-size: 18px;
  margin-bottom: 20px;
  color: #666;
}
</style>