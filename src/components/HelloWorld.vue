<!--<template>-->
<!--  <div ref="watermarkEl" class="demo-container">-->
<!--    <h1>纯 JS 水印（零 Vue 指令报错）</h1>-->
<!--    <button @click="changeWatermark">修改水印文本</button>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, onMounted, onUnmounted } from 'vue';-->
<!--import { createWatermark } from '@/utils/watermark';-->

<!--// 挂载元素-->
<!--const watermarkEl = ref(null);-->
<!--// 水印实例-->
<!--let watermarkInstance = null;-->

<!--// 组件挂载后初始化水印-->
<!--onMounted(() => {-->
<!--  if (watermarkEl.value) {-->
<!--    // 初始水印文本-->
<!--    watermarkInstance = createWatermark(watermarkEl.value, '未登录');-->
<!--  }-->
<!--});-->

// 手动修改水印
const changeWatermark = () => {
  if (watermarkInstance) {
    watermarkInstance.update('欢迎使用纯 JS 水印');
  }
};

// 组件卸载时清除水印
onUnmounted(() => {
  if (watermarkInstance) {
    watermarkInstance.clear();
  }
});
</script>

<style scoped>
.demo-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
button {
  margin-top: 20px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>