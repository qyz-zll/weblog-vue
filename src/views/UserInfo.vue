<template>
  <div class="profile-container">
    <!-- 粒子背景（复用首页逻辑） -->
    <div id="particles-bg" class="particles-container"></div>

    <!-- 背景装饰（渐变圆形+光点） -->
    <div class="background-decoration">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="gradient-circle circle-3"></div>
      <div class="glow-points"></div>
    </div>

    <!-- 顶部导航栏（与首页完全一致，保持统一） -->
    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="logo">
        <span class="logo-icon">✏️</span>
        <span class="logo-text">Weblog 博客平台</span>
      </div>
      <div class="user-info">
        <div class="avatar-container" @click="handleAvatarUpload">
          <img
            :src="userInfo.data?.avatar || defaultAvatar"
            alt="用户头像"
            class="avatar"
            @mouseenter="avatarHover = true"
            @mouseleave="avatarHover = false"
          >
          <div class="avatar-border" :class="{ 'avatar-border-active': avatarHover }"></div>
          <div class="avatar-loading" v-if="isAvatarLoading">上传中...</div>
        </div>
        <span class="username" :class="{ 'username-hover': usernameHover }"
              @mouseenter="usernameHover = true"
              @mouseleave="usernameHover = false">
          {{ userInfo.data?.username || '匿名用户' }}
        </span>
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

    <!-- 主体内容区（个人中心核心功能） -->
    <main class="content">
      <!-- 页面标题（带渐变装饰） -->
      <div class="page-header">
        <h1 class="page-title">个人中心</h1>
        <div class="title-divider"></div>
      </div>

      <!-- 核心内容卡片（分两栏：左侧信息，右侧统计） -->
      <div class="profile-content">
        <!-- 左侧：个人信息编辑卡片 -->
        <div class="info-card">
          <h2 class="card-title">
            <span class="title-icon">👤</span> 基本信息
          </h2>

          <!-- 头像上传区域（放大显示，支持点击上传） -->
          <div class="avatar-upload-section">
            <div class="avatar-preview-large" @click="handleAvatarUpload">
              <img
                :src="userInfo.data?.avatar || defaultAvatar"
                alt="用户头像"
                class="avatar-large"
              >
              <div class="avatar-mask" @mouseenter="maskHover = true" @mouseleave="maskHover = false">
                <span class="upload-text" :class="{ 'upload-text-active': maskHover }">
                  {{ isAvatarLoading ? '上传中...' : '点击更换头像' }}
                </span>
              </div>
            </div>
            <p class="avatar-tip">支持 jpg、jpeg、png、gif 格式，最大 5MB</p>
          </div>

          <!-- 个人信息编辑表单 -->
          <form class="profile-form" @submit.prevent="handleInfoSubmit">
            <div class="form-group">
              <label class="form-label">用户名</label>
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                :disabled="!isEditMode"
                class="form-input"
              ></el-input>
            </div>

            <div class="form-group">
              <label class="form-label">个人简介</label>
              <el-input
                v-model="formData.bio"
                type="textarea"
                :rows="4"
                placeholder="请输入个人简介（最多200字）"
                :disabled="!isEditMode"
                class="form-textarea"
                maxlength="200"
              ></el-input>
              <p class="word-count">{{ formData.bio.length }}/200</p>
            </div>

            <div class="form-group">
              <label class="form-label">注册时间</label>
              <el-input
                :value="formatTime(userInfo.data?.create_time) || '暂无数据'"
                disabled
                class="form-input"
              ></el-input>
            </div>

            <div class="form-group">
              <label class="form-label">最后登录</label>
              <el-input
                :value="formatTime(userInfo.data?.last_login_time) || '暂无数据'"
                disabled
                class="form-input"
              ></el-input>
            </div>

            <!-- 编辑/保存按钮 -->
            <div class="btn-group">
              <el-button
                type="primary"
                @click="toggleEditMode"
                :icon="isEditMode ? Edit : Save"
                class="action-btn"
              >
                {{ isEditMode ? '保存修改' : '编辑信息' }}
              </el-button>
              <el-button
                type="text"
                @click="resetForm"
                :disabled="!isEditMode"
                class="reset-btn"
              >
                取消
              </el-button>
            </div>
          </form>
        </div>

        <!-- 右侧：数据统计卡片 -->
        <div class="stats-card">
          <h2 class="card-title">
            <span class="title-icon">📊</span> 我的数据
          </h2>

          <div class="stats-grid">
            <div class="stat-item" @mouseenter="statHover[0] = true" @mouseleave="statHover[0] = false">
              <div class="stat-icon">📝</div>
              <span class="stat-label">发布文章</span>
              <span class="stat-value">{{ userInfo.data?.article_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[0] }"></div>
            </div>

            <div class="stat-item" @mouseenter="statHover[1] = true" @mouseleave="statHover[1] = false">
              <div class="stat-icon">👍</div>
              <span class="stat-label">获得点赞</span>
              <span class="stat-value">{{ userInfo.data?.like_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[1] }"></div>
            </div>

            <div class="stat-item" @mouseenter="statHover[2] = true" @mouseleave="statHover[2] = false">
              <div class="stat-icon">💬</div>
              <span class="stat-label">收到评论</span>
              <span class="stat-value">{{ userInfo.data?.comment_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[2] }"></div>
            </div>

            <div class="stat-item" @mouseenter="statHover[3] = true" @mouseleave="statHover[3] = false">
              <div class="stat-icon">👁️</div>
              <span class="stat-label">文章阅读</span>
              <span class="stat-value">{{ userInfo.data?.view_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[3] }"></div>
            </div>
          </div>

          <!-- 数据趋势图（占位，可后续集成ECharts） -->
          <div class="chart-placeholder">
            <span class="chart-icon">📈</span>
            <p class="chart-text">数据趋势图</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部装饰条（与首页一致） -->
    <footer class="home-footer">
      <div class="footer-gradient"></div>
      <p class="footer-text">Weblog 博客平台 © 2025 | 记录生活，分享知识</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElInput, ElButton } from 'element-plus';
import { Edit, Save } from '@element-plus/icons-vue';
import { logout, getUserInfo,updateUserInfo } from '@/api/user'; // 新增：用户信息接口

// 粒子库（复用首页逻辑）
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import service from "@/utils/request";

const router = useRouter();

// 状态管理

const userInfo = ref({
  id: '',
  username: '',
  email: '',
  bio: '',
  avatar: 'http://127.0.0.1:8000/media/avatars/default.png', // 后端默认头像路径
  create_time: '',
  last_login_time: '',
  article_count: 0,
  like_count: 0,
  comment_count: 0,
  view_count: 0
}); // 用户完整信息
const defaultAvatar = ref('http://127.0.0.1:8000/media/avatars/default.png');
const isScrolled = ref(false);
const avatarHover = ref(false);
const usernameHover = ref(false);
const logoutHover = ref(false);
const maskHover = ref(false);
const isAvatarLoading = ref(false);
const isEditMode = ref(false); // 编辑模式切换
const statHover = ref([false, false, false, false]);

// 表单数据（与后端字段对应）
const formData = reactive({
  username: '',
  bio: ''
});

// 页面挂载时初始化
onMounted(() => {
  fetchUserProfile(); // 获取用户详情
  initParticles(); // 初始化粒子背景
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20;
  });
  setTimeout(() => {
    document.querySelector('.content')?.classList.add('content-visible');
  }, 300);
});

// 1. 获取用户详情（调用后端接口，而非仅读本地存储）
const fetchUserProfile = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    // 🌟 步骤1：刷新后先读取本地存储的最新用户信息（优先用本地的，避免接口覆盖）
    const localUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (localUserInfo.avatar) {
      // 本地有最新头像，先赋值（避免刷新后短暂显示默认图）
      userInfo.value.avatar = localUserInfo.avatar;
    }

    // 🌟 步骤2：调用接口获取最新用户信息（验证并更新）
    const response = await getUserInfo(); // 响应拦截器返回后端的 {code:200, data:{用户信息}}
    const resData = response.data || {}; // 接口返回的用户信息（包含最新 avatar）

    // 🌟 步骤3：正确提取接口返回的 avatar（适配后端格式）
    const apiAvatar = resData.avatar || ''; // 假设接口返回的用户信息里直接有 avatar 字段
    // 若接口返回的是嵌套结构（如 resData.data.avatar），则改为：
    // const apiAvatar = resData.data?.avatar || '';

    // 🌟 步骤4：更新 userInfo（结构统一为用户信息对象，无 code/message）
    userInfo.value = {
      id: resData.id || localUserInfo.id || '',
      username: resData.username || localUserInfo.username || '',
      email: resData.email || localUserInfo.email || '',
      bio: resData.bio || localUserInfo.bio || '',
      // 优先用接口返回的最新头像，接口没有则用本地存储的，都没有则用默认
      avatar: apiAvatar.startsWith('http') ? apiAvatar : localUserInfo.avatar || defaultAvatar,
      create_time: resData.create_time || localUserInfo.create_time || '',
      last_login_time: resData.last_login_time || localUserInfo.last_login_time || '',
      article_count: resData.article_count || localUserInfo.article_count || 0,
      like_count: resData.like_count || localUserInfo.like_count || 0,
      comment_count: resData.comment_count || localUserInfo.comment_count || 0,
      view_count: resData.view_count || localUserInfo.view_count || 0
    };

    // 🌟 步骤5：同步表单数据和本地存储（保持结构统一）
    formData.username = userInfo.value.username || '';
    formData.bio = userInfo.value.bio || '';
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value)); // 存储纯用户信息对象

  } catch (error) {
    ElMessage.error('获取用户信息失败：' + (error.response?.data?.message || error.message));
    // 错误时，优先用本地存储的头像，避免显示默认图
    const localUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (localUserInfo.avatar) {
      userInfo.value.avatar = localUserInfo.avatar;
    } else {
      userInfo.value.avatar = defaultAvatar;
    }
    // 错误时不跳转登录，保留本地头像显示
  }
};

