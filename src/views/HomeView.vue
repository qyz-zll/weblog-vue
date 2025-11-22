<template>
  <div class="home-container">
    <!-- 粒子背景（最底层，不影响交互） -->
    <div id="particles-bg" class="particles-container"></div>

    <!-- 背景装饰（渐变圆形+光点） -->
    <div class="background-decoration">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="gradient-circle circle-3"></div>
      <div class="glow-points"></div>
    </div>

    <!-- 顶部导航栏（滚动渐变+阴影） -->
    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="logo">
        <span class="logo-icon">✏️</span>
        <span class="logo-text">Weblog 博客平台</span>
      </div>
      <div class="user-info">
        <!-- 用户头像（hover旋转+边框渐变） -->
        <div class="avatar-container" @click="handleAvatarUpload">
        <img
           :src="userInfo?.avatar || defaultAvatar"
          alt="用户头像"
          class="avatar"
          @mouseenter="avatarHover = true"
          @mouseleave="avatarHover = false"
        >
        <div class="avatar-border" :class="{ 'avatar-border-active': avatarHover }"></div>
        <!-- 新增：上传加载提示 -->
        <div class="avatar-loading" v-if="isAvatarLoading">上传中...</div>
        <!-- 新增：上传错误提示 -->
        <div class="avatar-error" v-if="avatarError">{{ avatarError }}</div>
        </div>
        <!-- 用户名（渐变色+hover高亮） -->
        <span class="username" :class="{ 'username-hover': usernameHover }"
              @mouseenter="usernameHover = true"
              @mouseleave="usernameHover = false">
          {{ userInfo.data?.username || '匿名用户' }}
        </span>
        <!-- 退出登录按钮（渐变背景+hover动效） -->
        <button
          @click="handleLogout"
          class="logout-btn"
          :class="{ 'logout-btn-hover': logoutHover }"
          @mouseenter="logoutHover = true"
          @mouseleave="logoutHover = false"
        >
          <span>退出登录</span>
          <span class="logout-icon">🚪</span>
        </button>
      </div>
    </nav>

    <!-- 主体内容区（居中+卡片悬浮） -->
    <main class="content">
      <!-- 欢迎卡片（渐变背景+阴影+入场动画） -->
      <div class="welcome-card" @mouseenter="cardHover = true" @mouseleave="cardHover = false">
        <div class="card-header">
          <h1 class="welcome-title" :class="{ 'title-hover': cardHover }">
            欢迎回来，{{ userInfo.data?.username || '探索者' }}！
          </h1>
          <!-- 装饰线 -->
          <div class="title-divider" :style="{ width: cardHover ? '200px' : '120px' }"></div>
        </div>

        <!-- 个人简介（带背景板+渐变色文字） -->
        <p class="bio">
          <span class="bio-icon">💬</span>
          {{ userInfo.data?.bio || '暂无个人简介，可前往个人中心完善' }}
        </p>

        <!-- 统计信息（卡片式+hover上浮） -->
        <div class="stats">
          <div class="stat-item" @mouseenter="statHover[0] = true" @mouseleave="statHover[0] = false">
            <div class="stat-icon">📅</div>
            <span class="label">注册时间</span>
            <span class="value">{{ formatTime(userInfo.data?.create_time) || '暂无数据' }}</span>
          </div>
          <div class="stat-item" @mouseenter="statHover[1] = true" @mouseleave="statHover[1] = false">
            <div class="stat-icon">⏰</div>
            <span class="label">最后登录</span>
            <span class="value">{{ formatTime(userInfo.data?.last_login_time) || '暂无数据' }}</span>
          </div>
        </div>
      </div>

      <!-- 功能入口（渐变卡片+hover动效+图标旋转） -->
      <div class="function-list">
        <div
          class="function-card"
          @click="goToPage('/articles')"
          @mouseenter="funcHover[0] = true"
          @mouseleave="funcHover[0] = false"
          :class="{ 'func-card-active': funcHover[0] }"
        >
          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[0] }">📝</div>
          <h3 class="func-title">我的文章</h3>
          <p class="func-desc">查看、发布或编辑你的博客</p>
          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[0] }">→</div>
        </div>
        <div
          class="function-card"
          @click="goToPage('/UserInfo')"
          @mouseenter="funcHover[1] = true"
          @mouseleave="funcHover[1] = false"
          :class="{ 'func-card-active': funcHover[1] }"
        >
          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[1] }">👤</div>
          <h3 class="func-title">个人中心</h3>
          <p class="func-desc">修改头像、简介等个人信息</p>
          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[1] }">→</div>
        </div>
        <div
          class="function-card"
          @click="goToPage('/explore')"
          @mouseenter="funcHover[2] = true"
          @mouseleave="funcHover[2] = false"
          :class="{ 'func-card-active': funcHover[2] }"
        >
          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[2] }">🔍</div>
          <h3 class="func-title">发现内容</h3>
          <p class="func-desc">浏览其他用户的优质博客</p>
          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[2] }">→</div>
        </div>
      </div>
    </main>

    <!-- 底部装饰条 -->
    <footer class="home-footer">
      <div class="footer-gradient"></div>
      <p class="footer-text">Weblog 博客平台 © 2025 | 记录生活，分享知识</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'; // Vue3 消息提示组件
