<!--<template>-->
<!--  <div class="wechat-layout" v-watermark="watermarkConfig">-->
<!--    <div class="home-container">-->
<!--      &lt;!&ndash; 粒子背景（最底层，不影响交互） &ndash;&gt;-->
<!--      <div id="particles-bg" class="particles-container"></div>-->

<!--      &lt;!&ndash; 背景装饰（渐变圆形+光点） &ndash;&gt;-->
<!--      <div class="background-decoration">-->
<!--        <div class="gradient-circle circle-1"></div>-->
<!--        <div class="gradient-circle circle-2"></div>-->
<!--        <div class="gradient-circle circle-3"></div>-->
<!--        <div class="glow-points"></div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 顶部导航栏（滚动渐变+阴影） &ndash;&gt;-->
<!--      <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">-->
<!--        <div class="logo">-->
<!--          <span class="logo-icon">✏️</span>-->
<!--          <span class="logo-text">Weblog 博客平台</span>-->
<!--        </div>-->
<!--        <div class="user-info">-->
<!--          &lt;!&ndash; 用户头像（hover旋转+边框渐变） &ndash;&gt;-->
<!--          <div class="avatar-container" @click="handleAvatarUpload">-->
<!--            <img-->
<!--              :src="storeUserInfo.avatar || defaultAvatar"-->
<!--              alt="用户头像"-->
<!--              class="avatar"-->
<!--              @mouseenter="avatarHover = true"-->
<!--              @mouseleave="avatarHover = false"-->
<!--              @error="handleAvatarError"-->
<!--            >-->
<!--            <div class="avatar-border" :class="{ 'avatar-border-active': avatarHover }"></div>-->
<!--            &lt;!&ndash; 上传加载提示 &ndash;&gt;-->
<!--            <div class="avatar-loading" v-if="isAvatarLoading">上传中...</div>-->
<!--            &lt;!&ndash; 上传错误提示 &ndash;&gt;-->
<!--            <div class="avatar-error" v-if="avatarError">{{ avatarError }}</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 用户名（渐变色+hover高亮） &ndash;&gt;-->
<!--          <span class="username" :class="{ 'username-hover': usernameHover }"-->
<!--                @mouseenter="usernameHover = true"-->
<!--                @mouseleave="usernameHover = false">-->
<!--            {{ storeUserInfo.username || '匿名用户' }}-->
<!--          </span>-->
<!--          &lt;!&ndash; 退出登录按钮（渐变背景+hover动效） &ndash;&gt;-->
<!--          <button-->
<!--            @click="handleLogout"-->
<!--            class="logout-btn"-->
<!--            :class="{ 'logout-btn-hover': logoutHover }"-->
<!--            @mouseenter="logoutHover = true"-->
<!--            @mouseleave="logoutHover = false"-->
<!--          >-->
<!--            <span>退出登录</span>-->
<!--            <span class="logout-icon">🚪</span>-->
<!--          </button>-->
<!--        </div>-->
<!--      </nav>-->

<!--      &lt;!&ndash; 主体内容区（居中+卡片悬浮） &ndash;&gt;-->
<!--      <main class="content">-->
<!--        &lt;!&ndash; 欢迎卡片（渐变背景+阴影+入场动画） &ndash;&gt;-->
<!--        <div class="welcome-card" @mouseenter="cardHover = true" @mouseleave="cardHover = false">-->
<!--          <div class="card-header">-->
<!--            <h1 class="welcome-title" :class="{ 'title-hover': cardHover }">-->
<!--              欢迎回来，{{ storeUserInfo.username || '探索者' }}！-->
<!--            </h1>-->
<!--            &lt;!&ndash; 装饰线 &ndash;&gt;-->
<!--            <div class="title-divider" :style="{ width: cardHover ? '200px' : '120px' }"></div>-->
<!--          </div>-->

<!--          &lt;!&ndash; 个人简介（带背景板+渐变色文字） &ndash;&gt;-->
<!--          <p class="bio">-->
<!--            <span class="bio-icon">💬</span>-->
<!--            {{ storeUserInfo.bio || '暂无个人简介，可前往个人中心完善' }}-->
<!--          </p>-->

