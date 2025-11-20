import request from '@/utils/request';

/**
 * 登录接口
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 */

export const login = (data) => {
  // 步骤1：request() 执行后返回 Promise，在 Promise 后链 .catch
  return request({
    url: '/login/',
    method: 'POST',
    data: { // data 对象单独闭合，不包含 .catch
      username: data.username,
      password: data.password
    }
  })
  // 步骤2：.catch 链在 request() 返回的 Promise 后面（关键修正）
  .catch(error => {
    // 解析后端错误响应（适配 Django DRF 格式：{ errors: { username: [ErrorDetail...] } }）
    const errResponse = error.response?.data || {};
    const errDetail = errResponse.errors || {}; // 后端错误字段

    // 提取错误提示：转为字符串（避免 [object Object]）
    const usernameErr = errDetail.username?.[0] ? String(errDetail.username[0]) : '';
    const passwordErr = errDetail.password?.[0] ? String(errDetail.password[0]) : '';

    // 优先显示具体错误，无则返回默认提示（登录接口用“登录失败”更语义化）
    const errMsg = usernameErr || passwordErr || '登录失败，请检查用户名或密码';
    console.log('登录错误：', errMsg);

    // 抛出错误，让组件内的 try/catch 捕获
    throw new Error(errMsg);
  });
};
/**
 * 注册接口
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.password2 - 确认密码
 * @param {string} data.email - 邮箱
 * @param {string} [data.bio] - 个人简介（可选）
 */
export const register = (data) => {
  return request({
    url: '/register/',
    method: 'POST',
    data: {
      username: data.username,
      password: data.password,
      password2: data.password2,
      email: data.email,
      bio: data.bio || ''  // 可选字段，默认空字符串
      // 无多余逗号！
    }
  });
};


/**
 * 获取当前用户信息
 * @returns {*}
 */
export const getUserInfo = () => {
  return request({
    url: '/userinfo/', // 后端用户信息接口路径，需与Django路由一致
    method: 'GET',
  });
};




/**
 * 退出登录（前端清除存储）
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
};