import { logout } from '@/api/user';
// import { initParticles } from '@/utils/particles.js';
// import { onMounted } from 'vue'
// 粒子库（Vue3 适配）
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import service from "@/utils/request";

const router = useRouter();

// 保留原有核心数据（功能不变）
const userInfo = ref({}); // 存储用户信息
const defaultAvatar = ''; // 保留默认头像

// 新增动画控制响应式状态（不影响原有功能）
const isScrolled = ref(false);
const avatarHover = ref(false);
const usernameHover = ref(false);
const logoutHover = ref(false);
const cardHover = ref(false);
const statHover = ref([false, false]);
const funcHover = ref([false, false, false]);
const isAvatarLoading = ref(false);
const avatarError = ref('');

// 保留原有功能：从 LocalStorage 读取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('userInfo');
  if (userStr) {
    userInfo.value = JSON.parse(userStr);
  } else {
    // 无用户信息，跳登录页（原有逻辑）
    router.push('/login');
  }
};

// 保留原有功能：退出登录
const handleLogout = async () => {
  try {
    logout(); // 调用登出接口（原有逻辑）
    router.push('/login'); // 跳登录页（原有逻辑）
    ElMessage.success('退出登录成功！'); // Vue3 消息提示
  } catch (error) {
    ElMessage.error('退出失败：' + error.message); // Vue3 消息提示
  }
};

// 保留原有功能：时间格式化（修复 iOS 兼容）
const formatTime = (timeStr) => {
  if (!timeStr) return '暂无数据';
  let date = new Date(timeStr);
  // 修复 iOS 不识别 "-" 分隔符的兼容问题
  if (isNaN(date.getTime())) {
    date = new Date(timeStr.replace(/-/g, '/'));
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 保留原有功能：跳转页面（提示待实现）
const goToPage = (path) => {
  // 优化提示信息：跳转到个人中心时显示更精准的提示
  const tipText = path === '/UserInfo'
    ? '正在跳转到个人中心...'
    : `即将跳转到 ${path} 页面`;

  ElMessage.success(tipText); // 用 success 提示更友好
  router.push(path); // 取消注释，实现实际跳转
};
const handleAvatarUpload = () => {
  // 触发文件选择弹窗
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpg,image/jpeg,image/png,image/gif'; // 限制图片格式
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadAvatarToServer(file);
    }
  };
  input.click();
};

const uploadAvatarToServer = async (file) => {
  isAvatarLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const accessToken = localStorage.getItem('accessToken');

    // 🌟 关键：service 响应拦截器已返回后端的 data（{code:200, message:"", data:{}}）
    const resData = await service.post('/upload-avatar/', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // 🌟 修正判断逻辑：直接用后端的 code 判断成功（无需 status）
    if (resData?.code !== 200) {
      throw new Error(resData?.message || '头像上传失败');
    }

    // 提取完整头像 URL（后端已返回，直接用）
    const newAvatarUrl = resData.data?.avatar || '';
    const validAvatarUrl = newAvatarUrl.startsWith('http') ? newAvatarUrl : defaultAvatar;

    // 赋值给 userInfo（ref 变量加 .value）
    userInfo.value.avatar = validAvatarUrl;
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

    ElMessage.success('头像修改成功！'); // 正确提示成功
  } catch (error) {
    // 仅真正失败时提示（如后端 code≠200、网络错误）
    const errMsg = error.message || '网络错误';
    ElMessage.error('保存失败：' + errMsg);
    // 错误时兜底头像
    userInfo.value.avatar = userInfo.value.avatar || defaultAvatar;
  } finally {
    isAvatarLoading.value = false;
  }
};


// 关键修改：粒子配置增强鼠标跟随效果
// / 粒子初始化：配置鼠标跟随效果，仅执行一次
const initParticles = async () => {
  await loadSlim(tsParticles);
  await tsParticles.load({
    id: "particles-bg",
    options: {
      fullScreen: { enable: true, zIndex: 0 },
      size: { value: 3, random: true },
      opacity: { value: 0.7, random: true },
      speed: { x: 0.5, y: 0.5 },
      shape: {
        type: ["circle", "triangle"],
        options: { triangle: { fill: true } }
      },
      color: {
        value: ["#409eff", "#67c23a", "#f56c6c", "#909399"],
        random: true
      },
      particles: {
        number: {
          value: 80,
          density: { enable: true, value_area: 800 },
          limit: 120
        },
        links: {
          enable: true,
          distance: 100,
          color: "#409eff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
          attract: { // 核心：粒子主动向鼠标吸引
            enable: true,
            rotateX: 3000,
            rotateY: 3000
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: { enable: true, mode: ["grab", "attract"] }, // 鼠标悬浮时聚集+吸引
            onClick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 180, links: { opacity: 0.6, width: 1.5 } },
            push: { quantity: 5 },
            attract: { distance: 150, duration: 2, speed: 3 }
          }
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              particles: { number: { value: 40 } },
              links: { distance: 80 }
            }
          }
        ]
      }
    }
  });
};