<!--          &lt;!&ndash; 统计信息（卡片式+hover上浮） &ndash;&gt;-->
<!--          <div class="stats">-->
<!--            <div class="stat-item" @mouseenter="statHover[0] = true" @mouseleave="statHover[0] = false">-->
<!--              <div class="stat-icon">📅</div>-->
<!--              <span class="label">注册时间</span>-->
<!--              <span class="value">{{ formatTime(storeUserInfo.create_time) || '暂无数据' }}</span>-->
<!--            </div>-->
<!--            <div class="stat-item" @mouseenter="statHover[1] = true" @mouseleave="statHover[1] = false">-->
<!--              <div class="stat-icon">⏰</div>-->
<!--              <span class="label">最后登录</span>-->
<!--              <span class="value">{{ formatTime(storeUserInfo.last_login_time) || '暂无数据' }}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 功能入口（渐变卡片+hover动效+图标旋转） &ndash;&gt;-->
<!--        <div class="function-list">-->
<!--          <div-->
<!--            class="function-card"-->
<!--            @click="goToPage('/articles')"-->
<!--            @mouseenter="funcHover[0] = true"-->
<!--            @mouseleave="funcHover[0] = false"-->
<!--            :class="{ 'func-card-active': funcHover[0] }"-->
<!--          >-->
<!--            <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[0] }">📝</div>-->
<!--            <h3 class="func-title">我的文章</h3>-->
<!--            <p class="func-desc">查看、发布或编辑你的博客</p>-->
<!--            <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[0] }">→</div>-->
<!--          </div>-->
<!--          <div-->
<!--            class="function-card"-->
<!--            @click="goToPage('/UserInfo')"-->
<!--            @mouseenter="funcHover[1] = true"-->
<!--            @mouseleave="funcHover[1] = false"-->
<!--            :class="{ 'func-card-active': funcHover[1] }"-->
<!--          >-->
<!--            <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[1] }">👤</div>-->
<!--            <h3 class="func-title">个人中心</h3>-->
<!--            <p class="func-desc">修改头像、简介等个人信息</p>-->
<!--            <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[1] }">→</div>-->
<!--          </div>-->
<!--          <div-->
<!--            class="function-card"-->
<!--            @click="goToPage('/other-blogs')"-->
<!--            @mouseenter="funcHover[2] = true"-->
<!--            @mouseleave="funcHover[2] = false"-->
<!--            :class="{ 'func-card-active': funcHover[2] }"-->
<!--          >-->
<!--            <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[2] }">🔍</div>-->
<!--            <h3 class="func-title">发现内容</h3>-->
<!--            <p class="func-desc">浏览其他用户的优质博客</p>-->
<!--            <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[2] }">→</div>-->
<!--          </div>-->
<!--          &lt;!&ndash; 好友功能入口卡片 &ndash;&gt;-->
<!--          <div-->
<!--            class="function-card"-->
<!--            @click="goToPage('/friends')"-->
<!--            @mouseenter="funcHover[3] = true"-->
<!--            @mouseleave="funcHover[3] = false"-->
<!--            :class="{ 'func-card-active': funcHover[3] }"-->
<!--          >-->
<!--            <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[3] }">👥</div>-->
<!--            <h3 class="func-title">好友功能</h3>-->
<!--            <p class="func-desc">添加好友、处理申请、实时聊天</p>-->
<!--            <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[3] }">→</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </main>-->

<!--      &lt;!&ndash; 底部装饰条 &ndash;&gt;-->
<!--      <footer class="home-footer">-->
<!--        <div class="footer-gradient"></div>-->
<!--        <p class="footer-text">Weblog 博客平台 © 2025 | 记录生活，分享知识</p>-->
<!--      </footer>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, onMounted, watch, computed } from 'vue';-->
<!--import { useRouter } from 'vue-router';-->
<!--import { ElMessage } from 'element-plus';-->
<!--import { logout, getUserInfo, uploadAvatar } from '@/api/user';-->
<!--import { tsParticles } from "tsparticles-engine";-->
<!--import { loadSlim } from "tsparticles-slim";-->
<!--import { useUserStore } from '@/stores/user'-->
<!--import { storeToRefs } from 'pinia'-->

<!--// ===================== 核心修复：独立定义水印渲染函数（彻底移除this依赖） =====================-->
<!--// 1. 独立的水印创建函数（无this依赖）-->
<!--const createWatermark = (el, config) => {-->
<!--  // 兜底默认配置-->
<!--  const finalConfig = {-->
<!--    text: '未登录用户',-->
<!--    fontSize: '32px',-->
<!--    color: 'rgba(120,120,120,0.4)',-->
<!--    rotate: -18,-->
<!--    spacing: 70,-->
<!--    zIndex: 9999,-->
<!--    ...config-->
<!--  };-->

<!--  // 移除旧水印（防止重复）-->
<!--  const oldWatermark = el.querySelector('div[data-watermark="true"]');-->
<!--  if (oldWatermark) el.removeChild(oldWatermark);-->

<!--  // 创建新水印容器-->
<!--  const watermarkEl = document.createElement('div');-->
<!--  watermarkEl.dataset.watermark = 'true'; // 标记水印元素-->
<!--  watermarkEl.style.position = 'absolute';-->
<!--  watermarkEl.style.top = '0';-->
<!--  watermarkEl.style.left = '0';-->
<!--  watermarkEl.style.width = '100%';-->
<!--  watermarkEl.style.height = '100%';-->
<!--  watermarkEl.style.pointerEvents = 'none';-->
<!--  watermarkEl.style.zIndex = finalConfig.zIndex;-->
<!--  el.style.position = 'relative';-->
<!--  el.appendChild(watermarkEl);-->

<!--  // 生成Canvas水印-->
<!--  const canvas = document.createElement('canvas');-->
<!--  const ctx = canvas.getContext('2d');-->
<!--  canvas.width = 200;-->
<!--  canvas.height = 200;-->
<!--  ctx.font = `${finalConfig.fontSize} Microsoft YaHei`;-->
<!--  ctx.fillStyle = finalConfig.color;-->
<!--  ctx.rotate((finalConfig.rotate * Math.PI) / 180);-->
<!--  ctx.fillText(finalConfig.text, finalConfig.spacing, 100);-->
<!--  watermarkEl.style.backgroundImage = `url(${canvas.toDataURL()})`;-->
<!--  watermarkEl.style.backgroundSize = `${finalConfig.spacing * 2}px ${finalConfig.spacing * 2}px`;-->
<!--};-->

