<template>
  <div class="other-blog-detail">
    <el-page-header @back="handleBack" content="博客详情"></el-page-header>

    <el-card class="detail-card" shadow="hover" v-loading="loading">
      <!-- 博客详情（仅公开博客可见） -->
      <div v-if="blogDetail && !loading" class="detail-content">
        <h1 class="title">{{ blogDetail.title }}</h1>

        <div class="meta">
          <el-tag type="success">已发布</el-tag>  <!-- 他人博客必为已发布状态 -->
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getOtherBlogDetail } from '@/api/blog';
import { DocumentDelete } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

// 状态管理
const loading = ref(true);
const blogDetail = ref({});  // 初始化为空对象，避免null报错

// 格式化时间
const formatTime = (timeStr) => {
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
  } catch (error) {
    ElMessage.error('获取详情失败：' + (error.response?.data?.detail || '博客未公开'));
    blogDetail.value = {};
  } finally {
    loading.value = false;
  }
};

// 返回博客广场
const handleBack = () => {
  router.push('/other-blogs');  // 返回他人博客列表页
};

// 页面加载时获取详情
onMounted(() => {
  fetchBlogDetail();
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
  white-space: pre-wrap;  /* 保留换行 */
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
</style>