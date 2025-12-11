<template>
  <div class="other-blogs">
    <el-page-header content="公开博客广场"></el-page-header>

    <!-- 搜索与筛选区 -->
    <el-card class="search-card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-input
            v-model="searchParams.search"
            placeholder="搜索博客标题/内容"
            clearable
            @keyup.enter="fetchPublicBlogs"
          >
            <template #append>
              <el-button type="primary" @click="fetchPublicBlogs">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="searchParams.ordering"
            placeholder="排序方式"
            clearable
            @change="fetchPublicBlogs"
          >
            <el-option label="最新发布" value="-created_at"></el-option>
            <el-option label="最早发布" value="created_at"></el-option>
            <el-option label="标题A-Z" value="title"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- 博客列表 -->
    <el-card class="blogs-card" shadow="hover" style="margin-top: 20px;">
      <div v-if="blogsList.length > 0">
        <el-table
          :data="blogsList"
          border
          stripe
          v-loading="loading"
          element-loading-text="加载中..."
        >
          <el-table-column prop="title" label="博客标题" min-width="300">
            <template #default="scope">
              <el-link @click="goToOtherDetail(scope.row.id)" type="primary">
                {{ scope.row.title }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="作者/操作" width="220">
            <template #default="scope">
              <div class="author-actions">
                <el-tag type="info">{{ scope.row.author.username }}</el-tag>

                <!-- 添加好友按钮：仅登录用户可见 -->
                <el-button
                  v-if="isLogin"
                  size="mini"
                  type="primary"
                  icon="el-icon-user-plus"
                  @click="addFriend(scope.row.author.id)"
                  :loading="friendLoading[scope.row.author.id]"
                  :disabled="isFriend[scope.row.author.id]"
                >
                  {{ isFriend[scope.row.author.id] ? '已添加' : '加好友' }}
                </el-button>

                <!-- 未登录提示 -->
                <el-button
                  v-else
                  size="mini"
                  type="primary"
                  icon="el-icon-user-plus"
                  @click="handleLoginTip"
                  disabled
                >
                  登录加好友
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="发布时间" width="200">
            <template #default="scope">
              {{ formatTime(scope.row.created_at) }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" style="margin-top: 20px; text-align: right;">
          <el-pagination
            v-model:current-page="searchParams.page"
            v-model:page-size="searchParams.page_size"
            :page-sizes="[10, 20, 50]"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty-state">
        <el-empty description="暂无公开博客"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // 补充computed导入
import { ElMessage, ElMessageBox } from 'element-plus'; // 补充ElMessageBox导入
import { useRouter } from 'vue-router';
import { getPublicBlogs } from '@/api/blog';
import {sendFriendRequest} from "@/api/friend";
// 若未创建friend.js接口文件，需先创建，或暂时注释（后续补全接口）
// import { addFriend, checkFriendship } from '@/api/friend';

const router = useRouter();

// 状态管理
const loading = ref(false);
const blogsList = ref([]);
const totalCount = ref(0);
// 补充缺失的变量定义
const isLogin = computed(() => !!localStorage.getItem('accessToken')); // 登录状态判断（从localStorage取token）
const friendLoading = ref({}); // 加好友按钮加载状态（按用户ID存储）
const isFriend = ref({}); // 记录是否已添加好友（按用户ID存储）

// 搜索参数（与后端筛选字段匹配）
const searchParams = ref({
  page: 1,          // 当前页
  page_size: 10,    // 每页条数
  search: '',       // 搜索关键词（匹配标题/内容）
  ordering: '-created_at'  // 排序（默认最新发布）
});

// 格式化时间
const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取公开博客列表
const fetchPublicBlogs = async () => {
  loading.value = true;
  try {
    const res = await getPublicBlogs(searchParams.value);
    blogsList.value = res.data || [];
    totalCount.value = res.data.length || 0;

    // 若已登录，可补充检查好友关系（需后端接口支持，暂时注释）
    // if (isLogin.value) {
    //   blogsList.value.forEach(blog => {
    //     const userId = blog.author.id;
    //     checkFriendship(userId).then(checkRes => {
    //       isFriend.value[userId] = checkRes.data.is_friend;
    //     }).catch(() => {});
    //   });
    // }
  } catch (error) {
    ElMessage.error('加载博客失败：' + (error.message || '网络错误'));
    blogsList.value = [];
    totalCount.value = 0;
  } finally {
    loading.value = false;
  }
};

// 分页：每页条数变化
const handleSizeChange = (size) => {
  searchParams.value.page_size = size;
  searchParams.value.page = 1;
  fetchPublicBlogs();
};

// 分页：页码变化
const handleCurrentChange = (page) => {
  searchParams.value.page = page;
  fetchPublicBlogs();
};

// 跳转到他人博客详情页
const goToOtherDetail = (id) => {
  router.push(`/other-blog-detail/${id}`);
};

// 补充缺失的方法：未登录提示
const handleLoginTip = () => {
  ElMessageBox.confirm('添加好友需先登录，是否前往登录？', '提示', {
    confirmButtonText: '前往登录',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    router.push('/login'); // 跳转到登录页（需确保登录页路由为/login）
  }).catch(() => {});
};

// 补充缺失的方法：添加好友（需后端接口支持，暂时先提示）
const addFriend = async (targetUserId) => {
  friendLoading.value[targetUserId] = true;
  try {
    // 调用修改后的addFriend接口：参数为目标用户ID（friendId）
    const res = await sendFriendRequest(targetUserId);
    ElMessage.success(res.data.message || '好友申请发送成功，等待对方审核');
    // 临时标记为"已申请"（可选，需后端接口返回申请状态）
    isFriend.value[targetUserId] = true;
  } catch (error) {
    ElMessage.error('添加失败：' + (error.response?.data?.message || error.message || '网络错误'));
  } finally {
    friendLoading.value[targetUserId] = false;
  }
};

// 页面加载时获取列表
onMounted(() => {
  fetchPublicBlogs();
});
</script>

<style scoped>
.other-blogs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.search-card {
  padding: 20px;
}
.blogs-card {
  padding: 20px;
}
.empty-state {
  padding: 50px 0;
  text-align: center;
}
/* 补充作者操作区样式，避免按钮挤在一起 */
.author-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>