<!--// 2. 水印指令（纯函数调用，无this）-->
<!--const vWatermark = {-->
<!--  mounted(el, binding) {-->
<!--    createWatermark(el, binding.value); // 直接调用独立函数-->
<!--  },-->
<!--  updated(el, binding) {-->
<!--    createWatermark(el, binding.value); // 直接调用独立函数-->
<!--  }-->
<!--};-->

<!--// ===================== 初始化变量 & Pinia Store =====================-->
<!--const userStore = useUserStore() // 正确初始化User Store-->
<!--const { isLogin, userInfo: storeUserInfo } = storeToRefs(userStore)-->
<!--console.log(storeUserInfo,'用户信息。。。。。。。。。。。。。。。。。。。。。。。。。。。。。')// 解构响应式状态-->
<!--const router = useRouter();-->
<!--const defaultAvatar = ref('http://127.0.0.1:8000/media/avatars/default.png');-->
<!--const baseURL = 'http://127.0.0.1:8000';-->

<!--// 动画控制响应式状态-->
<!--const isScrolled = ref(false);-->
<!--const avatarHover = ref(false);-->
<!--const usernameHover = ref(false);-->
<!--const logoutHover = ref(false);-->
<!--const cardHover = ref(false);-->
<!--const statHover = ref([false, false]);-->
<!--const funcHover = ref([false, false, false, false]);-->
<!--const isAvatarLoading = ref(false);-->
<!--const avatarError = ref('');-->

<!--// ===================== 水印配置（修复匿名用户问题：多层兜底+强制取缓存） =====================-->
<!--const watermarkConfig = computed(() => {-->
<!--  // 步骤1：优先取Pinia中的username-->
<!--  let username = storeUserInfo.username || '';-->

<!--  // 步骤2：Pinia为空则取本地缓存-->
<!--  if (!username) {-->
<!--    try {-->
<!--      const localUser = localStorage.getItem('userInfo');-->
<!--      if (localUser) {-->
<!--        const parsedUser = JSON.parse(localUser);-->
<!--        username = parsedUser.username || '';-->
<!--      }-->
<!--    } catch (e) {-->
<!--      console.warn('读取本地缓存用户名失败：', e);-->
<!--    }-->
<!--  }-->

<!--  // 步骤3：仍为空则取token兜底（避免完全匿名）-->
<!--  if (!username) {-->
<!--    const token = localStorage.getItem('accessToken');-->
<!--    username = token ? '已登录用户' : '未登录用户';-->
<!--  }-->

<!--  // 最终水印文本-->
<!--  const watermarkText = isLogin.value ? `@${username}` : '未登录用户';-->

<!--  return {-->
<!--    text: watermarkText,-->
<!--    fontSize: '16px',-->
<!--    color: 'rgba(120,120,120,0.12)',-->
<!--    rotate: -18,-->
<!--    spacing: 70,-->
<!--    zIndex: 9999-->
<!--  };-->
<!--});-->

<!--// ===================== 工具/业务函数 =====================-->
<!--// 时间格式化（兼容iOS）-->
<!--const formatTime = (timeStr) => {-->
<!--  if (!timeStr) return '暂无数据';-->
<!--  let date = new Date(timeStr);-->
<!--  if (isNaN(date.getTime())) date = new Date(timeStr.replace(/-/g, '/'));-->
<!--  return date.toLocaleString('zh-CN', {-->
<!--    year: 'numeric',-->
<!--    month: '2-digit',-->
<!--    day: '2-digit',-->
<!--    hour: '2-digit',-->
<!--    minute: '2-digit'-->
<!--  });-->
<!--};-->

<!--// 页面跳转-->
<!--const goToPage = (path) => {-->
<!--  const tipMap = {-->
<!--    '/UserInfo': '正在跳转到个人中心...',-->
<!--    '/friends': '正在跳转到好友功能...',-->
<!--    default: '即将跳转到目标页面'-->
<!--  };-->
<!--  ElMessage.success(tipMap[path] || tipMap.default);-->
<!--  router.push(path);-->
<!--};-->

<!--// 头像上传-->
<!--const handleAvatarUpload = () => {-->
<!--  if (isAvatarLoading.value) return;-->
<!--  const input = document.createElement('input');-->
<!--  input.type = 'file';-->
<!--  input.accept = 'image/jpg,image/jpeg,image/png,image/gif';-->
<!--  input.onchange = (e) => {-->
<!--    const file = e.target.files[0];-->
<!--    if (file) uploadAvatarToServer(file);-->
<!--  };-->
<!--  input.click();-->
<!--};-->

