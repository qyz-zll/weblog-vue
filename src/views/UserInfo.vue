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

    <!-- 顶部导航栏 -->
    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="logo">
        <span class="logo-icon">✏️</span>
        <span class="logo-text">Weblog 博客平台</span>
      </div>
      <div class="user-info">
        <div class="avatar-container" @click="handleAvatarUpload">
          <img
            :src="userInfo?.avatar || defaultAvatar.value"
            alt="用户头像"
            class="avatar"
            @mouseenter="avatarHover = true"
            @mouseleave="avatarHover = false"
            @error="handleAvatarError"
          >
          <div class="avatar-border" :class="{ 'avatar-border-active': avatarHover }"></div>
          <div class="avatar-loading" v-if="isAvatarLoading">上传中...</div>
        </div>
        <span class="username" :class="{ 'username-hover': usernameHover }"
              @mouseenter="usernameHover = true"
              @mouseleave="usernameHover = false">
          {{ userInfo?.username || '匿名用户' }}
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

          <!-- 头像上传区域 -->
          <div class="avatar-upload-section">
            <div class="avatar-preview-large" @click="handleAvatarUpload">
              <img
                :src="userInfo?.avatar || defaultAvatar.value"
                alt="用户头像"
                class="avatar-large"
                @error="handleAvatarError"
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
                :value="formatTime(userInfo?.create_time) || '暂无数据'"
                disabled
                class="form-input"
              ></el-input>
            </div>

            <div class="form-group">
              <label class="form-label">最后登录</label>
              <el-input
                :value="formatTime(userInfo?.last_login_time) || '暂无数据'"
                disabled
                class="form-input"
              ></el-input>
            </div>

            <!-- 编辑/保存按钮 -->
            <div class="btn-group">
              <el-button
                type="primary"
                @click="toggleEditMode"
                :icon="isEditMode ? Save : Edit"
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
              <span class="stat-value">{{ userInfo?.article_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[0] }"></div>
            </div>

            <div class="stat-item" @mouseenter="statHover[1] = true" @mouseleave="statHover[1] = false">
              <div class="stat-icon">👍</div>
              <span class="stat-label">获得点赞</span>
              <span class="stat-value">{{ userInfo?.like_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[1] }"></div>
            </div>

            <div class="stat-item" @mouseenter="statHover[2] = true" @mouseleave="statHover[2] = false">
              <div class="stat-icon">💬</div>
              <span class="stat-label">收到评论</span>
              <span class="stat-value">{{ userInfo?.comment_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[2] }"></div>
            </div>

            <div class="stat-item" @mouseenter="statHover[3] = true" @mouseleave="statHover[3] = false">
              <div class="stat-icon">👁️</div>
              <span class="stat-label">文章阅读</span>
              <span class="stat-value">{{ userInfo?.view_count || 0 }}</span>
              <div class="stat-bg" :class="{ 'stat-bg-active': statHover[3] }"></div>
            </div>
          </div>

          <!-- 数据趋势图（占位） -->
          <div class="chart-placeholder">
            <span class="chart-icon">📈</span>
            <p class="chart-text">数据趋势图</p>
          </div>
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
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElInput, ElButton } from 'element-plus';
import { Edit, Save } from '@element-plus/icons-vue';
import { logout, getUserInfo, updateUserInfo } from '@/api/user';
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import service from "@/utils/request";

// 路由实例
const router = useRouter();

// 核心配置
const baseURL = 'http://127.0.0.1:8000';
const userInfo = ref({
  id: '',
  username: '',
  email: '',
  bio: '',
  avatar: '',
  create_time: '',
  last_login_time: '',
  article_count: 0,
  like_count: 0,
  comment_count: 0,
  view_count: 0
});
const defaultAvatar = ref('http://127.0.0.1:8000/media/avatars/default.png');

// 状态管理
const isScrolled = ref(false);
const avatarHover = ref(false);
const usernameHover = ref(false);
const logoutHover = ref(false);
const maskHover = ref(false);
const isAvatarLoading = ref(false);
const isEditMode = ref(false);
const statHover = ref([false, false, false, false]);

// 表单数据
const formData = reactive({
  username: '',
  bio: ''
});

// 页面挂载初始化
onMounted(() => {
  fetchUserProfile();
  initParticles();
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20;
  });
  setTimeout(() => {
    document.querySelector('.content')?.classList.add('content-visible');
  }, 300);

  // 监听头像变化（调试用）
  watch(() => userInfo.value.avatar, (newVal) => {
    console.log('个人中心头像路径更新为：', newVal);
  }, { immediate: true });
});

