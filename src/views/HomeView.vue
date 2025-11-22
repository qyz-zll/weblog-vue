<!--<template>-->
<!--  <div class="home-container">-->
<!--    &lt;!&ndash; 粒子背景（最底层，不影响交互） &ndash;&gt;-->
<!--    <div id="particles-bg" class="particles-container"></div>-->

<!--    &lt;!&ndash; 背景装饰（渐变圆形+光点） &ndash;&gt;-->
<!--    <div class="background-decoration">-->
<!--      <div class="gradient-circle circle-1"></div>-->
<!--      <div class="gradient-circle circle-2"></div>-->
<!--      <div class="gradient-circle circle-3"></div>-->
<!--      <div class="glow-points"></div>-->
<!--    </div>-->

<!--    &lt;!&ndash; 顶部导航栏（滚动渐变+阴影） &ndash;&gt;-->
<!--    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">-->
<!--      <div class="logo">-->
<!--        <span class="logo-icon">✏️</span>-->
<!--        <span class="logo-text">Weblog 博客平台</span>-->
<!--      </div>-->
<!--      <div class="user-info">-->
<!--        &lt;!&ndash; 用户头像（hover旋转+边框渐变） &ndash;&gt;-->
<!--        <div class="avatar-container" @click="handleAvatarUpload">-->
<!--          <img-->
<!--            :src="userInfo?.avatar || defaultAvatar"-->
<!--            alt="用户头像"-->
<!--            class="avatar"-->
<!--            @mouseenter="avatarHover = true"-->
<!--            @mouseleave="avatarHover = false"-->
<!--            @error="handleAvatarError"-->
<!--          >-->
<!--          <div class="avatar-border" :class="{ 'avatar-border-active': avatarHover }"></div>-->
<!--          &lt;!&ndash; 新增：上传加载提示 &ndash;&gt;-->
<!--          <div class="avatar-loading" v-if="isAvatarLoading">上传中...</div>-->
<!--          &lt;!&ndash; 新增：上传错误提示 &ndash;&gt;-->
<!--          <div class="avatar-error" v-if="avatarError">{{ avatarError }}</div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 用户名（渐变色+hover高亮）：修复 userInfo.data → userInfo &ndash;&gt;-->
<!--        <span class="username" :class="{ 'username-hover': usernameHover }"-->
<!--              @mouseenter="usernameHover = true"-->
<!--              @mouseleave="usernameHover = false">-->
<!--          {{ userInfo?.username || '匿名用户' }}-->
<!--        </span>-->
<!--        &lt;!&ndash; 退出登录按钮（渐变背景+hover动效） &ndash;&gt;-->
<!--        <button-->
<!--          @click="handleLogout"-->
<!--          class="logout-btn"-->
<!--          :class="{ 'logout-btn-hover': logoutHover }"-->
<!--          @mouseenter="logoutHover = true"-->
<!--          @mouseleave="logoutHover = false"-->
<!--        >-->
<!--          <span>退出登录</span>-->
<!--          <span class="logout-icon">🚪</span>-->
<!--        </button>-->
<!--      </div>-->
<!--    </nav>-->

<!--    &lt;!&ndash; 主体内容区（居中+卡片悬浮） &ndash;&gt;-->
<!--    <main class="content">-->
<!--      &lt;!&ndash; 欢迎卡片（渐变背景+阴影+入场动画） &ndash;&gt;-->
<!--      <div class="welcome-card" @mouseenter="cardHover = true" @mouseleave="cardHover = false">-->
<!--        <div class="card-header">-->
<!--          <h1 class="welcome-title" :class="{ 'title-hover': cardHover }">-->
<!--            &lt;!&ndash; 修复 userInfo.data → userInfo &ndash;&gt;-->
<!--            欢迎回来，{{ userInfo?.username || '探索者' }}！-->
<!--          </h1>-->
<!--          &lt;!&ndash; 装饰线 &ndash;&gt;-->
<!--          <div class="title-divider" :style="{ width: cardHover ? '200px' : '120px' }"></div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 个人简介（带背景板+渐变色文字）：修复 userInfo.data → userInfo &ndash;&gt;-->
<!--        <p class="bio">-->
<!--          <span class="bio-icon">💬</span>-->
<!--          {{ userInfo?.bio || '暂无个人简介，可前往个人中心完善' }}-->
<!--        </p>-->

