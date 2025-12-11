import { ref, watch, unref } from 'vue';

// 弱引用存储元素与水印配置的映射，防止内存泄漏
const elConfigMap = new WeakMap();

/**
 * 渲染水印核心方法
 * @param {HTMLElement} el 挂载元素
 * @param {string|object} config 水印配置（字符串则为文本，对象则为完整配置）
 */
const renderWatermark = (el, config) => {
  try {
    // 1. 清除旧水印及监听
    const oldWatermark = el.querySelector('#dynamic-watermark');
    if (oldWatermark) {
      oldWatermark._observer?.disconnect();
      el.removeChild(oldWatermark);
    }

    // 2. 默认配置 + 兜底处理
    const defaultConfig = {
      text: '未登录',
      fontSize: '16px',
      color: 'rgba(120,120,120,0.12)',
      rotate: -18,
      zIndex: 9999,
      spacing: 70
    };
    const finalConfig = typeof config === 'string'
      ? { ...defaultConfig, text: config }
      : { ...defaultConfig, ...(config || {}) };

    // 3. 创建画布绘制水印
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // 极端情况兜底
    canvas.width = 220;
    canvas.height = 160;
    ctx.font = `${finalConfig.fontSize} Microsoft Yahei`;
    ctx.fillStyle = finalConfig.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.rotate((finalConfig.rotate * Math.PI) / 180);
    ctx.fillText(finalConfig.text, canvas.width / 2, canvas.height / 2);

    // 4. 创建水印容器并挂载
    const watermarkDiv = document.createElement('div');
    watermarkDiv.id = 'dynamic-watermark';
    watermarkDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: ${finalConfig.zIndex};
      background-image: url(${canvas.toDataURL('image/png')});
      background-repeat: repeat;
      background-size: ${canvas.width + finalConfig.spacing}px ${canvas.height + finalConfig.spacing}px;
    `;
    el.appendChild(watermarkDiv);

    // 5. 防篡改监听
    const observer = new MutationObserver(() => {
      const exist = el.querySelector('#dynamic-watermark');
      if (!exist || exist.style.display === 'none') {
        observer.disconnect();
        renderWatermark(el, finalConfig);
      }
    });
    watermarkDiv._observer = observer;
    observer.observe(el, { childList: true, attributes: true, subtree: true });
  } catch (e) {
    console.error('水印渲染异常:', e);
  }
};

// 指令核心配置（完全抛弃binding依赖）
export default {
  mounted(el) {
    // 初始化响应式配置
    const watermarkConfig = ref('未登录');
    elConfigMap.set(el, watermarkConfig);

    // 首次渲染水印
    renderWatermark(el, watermarkConfig.value);

    // 监听配置变化自动更新
    el._watermarkWatch = watch(
      () => unref(watermarkConfig),
      (newVal) => renderWatermark(el, newVal),
      { deep: true }
    );
  },
  unmounted(el) {
    // 清理所有资源
    elConfigMap.delete(el);
    const watermark = el.querySelector('#dynamic-watermark');
    watermark?._observer?.disconnect();
    watermark && el.removeChild(watermark);
    el._watermarkWatch?.();
    delete el._watermarkWatch;
  }
};

// 手动更新水印的方法（业务层调用）
export const updateWatermark = (el, config) => {
  if (!el || !elConfigMap.has(el)) return;
  const watermarkConfig = elConfigMap.get(el);
  watermarkConfig.value = config || '未登录';
};