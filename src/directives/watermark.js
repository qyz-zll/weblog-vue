// weblog-vue/src/directives/watermark.js
import { watch, unref } from 'vue'; // 补充导入（如果之前没导入的话）

// 提取创建水印的核心逻辑为独立函数
const createWatermark = (el, options) => {
  // 移除旧水印
  const oldWatermark = el.querySelector('#dynamic-watermark');
  if (oldWatermark) el.removeChild(oldWatermark);

  // 默认配置
  const defaultOptions = {
    text: '未登录',       // 未登录兜底文字
    fontSize: '16px',     // 字体大小
    color: 'rgba(120,120,120,0.12)',  // 水印颜色
    rotate: -18,          // 旋转角度
    zIndex: 9999,         // 层级
    spacing: 70           // 水印间距
  };
  // 合并配置（支持字符串/对象入参）
  const finalOptions = typeof options === 'string'
    ? { ...defaultOptions, text: options }
    : { ...defaultOptions, ...options };

  // 1. 创建画布绘制水印
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 220;  // 水印单元宽度
  canvas.height = 160; // 水印单元高度

  // 绘制文字
  ctx.font = `${finalOptions.fontSize} Microsoft Yahei`;
  ctx.fillStyle = finalOptions.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.rotate((finalOptions.rotate * Math.PI) / 180); // 旋转角度转弧度
  ctx.fillText(finalOptions.text, canvas.width / 2, canvas.height / 2);

  // 2. 创建水印容器（全局覆盖）
  const watermarkDiv = document.createElement('div');

  watermarkDiv.id = 'dynamic-watermark';
  watermarkDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;  /* 不遮挡交互 */
    z-index: ${finalOptions.zIndex};
    background-image: url(${canvas.toDataURL('image/png')});
    background-repeat: repeat;
    background-size: ${canvas.width + finalOptions.spacing}px ${canvas.height + finalOptions.spacing}px;
  `;
  el.appendChild(watermarkDiv);

  // 3. 防篡改：监听水印被删除/修改
  const observer = new MutationObserver(() => {
    const exist = el.querySelector('#dynamic-watermark');
    if (!exist || exist.style.display === 'none') {
      observer.disconnect();
      createWatermark(el, finalOptions); // 重新创建水印
    }
  });
  observer.observe(el, { childList: true, attributes: true, subtree: true });
};

export default {
  mounted(el, binding) {
    // 初始创建水印
    createWatermark(el, binding.value);

    // 监听指令值变化（如username更新），自动刷新水印
    if (binding.value?.text || typeof binding.value === 'string') {
      const stopWatch = watch(
        () => unref(binding.value),
        (newVal) => createWatermark(el, newVal), // 调用独立函数
        { deep: true }
      );
      // 解绑时停止监听
      el._watermarkWatch = stopWatch;
    }
  },
  updated(el, binding) {
    // 当值变化时重新创建水印
    if (binding.value !== binding.oldValue) {
      createWatermark(el, binding.value); // 调用独立函数，解决'mounted'未定义问题
    }
  },
  unmounted(el) {
    // 解绑时停止监听
    if (el._watermarkWatch) {
      el._watermarkWatch();
    }
  }
};