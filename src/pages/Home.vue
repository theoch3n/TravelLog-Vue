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

  <!-- <div>
    <div class="home-container">


      預販售的商品...
    </div>
  </div> -->
</template>
<style scoped>
.wrap {
  width: 100vw;
  display: flex;
  margin: 0 auto;

  .item {
    /* // 看圖片多少比例 */
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

    img {
      width: 100%;
      /* //使圖片下方莫名空間消除 */
      vertical-align: middle;
    }

    .content {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      padding: 0 520px;
      background: rgba(#000, 0.6);
      /* //垂直置中對齊 */
      display: flex;
      justify-content: center;
      flex-direction: column;
      /* //先文字一開始為透明 */
      opacity: 0;
      /* //透明漸變時間 */
      transition: opacity 0.6s;
      cursor: pointer;
    }

    h2 {
      color: #00eaff;
      font-size: 32px;

      /* // 動態橫線 */
      &::after {
        content: '';
        display: block;
        width: 0;
        height: 2px;
        margin: 5px 0;
        background-color: #00eaff;
        /* //使寬度漸變時間為 0.5s delay 0.3s */
        transition: width 0.5s 0.3s;
      }
    }

    p {
      color: #fff;
      padding: 5px 0;
      font-size: 18px;
    }
  }
}
</style>
