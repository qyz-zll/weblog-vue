<template>
  <div class="wechat-layout">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="nav-item active">
        <el-icon class="nav-icon"><ChatDotRound /></el-icon>
        <span>聊天</span>
      </div>
      <div class="nav-item">
        <el-icon class="nav-icon"><User /></el-icon>
        <span>通讯录</span>
      </div>
      <div class="nav-item" @click="goToFriendRequestsPage()">
        <el-icon class="nav-icon"><Message /></el-icon>
        <span>好友申请</span>
        <!-- 未读申请红点（保留） -->
        <span class="badge" v-if="pendingRequestCount > 0">{{ pendingRequestCount }}</span>
      </div>
      <div class="nav-item">
        <el-icon class="nav-icon"><Collection /></el-icon>
        <span>收藏</span>
      </div>
      <div class="nav-item">
        <el-icon class="nav-icon"><PictureFilled /></el-icon>
        <span>相册</span>
      </div>
      <div class="nav-item">
        <el-icon class="nav-icon"><Grid /></el-icon>
        <span>小程序</span>
      </div>
      <div class="nav-item">
        <el-icon class="nav-icon"><Message /></el-icon>
        <span>消息通知</span>
      </div>
      <div class="nav-item">
        <el-icon class="nav-icon"><Service /></el-icon>
        <span>服务</span>
      </div>
      <div class="nav-item">
        <el-icon class="nav-icon"><GameControllerFilled /></el-icon>
        <span>游戏</span>
      </div>
      <div class="nav-item footer-nav">
        <el-icon class="nav-icon"><Menu /></el-icon>
        <span>菜单</span>
      </div>
    </div>

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <div class="friend-list-header">
        <h3 class="friend-list-title">我的好友</h3>
      </div>

      <!-- 加载/错误/空状态 -->
      <div class="loading" v-if="isLoading">加载中...</div>
      <div class="error-state" v-if="!isLoading && isError">
        <el-icon class="error-icon"><WarningFilled /></el-icon>
        <p class="error-text">{{ errorDesc }}</p>
        <el-button type="primary" size="small" @click="loadFriendList()">刷新重试</el-button>
      </div>
      <div class="empty-state" v-if="!isLoading && !isError && friendList.length === 0">
        <el-icon class="empty-icon"><User /></el-icon>
        <p class="empty-text">暂无好友，快去添加吧～</p>
        <el-button type="primary" size="small" @click="goToSendRequest()">添加好友</el-button>
      </div>

      <!-- 好友列表（仿微信样式） -->
      <div class="friend-list" v-if="!isLoading && !isError && friendList.length > 0">
        <div
          class="friend-item"
          v-for="item in friendList"
          :key="item.friend_info.id"
          @click="handleItemClick(item.friend_info.id, item.friend_info.username)"
        >
          <!-- 头像+在线状态 -->
          <div class="friend-avatar-container">
            <el-avatar
              :src="item.friend_info.avatar"
              size="small"
              class="friend-avatar"
            >
              <span class="avatar-placeholder">{{ item.friend_info.username[0] }}</span>
            </el-avatar>
            <span class="online-status" :class="{ 'online': item.friend_info.is_online }"></span>
          </div>

          <!-- 好友信息（名称+在线状态/最后活跃+最后消息） -->
          <div class="friend-info">
            <div class="friend-name">
              {{ item.friend_info.username }}
              <span class="online-tag" v-if="item.friend_info.is_online">在线</span>
              <span class="last-active-tag" v-else>
                最后活跃：{{ formatLastActive(item.friend_info.last_active) }}
              </span>
            </div>
            <div class="last-message">{{ item.last_message || '暂无聊天记录' }}</div>
          </div>

          <!-- 最后消息时间 -->
          <div class="last-message-time">{{ formatTimeAdd8h(item.last_message_time) || '' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElIcon, ElAvatar, ElButton } from 'element-plus';
import {
  ChatDotRound, User, Collection, PictureFilled, Grid,
  Message, Service, GameControllerFilled, Menu, WarningFilled
} from '@element-plus/icons-vue';
import request from '@/utils/request';

// 响应式状态
const friendList = ref([]);
const isLoading = ref(true);
const isError = ref(false);
const errorDesc = ref('');
const pendingRequestCount = ref(0);
const router = useRouter();
let timer = null;
let heartbeatTimer = null;

// 加载好友列表
const loadFriendList = async () => {
  isLoading.value = true;
  isError.value = false;
  try {
    const res = await request({
      url: '/chat/friends/',
      method: 'GET'
    });
    friendList.value = res.data || [];
    if (friendList.value.length === 0) {
      ElMessage.info('暂无好友，快去添加吧～');
    }
  } catch (error) {
    isError.value = true;
    errorDesc.value = error.message || '加载好友列表失败';
    ElMessage.error(errorDesc.value);
  } finally {
    isLoading.value = false;
  }
};

// 加载未读申请数
const loadPendingRequestCount = async () => {
  try {
    const res = await request({
      url: '/chat/pending-request-count/',
      method: 'GET'
    });
    pendingRequestCount.value = res.data.count || 0;
  } catch (error) {
    console.error('加载未读申请数失败：', error);
  }
};

// 发送心跳请求保持在线
const sendHeartbeat = async () => {
  try {
    await request({
      url: '/chat/heartbeat/',
      method: 'POST'
    });
  } catch (error) {
    console.error('心跳请求失败：', error);
  }
};

// 格式化最后活跃时间
const formatLastActive = (time) => {
  if (!time) return '未知';
  const date = new Date(time);
  if (isNaN(date.getTime())) return '未知';

  // 时区处理：加8小时
  date.setHours(date.getHours() + 8);

  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// 处理时间显示（加8小时）
const formatTimeAdd8h = (time) => {
  if (!time) return '';
  const date = new Date(time + 'Z');
  if (isNaN(date.getTime())) return '';

  const utcHours = date.getUTCHours();
  date.setHours(utcHours + 8);

  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// 点击好友跳转聊天页
const handleItemClick = (friendId, friendName) => {
  ElMessage.info(`进入与${friendName}的聊天`);
  router.push({
    path: `/chat/${friendId}`,
    query: { friendName }
  });
};

// 跳转好友申请页面
const goToFriendRequestsPage = () => {
  router.push('/friend-request/list');
};

// 跳转添加好友页面
const goToSendRequest = () => {
  router.push('/send-friend-request');
};

// 页面挂载时初始化
onMounted(() => {
  loadFriendList();
  loadPendingRequestCount();
  sendHeartbeat();

  // 定时刷新数据（30秒一次）
  timer = setInterval(() => {
    loadFriendList();
    loadPendingRequestCount();
  }, 30 * 1000);

  // 定时发送心跳（30秒一次）
  heartbeatTimer = setInterval(sendHeartbeat, 30 * 1000);
});

// 页面卸载时清除定时器
onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (heartbeatTimer) clearInterval(heartbeatTimer);
});
</script>

<style scoped>
/* 整体布局：左侧导航 + 右侧内容 */
.wechat-layout {
  display: flex;
  height: 100vh;
  background-color: #f7f7f7;
}

/* 左侧导航栏（仿微信深色侧边栏） */
.sidebar {
  width: 60px;
  background-color: #272727;
  color: #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.nav-item {
  width: 100%;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  position: relative;
}

.nav-item.active, .nav-item:hover {
  background-color: #3a3a3a;
  color: #fff;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.footer-nav {
  margin-top: auto;
  margin-bottom: 20px;
}

/* 未读申请红点 */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 12px;
  border-radius: 8px;
  background-color: #f56c6c;
  color: #fff;
}

