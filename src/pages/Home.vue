<script setup>
import CarouselsCycle from "@/components/CarouselsCycle.vue";
import icon from "@/components/Icon.vue";
import { onMounted, onBeforeUnmount } from 'vue';

// 在组件挂载时添加特殊类，卸载时移除
onMounted(() => {
  document.body.classList.add('home-page');
  document.documentElement.style.overflow = 'auto'; // 确保 html 元素可滚动
  document.body.style.overflow = 'auto'; // 确保 body 元素可滚动
  
  // 获取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 添加透明背景
  if (header) header.style.backgroundColor = 'transparent';
  if (footer) footer.style.backgroundColor = 'transparent';
});

onBeforeUnmount(() => {
  document.body.classList.remove('home-page');
  document.documentElement.style.overflow = ''; // 恢复默认
  document.body.style.overflow = ''; // 恢复默认
  
  // 获取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 恢复原来的背景
  if (header) header.style.backgroundColor = '';
  if (footer) footer.style.backgroundColor = '';
});
</script>

<template>
  <div class="home-page-container">
    <div class="overlay-mask"></div>
    <div class="wrap">
      <div class="item">
        <CarouselsCycle class="carousels" />
        <div class="content">
          <icon class="icon"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
  z-index: 4;
  pointer-events: none;
}

CarouselsCycle {
  max-height: 100%;
}

.wrap {
  width: 100%;
  min-height: 100vh; /* 使用 min-height 而不是固定 height */
  display: flex;
  margin: 0 auto;
  position: relative;
  overflow: visible;
}

.item {
  width: 100%;
  min-height: 100vh; /* 使用 min-height 而不是固定 height */
  position: relative;
}

.content {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 1;
  transition: opacity 0.6s;
  width: 100%;
  height: 100%;
  z-index: 6;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* 确保 background-panel 也有遮罩效果 */
:deep(.background-panel) {
  position: relative;
  z-index: 10;
}

:deep(.background-panel::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: -1;
  border-radius: inherit;
}
</style>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body.home-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
}

body.home-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.home-page .header-container {
  background: transparent !important;
}

body.home-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 响应式调整 */
@media (max-width: 768px) {
  body.home-page .desktop-header,
  body.home-page footer.footer-container {
    background: transparent !important;
  }
}

@media (max-width: 576px) {
  body.home-page .desktop-header,
  body.home-page footer.footer-container {
    background: transparent !important;
  }
}
</style>