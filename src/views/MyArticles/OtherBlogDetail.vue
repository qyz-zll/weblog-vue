<template>
  <div class="other-blog-detail">
    <el-page-header @back="handleBack" content="博客详情"></el-page-header>

    <el-card class="detail-card" shadow="hover" v-loading="loading">
      <!-- 博客详情（仅公开博客可见） -->
      <div v-if="blogDetail && !loading" class="detail-content">
        <h1 class="title">{{ blogDetail.title }}</h1>

        <div class="meta">
          <el-tag type="success">已发布</el-tag>
          <span>作者：{{ blogDetail.author__username }}</span>
          <span>发布时间：{{ formatTime(blogDetail.created_at) }}</span>
        </div>

        <!-- 封面图 -->
        <div class="cover" v-if="blogDetail.cover_image_url">
          <el-image
            :src="blogDetail.cover_image_url"
            fit="contain"
            preview-teleported
          ></el-image>
        </div>

        <!-- 内容 -->
        <div class="content">{{ blogDetail.content }}</div>

        <!-- 互动功能区（点赞/转发/评论） -->
        <div class="interact-area" style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
          <!-- 点赞按钮 -->
          <el-button
            v-if="isLogin"
            type="text"
            :icon="isLiked ? 'el-icon-heart-solid' : 'el-icon-heart'"
            :class="{ liked: isLiked }"
            @click="handleLike"
            :loading="likeLoading"
          >
            {{ blogDetail.like_count || 0 }} 点赞
          </el-button>
          <el-button v-else type="text" icon="el-icon-heart" disabled @click="handleLoginTip">
            {{ blogDetail.like_count || 0 }} 点赞
          </el-button>

          <!-- 转发按钮 -->
          <el-button
            v-if="isLogin"
            type="text"
            icon="el-icon-share"
            @click="handleShare"
            :loading="shareLoading"
          >
            {{ blogDetail.share_count || 0 }} 转发
          </el-button>
          <el-button v-else type="text" icon="el-icon-share" disabled @click="handleLoginTip">
            {{ blogDetail.share_count || 0 }} 转发
          </el-button>

          <!-- 评论按钮（展开评论区） -->
          <el-button
            type="text"
            icon="el-icon-chat-dot-round"
            @click="commentVisible = !commentVisible"
          >
            {{ blogDetail.comment_count || 0 }} 评论
          </el-button>
        </div>

        <!-- 评论区 -->
        <div class="comment-section" v-if="commentVisible" style="margin-top: 20px;">
          <!-- 评论输入框 -->
          <div class="comment-input" v-if="isLogin">
            <el-input
              v-model="commentContent"
              type="textarea"
              placeholder="说点什么..."
              rows="3"
              @keyup.enter="handleComment"
            ></el-input>
            <el-button
              type="primary"
              style="margin-top: 10px;"
              @click="handleComment"
              :loading="commentLoading"
            >
              发布评论
            </el-button>
          </div>
          <div v-else class="comment-login-tip" style="padding: 20px; text-align: center; color: #999;">
            <el-button type="primary" size="small" @click="handleLoginTip">登录后可发表评论</el-button>
          </div>

          <!-- 评论列表：修复v-if和v-for混用问题 → 移到包裹元素上 -->
          <div class="comment-list" style="margin-top: 20px;" v-if="!commentLoading && commentVisible">
            <!-- 有评论时显示 -->
            <div v-if="commentList.length > 0" class="comment-list-wrapper">
              <div class="comment-item" v-for="item in commentList" :key="item.id">
                <div class="comment-header">
                  <span class="comment-author">{{ item.author_username }}</span>
                  <span class="comment-time">{{ formatTime(item.created_at) }}</span>
                </div>
                <div class="comment-content">{{ item.content }}</div>
                <hr style="margin: 10px 0; border: 0; border-top: 1px solid #f0f0f0;">
              </div>
            </div>
            <!-- 无评论时显示 -->
            <div v-else style="text-align: center; color: #999; padding: 20px;">
              暂无评论，快来抢沙发～
            </div>
          </div>

          <!-- 评论分页 -->
          <el-pagination
            v-if="commentTotal > 0"
            style="margin-top: 20px; text-align: right;"
            v-model:current-page="commentPage"
            v-model:page-size="commentPageSize"
            :total="commentTotal"
            layout="prev, pager, next"
            @current-change="fetchCommentList"
          ></el-pagination>
        </div>
      </div>

      <!-- 错误/空状态 -->
      <div v-else-if="!loading" class="empty">
        <el-icon :size="50" class="empty-icon"><DocumentDelete /></el-icon>
        <p>该博客不存在或未公开</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 补充导入watch
import { ref, onMounted, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getOtherBlogDetail, likeBlog, shareBlog, addBlogComment, getBlogComments } from '@/api/blog';
import { DocumentDelete } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

// 基础状态
const loading = ref(true);
const blogDetail = ref({});
// 登录状态判断
const isLogin = computed(() => !!localStorage.getItem('accessToken'));

// 点赞相关状态
const isLiked = ref(false);       // 是否已点赞
const likeLoading = ref(false);   // 点赞加载中

// 转发相关状态
const shareLoading = ref(false);  // 转发加载中

