<script setup>
import CarouselsCycle from "@/components/CarouselsCycle.vue";
import icon from "@/components/Icon.vue";
</script>

<template>
  <div class="wrap">
    <div class="item">
      <CarouselsCycle class="carousels" />
      <div class="content">
        <icon class="icon"></icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
CarouselsCycle {
  max-height: 100%;
}
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  margin: 0 auto;
  position: relative;

  .item {
    width: 100%;
    position: relative;

    /* 移除滑鼠移入效果，不再改變 .content 的 opacity */
    /* &:hover {
      .content {
        opacity: 1;
      }

      h2::after {
        width: 100%;
      }
    } */

    .content {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      padding: 0;  /* 移除水平内边距 */
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;  /* 添加垂直居中 */
      flex-direction: column;
      opacity: 1; /* 直接顯示 */
      transition: opacity 0.6s;
      cursor: pointer;
    }

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;  /* 确保宽度占满 */
    }
  }
}
</style>