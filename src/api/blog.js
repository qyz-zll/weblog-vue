import request from '@/utils/request';

// 创建博客（支持图片上传）
export const createBlog = (data) => {
  return request({
    url: 'api/blogs/',
    method: 'post',
    data,
    headers: { 'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json' },
  });
};

// 获取我的博客列表
export const getMyBlogs = () => {
  return request({
    url: 'api/blogs/my_blogs/',
    method: 'get',
  });
};

// // 获取公开博客列表
// export const getPublicBlogs = () => {
//   return request({
//     url: '/blogs/',
//     method: 'get',
//   });
// };

// 发布博客
export const publishBlog = (id) => {
  return request({
    url: `api/blogs/${id}/publish/`,
    method: 'patch',
  });
};

// 撤回博客（转为草稿）
export const unpublishBlog = (id) => {
  return request({
    url: `/blogs/${id}/unpublish/`,
    method: 'patch',
  });
};

// 删除博客
export const deleteBlog = (id) => {
  return request({
    url: `api/blogs/${id}/`,
    method: 'delete',
  });
};
export const getBlogDetail = (id) => {
  return request({
    url: `/api/blogs/${id}/`,  // 路径需与后端匹配
    method: 'get'
  });
};
// 新增：获取他人公开博客列表（无需登录）
export const getPublicBlogs = (params) => {
  return request({
    url: '/api/blogs/',  // 对应后端公开列表（is_public=True + status=published）
    method: 'get',
    params  // 支持分页、搜索、排序：{page, page_size, search, ordering}
  });
};

// 新增：获取他人博客详情（无需登录，仅公开博客）
export const getOtherBlogDetail = (id) => {
  return request({
    url: `/api/blogs/${id}/`,  // 与个人博客详情共用接口，后端自动判断权限
    method: 'get'
  });
};
// 1. 发布评论（详情页调用：blogId=详情页的博客ID）
export const addBlogComment = (blogId, content) => {
  return request({
    url: `api/blogs/${blogId}/comment/add/`, // 🌟 改为api/blogs/19/comment/add/（匹配后端路由）
    method: 'post',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    data: {
      blog_id: blogId,content } // 无需传blog_id，后端通过pk=19获取
  });
};

// 2. 获取评论列表（详情页调用：blogId=详情页的博客ID）
export const getBlogComments = (blogId) => {
  return request({
    url: `api/blogs/${blogId}/comment/list/`, // 🌟 改为api/blogs/19/comment/list/（删除query参数）
    method: 'get',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    // 分页参数直接传，无需传blog_id
    params: { page: 1, page_size: 10 }
  });
};

// 3. 点赞/转发（同步适配路径）
export const likeBlog = (blogId) => {
  return request({
    url: `api/blogs/${blogId}/like/`, // 改为api/blogs/19/like/
    method: 'post',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
};

export const shareBlog = (blogId) => {
  return request({
    url: `api/blogs/${blogId}/share/`, // 改为api/blogs/19/share/
    method: 'post',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
};