<!--const uploadAvatarToServer = async (file) => {-->
<!--  isAvatarLoading.value = true;-->
<!--  try {-->
<!--    const token = localStorage.getItem('accessToken');-->
<!--    if (!token) throw new Error('登录状态失效，请重新登录');-->

<!--    const formData = new FormData();-->
<!--    formData.append('avatar', file);-->
<!--    const res = await uploadAvatar(formData);-->
<!--    const resData = res.data || {};-->
<!--    const avatarPath = resData.avatar || resData.data?.avatar || resData.result?.avatar || '';-->

<!--    let newAvatar = defaultAvatar.value;-->
<!--    if (avatarPath) {-->
<!--      newAvatar = avatarPath.startsWith('http') ? avatarPath : `${baseURL}${avatarPath}`;-->
<!--      newAvatar += `?t=${Date.now()}`; // 防缓存-->
<!--    }-->

<!--    // 更新Pinia Store中的头像-->
<!--    userStore.setUserInfo({ avatar: newAvatar });-->
<!--    // 同步本地缓存-->
<!--    localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo));-->
<!--    ElMessage.success('头像修改成功！');-->
<!--  } catch (error) {-->
<!--    const errMsg = error.response-->
<!--      ? `服务器返回${error.response.status}：${error.response.data?.message || '上传失败'}`-->
<!--      : error.message || '头像上传失败';-->
<!--    ElMessage.error(errMsg);-->
<!--  } finally {-->
<!--    isAvatarLoading.value = false;-->
<!--  }-->
<!--};-->

<!--// 头像加载失败兜底-->
<!--const handleAvatarError = () => {-->
<!--  userStore.setUserInfo({ avatar: defaultAvatar.value });-->
<!--};-->

<!--// 粒子背景初始化-->
<!--const initParticles = async () => {-->
<!--  try {-->
<!--    await loadSlim(tsParticles);-->
<!--    await tsParticles.load({-->
<!--      id: "particles-bg",-->
<!--      options: {-->
<!--        fullScreen: { enable: true, zIndex: 0 },-->
<!--        particles: {-->
<!--          number: { value: 80, density: { enable: true, value_area: 800 } },-->
<!--          size: { value: 3, random: true },-->
<!--          opacity: { value: 0.7, random: true },-->
<!--          color: { value: ["#409eff", "#67c23a", "#f56c6c", "#909399"], random: true },-->
<!--          shape: { type: ["circle", "triangle"] },-->
<!--          move: { enable: true, speed: { x: 0.5, y: 0.5 }, attract: { enable: true } },-->
<!--          links: { enable: true, distance: 100, color: "#409eff", opacity: 0.4 }-->
<!--        },-->
<!--        interactivity: {-->
<!--          events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } }-->
<!--        },-->
<!--        responsive: [{ breakpoint: 768, options: { particles: { number: { value: 40 } } } }]-->
<!--      }-->
<!--    });-->
<!--  } catch (e) {-->
<!--    console.warn('粒子背景初始化失败:', e); // 不影响主功能-->
<!--  }-->
<!--};-->

<!--// 获取用户信息（修复：强制赋值username+同步登录状态）-->
<!--const fetchUserProfile = async () => {-->
<!--  try {-->
<!--    const token = localStorage.getItem('accessToken');-->
<!--    if (!token) {-->
<!--      router.push('/login');-->
<!--      return;-->
<!--    }-->

<!--    const res = await getUserInfo({ headers: { 'Cache-Control': 'no-cache' } });-->
<!--    console.log('接口返回完整数据：', res.data); // 调试：查看接口返回-->

<!--    const data = res.data?.data || res.data || {};-->
<!--    console.log('提取的用户核心数据：', {-->
<!--      username: data.username,-->
<!--      id: data.id,-->
<!--      avatar: data.avatar-->
<!--    });-->

<!--    // 强制兜底：确保username不为空-->
<!--    const username = data.username || data.user_name || data.name || '用户' + (data.id || Date.now().toString().slice(-4));-->
<!--    const avatar = data.avatar && data.avatar.startsWith('/')-->
<!--      ? `${baseURL}${data.avatar}`-->
<!--      : defaultAvatar.value;-->

<!--    // 组装用户信息（对齐Pinia Store结构）-->
<!--    const userData = {-->
<!--      id: data.id || '',-->
<!--      username: username, // 强制赋值，避免为空-->
<!--      bio: data.bio || '',-->
<!--      avatar,-->
<!--      create_time: data.create_time || '',-->
<!--      last_login_time: data.last_login_time || ''-->
<!--    };-->

<!--    // 更新Pinia Store-->
<!--    userStore.setUserInfo(userData);-->
<!--    // 强制同步登录状态（修复isLogin为false的问题）-->
<!--    userStore.isLogin = true;-->
<!--    // 同步本地缓存-->
<!--    localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo));-->
<!--    console.log('Store更新后：', {-->
<!--      username: storeUserInfo.username,-->
<!--      isLogin: isLogin.value-->
<!--    });-->

