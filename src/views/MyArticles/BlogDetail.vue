<template>
  <div class="blog-detail">
    <el-page-header @back="handleBack" content="博客详情"></el-page-header>

    <el-card class="detail-card" shadow="hover" v-loading="loading">
      <!-- 博客详情内容 -->
      <div v-if="blogDetail && !loading" class="detail-content">
        <h1 class="title">{{ blogDetail.title }}</h1>

        <div class="meta">
          <el-tag :type="blogDetail.status === 'published' ? 'success' : 'warning'">
            {{ blogDetail.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
          <span>作者：{{ blogDetail.author__username }}</span>
          <span>创建时间：{{ formatTime(blogDetail.created_at) }}</span>
          <span v-if="blogDetail.updated_at">更新时间：{{ formatTime(blogDetail.updated_at) }}</span>
        </div>

        <div class="cover" v-if="blogDetail.cover_image_url">
          <el-image
            :src="blogDetail.cover_image_url"
            fit="contain"
            preview-teleported
          ></el-image>
        </div>

        <div class="content">{{ blogDetail.content }}</div>
      </div>

      <!-- 错误提示（非加载状态且无详情数据时显示） -->
      <div v-else-if="!blogDetail && !loading" class="empty">
        <el-icon :size="50" class="empty-icon"><DocumentDelete /></el-icon>
        <p>未找到该博客（可能已被删除）</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getBlogDetail } from '@/api/blog';
import { DocumentDelete } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const blogDetail = ref(null);

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

const fetchBlogDetail = async () => {
  const blogId = route.params.id;
  try {
    const res = await getBlogDetail(blogId);
    blogDetail.value = res.data;
  } catch (error) {
    ElMessage.error('获取详情失败：' + (error.response?.data?.detail || error.message));
    blogDetail.value = null;
  } finally {
    loading.value = false;
  }
};

const handleBack = () => {
  router.push('/blog-manager');
};

onMounted(() => {
  fetchBlogDetail();
});
</script>

<style scoped>
/* 样式保持不变 */
.blog-detail {
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
</style>