<template>
  <router-view />
</template>

<script setup>
// 根组件仅渲染路由视图，无额外逻辑（避免提前调用store）
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #f5f7fa;
}
</style>