// 获取用户信息函数
const fetchUserProfile = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const response = await getUserInfo({
      headers: { 'Cache-Control': 'no-cache' }
    });
    console.log('个人中心接口原始响应：', response);

    const resData = response.data || {};
    const apiUserInfo = resData.data || resData;
    console.log('个人中心提取的用户信息：', apiUserInfo);

    let finalAvatarUrl = defaultAvatar.value;
    if (apiUserInfo.avatar && typeof apiUserInfo.avatar === 'string') {
      finalAvatarUrl = apiUserInfo.avatar.startsWith('http')
        ? apiUserInfo.avatar
        : `${baseURL}${apiUserInfo.avatar}`;
    }

    userInfo.value = {
      id: apiUserInfo.id || '',
      username: apiUserInfo.username || '匿名用户',
      email: apiUserInfo.email || '',
      bio: apiUserInfo.bio || '',
      avatar: finalAvatarUrl,
      create_time: apiUserInfo.create_time || '',
      last_login_time: apiUserInfo.last_login_time || '',
      article_count: apiUserInfo.article_count || 0,
      like_count: apiUserInfo.like_count || 0,
      comment_count: apiUserInfo.comment_count || 0,
      view_count: apiUserInfo.view_count || 0
    };

    // 同步表单数据
    formData.username = userInfo.value.username || '';
    formData.bio = userInfo.value.bio || '';

    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));

  } catch (error) {
    console.error('个人中心获取用户信息失败：', error);
    ElMessage.error('获取用户信息失败：' + (error.response?.data?.message || error.message));
    userInfo.value.avatar = defaultAvatar.value;
  }
};

// 头像上传触发函数
const handleAvatarUpload = () => {
  if (isAvatarLoading.value) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpg,image/jpeg,image/png,image/gif';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        ElMessage.warning('仅支持 JPG、JPEG、PNG、GIF 格式');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.warning('图片大小不能超过 5MB');
        return;
      }
      uploadAvatarToServer(file);
    }
  };
  input.click();
};

// 头像上传核心函数
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

// 头像加载失败处理
const handleAvatarError = () => {
  console.error('个人中心头像加载失败，切换为默认路径');
  userInfo.value.avatar = defaultAvatar.value;
};

// 编辑/保存个人信息
const toggleEditMode = async () => {
  if (isEditMode.value) {
    try {
      if (!formData.username.trim()) {
        ElMessage.warning('用户名不能为空！');
        return;
      }
      if (formData.bio.length > 200) {
        ElMessage.warning('个人简介不能超过200字！');
        return;
      }

      const response = await updateUserInfo({
        username: formData.username.trim(),
        bio: formData.bio.trim()
      });

      const resData = response.data || {};
      if (resData.code !== 200 && resData.code !== undefined) {
        throw new Error(resData.message || '更新失败');
      }

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

// 重置表单
const resetForm = () => {
  formData.username = userInfo.value?.username || '';
  formData.bio = userInfo.value?.bio || '';
  isEditMode.value = false;
};

// 退出登录
const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    router.push('/login');
    ElMessage.success('退出登录成功！');
  } catch (error) {
    ElMessage.error('退出失败：' + error.message);
  }
};

// 时间格式化
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

// 粒子背景初始化
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

// 表单提交事件
const handleInfoSubmit = () => {
  toggleEditMode();
};
</script>


<style scoped>
/* 原有样式完全不变，无需修改 */
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

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 30px) scale(1.05); }
}

@keyframes fade {
  0% { opacity: 0.1; }
  100% { opacity: 0.2; }
}

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