<template>
  <div class="send-request-container">
    <main class="content">
      <div class="page-header">
        <h2 class="page-title">发送好友申请</h2>
      </div>

      <el-card class="send-card" shadow="hover">
        <el-form :model="form" :rules="requestRules" ref="formRef" label-width="100px">
          <el-form-item label="被申请人ID" prop="friendId">
            <el-input
              v-model.number="form.friendId"
              placeholder="请输入对方的用户ID"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证信息" prop="verifyMsg">
            <el-input
              v-model="form.verifyMsg"
              placeholder="请输入验证信息（可选）"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSend" :loading="isLoading">发送申请</el-button>
            <el-button type="text" @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </main>

    <footer class="home-footer">
      <div class="footer-gradient"></div>
      <p class="footer-text">Weblog 博客平台 © 2025 | 记录生活，分享知识</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElCard, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { sendFriendRequest } from '@/api/friend';

const router = useRouter();
const formRef = ref(null); // 表单引用
const isLoading = ref(false); // 加载状态

// 表单数据
const form = ref({
  friendId: '', // 被申请人ID
  verifyMsg: '' // 验证信息（可选）
});

// 从本地存储获取当前登录用户信息（替代 store）
const currentUser = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'));
const currentUserId = currentUser.value?.id; // 当前用户ID

// 表单验证规则（修复：用本地存储的用户ID替代 store）
const requestRules = ref({
  friendId: [
    { required: true, message: '请输入被申请人ID', trigger: 'blur' },
    { type: 'number', message: 'ID必须是数字', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 容错：如果当前用户ID不存在（未登录/存储异常），直接通过校验（路由守卫已限制登录）
        if (!currentUserId) {
          callback();
          return;
        }
        // 不能添加自己（用本地存储的ID对比）
        if (value && value.toString() === currentUserId.toString()) {
          callback(new Error('不能添加自己为好友'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// 发送好友申请
const handleSend = async () => {
  try {
    // 表单校验
    await formRef.value.validate();
    isLoading.value = true;

    // 调用API发送申请（参数按后端要求调整）
    await sendFriendRequest({
      friend_id: form.value.friendId,
      verify_msg: form.value.verifyMsg
    });

    ElMessage.success('好友申请发送成功！');
    router.push('/friends'); // 发送成功后跳转到好友列表
  } catch (error) {
    // 表单校验失败或API错误
    if (error.message !== 'Validation failed') {
      ElMessage.error('发送失败：' + (error.message || '网络错误'));
    }
  } finally {
    isLoading.value = false;
  }
};

// 取消：返回好友列表
const goBack = () => {
  router.back(); // 或 router.push('/friends')
};
</script>

<style scoped>
.send-request-container {
  position: relative;
  min-height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 5;
  width: 600px;
  margin: 30px auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  color: #333;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.send-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.el-form-item {
  margin-bottom: 20px;
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

@media (max-width: 768px) {
  .content {
    width: 100%;
    padding: 15px;
  }

  .send-card {
    padding: 20px;
  }
}
</style>