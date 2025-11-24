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

          <!-- 好友信息（名称+最后消息） -->
          <div class="friend-info">
            <div class="friend-name">{{ item.friend_info.username }}</div>
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
import { ref, onMounted } from 'vue';
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
const router = useRouter();

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
    } else {
      ElMessage.success(`加载成功，共${friendList.value.length}位好友`);
    }
  } catch (error) {
    isError.value = true;
    errorDesc.value = error.message || '加载好友列表失败';
    ElMessage.error(errorDesc.value);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadFriendList();
});
// 处理时间显示问题
const formatTimeAdd8h = (time) => {
  if (!time) return '';
  const date = new Date(time);
  if (isNaN(date.getTime())) return ''; // 处理无效时间

  // 核心：加8小时
  date.setHours(date.getHours() + 8);

  // 格式化（补零统一格式）
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

// 跳转添加好友页面
const goToSendRequest = () => {
  router.push('/send-friend-request');
};
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

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: #ccc;
}

.online-status.online {
  background-color: #4cd964;
}

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