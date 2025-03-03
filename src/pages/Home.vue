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
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  margin: 0 auto;
  position: relative;

  .item {
    width: 100%;
    position: relative;

    &:hover {
      .content {
        opacity: 1;
      }

      h2::after {
        width: 100%;
      }
    }

    .content {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      padding: 0 520px;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      flex-direction: column;
      opacity: 0;
      transition: opacity 0.6s;
      cursor: pointer;
    }
  }
}
</style>