// 页面挂载时：执行用户信息读取、粒子初始化、滚动监听
onMounted(() => {
  getUserInfo();
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20;
  });
  initParticles(); // 仅调用一次粒子初始化
  setTimeout(() => {
    document.querySelector('.content')?.classList.add('content-visible');
  }, 300);
});

</script>

<style scoped>
/* 全局样式重置与基础设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.home-container {
  position: relative;
  min-height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
}
/* 新增：头像上传加载提示 */
.avatar-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 10;
}

/* 新增：头像上传错误提示 */
.avatar-error {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #f56c6c;
  font-size: 12px;
  white-space: nowrap;
}
/* 粒子容器样式（确保全屏且不抢占交互） */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* 不拦截鼠标事件 */
  z-index: 0; /* 最底层背景 */
}

/* 背景装饰（渐变圆形+动态光点） */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: float 15s infinite alternate ease-in-out;
}

.circle-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  top: -200px;
  left: -200px;
}

.circle-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f56c6c, #409eff);
  bottom: -150px;
  right: -150px;
  animation-delay: 3s;
}

.circle-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #909399, #67c23a);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 6s;
}

.glow-points {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#409eff 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.1;
  animation: fade 8s infinite alternate;
}

/* 导航栏样式（优化后，保留原有布局） */
.navbar {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 50px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  padding: 12px 50px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
  color: #409eff;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar-container {
  position: relative;
  width: 40px;
  height: 40px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.avatar-border {
  position: absolute;
  top: -2px;
  left: -2px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: -1;
}

.avatar-border-active {
  opacity: 1;
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.4);
}

.avatar:hover {
  transform: rotate(5deg) scale(1.05);
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: all 0.3s ease;
  cursor: default;
}

.username-hover {
  color: #409eff;
  text-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(135deg, #f56c6c, #e64340);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.2);
}

.logout-btn-hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(245, 108, 108, 0.3);
  background: linear-gradient(135deg, #e64340, #d32f2f);
}

.logout-icon {
  font-size: 14px;
}

/* 主体内容样式（优化后，保留原有布局） */
.content {
  position: relative;
  z-index: 5;
  width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.content-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 欢迎卡片（优化后） */
.welcome-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(135deg, #409eff, #67c23a);
}

.welcome-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 20px;
}

.welcome-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.title-hover {
  color: #409eff;
  text-shadow: 0 0 10px rgba(64, 158, 255, 0.2);
}

.title-divider {
  height: 3px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.bio {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
  background-color: rgba(64, 158, 255, 0.05);
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bio-icon {
  font-size: 20px;
  color: #409eff;
}

.stats {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 24px;
  color: #409eff;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* 功能入口列表（优化后，保留原有布局） */
.function-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.function-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.func-card-active {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(64, 158, 255, 0.1);
  background: linear-gradient(135deg, #f8f9ff, #f0f7ff);
}

.func-icon {
  font-size: 40px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.func-icon-rotate {
  transform: rotate(15deg) scale(1.1);
}

.func-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.func-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.func-arrow {
  font-size: 16px;
  color: #409eff;
  opacity: 0;
  transition: all 0.3s ease;
}

.func-arrow-active {
  opacity: 1;
  transform: translateX(5px);
}

/* 底部样式 */
.home-footer {
  position: relative;
  z-index: 5;
  margin-top: 60px;
  padding: 20px 0;
  text-align: center;
}

.footer-gradient {
  height: 4px;
  width: 100%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  margin-bottom: 16px;
}

.footer-text {
  font-size: 14px;
  color: #999;
}

/* 动画关键帧 */
@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 30px) scale(1.05); }
}

@keyframes fade {
  0% { opacity: 0.1; }
  100% { opacity: 0.2; }
}

/* 响应式适配（保留原有逻辑） */
@media (max-width: 1200px) {
  .content {
    width: 100%;
  }
  .function-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
  }
  .navbar-scrolled {
    padding: 10px 20px;
  }
  .logo-text {
    font-size: 18px;
  }
  .user-info {
    gap: 12px;
  }
  .avatar-container {
    width: 36px;
    height: 36px;
  }
  .username {
    font-size: 14px;
  }
  .logout-btn {
    padding: 5px 10px;
    font-size: 13px;
  }
  .content {
    padding: 15px;
  }
  .welcome-card {
    padding: 25px;
  }
  .welcome-title {
    font-size: 22px;
  }
  .bio {
    font-size: 15px;
    padding: 10px 16px;
  }
  .stats {
    gap: 20px;
  }
  .function-list {
    grid-template-columns: 1fr;
  }
}
</style>