<!--        &lt;!&ndash; 统计信息（卡片式+hover上浮）：修复 userInfo.data → userInfo &ndash;&gt;-->
<!--        <div class="stats">-->
<!--          <div class="stat-item" @mouseenter="statHover[0] = true" @mouseleave="statHover[0] = false">-->
<!--            <div class="stat-icon">📅</div>-->
<!--            <span class="label">注册时间</span>-->
<!--            <span class="value">{{ formatTime(userInfo?.create_time) || '暂无数据' }}</span>-->
<!--          </div>-->
<!--          <div class="stat-item" @mouseenter="statHover[1] = true" @mouseleave="statHover[1] = false">-->
<!--            <div class="stat-icon">⏰</div>-->
<!--            <span class="label">最后登录</span>-->
<!--            <span class="value">{{ formatTime(userInfo?.last_login_time) || '暂无数据' }}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 功能入口（渐变卡片+hover动效+图标旋转） &ndash;&gt;-->
<!--      <div class="function-list">-->
<!--        <div-->
<!--          class="function-card"-->
<!--          @click="goToPage('/articles')"-->
<!--          @mouseenter="funcHover[0] = true"-->
<!--          @mouseleave="funcHover[0] = false"-->
<!--          :class="{ 'func-card-active': funcHover[0] }"-->
<!--        >-->
<!--          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[0] }">📝</div>-->
<!--          <h3 class="func-title">我的文章</h3>-->
<!--          <p class="func-desc">查看、发布或编辑你的博客</p>-->
<!--          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[0] }">→</div>-->
<!--        </div>-->
<!--        <div-->
<!--          class="function-card"-->
<!--          @click="goToPage('/UserInfo')"-->
<!--          @mouseenter="funcHover[1] = true"-->
<!--          @mouseleave="funcHover[1] = false"-->
<!--          :class="{ 'func-card-active': funcHover[1] }"-->
<!--        >-->
<!--          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[1] }">👤</div>-->
<!--          <h3 class="func-title">个人中心</h3>-->
<!--          <p class="func-desc">修改头像、简介等个人信息</p>-->
<!--          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[1] }">→</div>-->
<!--        </div>-->
<!--        <div-->
<!--          class="function-card"-->
<!--          @click="goToPage('/explore')"-->
<!--          @mouseenter="funcHover[2] = true"-->
<!--          @mouseleave="funcHover[2] = false"-->
<!--          :class="{ 'func-card-active': funcHover[2] }"-->
<!--        >-->
<!--          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[2] }">🔍</div>-->
<!--          <h3 class="func-title">发现内容</h3>-->
<!--          <p class="func-desc">浏览其他用户的优质博客</p>-->
<!--          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[2] }">→</div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 新增：好友功能入口卡片 &ndash;&gt;-->
<!--        <div-->
<!--          class="function-card"-->
<!--          @click="goToPage('/friends')"-->
<!--          @mouseenter="funcHover[3] = true"-->
<!--          @mouseleave="funcHover[3] = false"-->
<!--          :class="{ 'func-card-active': funcHover[3] }"-->
<!--        >-->
<!--          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[3] }">👥</div>-->
<!--          <h3 class="func-title">好友功能</h3>-->
<!--          <p class="func-desc">添加好友、处理申请、实时聊天</p>-->
<!--          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[3] }">→</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </main>-->

<!--    &lt;!&ndash; 底部装饰条 &ndash;&gt;-->
<!--    <footer class="home-footer">-->
<!--      <div class="footer-gradient"></div>-->
<!--      <p class="footer-text">Weblog 博客平台 © 2025 | 记录生活，分享知识</p>-->
<!--    </footer>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, onMounted, watch } from 'vue'; // 新增 watch 用于调试-->
<!--import { useRouter } from 'vue-router';-->
<!--import { ElMessage } from 'element-plus';-->
<!--import { logout, getUserInfo } from '@/api/user'; // 新增：引入后端 getUserInfo 接口-->
<!--import { tsParticles } from "tsparticles-engine";-->
<!--import { loadSlim } from "tsparticles-slim";-->
<!--import service from "@/utils/request";-->

<!--const router = useRouter();-->

<!--// 核心修改1：初始化用户信息（无本地存储依赖）-->
<!--const userInfo = ref({}); // 仅存储接口返回的用户信息，无默认值-->
<!--const defaultAvatar = ref('http://127.0.0.1:8000/media/avatars/default.png'); // 完善默认头像路径-->
<!--const baseURL = 'http://127.0.0.1:8000'; // 统一后端基础地址-->

<!--// 动画控制响应式状态（保留原有）-->
<!--const isScrolled = ref(false);-->
<!--const avatarHover = ref(false);-->
<!--const usernameHover = ref(false);-->
<!--const logoutHover = ref(false);-->
<!--const cardHover = ref(false);-->
<!--const statHover = ref([false, false]);-->
<!--const funcHover = ref([false, false, false]);-->
<!--const isAvatarLoading = ref(false);-->
<!--const avatarError = ref('');-->

<!--// 核心修改2：重写 getUserInfo，仅从接口获取数据（删掉本地存储读取）-->
<!--const fetchUserProfile = async () => {-->
<!--  try {-->
<!--    const accessToken = localStorage.getItem('accessToken');-->
<!--    if (!accessToken) {-->
<!--      router.push('/login');-->
<!--      return;-->
<!--    }-->

<!--    // 调用后端接口（禁用缓存，确保最新数据）-->
<!--    const response = await getUserInfo({-->
<!--      headers: { 'Cache-Control': 'no-cache' }-->
<!--    });-->
<!--    console.log('首页接口原始响应：', response);-->

<!--    // 提取接口数据（按实际响应结构调整，确保拿到 avatar 字段）-->
<!--    const resData = response.data || {};-->
<!--    const apiUserInfo = resData.data || resData; // 兼容两种返回结构-->
<!--    console.log('首页提取的用户信息：', apiUserInfo);-->
<!--    console.log('首页接口返回的 avatar 相对路径：', apiUserInfo.avatar);-->

<!--    // 拼接头像完整路径（强制优先使用接口路径）-->
<!--    let finalAvatarUrl = defaultAvatar.value;-->
<!--    if (apiUserInfo.avatar && typeof apiUserInfo.avatar === 'string' && apiUserInfo.avatar.startsWith('/')) {-->
<!--      finalAvatarUrl = `${baseURL}${apiUserInfo.avatar}`;-->
<!--      console.log('首页拼接后的完整头像路径：', finalAvatarUrl);-->
<!--    }-->

<!--    // 强制更新 userInfo（覆盖所有字段，无本地兜底）-->
<!--    userInfo.value = {-->
<!--      id: apiUserInfo.id || '',-->
<!--      username: apiUserInfo.username || '匿名用户',-->
<!--      bio: apiUserInfo.bio || '',-->
<!--      avatar: finalAvatarUrl, // 接口拼接后的路径-->
<!--      create_time: apiUserInfo.create_time || '',-->
<!--      last_login_time: apiUserInfo.last_login_time || '',-->
<!--      article_count: apiUserInfo.article_count || 0,-->
<!--      like_count: apiUserInfo.like_count || 0,-->
<!--      comment_count: apiUserInfo.comment_count || 0,-->
<!--      view_count: apiUserInfo.view_count || 0-->
<!--    };-->

<!--    // 保留本地存储写入（仅用于页面刷新缓存，重新登录不读取）-->
<!--    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));-->