// 2. 头像上传逻辑（复用并优化）
const handleAvatarUpload = () => {
  if (isAvatarLoading.value) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpg,image/jpeg,image/png,image/gif';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.warning('图片大小不能超过5MB');
        return;
      }
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

    const response = await service.post('/upload-avatar/', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // 更新头像（同步到用户信息和本地存储）
    const newAvatarUrl = response.data.data.avatar;
    userInfo.value.data.avatar = newAvatarUrl;
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
    ElMessage.success('头像修改成功！');
  } catch (error) {
    ElMessage.error('头像上传失败：' + (error.response?.data?.message || error.message));
  } finally {
    isAvatarLoading.value = false;
  }
};

// 3. 个人信息编辑/保存
const toggleEditMode = async () => {
  if (isEditMode.value) {
    try {
      // 1. 表单预校验（避免无效请求）
      if (!formData.username.trim()) {
        ElMessage.warning('用户名不能为空！');
        return;
      }
      if (formData.bio.length > 500) {
        ElMessage.warning('个人简介不能超过500字！');
        return;
      }

      // 2. 关键：移除多传的 accessToken（updateUserInfo 内部已获取）
      const response = await updateUserInfo({
        username: formData.username.trim(),
        bio: formData.bio.trim()
      });

      // 3. 验证接口响应
      if (response?.code !== 200) {
        throw new Error(response?.message || '更新失败');
      }

      // 4. 同步更新 userInfo（直接访问字段，无 data）
      userInfo.value.username = formData.username.trim();
      userInfo.value.bio = formData.bio.trim();
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

      ElMessage.success('个人信息修改成功！');
      isEditMode.value = false;
    } catch (error) {
      ElMessage.error('保存失败：' + (error.message || '网络错误'));
    }
  } else {
    isEditMode.value = true;
  }
};
// 4. 重置表单（取消编辑）
const resetForm = () => {
  // 直接访问 userInfo.value 的字段（无 data），用可选链兜底
  formData.username = userInfo.value?.username || '';
  formData.bio = userInfo.value?.bio || '';
  isEditMode.value = false;
};