/* 右侧主内容区 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.friend-list-header {
  margin-bottom: 20px;
}

.friend-list-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 好友项样式（仿微信列表项） */
.friend-list {
  display: flex;
  flex-direction: column;
  gap: 0; /* 去掉间距，用分隔线替代 */
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  background-color: #fff;
  border-bottom: 1px solid #eee; /* 分隔线 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.friend-item:hover {
  background-color: #f5f7fa;
}

.friend-avatar-container {
  position: relative;
  margin-right: 16px;
  margin-left: 10px;
}

.friend-avatar {
  width: 48px;
  height: 48px;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 20px;
  color: #fff;
}

/* 在线状态圆点 */
.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: #ccc;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
}

.online-status.online {
  background-color: #4cd964;
}

/* 好友信息区域 */
.friend-info {
  flex: 1;
  overflow: hidden;
}

.friend-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

/* 在线标签 */
.online-tag {
  font-size: 12px;
  color: #4cd964;
  margin-left: 8px;
  font-weight: normal;
}

/* 最后活跃标签 */
.last-active-tag {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  font-weight: normal;
}

.last-message {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.last-message-time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  margin-right: 10px;
}

/* 状态样式 */
.loading, .empty-state, .error-state {
  text-align: center;
  padding: 50px 20px;
  color: #666;
}

.empty-icon, .error-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #999;
}

.empty-text, .error-text {
  margin-bottom: 20px;
  font-size: 14px;
}
</style>