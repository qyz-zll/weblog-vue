<template>
  <div class="login-page">
    <!-- 背景装饰（轻纹理） -->
    <div class="bg-decoration"></div>

    <!-- 3D登录卡片 -->
    <div class="login-container" :class="{ 'hover': isHover }">
      <h2 class="login-title">
        <span class="title-text">用户登录</span>
        <div class="title-line"></div>
      </h2>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 用户名 -->
        <div class="form-item">
          <label class="form-label">
            <i class="icon-user"></i> 用户名
          </label>
          <div class="input-wrapper">
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="请输入用户名"
              @blur="validateUsername"
              @focus="clearError('username')"
              class="form-input"
            >
          </div>
          <span class="error" v-if="errors.username" :class="{ 'shake': errors.username }">
            {{ errors.username }}
          </span>
        </div>

        <!-- 密码 -->
        <div class="form-item">
          <label class="form-label">
            <i class="icon-lock"></i> 密码
          </label>
          <div class="input-wrapper">
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="请输入密码（至少6位）"
              @blur="validatePassword"
              @focus="clearError('password')"
              class="form-input"
            >
          </div>
          <span class="error" v-if="errors.password" :class="{ 'shake': errors.password }">
            {{ errors.password }}
          </span>
        </div>

        <!-- 全局错误提示 -->
        <div class="global-error" v-if="globalError" :class="{ 'show': globalError }">
          <i class="icon-error"></i> {{ globalError }}
        </div>

        <!-- 登录按钮 -->
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="loading">
            <i class="icon-loading"></i> 登录中...
          </span>
          <span v-else>立即登录</span>
        </button>

        <!-- 跳转注册 -->
        <div class="register-link">
          没有账号？
          <router-link to="/register" class="register-btn">
            立即注册 <i class="icon-arrow-right"></i>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<!-- 第一个 script：定义组件名 -->
<script>
export default {
  name: 'UserLogin'
};
</script>

<!-- 第二个 script：业务逻辑 -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
// 请确保项目中存在以下API（若路径不同需调整）
import { login, getUserInfo } from '@/api/user';

const form = ref({ username: '', password: '' });
const errors = ref({});
const globalError = ref('');
const isSubmitting = ref(false);
const isHover = ref(false); // 3D效果触发
const router = useRouter();

// 清除单个错误
const clearError = (field) => {
  errors.value[field] = '';
};

// 用户名验证
const validateUsername = () => {
  errors.value.username = '';
  if (!form.value.username.trim()) {
    errors.value.username = '用户名不能为空';
  } else if (form.value.username.length < 3 || form.value.username.length > 20) {
    errors.value.username = '用户名长度需在3-20位之间';
  }
};

// 密码验证
const validatePassword = () => {
  errors.value.password = '';
  if (!form.value.password.trim()) {
    errors.value.password = '密码不能为空';
  } else if (form.value.password.length < 6) {
    errors.value.password = '密码长度至少6位';
  }
};

// 提交登录
const handleLogin = async () => {
  validateUsername();
  validatePassword();
  if (Object.values(errors.value).some(msg => msg)) return;

  isSubmitting.value = true;
  globalError.value = '';
  try {
    const res = await login(form.value);
    localStorage.setItem('accessToken', res.data.access);
    localStorage.setItem('refreshToken', res.data.refresh);

    const userInfoRes = await getUserInfo();
    const userId = userInfoRes.id || (userInfoRes.data && userInfoRes.data.id);
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    } else {
      throw new Error('未获取到用户ID');
    }

    localStorage.setItem('userInfo', JSON.stringify(userInfoRes));
    ElMessage.success('登录成功！');
    router.push('/');
  } catch (error) {
    console.error('登录失败：', error);
    if (error.message === '未获取到用户ID') {
      globalError.value = '登录异常：无法获取用户信息';
    } else if (error.response?.status === 401) {
      globalError.value = '用户名或密码错误';
    } else {
      globalError.value = error.message || '登录失败，请重试';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* 全局背景（柔和蓝紫渐变+轻纹理） */
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f7fa 0%, #e8eaf6 100%);
  padding: 20px;
  overflow: hidden;
}

/* 背景装饰（轻纹理，替代原粒子效果） */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 30%, rgba(128, 177, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(173, 181, 255, 0.03) 0%, transparent 50%);
  z-index: 0;
}

