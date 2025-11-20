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

<script>
import { login,getUserInfo} from '@/api/user';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      errors: {},  // 字段错误
      globalError: '',  // 全局错误
      isSubmitting: false  // 提交状态
    };
  },
  methods: {
    // 前端验证：用户名
    validateUsername() {
      this.errors.username = '';
      if (!this.form.username.trim()) {
        this.errors.username = '用户名不能为空';
      } else if (this.form.username.length < 3 || this.form.username.length > 20) {
        this.errors.username = '用户名长度需在3-20位之间';
      }
    },

    // 前端验证：密码
    validatePassword() {
      this.errors.password = '';
      if (!this.form.password.trim()) {
        this.errors.password = '密码不能为空';
      } else if (this.form.password.length < 6) {
        this.errors.password = '密码长度至少6位';
      }
    },

    // 提交登录
    async handleLogin() {
      // 1. 前端双重验证
      this.validateUsername();
      this.validatePassword();
      if (Object.values(this.errors).some(msg => msg)) return;

      // 2. 提交数据
      this.isSubmitting = true;
      this.globalError = '';
      try {
        // 调用登录接口
        const res = await login(this.form);
        // 3. 存储 Token 和用户信息
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('refreshToken', res.data.refresh);

        const userInfoRes = await getUserInfo();
        console.log(userInfoRes,"6666666666666666666666666666666666666666666666666用户信息")
        console.log(JSON.stringify(userInfoRes),'用户信息');
        localStorage.setItem('userInfo', JSON.stringify(userInfoRes));

        // 4. 跳转首页
        this.$message.success('登录成功！');
        this.$router.push('/');

      } catch (error) {
        // 5. 处理错误（如用户名密码错误）
        this.globalError = error.message;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
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