<!--  } catch (error) {-->
<!--    console.error('首页获取用户信息失败：', error);-->
<!--    ElMessage.error('获取用户信息失败：' + (error.message || '网络错误'));-->
<!--    userInfo.value.avatar = defaultAvatar.value; // 错误时用默认头像-->
<!--  }-->
<!--};-->

<!--// 保留原有功能：退出登录（核心修改：清空所有本地存储）-->
<!--const handleLogout = async () => {-->
<!--  try {-->
<!--    await logout(); // 调用登出接口-->
<!--    // 清空本地存储，确保重新登录后无旧数据-->
<!--    localStorage.removeItem('accessToken');-->
<!--    localStorage.removeItem('userInfo');-->
<!--    router.push('/login');-->
<!--    ElMessage.success('退出登录成功！');-->
<!--  } catch (error) {-->
<!--    ElMessage.error('退出失败：' + error.message);-->
<!--  }-->
<!--};-->

<!--// 保留原有功能：时间格式化（修复 iOS 兼容）-->
<!--const formatTime = (timeStr) => {-->
<!--  if (!timeStr) return '暂无数据';-->
<!--  let date = new Date(timeStr);-->
<!--  if (isNaN(date.getTime())) {-->
<!--    date = new Date(timeStr.replace(/-/g, '/'));-->
<!--  }-->
<!--  return date.toLocaleString('zh-CN', {-->
<!--    year: 'numeric',-->
<!--    month: '2-digit',-->
<!--    day: '2-digit',-->
<!--    hour: '2-digit',-->
<!--    minute: '2-digit'-->
<!--  });-->
<!--};-->

<!--// 保留原有功能：跳转页面-->
<!--const goToPage = (path) => {-->
<!--  const tipText = path === '/UserInfo'-->
<!--    ? '正在跳转到个人中心...'-->
<!--    : `即将跳转到目标页面`;-->
<!--  ElMessage.success(tipText);-->
<!--  router.push(path);-->
<!--};-->

<!--// 头像上传逻辑（核心修改：同步接口路径拼接规则）-->
<!--const handleAvatarUpload = () => {-->
<!--  if (isAvatarLoading.value) return;-->
<!--  const input = document.createElement('input');-->
<!--  input.type = 'file';-->
<!--  input.accept = 'image/jpg,image/jpeg,image/png,image/gif';-->
<!--  input.onchange = (e) => {-->
<!--    const file = e.target.files[0];-->
<!--    if (file) {-->
<!--      uploadAvatarToServer(file);-->
<!--    }-->
<!--  };-->
<!--  input.click();-->
<!--};-->


<!--const uploadAvatarToServer = async (file) => {-->
<!--  isAvatarLoading.value = true;-->
<!--  try {-->
<!--    const formData = new FormData();-->
<!--    formData.append('avatar', file);-->
<!--    const accessToken = localStorage.getItem('accessToken');-->

<!--    // 前置检查：Token 存在性-->
<!--    if (!accessToken) {-->
<!--      ElMessage.error('登录状态失效，请重新登录');-->
<!--      router.push('/login');-->
<!--      isAvatarLoading.value = false;-->
<!--      return;-->
<!--    }-->

<!--    console.log('=== 个人中心开始上传 ===');-->
<!--    console.log('Token 存在：', !!accessToken);-->
<!--    console.log('文件信息：', file.name, file.size, file.type);-->

<!--    // 发起请求-->
<!--    const response = await service.post('/upload-avatar/', formData, {-->
<!--      headers: {-->
<!--        'Authorization': `Bearer ${accessToken}`,-->
<!--        'Content-Type': 'multipart/form-data',-->
<!--        'Cache-Control': 'no-cache'-->
<!--      },-->
<!--      timeout: 30000,-->
<!--      responseType: 'json'-->
<!--    });-->

<!--    // 成功响应处理-->
<!--    console.log('=== 个人中心上传成功响应 ===');-->
<!--    console.log('HTTP 状态码：', response.status);-->
<!--    console.log('响应体：', JSON.stringify(response.data, null, 2));-->

<!--    let newAvatarRelativePath = '';-->
<!--    const resData = response.data || {};-->
<!--    if (resData.avatar) {-->
<!--      newAvatarRelativePath = resData.avatar;-->
<!--    } else if (resData.data?.avatar) {-->
<!--      newAvatarRelativePath = resData.data.avatar;-->
<!--    } else if (resData.result?.avatar) {-->
<!--      newAvatarRelativePath = resData.result.avatar;-->
<!--    }-->

<!--    let newAvatarUrl = defaultAvatar.value;-->
<!--    if (newAvatarRelativePath) {-->
<!--      newAvatarUrl = newAvatarRelativePath.startsWith('http')-->
<!--        ? newAvatarRelativePath-->
<!--        : `${baseURL}${newAvatarRelativePath}`;-->
<!--      newAvatarUrl = `${newAvatarUrl}?t=${Date.now()}`;-->
<!--    }-->

<!--    // 强制更新响应式-->
<!--    userInfo.value.avatar = newAvatarUrl;-->
<!--    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));-->
<!--    userInfo.value = { ...userInfo.value };-->
<!--    ElMessage.success('头像修改成功！');-->