// 5. 退出登录（复用首页逻辑）
const handleLogout = async () => {
  try {
    await logout(); // 调用后端登出接口
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    router.push('/login');
    ElMessage.success('退出登录成功！');
  } catch (error) {
    ElMessage.error('退出失败：' + error.message);
  }
};

// 6. 时间格式化（复用首页逻辑）
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

// 7. 粒子背景初始化（复用首页增强版配置）
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
</script>

<style scoped>
/* 全局基础样式（与首页一致） */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.profile-container {
  position: relative;
  min-height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
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

/* 背景装饰（复用首页样式） */
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
  right: -200px;
}

.circle-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f56c6c, #409eff);
  bottom: -150px;
  left: -150px;
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

/* 导航栏（完全复用首页样式） */
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

/* 主体内容样式 */
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

/* 页面标题 */
.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.title-divider {
  width: 150px;
  height: 3px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 3px;
  margin: 0 auto;
}

/* 核心内容卡片（两栏布局） */
.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.info-card, .stats-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.info-card:hover, .stats-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 22px;
  color: #409eff;
}

/* 头像上传区域（放大版） */
.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-preview-large {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 10px;
  border: 3px solid #eee;
  transition: all 0.3s ease;
}

.avatar-preview-large:hover {
  border-color: #409eff;
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.3);
}