// 评论相关状态
const commentVisible = ref(false); // 评论区是否展开
const commentContent = ref('');    // 评论输入内容
const commentLoading = ref(false); // 发布评论加载中
const commentList = ref([]);       // 评论列表
const commentPage = ref(1);        // 评论当前页
const commentPageSize = ref(10);   // 评论每页条数
const commentTotal = ref(0);       // 评论总数

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return new Date(timeStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取他人博客详情
const fetchBlogDetail = async () => {
  const blogId = route.params.id;
  try {
    const res = await getOtherBlogDetail(blogId);
    blogDetail.value = res.data || {};
    // 初始化点赞状态（需后端返回is_liked字段，若无则默认false）
    isLiked.value = res.data?.is_liked || false;
    // 初始化评论列表
    if (commentVisible.value) {
      fetchCommentList();
    }
  } catch (error) {
    ElMessage.error('获取详情失败：' + (error.response?.data?.detail || '博客未公开'));
    blogDetail.value = {};
  } finally {
    loading.value = false;
  }
};

// 点赞功能
const handleLike = async () => {
  const blogId = route.params.id;
  likeLoading.value = true;
  try {
    const res = await likeBlog(blogId);
    if (res.code === 200) {
      isLiked.value = !isLiked.value;
      // 更新点赞数
      blogDetail.value.like_count = isLiked.value
        ? (blogDetail.value.like_count || 0) + 1
        : Math.max(0, (blogDetail.value.like_count || 1) - 1);
      ElMessage.success(isLiked.value ? '点赞成功' : '取消点赞成功');
    } else {
      ElMessage.error(res.message || '操作失败');
    }
  } catch (error) {
    ElMessage.error('点赞失败：' + error.message);
  } finally {
    likeLoading.value = false;
  }
};

// 转发功能
const handleShare = async () => {
  const blogId = route.params.id;
  shareLoading.value = true;
  try {
    // 模拟转发逻辑（可根据实际需求调整，比如复制链接）
    await shareBlog(blogId);
    // 复制博客链接到剪贴板
    const shareUrl = window.location.href;
    await navigator.clipboard.writeText(shareUrl);
    ElMessage.success('转发成功！链接已复制到剪贴板');
    // 更新转发数
    blogDetail.value.share_count = (blogDetail.value.share_count || 0) + 1;
  } catch (error) {
    ElMessage.error('转发失败：' + error.message);
  } finally {
    shareLoading.value = false;
  }
};

// 获取评论列表
const handleComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容');
    return;
  }
  const blogId = route.params.id;
  commentLoading.value = true;
  try {
    // 修复：传blogId和content，而非对象
    const res = await addBlogComment(blogId, commentContent.value.trim());
    if (res.code === 200) {
      ElMessage.success('评论发布成功');
      commentContent.value = '';
      // 刷新评论列表
      commentPage.value = 1;
      fetchCommentList();
      // 更新评论数
      blogDetail.value.comment_count = (blogDetail.value.comment_count || 0) + 1;
    } else {
      ElMessage.error(res.message || '评论发布失败');
    }
  } catch (error) {
    ElMessage.error('评论发布失败：' + (error.message || '接口异常'));
  } finally {
    commentLoading.value = false;
  }
};

// 获取评论列表（修复：传blogId+分页参数，而非对象）
const fetchCommentList = async () => {
  const blogId = route.params.id;
  commentLoading.value = true;
  try {
    // 修复：传blogId、page、pageSize
    const res = await getBlogComments(blogId, commentPage.value, commentPageSize.value);
    commentList.value = res.data || [];
    commentTotal.value = res.total || 0;
  } catch (error) {
    ElMessage.error('获取评论失败：' + (error.message || '接口异常'));
    commentList.value = [];
  } finally {
    commentLoading.value = false;
  }
};

// 登录提示
const handleLoginTip = () => {
  ElMessageBox.confirm(
    '该操作需要先登录，是否前往登录页？',
    '提示',
    {
      confirmButtonText: '前往登录',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    router.push('/login');
  }).catch(() => {});
};

// 返回博客广场
const handleBack = () => {
  router.push('/other-blogs');
};

// 页面加载时获取详情
onMounted(() => {
  fetchBlogDetail();
});

// 监听评论区展开状态，自动加载评论
watch(commentVisible, (newVal) => {
  if (newVal && blogDetail.value.id) {
    fetchCommentList();
  }
});
</script>

<style scoped>
.other-blog-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.detail-card {
  padding: 30px;
  margin-top: 10px;
}
.title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  color: #666;
  font-size: 14px;
}
.meta .el-tag {
  margin-top: 2px;
}
.cover {
  text-align: center;
  margin: 30px 0;
}
.cover img {
  max-width: 80%;
  max-height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.content {
  line-height: 2;
  color: #333;
  font-size: 16px;
  white-space: pre-wrap;
}
.empty {
  text-align: center;
  padding: 80px 0;
  color: #999;
}
.empty-icon {
  margin-bottom: 20px;
  color: #ddd;
}
/* 点赞样式 */
.interact-area .liked {
  color: #f56c6c;
}
/* 评论区样式 */
.comment-item {
  padding: 10px 0;
}
.comment-author {
  font-weight: 600;
  color: #333;
}
.comment-time {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}
.comment-content {
  margin-top: 5px;
  color: #666;
  line-height: 1.8;
}
</style>