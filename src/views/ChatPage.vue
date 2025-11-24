<template>
  <div class="chat-page">
    <!-- 顶部导航栏（仿微信，带返回按钮+好友信息） -->
    <div class="chat-header">
      <el-button type="text" @click="goBack" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="friend-header-info">
        <el-avatar :src="friendAvatar" size="small" class="header-avatar" />
        <div class="friend-header-detail">
          <span class="friend-header-name">{{ friendName }}</span>
          <span class="friend-header-status">在线</span> <!-- 可对接后端在线状态接口 -->
        </div>
      </div>
    </div>

    <!-- 聊天内容区域（消息列表） -->
    <div class="chat-content" ref="chatContentRef">
      <!-- 历史消息+实时消息列表 -->
      <div
        v-for="(msg, index) in messageList"
        :key="index + msg.send_time"
        :class="['message-item', msg.sender_id === currentUserId ? 'sent' : 'received']"
      >
        <!-- 头像（自己发送的在右侧，接收的在左侧） -->
        <el-avatar
          :src="msg.sender_id === currentUserId ? currentUserAvatar : friendAvatar"
          size="mini"
          class="message-avatar"
        />
        <!-- 消息气泡 -->
        <div class="message-bubble">
          <p class="message-content">{{ msg.content }}</p>
          <p class="message-time">{{ msg.send_time }}</p>
        </div>
      </div>
    </div>

    <!-- 底部输入框区域（仿微信） -->
    <div class="chat-input-area">
      <el-input
        v-model="inputContent"
        placeholder="输入消息..."
        @keyup.enter="sendMessage"
        class="message-input"
        :maxlength="500"
      />
      <el-button type="primary" @click="sendMessage" class="send-btn">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElIcon, ElAvatar, ElInput, ElButton } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import request from '@/utils/request'; // 导入你的请求工具

// 路由与基础参数
const route = useRoute();
const router = useRouter();
const friendId = route.params.friendId; // 好友ID（从路由获取）
const friendName = ref(route.query.friendName || '未知用户'); // 好友名称

// 响应式状态（实时聊天核心）
const inputContent = ref(''); // 输入框内容
const messageList = ref([]); // 消息列表（历史+实时）
const currentUserId = ref(''); // 当前登录用户ID
const currentUserAvatar = ref('http://127.0.0.1:8000/media/avatars/default.png'); // 当前用户头像
const friendAvatar = ref('http://127.0.0.1:8000/media/avatars/default.png'); // 好友头像
const chatContentRef = ref(null); // 聊天内容区域DOM（用于滚动到底部）
let websocket = null; // WebSocket实例

// 初始化聊天（页面加载时执行）
const initChat = async () => {
  try {
    await getCurrentUserInfo(); // 先获取当前用户信息
    await getFriendAvatar();    // 再获取好友信息
    await loadHistoryMessages();
    createWebSocket();
  } catch (error) {
    ElMessage.error('聊天初始化失败，请刷新重试');
    console.error('初始化错误：', error);
  }
};


const getCurrentUserInfo = async () => {
  try {
    const res = await request({
      url: '/userinfo/',
      method: 'GET'
    });
    // 接口返回格式：{ "code":200, "data": { "id":6, "avatar":"/media/..." } }
    const userData = res.data || {}; // 提取 data 字段里的用户数据
    const userId = userData.id;
    const userAvatar = userData.avatar;

    if (!userId) {
      throw new Error('用户信息缺少ID字段');
    }

    currentUserId.value = userId;
    currentUserAvatar.value = userAvatar || currentUserAvatar.value; // 有头像则用，否则用默认
  } catch (error) {
    ElMessage.error('获取用户信息失败，请重新登录');
    console.error('接口返回格式错误：', error.response?.data);
    router.push('/login');
    throw error;
  }
};

// 2. 获取好友头像（接口路径与后端匹配）
const getFriendAvatar = async () => {
  try {
    const res = await request({
      url: `/users/${friendId}/`, // 后端按ID查询好友信息的接口
      method: 'GET'
    });
    friendAvatar.value = res.avatar || friendAvatar.value;
    friendName.value = res.username || friendName.value;
  } catch (error) {
    console.warn('获取好友头像失败，使用默认头像');
  }
};
// 3. 加载历史消息（调用后端历史消息接口）
const loadHistoryMessages = async () => {
  try {
    const res = await request({
      url: `/user/messages/`, // 后端历史消息接口（已配置）
      method: 'GET',
      params: { friend_id: friendId } // 传递好友ID查询
    });
    messageList.value = res.data || [];
    // 滚动到最新消息
    scrollToBottom();
  } catch (error) {
    ElMessage.warning('历史消息加载失败');
    console.error('加载历史消息错误：', error);
  }
};

