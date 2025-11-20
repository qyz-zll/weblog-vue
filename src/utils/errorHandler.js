/**
 * 解析 Django 后端返回的 ErrorDetail 错误格式
 * @param {Object} error - 前端 catch 到的错误对象
 * @returns {Array} - 处理后的错误提示数组（如：['该邮箱已注册！', '用户名已存在！']）
 */
export const parseBackendError = (error) => {
  // 1. 提取后端完整错误数据（兼容 error 或 error.response.data 两种情况）
  const errorData = error.response?.data || error;
  if (!errorData || typeof errorData !== 'object') {
    return ['请求失败，请稍后重试'];
  }

  // 2. 遍历所有错误字段，提取 string 提示
  const errorMessages = [];
  Object.values(errorData).forEach((fieldErrors) => {
    // fieldErrors 是数组（如：[ErrorDetail对象]），取第一个元素的 string（优先显示第一个错误）
    const errMsg = fieldErrors?.[0]?.string;
    if (errMsg) {
      errorMessages.push(errMsg);
    }
  });

  // 3. 若无提取到具体错误，返回默认提示
  return errorMessages.length > 0 ? errorMessages : ['操作失败，请检查提交信息'];
};