<!--  } catch (error) {-->
<!--    console.error('=== 个人中心上传错误详情 ===');-->
<!--    console.error('错误对象：', error);-->
<!--    console.error('是否有响应对象：', !!error.response);-->

<!--    // 错误分类处理-->
<!--    let errMsg = '';-->
<!--    if (!error.response) {-->
<!--      if (error.message.includes('timeout')) {-->
<!--        errMsg = '网络超时，请求未到达服务器，请检查网络';-->
<!--      } else if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {-->
<!--        errMsg = '网络连接失败（可能是跨域配置错误或服务器离线）';-->
<!--      } else {-->
<!--        errMsg = '请求发送失败：' + error.message;-->
<!--      }-->
<!--    } else {-->
<!--      errMsg = `服务器返回状态码 ${error.response.status}：${error.response.data?.message || '上传失败'}`;-->
<!--    }-->

<!--    ElMessage.error(errMsg);-->
<!--    if (!userInfo.value.avatar) {-->
<!--      userInfo.value.avatar = defaultAvatar.value;-->
<!--    }-->
<!--  } finally {-->
<!--    isAvatarLoading.value = false;-->
<!--  }-->
<!--};-->


<!--// 新增：头像加载失败处理-->
<!--const handleAvatarError = () => {-->
<!--  console.error('首页头像加载失败，切换为默认路径');-->
<!--  userInfo.value.avatar = defaultAvatar.value;-->
<!--};-->

<!--// 粒子初始化（保留原有增强配置）-->
<!--const initParticles = async () => {-->
<!--  await loadSlim(tsParticles);-->
<!--  await tsParticles.load({-->
<!--    id: "particles-bg",-->
<!--    options: {-->
<!--      fullScreen: { enable: true, zIndex: 0 },-->
<!--      size: { value: 3, random: true },-->
<!--      opacity: { value: 0.7, random: true },-->
<!--      speed: { x: 0.5, y: 0.5 },-->
<!--      shape: {-->
<!--        type: ["circle", "triangle"],-->
<!--        options: { triangle: { fill: true } }-->
<!--      },-->
<!--      color: {-->
<!--        value: ["#409eff", "#67c23a", "#f56c6c", "#909399"],-->
<!--        random: true-->
<!--      },-->
<!--      particles: {-->
<!--        number: { value: 80, density: { enable: true, value_area: 800 }, limit: 120 },-->
<!--        links: { enable: true, distance: 100, color: "#409eff", opacity: 0.4, width: 1 },-->
<!--        move: {-->
<!--          enable: true,-->
<!--          direction: "none",-->
<!--          random: true,-->
<!--          straight: false,-->
<!--          outModes: { default: "out" },-->
<!--          attract: { enable: true, rotateX: 3000, rotateY: 3000 }-->
<!--        },-->
<!--        interactivity: {-->
<!--          detectsOn: "canvas",-->
<!--          events: {-->
<!--            onHover: { enable: true, mode: ["grab", "attract"] },-->
<!--            onClick: { enable: true, mode: "push" },-->
<!--            resize: true-->
<!--          },-->
<!--          modes: {-->
<!--            grab: { distance: 180, links: { opacity: 0.6, width: 1.5 } },-->
<!--            push: { quantity: 5 },-->
<!--            attract: { distance: 150, duration: 2, speed: 3 }-->
<!--          }-->
<!--        },-->
<!--        responsive: [{ breakpoint: 768, options: { particles: { number: { value: 40 } }, links: { distance: 80 } } }]-->
<!--      }-->
<!--    }-->
<!--  });-->
<!--};-->

<!--// 页面挂载时执行（核心修改：调用 fetchUserProfile 而非读本地）-->
<!--onMounted(() => {-->
<!--  fetchUserProfile(); // 仅从接口获取用户信息-->
<!--  window.addEventListener('scroll', () => {-->
<!--    isScrolled.value = window.scrollY > 20;-->
<!--  });-->
<!--  initParticles();-->
<!--  setTimeout(() => {-->
<!--    document.querySelector('.content')?.classList.add('content-visible');-->
<!--  }, 300);-->

<!--  // 新增：监听头像变化，调试用-->
<!--  watch(() => userInfo.value.avatar, (newVal) => {-->
<!--    console.log('首页头像最终路径：', newVal);-->
<!--  }, { immediate: true });-->
<!--});-->
<!--</script>-->

<!--<style scoped>-->
<!--/* 全局样式重置与基础设置 */-->
<!--* {-->
<!--  margin: 0;-->
<!--  padding: 0;-->
<!--  box-sizing: border-box;-->
<!--  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;-->
<!--}-->

<!--.home-container {-->
<!--  position: relative;-->
<!--  min-height: 100vh;-->
<!--  background-color: #f5f7fa;-->
<!--  overflow: hidden;-->
<!--}-->
<!--/* 新增：头像上传加载提示 */-->
<!--.avatar-loading {-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  background-color: rgba(0, 0, 0, 0.7);-->
<!--  color: #fff;-->
<!--  font-size: 12px;-->
<!--  padding: 4px 8px;-->
<!--  border-radius: 4px;-->
<!--  z-index: 10;-->
<!--}-->

<!--/* 新增：头像上传错误提示 */-->
<!--.avatar-error {-->
<!--  position: absolute;-->
<!--  bottom: -20px;-->
<!--  left: 50%;-->
<!--  transform: translateX(-50%);-->
<!--  color: #f56c6c;-->
<!--  font-size: 12px;-->
<!--  white-space: nowrap;-->
<!--}-->
<!--/* 粒子容器样式（确保全屏且不抢占交互） */-->
<!--.particles-container {-->
<!--  position: fixed;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100vw;-->
<!--  height: 100vh;-->
<!--  pointer-events: none; /* 不拦截鼠标事件 */-->
<!--  z-index: 0; /* 最底层背景 */-->
<!--}-->

<!--/* 背景装饰（渐变圆形+动态光点） */-->
<!--.background-decoration {-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  z-index: 1;-->
<!--  pointer-events: none;-->
<!--}-->

