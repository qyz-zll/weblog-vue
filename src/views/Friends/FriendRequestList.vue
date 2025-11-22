<template>
  <div class="request-list-container">
    <!-- 复用全局导航栏 -->
    <Navbar />

    <!-- 页面主体 -->
    <main class="content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">好友申请</h2>
        <span class="request-count" v-if="requestList.length > 0">
          共收到 {{ requestList.length }} 条申请
        </span>
      </div>

      <!-- 申请列表卡片 -->
      <el-card class="request-card" shadow="hover">
        <el-table
          :data="requestList"
          border
          style="width: 100%;"
          :header-cell-style="{ background: '#f8f9ff', color: '#333' }"
        >
          <!-- 申请人信息 -->
          <el-table-column label="申请人" align="center">
            <template #default="scope">
              <div class="applicant-info">
                <el-avatar :src="scope.row.applicant_info.avatar" size="56"></el-avatar>
                <div class="applicant-info-detail">
                  <h4>{{ scope.row.applicant_info.username }}</h4>
                  <p class="apply-time">申请时间：{{ formatTime(scope.row.created_at) }}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 验证信息 -->
          <el-table-column label="验证信息" min-width="200">
            <template #default="scope">
              <p class="verify-msg">{{ scope.row.verify_msg || '无验证信息' }}</p>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" width="160" align="center">
            <template #default="scope">
              <el-button type="success" size="small" @click="handleAgree(scope.row.id)" :loading="scope.row.loading">
                <el-icon><Check /></el-icon> 同意
              </el-button>
              <el-button type="danger" size="small" @click="handleReject(scope.row.id)" :loading="scope.row.loading">
                <el-icon><Close /></el-icon> 拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 空状态 -->
        <el-empty v-if="requestList.length === 0" description="暂无好友申请" style="padding: 60px 0;"></el-empty>
      </el-card>
    </main>

    <!-- 底部装饰 -->
    <footer class="home-footer">
      <div class="footer-gradient"></div>
      <p class="footer-text">Weblog 博客平台 © 2025 | 记录生活，分享知识</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Check, Close } from '@element-plus/icons-vue';

// 导入组件和API
import { getReceivedFriendRequests, handleFriendRequest } from '@/api/friend';

// const router = useRouter();
const requestList = ref([]); // 好友申请列表

// 加载申请列表
const loadRequestList = async () => {
  try {
    const res = await getReceivedFriendRequests();
    // 为每条申请添加 loading 状态（防止重复点击）
    requestList.value = (res || []).map(item => ({ ...item, loading: false }));
  } catch (error) {
    console.error('加载申请列表失败：', error);
    ElMessage.error('加载申请失败：' + (error.message || '网络错误'));
  }
};

// 页面挂载时加载
onMounted(() => {
  loadRequestList();
  // 滚动监听
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.el-menu-demo');
    if (window.scrollY > 20) {
      navbar?.classList.add('navbar-scrolled');
    } else {
      navbar?.classList.remove('navbar-scrolled');
    }
  });
});

// 时间格式化（复用首页逻辑）
const formatTime = (timeStr) => {
  if (!timeStr) return '暂无数据';
  let date = new Date(timeStr);
  if (isNaN(date.getTime())) {
    date = new Date(timeStr.replace(/-/g, '/'));
  }
  return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

// 同意申请
const handleAgree = async (requestId) => {
  const requestItem = requestList.value.find(item => item.id === requestId);
  if (!requestItem) return;

  requestItem.loading = true;
  try {
    await handleFriendRequest(requestId, true);
    ElMessage.success('已同意好友申请');
    loadRequestList(); // 刷新列表
  } catch (error) {
    ElMessage.error('操作失败：' + (error.message || '网络错误'));
    requestItem.loading = false;
  }
};

// 拒绝申请
const handleReject = async (requestId) => {
  const requestItem = requestList.value.find(item => item.id === requestId);
  if (!requestItem) return;

  requestItem.loading = true;
  try {
    await handleFriendRequest(requestId, false);
    ElMessage.success('已拒绝好友申请');
    loadRequestList(); // 刷新列表
  } catch (error) {
    ElMessage.error('操作失败：' + (error.message || '网络错误'));
    requestItem.loading = false;
  }
};
</script>

<style scoped>
/* 继承首页全局样式 */
.request-list-container {
  position: relative;
  min-height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 5;
  width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.request-count {
  font-size: 14px;
  color: #666;
}

/* 申请列表卡片 */
.request-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 申请人信息样式 */
.applicant-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.applicant-info-detail h4 {
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
}

.apply-time {
  font-size: 12px;
  color: #666;
}

/* 验证信息样式 */
.verify-msg {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
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

/* 响应式适配 */
@media (max-width: 1000px) {
  .content {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .applicant-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>