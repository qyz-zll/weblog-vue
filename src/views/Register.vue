<template>
  <div class="register-container">
    <h2>用户注册</h2>
    <form @submit.prevent="handleRegister" class="register-form">
      <!-- 用户名 -->
      <div class="form-item">
        <label>用户名：</label>
        <input
          v-model="form.username"
          type="text"
          required
          placeholder="请输入3-20位用户名"
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
          placeholder="请输入至少6位密码"
          @blur="validatePassword"
        >
        <span class="error" v-if="errors.password">{{ errors.password }}</span>
      </div>

      <!-- 确认密码 -->
      <div class="form-item">
        <label>确认密码：</label>
        <input
          v-model="form.password2"
          type="password"
          required
          placeholder="请再次输入密码"
          @blur="validatePassword2"
        >
        <span class="error" v-if="errors.password2">{{ errors.password2 }}</span>
      </div>

      <!-- 邮箱 -->
      <div class="form-item">
        <label>邮箱：</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="请输入有效邮箱"
          @blur="validateEmail"
        >
        <span class="error" v-if="errors.email">{{ errors.email }}</span>
      </div>

      <!-- 个人简介（可选） -->
      <div class="form-item">
        <label>个人简介（可选）：</label>
        <textarea
          v-model="form.bio"
          placeholder="一句话介绍自己（最多500字）"
          rows="3"
          maxlength="500"
        ></textarea>
      </div>

      <!-- 全局错误提示 -->
      <div class="global-error" v-if="globalError">{{ globalError }}</div>

      <!-- 注册按钮 -->
      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        <span v-if="isSubmitting">注册中...</span>
        <span v-else>立即注册</span>
      </button>

      <!-- 跳转登录 -->
      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { register } from '@/api/user';
import {ElMessageBox} from "element-plus"
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        password: '',
        password2: '',
        email: '',
        bio: ''
      },
      errors: {},  // 字段错误
      globalError: '',  // 全局错误
      isSubmitting: false  // 提交状态
    };
  },
  methods: {
    // 验证用户名
    validateUsername() {
      this.errors.username = '';
      const val = this.form.username.trim();
      if (!val) {
        this.errors.username = '用户名不能为空';
      } else if (val.length < 3 || val.length > 20) {
        this.errors.username = '用户名长度需在3-20位之间';
      }
    },

    // 验证密码
    validatePassword() {
      this.errors.password = '';
      const val = this.form.password.trim();
      if (!val) {
        this.errors.password = '密码不能为空';
      } else if (val.length < 6) {
        this.errors.password = '密码长度至少6位';
      }
    },

    // 验证确认密码
    validatePassword2() {
      this.errors.password2 = '';
      const val = this.form.password2.trim();
      if (!val) {
        this.errors.password2 = '请确认密码';
      } else if (val !== this.form.password.trim()) {
        this.errors.password2 = '两次密码输入不一致';
      }
    },

    // 验证邮箱格式
    validateEmail() {
      this.errors.email = '';
      const val = this.form.email.trim();
      const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!val) {
        this.errors.email = '邮箱不能为空';
      } else if (!emailReg.test(val)) {
        this.errors.email = '邮箱格式不正确';
      }
    },

    // 提交注册
    async handleRegister() {
      // 1. 前端全量验证
      this.validateUsername();
      this.validatePassword();
      this.validatePassword2();
      this.validateEmail();
      if (Object.values(this.errors).some(msg => msg)) return;

      // 2. 提交数据
      this.isSubmitting = true;
      this.globalError = '';
      try {
        // 调用注册接口
        const res = await register(this.form);
        // 3. 存储 Token 和用户信息（自动登录）
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('refreshToken', res.data.refresh);
        localStorage.setItem('userInfo', JSON.stringify(res.data.user));
        // 4. 跳转首页
        this.$message.success('注册成功！已自动登录');
        this.$router.push('/login');
      } catch (error) {
        // 5. 处理后端错误（如用户名已占用）
        // this.globalError = error.message;
        const errorMsg = error.message || '操作失败，请重试';
        ElMessageBox.alert(
        errorMsg, // 弹窗内容
        '错误提示', // 弹窗标题
        {
        confirmButtonText: '确定',
            type: 'error' // 弹窗类型（错误色）
        }
       );
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  width: 400px;
  margin: 50px auto;
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
.form-item input, .form-item textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: none;
}
.form-item input:focus, .form-item textarea:focus {
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
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
.login-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 4px;
}
.login-link a:hover {
  text-decoration: underline;
}
</style>