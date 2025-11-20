// // src/utils/format.js
// /**
//  * 格式化 ISO 时间字符串（后端返回的 create_time 格式）
//  * @param {string} timeStr - 后端返回的 ISO 时间（如：2025-11-19T12:34:56Z）
//  * @returns {string} 格式化后的本地时间（如：2025/11/19 12:34）
//  */
// export const formatTime = (timeStr) => {
//   if (!timeStr) return '暂无数据';
//   const date = new Date(timeStr);
//   // 兼容 iOS 系统对日期格式的兼容问题（部分 iOS 不识别 "-" 分隔符）
//   if (isNaN(date.getTime())) {
//     date = new Date(timeStr.replace(/-/g, '/'));
//   }
//   return date.toLocaleString('zh-CN', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false // 禁用 12 小时制，使用 24 小时制
//   });
// };