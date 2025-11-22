<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <!-- 用户名 -->
      <div class="form-item">
        <label>用户名：</label>
        <input
          v-model="form.username"
          type="text"
          required
          placeholder="请输入用户名"
          @blur="validateUsername"
        >
        <span class="error" v-if="errors.username">{{ errors.username }}</span>
      </div>

      <!-- 密码 -->
      <div class="form-item">
        <label>密码：</label>
        <input
          v-model="form.password"
          type="password"
          required
          placeholder="请输入密码（至少6位）"
          @blur="validatePassword"
        >
        <span class="error" v-if="errors.password">{{ errors.password }}</span>
      </div>

      <!-- 全局错误提示 -->
      <div class="global-error" v-if="globalError">{{ globalError }}</div>

      <!-- 登录按钮 -->
      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        <span v-if="isSubmitting">登录中...</span>
        <span v-else>立即登录</span>
      </button>

      <!-- 跳转注册 -->
      <div class="register-link">
        没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </form>
  </div>
</template>

<!-- 第一个 script：仅定义组件名（解决多单词报错，兼容所有 Vue3 版本） -->
<script>
// 组件名改为多单词（UserLogin），彻底解决 ESLint 报错
export default {
  name: 'UserLogin'
};
</script>

<!-- 第二个 script：业务逻辑（script setup 语法） -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login, getUserInfo } from '@/api/user';

// 响应式状态（无任何未定义 API）
const form = ref({
  username: '',
  password: ''
});
const errors = ref({});
const globalError = ref('');
const isSubmitting = ref(false);
const router = useRouter();

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

// 提交登录（无任何新增错误）
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
    console.log('用户信息：', userInfoRes);

    // 提取用户ID（适配后端返回结构）
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
/* 样式完全不变，确保无样式错误 */
.login-container {
  width: 400px;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}
.form-item {
  margin-bottom: 20px;
}
.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}
.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
.form-item input:focus {
  outline: none;
  border-color: #409eff;
}
.error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
.global-error {
  color: #f56c6c;
  text-align: center;
  margin: 10px 0;
  padding: 8px;
  background: #fef0f0;
  border-radius: 4px;
}
.submit-btn {
  width: 100%;
  padding: 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}
.submit-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
.submit-btn:hover:not(:disabled) {
  background: #3086d6;
}
.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
.register-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 4px;
}
.register-link a:hover {
  text-decoration: underline;
}
</style>