<!--  } catch (error) {-->
<!--    console.error('获取用户信息失败：', error);-->
<!--    ElMessage.error('获取用户信息失败：' + (error.message || '网络错误'));-->
<!--    // 兜底：即使接口失败，也标记为登录（避免水印匿名）-->
<!--    if (localStorage.getItem('accessToken')) {-->
<!--      userStore.isLogin = true;-->
<!--    }-->
<!--  }-->
<!--};-->

<!--// 退出登录（调用Pinia Store的clearUserInfo）-->
<!--const handleLogout = async () => {-->
<!--  try {-->
<!--    await logout();-->
<!--    userStore.clearUserInfo(); // 清空Pinia Store-->
<!--    router.push('/login');-->
<!--    ElMessage.success('退出登录成功！');-->
<!--  } catch (error) {-->
<!--    ElMessage.error('退出失败：' + error.message);-->
<!--  }-->
<!--};-->

<!--// ===================== 页面挂载（增加完整调试+强制初始化） =====================-->
<!--onMounted(async () => {-->
<!--  // 调试：打印初始状态-->
<!--  console.log('===== 初始状态调试 =====');-->
<!--  console.log('本地缓存token：', localStorage.getItem('accessToken'));-->
<!--  console.log('本地缓存userInfo：', localStorage.getItem('userInfo'));-->
<!--  console.log('Store初始isLogin：', isLogin.value);-->
<!--  console.log('Store初始username：', storeUserInfo.username);-->

<!--  // 1. 初始化Pinia中的用户信息（从本地缓存读取）-->
<!--  userStore.initUserInfo();-->
<!--  console.log('initUserInfo后Store状态：', {-->
<!--    isLogin: isLogin.value,-->
<!--    username: storeUserInfo.username-->
<!--  });-->

<!--  // 2. 强制兜底：如果缓存无用户名但有token，标记为登录-->
<!--  const token = localStorage.getItem('accessToken');-->
<!--  if (token && !storeUserInfo.username) {-->
<!--    console.log('缓存无用户名，调用接口获取');-->
<!--    await fetchUserProfile();-->
<!--  }-->

<!--  // 3. 仍无用户名则手动赋值（终极兜底）-->
<!--  if (!storeUserInfo.username && token) {-->
<!--    console.log('接口也无用户名，手动赋值兜底');-->
<!--    const randomName = '用户' + Date.now().toString().slice(-4);-->
<!--    userStore.setUserInfo({ username: randomName });-->
<!--    userStore.isLogin = true;-->
<!--  }-->

<!--  // 4. 其他初始化逻辑-->
<!--  window.addEventListener('scroll', () => isScrolled.value = window.scrollY > 20);-->
<!--  await initParticles();-->

<!--  // 5. 内容入场动画-->
<!--  setTimeout(() => {-->
<!--    document.querySelector('.content')?.classList.add('content-visible');-->
<!--  }, 300);-->

<!--  // 6. 监听用户信息变化（调试）-->
<!--  watch(storeUserInfo, (newVal) => {-->
<!--    console.log('用户信息变化：', newVal);-->
<!--  }, { deep: true });-->
<!--});-->
<!--</script>-->

<!--<style scoped>-->
<!--/* 全局样式重置 */-->
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

<!--/* 头像上传提示 */-->
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

<!--.avatar-error {-->
<!--  position: absolute;-->
<!--  bottom: -20px;-->
<!--  left: 50%;-->
<!--  transform: translateX(-50%);-->
<!--  color: #f56c6c;-->
<!--  font-size: 12px;-->
<!--  white-space: nowrap;-->
<!--}-->

<!--/* 粒子背景容器 */-->
<!--.particles-container {-->
<!--  position: fixed;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  width: 100vw;-->
<!--  height: 100vh;-->
<!--  pointer-events: none;-->
<!--  z-index: 0;-->
<!--}-->

<!--/* 背景装饰 */-->
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

<!--/* 导航栏 */-->
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
<!--  cursor: pointer;-->
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

<!--/* 主体内容 */-->
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

<!--/* 欢迎卡片 */-->
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

<!--/* 功能入口列表 */-->
<!--.function-list {-->
<!--  display: grid;-->
<!--  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));-->
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
<!--  transition: all 0.5s ease;-->
<!--}-->

<!--.func-icon-rotate {-->
<!--  transform: rotate(10deg) scale(1.1);-->
<!--}-->

