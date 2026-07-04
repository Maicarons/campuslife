<template>
  <div class="not-found">
    <div class="content">
      <h1 class="code">404</h1>
      <p class="message">页面不存在</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color-page, #f8f9fa);
}

.content {
  text-align: center;
}

.code {
  font-size: 120px;
  font-weight: 700;
  color: var(--el-text-color-placeholder, #c0c4cc);
  line-height: 1;
  margin-bottom: $spacing-lg;
}

.message {
  font-size: 18px;
  color: var(--el-text-color-secondary, #909399);
  margin-bottom: $spacing-xl;
}
</style>