.avatar-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.avatar-preview-large:hover .avatar-mask {
  opacity: 1;
}

.upload-text {
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.upload-text-active {
  transform: translateY(-5px);
  font-size: 15px;
}

.avatar-tip {
  font-size: 12px;
  color: #999;
}

/* 表单样式 */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.form-input, .form-textarea {
  border-radius: 8px !important;
  border: 1px solid #eee !important;
  transition: all 0.3s ease !important;
}

.form-input:focus, .form-textarea:focus {
  border-color: #409eff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1) !important;
}

.word-count {
  font-size: 12px;
  color: #999;
  align-self: flex-end;
  margin-top: -5px;
}

.btn-group {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.action-btn {
  background: linear-gradient(135deg, #409eff, #67c23a) !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 8px 20px !important;
  transition: all 0.3s ease !important;
}

.action-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3) !important;
}

.reset-btn {
  color: #999 !important;
  transition: all 0.3s ease !important;
}

.reset-btn:hover {
  color: #f56c6c !important;
}

/* 数据统计区域 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 32px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.stat-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  transform: translateX(-100%);
  transition: all 0.3s ease;
}

.stat-bg-active {
  transform: translateX(0);
}

/* 图表占位区 */
.chart-placeholder {
  height: 200px;
  border-radius: 8px;
  background-color: #f8f9ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #999;
}

.chart-icon {
  font-size: 36px;
}

.chart-text {
  font-size: 14px;
}

/* 底部样式（复用首页） */
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

/* 动画关键帧（复用首页） */
@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 30px) scale(1.05); }
}

@keyframes fade {
  0% { opacity: 0.1; }
  100% { opacity: 0.2; }
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .content {
    width: 100%;
  }
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
  }
  .navbar-scrolled {
    padding: 10px 20px;
  }
  .content {
    padding: 15px;
  }
  .info-card, .stats-card {
    padding: 25px;
  }
  .avatar-preview-large {
    width: 120px;
    height: 120px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>