// 4. 建立WebSocket连接（实时通信核心）
const createWebSocket = () => {
  // 关闭已有连接（避免重复连接）
  if (websocket) {
    websocket.close();
    console.log('关闭已有WebSocket连接');
  }

  // 获取JWT Token（登录时存入本地存储，用于WebSocket认证）
  const token = localStorage.getItem('accessToken');
  if (!token) {
    ElMessage.error('未登录，无法聊天');
    router.push('/login');
    return;
  }

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = 'localhost'; // 后端地址（和前端同一主机，直接用 localhost）
  const wsPort = '8000'; // 后端 Daphne 启动的端口（必须和后端一致！）
  const wsPath = `/ws/chat/${friendId}/`; // 后端 WebSocket 路由路径（和 asgi.py 一致）
  const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}${wsPath}?token=${token}`; // 拼接完整地址
  console.log('最终WebSocket地址：', wsUrl)
  // 创建WebSocket实例
  websocket = new WebSocket(wsUrl);

  // 连接成功回调
  websocket.onopen = () => {
    console.log('WebSocket连接成功（好友ID：', friendId, '）');
    ElMessage.success('已连接，可实时聊天');
  };

  // 接收后端消息（实时消息）
  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'new_message') {
      // 新增消息到列表
      messageList.value.push(data.message);
      // 滚动到最新消息
      scrollToBottom();
    }
  };

  // 连接错误回调
  websocket.onerror = (error) => {
    console.error('WebSocket连接错误：', error);
    ElMessage.error('聊天连接异常');
  };

  // 连接关闭回调（自动重连）
  websocket.onclose = () => {
    console.log('WebSocket连接关闭');
    // 1秒后自动重连（仅当前页面有效）
    setTimeout(() => {
      if (router.currentRoute.path === `/chat/${friendId}`) {
        createWebSocket();
      }
    }, 1000);
  };
};

// 发送消息
const sendMessage = () => {
  const content = inputContent.value.trim();
  // 验证输入
  if (!content) {
    ElMessage.warning('请输入消息内容');
    return;
  }
  // 验证WebSocket连接
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    ElMessage.error('连接未建立，无法发送');
    return;
  }

  // 发送消息到后端
  websocket.send(JSON.stringify({ content }));
  // 清空输入框
  inputContent.value = '';
};

// 滚动到最新消息
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
    }
  });
};

// 返回好友列表页
const goBack = () => {
  router.push('/friends');
};

// 页面挂载时初始化
onMounted(() => {
  // 原有校验：无好友ID则返回
  if (!friendId) {
    ElMessage.error('聊天页缺少好友ID');
    router.push('/friends');
    return;
  }
  // 初始化聊天功能
  initChat();
});

// 页面卸载时关闭WebSocket
onUnmounted(() => {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
});
</script>

<style scoped>
/* 整体布局（占满屏幕） */
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7f7;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0; /* 取消原有padding，由子组件控制 */
}

/* 顶部导航栏（仿微信） */
.chat-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  z-index: 10;
}

.back-btn {
  color: #333;
  padding: 5px 0;
  margin-right: 12px;
}

.friend-header-info {
  display: flex;
  align-items: center;
}

.header-avatar {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}

.friend-header-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.friend-header-status {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 2px;
}

/* 聊天内容区域（消息列表） */
.chat-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f7f7f7;
}

/* 消息项（通用样式） */
.message-item {
  display: flex;
  margin-bottom: 16px;
  max-width: 75%; /* 消息最大宽度，避免过宽 */
}

/* 自己发送的消息（靠右） */
.message-item.sent {
  flex-direction: row-reverse;
  margin-left: auto;
}

/* 接收的消息（靠左） */
.message-item.received {
  flex-direction: row;
  margin-right: auto;
}

/* 消息头像 */
.message-avatar {
  margin: 0 8px;
}

/* 消息气泡（仿微信） */
.message-bubble {
  padding: 8px 12px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* 自己发送的消息气泡（绿色） */
.message-item.sent .message-bubble {
  background-color: #4cd964;
  color: #fff;
  border-top-right-radius: 4px;
}

/* 接收的消息气泡（白色） */
.message-item.received .message-bubble {
  background-color: #fff;
  color: #333;
  border-top-left-radius: 4px;
}

/* 消息内容 */
.message-content {
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.4;
}

/* 消息时间 */
.message-time {
  margin: 0;
  font-size: 11px;
  text-align: right;
}

/* 自己发送的消息时间（浅色） */
.message-item.sent .message-time {
  color: #eee;
}

/* 接收的消息时间（灰色） */
.message-item.received .message-time {
  color: #999;
}

/* 底部输入区域（仿微信） */
.chat-input-area {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

/* 输入框 */
.message-input {
  flex: 1;
  border-radius: 20px;
  padding: 8px 16px;
  border: 1px solid #eee;
  margin-right: 10px;
}

/* 发送按钮 */
.send-btn {
  border-radius: 20px;
  padding: 8px 24px;
  background-color: #4cd964;
  border-color: #4cd964;
}

.send-btn:hover {
  background-color: #3dc755;
  border-color: #3dc755;
}
</style>