<!--.gradient-circle {-->
<!--  position: absolute;-->
<!--  border-radius: 50%;-->
<!--  filter: blur(100px);-->
<!--  opacity: 0.2;-->
<!--  animation: float 15s infinite alternate ease-in-out;-->
<!--}-->

<!--.circle-1 {-->
<!--  width: 600px;-->
<!--  height: 600px;-->
<!--  background: linear-gradient(135deg, #409eff, #67c23a);-->
<!--  top: -200px;-->
<!--  left: -200px;-->
<!--}-->

<!--.circle-2 {-->
<!--  width: 500px;-->
<!--  height: 500px;-->
<!--  background: linear-gradient(135deg, #f56c6c, #409eff);-->
<!--  bottom: -150px;-->
<!--  right: -150px;-->
<!--  animation-delay: 3s;-->
<!--}-->

<!--.circle-3 {-->
<!--  width: 400px;-->
<!--  height: 400px;-->
<!--  background: linear-gradient(135deg, #909399, #67c23a);-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  animation-delay: 6s;-->
<!--}-->

<!--.glow-points {-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  background-image: radial-gradient(#409eff 1px, transparent 1px);-->
<!--  background-size: 30px 30px;-->
<!--  opacity: 0.1;-->
<!--  animation: fade 8s infinite alternate;-->
<!--}-->

<!--/* 导航栏样式（优化后，保留原有布局） */-->
<!--.navbar {-->
<!--  position: relative;-->
<!--  z-index: 10;-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  padding: 16px 50px;-->
<!--  background-color: rgba(255, 255, 255, 0.8);-->
<!--  backdrop-filter: blur(8px);-->
<!--  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.navbar-scrolled {-->
<!--  padding: 12px 50px;-->
<!--  background-color: rgba(255, 255, 255, 0.95);-->
<!--  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.logo {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 8px;-->
<!--}-->

<!--.logo-icon {-->
<!--  font-size: 24px;-->
<!--  color: #409eff;-->
<!--}-->

<!--.logo-text {-->
<!--  font-size: 20px;-->
<!--  font-weight: 600;-->
<!--  background: linear-gradient(135deg, #409eff, #67c23a);-->
<!--  -webkit-background-clip: text;-->
<!--  background-clip: text;-->
<!--  color: transparent;-->
<!--}-->

<!--.user-info {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 15px;-->
<!--}-->

<!--.avatar-container {-->
<!--  position: relative;-->
<!--  width: 40px;-->
<!--  height: 40px;-->
<!--}-->

<!--.avatar {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  border-radius: 50%;-->
<!--  object-fit: cover;-->
<!--  border: 2px solid transparent;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.avatar-border {-->
<!--  position: absolute;-->
<!--  top: -2px;-->
<!--  left: -2px;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  border-radius: 50%;-->
<!--  background: linear-gradient(135deg, #409eff, #67c23a);-->
<!--  opacity: 0;-->
<!--  transition: all 0.3s ease;-->
<!--  z-index: -1;-->
<!--}-->

<!--.avatar-border-active {-->
<!--  opacity: 1;-->
<!--  transform: scale(1.05);-->
<!--  box-shadow: 0 0 10px rgba(64, 158, 255, 0.4);-->
<!--}-->

<!--.avatar:hover {-->
<!--  transform: rotate(5deg) scale(1.05);-->
<!--}-->

<!--.username {-->
<!--  font-size: 16px;-->
<!--  font-weight: 500;-->
<!--  color: #333;-->
<!--  transition: all 0.3s ease;-->
<!--  cursor: default;-->
<!--}-->

<!--.username-hover {-->
<!--  color: #409eff;-->
<!--  text-shadow: 0 0 8px rgba(64, 158, 255, 0.2);-->
<!--}-->

<!--.logout-btn {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 6px;-->
<!--  padding: 6px 12px;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--  background: linear-gradient(135deg, #f56c6c, #e64340);-->
<!--  color: #fff;-->
<!--  font-size: 14px;-->
<!--  font-weight: 500;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.3s ease;-->
<!--  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.2);-->
<!--}-->

<!--.logout-btn-hover {-->
<!--  transform: translateY(-2px);-->
<!--  box-shadow: 0 4px 10px rgba(245, 108, 108, 0.3);-->
<!--  background: linear-gradient(135deg, #e64340, #d32f2f);-->
<!--}-->

<!--.logout-icon {-->
<!--  font-size: 14px;-->
<!--}-->

<!--/* 主体内容样式（优化后，保留原有布局） */-->
<!--.content {-->
<!--  position: relative;-->
<!--  z-index: 5;-->
<!--  width: 1200px;-->
<!--  margin: 30px auto;-->
<!--  padding: 0 20px;-->
<!--  box-sizing: border-box;-->
<!--  opacity: 0;-->
<!--  transform: translateY(20px);-->
<!--  transition: all 0.6s ease;-->
<!--}-->

<!--.content-visible {-->
<!--  opacity: 1;-->
<!--  transform: translateY(0);-->
<!--}-->

<!--/* 欢迎卡片（优化后） */-->
<!--.welcome-card {-->
<!--  background-color: rgba(255, 255, 255, 0.9);-->
<!--  backdrop-filter: blur(10px);-->
<!--  border-radius: 12px;-->
<!--  padding: 30px;-->
<!--  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);-->
<!--  margin-bottom: 30px;-->
<!--  transition: all 0.3s ease;-->
<!--  position: relative;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.welcome-card::before {-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 4px;-->
<!--  background: linear-gradient(135deg, #409eff, #67c23a);-->
<!--}-->

<!--.welcome-card:hover {-->
<!--  transform: translateY(-5px);-->
<!--  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.card-header {-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.welcome-title {-->
<!--  font-size: 24px;-->
<!--  color: #333;-->
<!--  margin-bottom: 8px;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.title-hover {-->
<!--  color: #409eff;-->
<!--  text-shadow: 0 0 10px rgba(64, 158, 255, 0.2);-->
<!--}-->

<!--.title-divider {-->
<!--  height: 3px;-->
<!--  background: linear-gradient(135deg, #409eff, #67c23a);-->
<!--  border-radius: 3px;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.bio {-->
<!--  font-size: 16px;-->
<!--  color: #666;-->
<!--  margin-bottom: 20px;-->
<!--  line-height: 1.5;-->
<!--  background-color: rgba(64, 158, 255, 0.05);-->
<!--  padding: 12px 20px;-->
<!--  border-radius: 8px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 10px;-->
<!--}-->

<!--.bio-icon {-->
<!--  font-size: 20px;-->
<!--  color: #409eff;-->
<!--}-->

<!--.stats {-->
<!--  display: flex;-->
<!--  gap: 40px;-->
<!--  flex-wrap: wrap;-->
<!--}-->

<!--.stat-item {-->
<!--  background-color: #fff;-->
<!--  padding: 16px 20px;-->
<!--  border-radius: 8px;-->
<!--  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);-->
<!--  transition: all 0.3s ease;-->
<!--  flex: 1;-->
<!--  min-width: 200px;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  text-align: center;-->
<!--}-->

<!--.stat-item:hover {-->
<!--  transform: translateY(-3px);-->
<!--  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);-->
<!--}-->

<!--.stat-icon {-->
<!--  font-size: 24px;-->
<!--  color: #409eff;-->
<!--  margin-bottom: 8px;-->
<!--}-->

<!--.label {-->
<!--  font-size: 14px;-->
<!--  color: #999;-->
<!--  margin-bottom: 4px;-->
<!--}-->

<!--.value {-->
<!--  font-size: 16px;-->
<!--  color: #333;-->
<!--  font-weight: 500;-->
<!--}-->

<!--/* 功能入口列表（优化后，保留原有布局） */-->
<!--.function-list {-->
<!--  display: grid;-->
<!--  grid-template-columns: repeat(3, 1fr);-->
<!--  gap: 20px;-->
<!--}-->

<!--.function-card {-->
<!--  background-color: #fff;-->
<!--  border-radius: 8px;-->
<!--  padding: 30px;-->
<!--  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);-->
<!--  text-align: center;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.3s ease;-->
<!--  position: relative;-->
<!--  overflow: hidden;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--}-->

<!--.func-card-active {-->
<!--  transform: translateY(-8px);-->
<!--  box-shadow: 0 12px 24px rgba(64, 158, 255, 0.1);-->
<!--  background: linear-gradient(135deg, #f8f9ff, #f0f7ff);-->
<!--}-->

<!--.func-icon {-->
<!--  font-size: 40px;-->
<!--  background: linear-gradient(135deg, #409eff, #67c23a);-->
<!--  -webkit-background-clip: text;-->
<!--  background-clip: text;-->
<!--  color: transparent;-->
<!--  margin-bottom: 15px;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.func-icon-rotate {-->
<!--  transform: rotate(15deg) scale(1.1);-->
<!--}-->

<!--.func-title {-->
<!--  font-size: 18px;-->
<!--  color: #333;-->
<!--  margin-bottom: 8px;-->
<!--}-->

<!--.func-desc {-->
<!--  font-size: 14px;-->
<!--  color: #666;-->
<!--  line-height: 1.5;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.func-arrow {-->
<!--  font-size: 16px;-->
<!--  color: #409eff;-->
<!--  opacity: 0;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.func-arrow-active {-->
<!--  opacity: 1;-->
<!--  transform: translateX(5px);-->
<!--}-->

<!--/* 底部样式 */-->
<!--.home-footer {-->
<!--  position: relative;-->
<!--  z-index: 5;-->
<!--  margin-top: 60px;-->
<!--  padding: 20px 0;-->
<!--  text-align: center;-->
<!--}-->

<!--.footer-gradient {-->
<!--  height: 4px;-->
<!--  width: 100%;-->
<!--  background: linear-gradient(135deg, #409eff, #67c23a);-->
<!--  margin-bottom: 16px;-->
<!--}-->

<!--.footer-text {-->
<!--  font-size: 14px;-->
<!--  color: #999;-->
<!--}-->

<!--/* 动画关键帧 */-->
<!--@keyframes float {-->
<!--  0% { transform: translate(0, 0) scale(1); }-->
<!--  100% { transform: translate(30px, 30px) scale(1.05); }-->
<!--}-->

<!--@keyframes fade {-->
<!--  0% { opacity: 0.1; }-->
<!--  100% { opacity: 0.2; }-->
<!--}-->

<!--/* 响应式适配（保留原有逻辑） */-->
<!--@media (max-width: 1200px) {-->
<!--  .content {-->
<!--    width: 100%;-->
<!--  }-->
<!--  .function-list {-->
<!--    grid-template-columns: repeat(2, 1fr);-->
<!--  }-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .navbar {-->
<!--    padding: 12px 20px;-->
<!--  }-->
<!--  .navbar-scrolled {-->
<!--    padding: 10px 20px;-->
<!--  }-->
<!--  .logo-text {-->
<!--    font-size: 18px;-->
<!--  }-->
<!--  .user-info {-->
<!--    gap: 12px;-->
<!--  }-->
<!--  .avatar-container {-->
<!--    width: 36px;-->
<!--    height: 36px;-->
<!--  }-->
<!--  .username {-->
<!--    font-size: 14px;-->
<!--  }-->
<!--  .logout-btn {-->
<!--    padding: 5px 10px;-->
<!--    font-size: 13px;-->
<!--  }-->
<!--  .content {-->
<!--    padding: 15px;-->
<!--  }-->
<!--  .welcome-card {-->
<!--    padding: 25px;-->
<!--  }-->
<!--  .welcome-title {-->
<!--    font-size: 22px;-->
<!--  }-->
<!--  .bio {-->
<!--    font-size: 15px;-->
<!--    padding: 10px 16px;-->
<!--  }-->
<!--  .stats {-->
<!--    gap: 20px;-->
<!--  }-->
<!--  .function-list {-->
<!--    grid-template-columns: 1fr;-->
<!--  }-->
<!--}-->
<!--</style>-->
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
            @error="handleAvatarError"
          >
          <div class="avatar-border" :class="{ 'avatar-border-active': avatarHover }"></div>
          <!-- 新增：上传加载提示 -->
          <div class="avatar-loading" v-if="isAvatarLoading">上传中...</div>
          <!-- 新增：上传错误提示 -->
          <div class="avatar-error" v-if="avatarError">{{ avatarError }}</div>
        </div>
        <!-- 用户名（渐变色+hover高亮）：修复 userInfo.data → userInfo -->
        <span class="username" :class="{ 'username-hover': usernameHover }"
              @mouseenter="usernameHover = true"
              @mouseleave="usernameHover = false">
          {{ userInfo?.username || '匿名用户' }}
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
            <!-- 修复 userInfo.data → userInfo -->
            欢迎回来，{{ userInfo?.username || '探索者' }}！
          </h1>
          <!-- 装饰线 -->
          <div class="title-divider" :style="{ width: cardHover ? '200px' : '120px' }"></div>
        </div>

        <!-- 个人简介（带背景板+渐变色文字）：修复 userInfo.data → userInfo -->
        <p class="bio">
          <span class="bio-icon">💬</span>
          {{ userInfo?.bio || '暂无个人简介，可前往个人中心完善' }}
        </p>

        <!-- 统计信息（卡片式+hover上浮）：修复 userInfo.data → userInfo -->
        <div class="stats">
          <div class="stat-item" @mouseenter="statHover[0] = true" @mouseleave="statHover[0] = false">
            <div class="stat-icon">📅</div>
            <span class="label">注册时间</span>
            <span class="value">{{ formatTime(userInfo?.create_time) || '暂无数据' }}</span>
          </div>
          <div class="stat-item" @mouseenter="statHover[1] = true" @mouseleave="statHover[1] = false">
            <div class="stat-icon">⏰</div>
            <span class="label">最后登录</span>
            <span class="value">{{ formatTime(userInfo?.last_login_time) || '暂无数据' }}</span>
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
        <!-- 新增：好友功能入口卡片（与现有风格100%统一） -->
        <div
          class="function-card"
          @click="goToPage('/friends')"
          @mouseenter="funcHover[3] = true"
          @mouseleave="funcHover[3] = false"
          :class="{ 'func-card-active': funcHover[3] }"
        >
          <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[3] }">👥</div>
          <h3 class="func-title">好友功能</h3>
          <p class="func-desc">添加好友、处理申请、实时聊天</p>
          <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[3] }">→</div>
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
import { ref, onMounted, watch } from 'vue'; // 新增 watch 用于调试
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { logout, getUserInfo } from '@/api/user'; // 新增：引入后端 getUserInfo 接口
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import service from "@/utils/request";

const router = useRouter();

// 核心修改1：初始化用户信息（无本地存储依赖）
const userInfo = ref({}); // 仅存储接口返回的用户信息，无默认值
const defaultAvatar = ref('http://127.0.0.1:8000/media/avatars/default.png'); // 完善默认头像路径
const baseURL = 'http://127.0.0.1:8000'; // 统一后端基础地址

// 动画控制响应式状态（核心修复：funcHover扩展为4个元素，适配好友卡片）
const isScrolled = ref(false);
const avatarHover = ref(false);
const usernameHover = ref(false);
const logoutHover = ref(false);
const cardHover = ref(false);
const statHover = ref([false, false]);
// 原3个元素 → 新增第4个元素（好友卡片hover控制）
const funcHover = ref([false, false, false, false]);
const isAvatarLoading = ref(false);
const avatarError = ref('');

// 核心修改2：重写 getUserInfo，仅从接口获取数据（删掉本地存储读取）
const fetchUserProfile = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    // 调用后端接口（禁用缓存，确保最新数据）
    const response = await getUserInfo({
      headers: { 'Cache-Control': 'no-cache' }
    });
    console.log('首页接口原始响应：', response);

    // 提取接口数据（按实际响应结构调整，确保拿到 avatar 字段）
    const resData = response.data || {};
    const apiUserInfo = resData.data || resData; // 兼容两种返回结构
    console.log('首页提取的用户信息：', apiUserInfo);
    console.log('首页接口返回的 avatar 相对路径：', apiUserInfo.avatar);

    // 拼接头像完整路径（强制优先使用接口路径）
    let finalAvatarUrl = defaultAvatar.value;
    if (apiUserInfo.avatar && typeof apiUserInfo.avatar === 'string' && apiUserInfo.avatar.startsWith('/')) {
      finalAvatarUrl = `${baseURL}${apiUserInfo.avatar}`;
      console.log('首页拼接后的完整头像路径：', finalAvatarUrl);
    }

    // 强制更新 userInfo（覆盖所有字段，无本地兜底）
    userInfo.value = {
      id: apiUserInfo.id || '',
      username: apiUserInfo.username || '匿名用户',
      bio: apiUserInfo.bio || '',
      avatar: finalAvatarUrl, // 接口拼接后的路径
      create_time: apiUserInfo.create_time || '',
      last_login_time: apiUserInfo.last_login_time || '',
      article_count: apiUserInfo.article_count || 0,
      like_count: apiUserInfo.like_count || 0,
      comment_count: apiUserInfo.comment_count || 0,
      view_count: apiUserInfo.view_count || 0
    };

    // 保留本地存储写入（仅用于页面刷新缓存，重新登录不读取）
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

  } catch (error) {
    console.error('首页获取用户信息失败：', error);
    ElMessage.error('获取用户信息失败：' + (error.message || '网络错误'));
    userInfo.value.avatar = defaultAvatar.value; // 错误时用默认头像
  }
};

// 保留原有功能：退出登录（核心修改：清空所有本地存储）
const handleLogout = async () => {
  try {
    await logout(); // 调用登出接口
    // 清空本地存储，确保重新登录后无旧数据
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    router.push('/login');
    ElMessage.success('退出登录成功！');
  } catch (error) {
    ElMessage.error('退出失败：' + error.message);
  }
};

// 保留原有功能：时间格式化（修复 iOS 兼容）
const formatTime = (timeStr) => {
  if (!timeStr) return '暂无数据';
  let date = new Date(timeStr);
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

// 保留原有功能：跳转页面（核心优化：新增好友页面专属提示）
const goToPage = (path) => {
  let tipText = '';
  switch (path) {
    case '/UserInfo':
      tipText = '正在跳转到个人中心...';
      break;
    case '/friends': // 好友页面专属提示
      tipText = '正在跳转到好友功能...';
      break;
    default:
      tipText = '即将跳转到目标页面';
  }
  ElMessage.success(tipText);
  router.push(path);
};

// 头像上传逻辑（核心修改：同步接口路径拼接规则）
const handleAvatarUpload = () => {
  if (isAvatarLoading.value) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpg,image/jpeg,image/png,image/gif';
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

    // 前置检查：Token 存在性
    if (!accessToken) {
      ElMessage.error('登录状态失效，请重新登录');
      router.push('/login');
      isAvatarLoading.value = false;
      return;
    }

    console.log('=== 个人中心开始上传 ===');
    console.log('Token 存在：', !!accessToken);
    console.log('文件信息：', file.name, file.size, file.type);

    // 发起请求
    const response = await service.post('/upload-avatar/', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache'
      },
      timeout: 30000,
      responseType: 'json'
    });

    // 成功响应处理
    console.log('=== 个人中心上传成功响应 ===');
    console.log('HTTP 状态码：', response.status);
    console.log('响应体：', JSON.stringify(response.data, null, 2));

    let newAvatarRelativePath = '';
    const resData = response.data || {};
    if (resData.avatar) {
      newAvatarRelativePath = resData.avatar;
    } else if (resData.data?.avatar) {
      newAvatarRelativePath = resData.data.avatar;
    } else if (resData.result?.avatar) {
      newAvatarRelativePath = resData.result.avatar;
    }

    let newAvatarUrl = defaultAvatar.value;
    if (newAvatarRelativePath) {
      newAvatarUrl = newAvatarRelativePath.startsWith('http')
        ? newAvatarRelativePath
        : `${baseURL}${newAvatarRelativePath}`;
      newAvatarUrl = `${newAvatarUrl}?t=${Date.now()}`;
    }

    // 强制更新响应式
    userInfo.value.avatar = newAvatarUrl;
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
    userInfo.value = { ...userInfo.value };
    ElMessage.success('头像修改成功！');

  } catch (error) {
    console.error('=== 个人中心上传错误详情 ===');
    console.error('错误对象：', error);
    console.error('是否有响应对象：', !!error.response);

    // 错误分类处理
    let errMsg = '';
    if (!error.response) {
      if (error.message.includes('timeout')) {
        errMsg = '网络超时，请求未到达服务器，请检查网络';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        errMsg = '网络连接失败（可能是跨域配置错误或服务器离线）';
      } else {
        errMsg = '请求发送失败：' + error.message;
      }
    } else {
      errMsg = `服务器返回状态码 ${error.response.status}：${error.response.data?.message || '上传失败'}`;
    }

    ElMessage.error(errMsg);
    if (!userInfo.value.avatar) {
      userInfo.value.avatar = defaultAvatar.value;
    }
  } finally {
    isAvatarLoading.value = false;
  }
};

// 新增：头像加载失败处理
const handleAvatarError = () => {
  console.error('首页头像加载失败，切换为默认路径');
  userInfo.value.avatar = defaultAvatar.value;
};

// 粒子初始化（保留原有增强配置）
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
        number: { value: 80, density: { enable: true, value_area: 800 }, limit: 120 },
        links: { enable: true, distance: 100, color: "#409eff", opacity: 0.4, width: 1 },
        move: {
          enable: true,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
          attract: { enable: true, rotateX: 3000, rotateY: 3000 }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: { enable: true, mode: ["grab", "attract"] },
            onClick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            grab: { distance: 180, links: { opacity: 0.6, width: 1.5 } },
            push: { quantity: 5 },
            attract: { distance: 150, duration: 2, speed: 3 }
          }
        },
        responsive: [{ breakpoint: 768, options: { particles: { number: { value: 40 } }, links: { distance: 80 } } }]
      }
    }
  });
};

// 页面挂载时执行（核心修改：调用 fetchUserProfile 而非读本地）
onMounted(() => {
  fetchUserProfile(); // 仅从接口获取用户信息
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20;
  });
  initParticles();
  setTimeout(() => {
    document.querySelector('.content')?.classList.add('content-visible');
  }, 300);

  // 新增：监听头像变化，调试用
  watch(() => userInfo.value.avatar, (newVal) => {
    console.log('首页头像最终路径：', newVal);
  }, { immediate: true });
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

/* 功能入口列表（核心优化：适配4个卡片的响应式布局） */
.function-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

/* 响应式适配（优化4个卡片显示） */
@media (max-width: 1200px) {
  .content {
    width: 100%;
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