/* 3D登录卡片核心样式 */
.login-container {
  position: relative;
  z-index: 1;
  width: 360px;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08),
              0 10px 20px rgba(0, 0, 0, 0.05);
  transform-style: preserve-3d;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  perspective: 1000px;
}

/* 3D悬浮效果 */
.login-container:hover {

  transform: translateY(-10px) rotateX(1deg) rotateY(1deg); /* 降低旋转角度 */
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12),
              0 15px 30px rgba(0, 0, 0, 0.1);
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(45deg, #64b5f6, #7e57c2);
  transform: translateZ(-10px);
  box-shadow: 0 0 30px rgba(100, 181, 246, 0.3);
  opacity: 0.8;
  transition: opacity 0.3s;
}

.login-container:hover::before {
  opacity: 1;
}

/* 标题样式 */
.login-title {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.title-text {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  position: relative;
  z-index: 1;
  background: linear-gradient(90deg, #64b5f6, #7e57c2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.title-line {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #64b5f6, #7e57c2);
  border-radius: 2px;
  margin: 10px auto 0;
  transform: translateZ(2px);
}

/* 表单样式 */
.login-form {
  position: relative;
  z-index: 2;
}

.form-item {
  margin-bottom: 25px;
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  transition: color 0.3s;
}

.form-label i {
  margin-right: 8px;
  color: #64b5f6;
  font-size: 16px;
}

/* 输入框3D容器 */
.input-wrapper {
  position: relative;
  transform-style: preserve-3d;
}

.form-input {
  width: 90%;
  padding: 12px 15px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateZ(2px);
  background: rgba(255, 255, 255, 0.8);
}

.form-input:focus {
  outline: none;
  border-color: #64b5f6;
  box-shadow: 0 0 0 4px rgba(100, 181, 246, 0.15),
              0 5px 15px rgba(100, 181, 246, 0.1);
  transform: translateZ(4px) scale(1.02);
}

.form-input::placeholder {
  color: #bbb;
  transition: color 0.3s;
}

.form-input:focus::placeholder {
  color: #888;
}

/* 错误提示 */
.error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s;
}

.error.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-3px); }
  40%, 60% { transform: translateX(3px); }
}

/* 全局错误提示 */
.global-error {
  color: #f56c6c;
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background: rgba(245, 108, 108, 0.1);
  border-radius: 8px;
  border-left: 4px solid #f56c6c;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.global-error.show {
  opacity: 1;
  transform: translateY(0);
}

.global-error i {
  margin-right: 8px;
  font-size: 14px;
}

/* 登录按钮 */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #64b5f6 0%, #7e57c2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateZ(2px);
  box-shadow: 0 4px 15px rgba(100, 181, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:disabled {
  background: linear-gradient(90deg, #a0cfff 0%, #b39ddb 100%);
  cursor: not-allowed;
  transform: translateZ(1px);
  box-shadow: 0 2px 10px rgba(100, 181, 246, 0.1);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #42a5f5 0%, #673ab7 100%);
  transform: translateZ(4px) scale(1.02);
  box-shadow: 0 6px 20px rgba(100, 181, 246, 0.4);
}

.loading i {
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #666;
  position: relative;
  z-index: 2;
}

.register-btn {
  color: #64b5f6;
  text-decoration: none;
  margin-left: 4px;
  font-weight: 500;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
}

.register-btn:hover {
  color: #42a5f5;
  text-decoration: none;
  transform: translateX(3px);
}

.register-btn i {
  margin-left: 4px;
  font-size: 12px;
  transition: transform 0.3s;
}

.register-btn:hover i {
  transform: translateX(2px);
}

/* 图标样式（可替换为Font Awesome或自定义图标） */
.icon-user::before { content: '👤'; }
.icon-lock::before { content: '🔒'; }
.icon-error::before { content: '❌'; }
.icon-loading::before { content: '🔄'; }
.icon-arrow-right::before { content: '→'; }

/* 响应式适配 */
@media (max-width: 480px) {
  .login-container {
    width: 100%;
    padding: 30px 20px;
  }

  .form-input {
    padding: 10px 10px;
    font-size: 15px;
  }

  .submit-btn {
    padding: 12px;
    font-size: 15px;
  }
}
</style>