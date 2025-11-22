import axios from 'axios';
import router from '@/route';

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // 后端接口基础地址（本地开发）
  timeout: 5000,  // 请求超时时间
  headers: {
    'Content-Type': 'application/json'  // 默认 JSON 格式请求
  }
});

// 请求拦截器：添加 JWT Token（登录后自动携带）
service.interceptors.request.use(
  (config) => {
    // 从本地存储获取 Token
    const token = localStorage.getItem('accessToken');
    console.log(token,"用户缓存")
    if (token) {
      // 拼接 Token 格式：Bearer + 空格 + Token
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(config.headers['Authorization'],'token')
    return config;
  },
  (error) => {
    // 请求发送失败（如网络错误）
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理响应格式和错误
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 按后端统一格式判断：code=200 为成功
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || '操作失败'));
        // return response.data;

    } else {
      // 成功：返回数据
      return res;
    }
  },
  (error) => {
    const errMsg = error.response?.data?.message || error.message || '网络异常';
    // Token 过期/无效（401 错误）：跳回登录页
    if (error.response?.status === 401) {
      localStorage.clear();  // 清除无效 Token
      router.push('/login');  // 跳转登录页
      alert('登录已过期，请重新登录');
    }
    // 打印错误（开发环境）
    console.error('请求错误：', errMsg);
    return Promise.reject(new Error(errMsg));
  }
);

export default service;