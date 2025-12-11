<template>
  <div class="blog-manager">
    <el-page-header content="博客管理"></el-page-header>

    <!-- 创建博客表单 -->
    <el-card class="create-card" shadow="hover">
      <h3>创建新博客</h3>
      <el-form :model="blogForm" :rules="blogRules" ref="blogFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="blogForm.title" placeholder="请输入博客标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="blogForm.content" type="textarea" rows="6" placeholder="请输入博客内容"></el-input>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            action="#"
            :auto-upload="false"
            :file-list="fileList"
            :multiple="false"
            @change="handleFileChange"
            list-type="picture"
            class="upload-demo"
          >
            <el-button type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="blogForm.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">直接发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 我的博客列表 -->
    <el-card class="list-card" shadow="hover" style="margin-top: 20px;">
      <h3>我的博客列表</h3>
      <el-table :data="myBlogs" border stripe>
        <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'published' ? 'success' : 'warning'">
              {{ scope.row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="200">
          <template #default="scope">
            {{ new Date(scope.row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handlePublish(scope.row.id)"
              v-if="scope.row.status === 'draft'"
              icon="el-icon-check"
            >
              发布
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handleUnpublish(scope.row.id)"
              v-if="scope.row.status === 'published'"
              icon="el-icon-refresh"
            >
              撤回
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row.id)"
              icon="el-icon-delete"
            >
              删除
            </el-button>
            <el-button
              type="info"
              size="small"
              @click="goToDetail(scope.row.id)"
              icon="el-icon-view"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createBlog, getMyBlogs, publishBlog, unpublishBlog, deleteBlog } from '@/api/blog';
import { useRouter } from 'vue-router';
// 博客表单数据
const blogForm = ref({
  title: '',
  content: '',
  status: 'draft',
});
// 表单校验规则
const blogRules = ref({
  title: [{ required: true, message: '请输入博客标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入博客内容', trigger: 'blur' }],
});
const router = useRouter();
// 跳转到详情页（携带博客ID）
const goToDetail = (id) => {
  router.push(`/blog-detail/${id}`);  // 路由路径：/blog-detail/1（1为博客ID）
};
// 上传文件列表（必须初始化为数组）
const fileList = ref([]);
// 我的博客列表
const myBlogs = ref([]);
// 表单引用
const blogFormRef = ref(null);

// 处理文件上传事件
const handleFileChange = (_, uploadFiles) => {
  fileList.value = uploadFiles || [];
};

// 创建博客
const handleCreate = async () => {
  if (!blogFormRef.value) return;
  try {
    // 表单校验
    await blogFormRef.value.validate();

    // 构建请求数据
    let data;
    if (fileList.value.length > 0) {
      data = new FormData();
      data.append('title', blogForm.value.title);
      data.append('content', blogForm.value.content);
      data.append('status', blogForm.value.status);
      data.append('cover_image', fileList.value[0].raw); // 原生File对象
    } else {
      data = { ...blogForm.value };
    }

    // 调用创建接口（无未使用变量）
    await createBlog(data);
    ElMessage.success('博客创建成功！');
    // 重置表单
    resetForm();
    // 刷新列表
    fetchMyBlogs();
  } catch (error) {
    ElMessage.error('创建失败：' + (error.response?.data?.message || error.message));
  }
};

// 重置表单
const resetForm = () => {
  if (blogFormRef.value) {
    blogFormRef.value.resetFields();
  }
  blogForm.value = { title: '', content: '', status: 'draft' };
  fileList.value = [];
};

// 获取我的博客列表
const fetchMyBlogs = async () => {
  try {
    const res = await getMyBlogs();
    myBlogs.value = res.data || [];
  } catch (error) {
    ElMessage.error('获取博客列表失败！');
  }
};

// 发布博客
const handlePublish = async (id) => {
  try {
    await publishBlog(id);
    ElMessage.success('博客发布成功！');
    fetchMyBlogs();
  } catch (error) {
    ElMessage.error('发布失败：' + (error.response?.data?.message || error.message));
  }
};

// 撤回博客
const handleUnpublish = async (id) => {
  try {
    await unpublishBlog(id);
    ElMessage.success('博客已撤回为草稿！');
    fetchMyBlogs();
  } catch (error) {
    ElMessage.error('撤回失败：' + (error.response?.data?.message || error.message));
  }
};

// 删除博客
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该博客吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteBlog(id);
    ElMessage.success('博客删除成功！');
    fetchMyBlogs();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + (error.response?.data?.message || error.message));
    }
  }
};

// 页面加载时获取列表
onMounted(() => {
  fetchMyBlogs();
});
</script>

<style scoped>
.blog-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.create-card, .list-card {
  padding: 20px;
}
.upload-demo {
  margin-top: 10px;
}
</style>