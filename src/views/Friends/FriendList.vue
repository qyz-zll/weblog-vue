<template>
  <div class="wechat-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="avatar-container">
        <el-avatar :src="userAvatar" size="small" class="user-avatar" />
      </div>
      <div class="nav-menu">
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
      </div>
      <div class="nav-item footer-nav">
        <el-icon class="nav-icon"><Menu /></el-icon>
        <span>菜单</span>
      </div>
    </div>

    <!-- 右侧主内容区 -->
    <div class="main-content">
      <div class="header">
        <div class="search-bar">
          <el-input placeholder="搜索" prefix-icon="Search" class="search-input" />
        </div>
        <div class="action-buttons">
          <el-button type="text" icon="Plus" class="add-btn" @click="goToSendRequest" />
        </div>
      </div>

      <!-- 好友列表 -->
      <div class="friend-list" v-loading="isLoading">
        <!-- 错误状态 -->
        <div class="empty-state error-state" v-if="isError">
          <el-icon class="empty-icon"><WarningFilled /></el-icon>
          <p class="empty-text">加载好友列表失败</p>
          <p class="error-desc">{{ errorDesc }}</p>
          <p class="error-desc small">接口地址：{{ apiUrl }}</p>
          <el-button type="primary" size="small" @click="loadFriendList()">刷新重试</el-button>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="!isLoading && !isError && friendList.length === 0">
          <el-icon class="empty-icon"><User /></el-icon>
          <p class="empty-text">暂无好友，快去添加吧～</p>
          <el-button type="primary" size="small" @click="goToSendRequest()">添加好友</el-button>
        </div>

        <!-- 好友列表 -->
        <div v-if="!isLoading && !isError && friendList.length > 0">
          <div
            v-for="item in friendList"
            :key="item.friendId"
            class="friend-item"
            @click="handleItemClick(item)"
          >
            <el-avatar :src="item.avatar || defaultAvatar" size="small" class="friend-avatar" />
            <div class="friend-info">
              <div class="name-time">
                <h4 class="friend-name">{{ item.friend_info.username || '未知用户' }}</h4>
                <span class="friend-time">{{ formatTime(item.createdAt) || '暂无时间' }}</span>
              </div>
              <el-badge
                v-if="item.unreadCount"
                :value="item.unreadCount"
                class="unread-badge"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElAvatar, ElButton, ElIcon, ElInput, ElBadge } from 'element-plus';
// Element Plus 图标（Vue3 按需导入）
import {
  ChatDotRound, User, Collection, PictureFilled, Grid,
  Message, Service, GameControllerFilled, Menu,
  WarningFilled
} from '@element-plus/icons-vue';
import request from '@/utils/request';

// 响应式状态
const friendList = ref([]);
const isLoading = ref(true);
const isError = ref(false);
const errorDesc = ref('');
const apiUrl = ref('');
const userAvatar = ref(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).avatar || '' : '');
const defaultAvatar = 'http://127.0.0.1:8000/media/avatars/default.png';
const currentUserId = ref(localStorage.getItem('userId') || ''); // 从登录页存储的 userId 获取
const router = useRouter();