<!--.func-title {-->
<!--  font-size: 18px;-->
<!--  color: #333;-->
<!--  margin-bottom: 8px;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.func-desc {-->
<!--  font-size: 14px;-->
<!--  color: #666;-->
<!--  margin-bottom: 20px;-->
<!--  line-height: 1.4;-->
<!--}-->

<!--.func-arrow {-->
<!--  font-size: 16px;-->
<!--  color: #999;-->
<!--  transition: all 0.3s ease;-->
<!--  opacity: 0.6;-->
<!--}-->

<!--.func-arrow-active {-->
<!--  color: #409eff;-->
<!--  transform: translateX(5px);-->
<!--  opacity: 1;-->
<!--}-->

<!--/* 底部样式 */-->
<!--.home-footer {-->
<!--  position: relative;-->
<!--  z-index: 5;-->
<!--  margin-top: 50px;-->
<!--  padding: 20px 0;-->
<!--  text-align: center;-->
<!--}-->

<!--.footer-gradient {-->
<!--  height: 2px;-->
<!--  background: linear-gradient(90deg, transparent, #409eff, transparent);-->
<!--  margin-bottom: 15px;-->
<!--  width: 80%;-->
<!--  margin-left: 10%;-->
<!--}-->

<!--.footer-text {-->
<!--  font-size: 14px;-->
<!--  color: #999;-->
<!--}-->

<!--/* 动画定义 */-->
<!--@keyframes float {-->
<!--  0% { transform: translate(0, 0); }-->
<!--  100% { transform: translate(20px, -20px); }-->
<!--}-->

<!--@keyframes fade {-->
<!--  0% { opacity: 0.1; }-->
<!--  100% { opacity: 0.2; }-->
<!--}-->

<!--/* 响应式适配 */-->
<!--@media (max-width: 1200px) {-->
<!--  .content { width: 90%; }-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .navbar { padding: 12px 20px; }-->
<!--  .navbar-scrolled { padding: 8px 20px; }-->
<!--  .logo-text { font-size: 18px; }-->
<!--  .user-info { gap: 10px; }-->
<!--  .username { font-size: 14px; }-->
<!--  .logout-btn { padding: 4px 8px; font-size: 12px; }-->
<!--  .stats { gap: 20px; }-->
<!--  .stat-item { min-width: 100%; }-->
<!--  .function-list { grid-template-columns: 1fr; }-->
<!--}-->
<!--</style>-->
<template>
  <div class="wechat-layout" v-watermark="watermarkConfig">
    <div class="home-container">
      <!-- 粒子背景 -->
      <div id="particles-bg" class="particles-container"></div>

      <!-- 背景装饰 -->
      <div class="background-decoration">
        <div class="gradient-circle circle-1"></div>
        <div class="gradient-circle circle-2"></div>
        <div class="gradient-circle circle-3"></div>
        <div class="glow-points"></div>
      </div>

      <!-- 顶部导航栏 -->
      <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
        <div class="logo">
          <span class="logo-icon">✏️</span>
          <span class="logo-text">Weblog 博客平台</span>
        </div>
        <div class="user-info">
          <!-- 用户头像（仅用接口返回的头像） -->
          <div class="avatar-container" @click="handleAvatarUpload">
            <img
              :src="userInfo.avatar"
              alt="用户头像"
              class="avatar"
              @mouseenter="avatarHover = true"
              @mouseleave="avatarHover = false"
              @error="userInfo.avatar = defaultAvatar"
            >
            <div class="avatar-border" :class="{ 'avatar-border-active': avatarHover }"></div>
            <div class="avatar-loading" v-if="isAvatarLoading">上传中...</div>
            <div class="avatar-error" v-if="avatarError">{{ avatarError }}</div>
          </div>
          <!-- 用户名（仅用接口返回的用户名） -->
          <span class="username" :class="{ 'username-hover': usernameHover }"
                @mouseenter="usernameHover = true"
                @mouseleave="usernameHover = false">
            {{ userInfo.username }}
          </span>
          <!-- 退出登录 -->
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

      <!-- 主体内容区 -->
      <main class="content">
        <!-- 欢迎卡片 -->
        <div class="welcome-card" @mouseenter="cardHover = true" @mouseleave="cardHover = false">
          <div class="card-header">
            <h1 class="welcome-title" :class="{ 'title-hover': cardHover }">
              欢迎回来，{{ userInfo.username }}！
            </h1>
            <div class="title-divider" :style="{ width: cardHover ? '200px' : '120px' }"></div>
          </div>

          <!-- 个人简介（接口返回） -->
          <p class="bio">
            <span class="bio-icon">💬</span>
            {{ userInfo.bio || '暂无个人简介，可前往个人中心完善' }}
          </p>

          <!-- 统计信息（接口返回） -->
          <div class="stats">
            <div class="stat-item" @mouseenter="statHover[0] = true" @mouseleave="statHover[0] = false">
              <div class="stat-icon">📅</div>
              <span class="label">注册时间</span>
              <span class="value">{{ formatTime(userInfo.create_time) || '暂无数据' }}</span>
            </div>
            <div class="stat-item" @mouseenter="statHover[1] = true" @mouseleave="statHover[1] = false">
              <div class="stat-icon">⏰</div>
              <span class="label">最后登录</span>
              <span class="value">{{ formatTime(userInfo.last_login_time) || '暂无数据' }}</span>
            </div>
          </div>
        </div>

        <!-- 功能入口 -->
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
            @click="goToPage('/other-blogs')"
            @mouseenter="funcHover[2] = true"
            @mouseleave="funcHover[2] = false"
            :class="{ 'func-card-active': funcHover[2] }"
          >
            <div class="func-icon" :class="{ 'func-icon-rotate': funcHover[2] }">🔍</div>
            <h3 class="func-title">发现内容</h3>
            <p class="func-desc">浏览其他用户的优质博客</p>
            <div class="func-arrow" :class="{ 'func-arrow-active': funcHover[2] }">→</div>
          </div>
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

      <!-- 底部 -->
      <footer class="home-footer">
        <div class="footer-gradient"></div>
        <p class="footer-text">Weblog 博客平台 © 2025 | 记录生活，分享知识</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { logout, getUserInfo } from '@/api/user';
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { useUserStore } from '@/stores/user'

// ===================== 核心：仅从/userinfo接口获取用户信息 =====================
const router = useRouter();
const userStore = useUserStore()
const baseURL = 'http://127.0.0.1:8000';
const defaultAvatar = 'http://127.0.0.1:8000/media/avatars/default.png';

// 响应式用户信息（仅存储接口返回的数据）
const userInfo = ref({
  username: '加载中...',
  avatar: defaultAvatar,
  bio: '',
  create_time: '',
  last_login_time: '',
  id: ''
});

// 动画/状态变量
const isScrolled = ref(false);
const avatarHover = ref(false);
const usernameHover = ref(false);
const logoutHover = ref(false);
const cardHover = ref(false);
const statHover = ref([false, false]);
const funcHover = ref([false, false, false, false]);
const isAvatarLoading = ref(false);
const avatarError = ref('');

// ===================== 水印配置（仅用接口返回的用户名） =====================
const watermarkConfig = computed(() => {
  return {
    text: `@${userInfo.value.username || '已登录用户'}`,
    fontSize: '16px',
    color: 'rgba(120,120,120,0.12)',
    rotate: -18,
    spacing: 70,
    zIndex: 9999
  };
});

// ===================== 核心：调用/userinfo接口获取用户信息 =====================
const fetchUserProfile = async () => {
  try {
    // 1. 校验登录状态
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // 2. 仅调用/userinfo接口（核心：唯一数据来源）
    const res = await getUserInfo({
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${token}` // 按需调整token传递方式
      }
    });
    console.log('/userinfo接口返回：', res.data);

    // 3. 解析接口数据（适配你的接口返回格式）
    const data = res.data?.data || res.data || {};

    // 4. 数据兜底（防止接口返回空值）
    userInfo.value = {
      id: data.id || '',
      username: data.username || data.user_name || `用户${Date.now().toString().slice(-4)}`,
      bio: data.bio || '',
      avatar: data.avatar
        ? (data.avatar.startsWith('http') ? data.avatar : `${baseURL}${data.avatar}`)
        : defaultAvatar,
      create_time: data.create_time || '',
      last_login_time: data.last_login_time || ''
    };

    // 5. 同步到Pinia（仅为了兼容头像上传逻辑，非核心）
    userStore.setUserInfo(userInfo.value);

  } catch (error) {
    console.error('/userinfo接口调用失败：', error);
    ElMessage.error('获取用户信息失败，请刷新页面');
    // 接口失败兜底
    userInfo.value.username = '已登录用户';
  }
};

// ===================== 水印指令 =====================
const createWatermark = (el, config) => {
  const oldWatermark = el.querySelector('div[data-watermark="true"]');
  if (oldWatermark) el.removeChild(oldWatermark);

  const watermarkEl = document.createElement('div');
  watermarkEl.dataset.watermark = 'true';
  watermarkEl.style.position = 'absolute';
  watermarkEl.style.top = '0';
  watermarkEl.style.left = '0';
  watermarkEl.style.width = '100%';
  watermarkEl.style.height = '100%';
  watermarkEl.style.pointerEvents = 'none';
  watermarkEl.style.zIndex = config.zIndex;
  el.style.position = 'relative';
  el.appendChild(watermarkEl);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 200;
  canvas.height = 200;
  ctx.font = `${config.fontSize} Microsoft YaHei`;
  ctx.fillStyle = config.color;
  ctx.rotate((config.rotate * Math.PI) / 180);
  ctx.fillText(config.text, config.spacing, 100);
  watermarkEl.style.backgroundImage = `url(${canvas.toDataURL()})`;
  watermarkEl.style.backgroundSize = `${config.spacing * 2}px ${config.spacing * 2}px`;
};

const vWatermark = {
  mounted(el, binding) {
    createWatermark(el, binding.value);
  },
  updated(el, binding) {
    createWatermark(el, binding.value);
  }
};

// ===================== 工具函数 =====================
// 时间格式化
const formatTime = (timeStr) => {
  if (!timeStr) return '暂无数据';
  let date = new Date(timeStr);
  if (isNaN(date.getTime())) date = new Date(timeStr.replace(/-/g, '/'));
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 页面跳转
const goToPage = (path) => {
  const tipMap = {
    '/UserInfo': '正在跳转到个人中心...',
    '/friends': '正在跳转到好友功能...',
    default: '即将跳转到目标页面'
  };
  ElMessage.success(tipMap[path] || tipMap.default);
  router.push(path);
};

// 头像上传（上传后更新接口返回的用户信息）
// 头像上传 - 触发文件选择框

// ========== 删掉所有uploadAvatar相关导入，替换为以下代码 ==========
// 头像上传 - 触发文件选择框
const handleAvatarUpload = () => {
  if (isAvatarLoading.value) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpg,image/jpeg,image/png,image/gif';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) uploadAvatarToServer(file);
  };
  input.click();
};

// 头像上传 - 原生Axios请求（彻底绕开导入导出问题）
const uploadAvatarToServer = async (file) => {
  isAvatarLoading.value = true;
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('登录状态失效，请重新登录');

    const formData = new FormData();
    formData.append('avatar', file);

    // 直接用原生Axios请求，无需导入任何uploadAvatar函数
    const res = await axios({
      url: `${baseURL}/upload-avatar/`, // 替换为你的实际头像上传接口地址
      method: 'post',
      data: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const resData = res.data || {};
    const avatarPath = resData.avatar || resData.data?.avatar || resData.result?.avatar || '';

    let newAvatar = defaultAvatar; // 修复defaultAvatar.value错误
    if (avatarPath) {
      newAvatar = avatarPath.startsWith('http') ? avatarPath : `${baseURL}${avatarPath}`;
      newAvatar += `?t=${Date.now()}`; // 防缓存
    }

    // 更新Pinia和本地缓存
    userStore.setUserInfo({ ...userStore.userInfo, avatar: newAvatar });
    localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo));
    userInfo.value.avatar = newAvatar; // 同步页面显示
    ElMessage.success('头像修改成功！');
  } catch (error) {
    const errMsg = error.response
      ? `服务器返回${error.response.status}：${error.response.data?.message || '上传失败'}`
      : error.message || '头像上传失败';
    ElMessage.error(errMsg);
  } finally {
    isAvatarLoading.value = false;
  }
};
// 退出登录
const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem('accessToken');
    userStore.clearUserInfo();
    router.push('/login');
    ElMessage.success('退出登录成功！');
  } catch (error) {
    ElMessage.error('退出失败：' + error.message);
  }
};

// 粒子背景
const initParticles = async () => {
  try {
    await loadSlim(tsParticles);
    await tsParticles.load({
      id: "particles-bg",
      options: {
        fullScreen: { enable: true, zIndex: 0 },
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          size: { value: 3, random: true },
          opacity: { value: 0.7, random: true },
          color: { value: ["#409eff", "#67c23a", "#f56c6c", "#909399"], random: true },
          shape: { type: ["circle", "triangle"] },
          move: { enable: true, speed: { x: 0.5, y: 0.5 }, attract: { enable: true } },
          links: { enable: true, distance: 100, color: "#409eff", opacity: 0.4 }
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } }
        },
        responsive: [{ breakpoint: 768, options: { particles: { number: { value: 40 } } } }]
      }
    });
  } catch (e) {
    console.warn('粒子背景初始化失败:', e);
  }
};

// ===================== 页面挂载：优先调用/userinfo接口 =====================
onMounted(async () => {
  // 1. 核心：先拉取/userinfo接口数据
  await fetchUserProfile();

  // 2. 其他初始化
  window.addEventListener('scroll', () => isScrolled.value = window.scrollY > 20);
  await initParticles();

  // 3. 内容入场动画
  setTimeout(() => {
    document.querySelector('.content')?.classList.add('content-visible');
  }, 300);
});
</script>

<style scoped>
/* 样式部分与你原代码完全一致，无修改 */
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

.avatar-error {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #f56c6c;
  font-size: 12px;
  white-space: nowrap;
}

.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}

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
  cursor: pointer;
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
  transition: all 0.5s ease;
}

.func-icon-rotate {
  transform: rotate(10deg) scale(1.1);
}

.func-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.func-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.4;
}

.func-arrow {
  font-size: 16px;
  color: #999;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.func-arrow-active {
  color: #409eff;
  transform: translateX(5px);
  opacity: 1;
}

.home-footer {
  position: relative;
  z-index: 5;
  margin-top: 50px;
  padding: 20px 0;
  text-align: center;
}

.footer-gradient {
  height: 2px;
  background: linear-gradient(90deg, transparent, #409eff, transparent);
  margin-bottom: 15px;
  width: 80%;
  margin-left: 10%;
}

.footer-text {
  font-size: 14px;
  color: #999;
}

@keyframes float {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20px, -20px); }
}

@keyframes fade {
  0% { opacity: 0.1; }
  100% { opacity: 0.2; }
}

@media (max-width: 1200px) {
  .content { width: 90%; }
}

@media (max-width: 768px) {
  .navbar { padding: 12px 20px; }
  .navbar-scrolled { padding: 8px 20px; }
  .logo-text { font-size: 18px; }
  .user-info { gap: 10px; }
  .username { font-size: 14px; }
  .logout-btn { padding: 4px 8px; font-size: 12px; }
  .stats { gap: 20px; }
  .stat-item { min-width: 100%; }
  .function-list { grid-template-columns: 1fr; }
}
</style>