// 加载好友列表（适配后端 Friend 模型）
const loadFriendList = async () => {
  isLoading.value = true;
  isError.value = false;
  errorDesc.value = '';
  friendList.value = [];

  // 后端接口地址（与 urls.py 配置一致）
  const backendApiUrl = '/chat/friends/';
  apiUrl.value = backendApiUrl;
  console.log('===== 开始请求好友列表 =====');
  console.log('请求地址：', backendApiUrl);
  console.log('当前登录用户ID：', currentUserId.value);

  try {
    // 发起请求（携带 JWT Token）
    const res = await request({
      url: backendApiUrl,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
      }
    });

    // 打印后端响应
    console.log('接口响应成功！');
    console.log('原始数据：', res);
    console.log('响应类型：', Array.isArray(res) ? '数组（正确）' : typeof res);

    // 格式兼容：处理数组/空对象/其他
    let friendData = [];
    if (Array.isArray(res)) {
      friendData = res;
    } else if (typeof res === 'object' && res !== null) {
      friendData = Object.keys(res).length === 0 ? [] : (res.results || res.data || []);
      friendData = Array.isArray(friendData) ? friendData : [];
    } else {
      friendData = [];
    }
    console.log('解析后数据长度：', friendData.length);

    // 核心：提取好友信息（区分 user 和 friend 字段）
    friendList.value = friendData.map(item => {
      const isCurrentUserInUser = item.user?.id?.toString() === currentUserId.value.toString();
      const friendInfo = isCurrentUserInUser ? item.friend : item.user;

      return {
        friendId: friendInfo?.id || `temp_${Date.now()}`,
        username: friendInfo?.username || '未知用户',
        avatar: friendInfo?.avatar || defaultAvatar,
        createdAt: item.created_at || '',
        unreadCount: 0
      };
    });

    // 去重（避免双向好友重复）
    friendList.value = Array.from(
      new Map(friendList.value.map(f => [f.friendId, f])).values()
    );

    // 提示
    if (friendList.value.length === 0) {
      ElMessage.info('暂无双向通过的好友～');
    } else {
      ElMessage.success(`加载成功，共${friendList.value.length}位好友`);
    }

  } catch (error) {
    console.error('请求失败：', error);
    isError.value = true;
    if (!error.response) {
      errorDesc.value = '网络错误：无法连接后端';
    } else if (error.response.status === 401) {
      errorDesc.value = '未登录：请先登录';
      setTimeout(() => router.push('/login'), 1500);
    } else if (error.response.status === 404) {
      errorDesc.value = `接口不存在：${backendApiUrl}`;
    } else if (error.response.status === 500) {
      errorDesc.value = '后端错误：请查看后端日志';
    } else {
      errorDesc.value = `${error.response.status}错误：${error.message}`;
    }
    ElMessage.error('加载失败');
  } finally {
    isLoading.value = false;
  }
};

// 页面挂载时加载
onMounted(() => {
  // 若未找到 userId，尝试从 userInfo 提取
  if (!currentUserId.value) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo?.id) {
        currentUserId.value = userInfo.id.toString();
        localStorage.setItem('userId', currentUserId.value);
      }
    } catch (e) {
      console.error('提取 userId 失败：', e);
    }
  }
  loadFriendList();
});

// 跳转添加好友
const goToSendRequest = () => {
  router.push('/friend-request/send');
};

// 点击好友（跳转聊天页）
const handleItemClick = (item) => {
  ElMessage.info(`进入与${item.username}的聊天`);
  router.push(`/chat/${item.friendId}`);
};

// 时间格式化
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    const date = new Date(timeStr.replace('Z', '+00:00'));
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today - targetDay) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return `昨天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  } catch (err) {
    console.error('时间格式化失败：', err);
    return '';
  }
};
</script>

<style scoped>
.wechat-container {
  display: flex;
  height: 100vh;
  background-color: #f7f7f7;
  overflow: hidden;
}

/* 左侧导航栏 */
.sidebar {
  width: 60px;
  background-color: #272727;
  color: #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

.avatar-container {
  margin-bottom: 20px;
}

.user-avatar {
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #444;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  margin-bottom: 10px;
}

/* 右侧主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #eee;
}

.search-bar {
  flex: 1;
  max-width: 300px;
}

.search-input {
  border-radius: 20px;
  background-color: #e5e5e5;
  border: none;
  height: 34px;
  padding: 0 15px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.add-btn {
  color: #07c160;
  font-size: 20px;
}

/* 好友列表区域 */
.friend-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

/* 空状态和错误状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #666;
}

.error-state .empty-icon {
  color: #f56c6c;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #ccc;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 10px;
}

.error-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
  text-align: center;
  max-width: 350px;
  line-height: 1.5;
}

.error-desc.small {
  font-size: 11px;
  color: #bbb;
  margin-bottom: 25px;
}

/* 好友条目 */
.friend-list > div {
  padding: 0 15px;
}

.friend-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.friend-item:hover {
  background-color: #f7f7f7;
}

.friend-avatar {
  border-radius: 50%;
  margin-right: 12px;
  border: 1px solid #eee;
}

.friend-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2px 0;
}

.name-time {
  display: flex;
  flex-direction: column;
}

.friend-name {
  font-size: 16px;
  color: #333;
  margin: 0 0 2px 0;
  font-weight: 500;
}

.friend-time {
  font-size: 12px;
  color: #999;
  margin: 0;
  padding-top: 2px;
}

/* 未读徽章 */
.unread-badge {
  background-color: #f56c6c;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  margin-top: 2px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .sidebar {
    width: 50px;
  }

  .nav-item {
    padding: 12px 0;
    font-size: 11px;
  }

  .nav-icon {
    font-size: 18px;
  }

  .header {
    padding: 10px 15px;
  }

  .search-bar {
    max-width: 200px;
  }
}
</style>