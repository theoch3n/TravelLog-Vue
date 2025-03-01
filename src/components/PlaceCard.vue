<template>
  <div class="card mb-1" style="max-width: 540px">
    <div class="row g-0">
      <div class="col-4">
        <img :src="data.img" alt="景點圖片" class="card-img" />
      </div>
      <div class="col-8">
        <div class="card-content">
          <i v-if="hide" class="bi bi-x PlaceCard-closebtn" @click="Delete(data.id)"></i>
          <h4 class="placecard-title">{{ data.name }}</h4>
          <p>評分：{{ data.rating }}</p>
          <div class="rating">
            <!-- 根據評分顯示星星 -->
            <span v-for="index in 5" :key="index" :class="{ filled: index <= data.rating }">
              {{ index <= data.rating ? "★" : "☆" }} </span>
          </div>
          <p v-if="hide">到達時間: {{ data.time }}</p>
          <!--插槽 從父元件-->
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 使用 defineProps 接收父元件傳遞的資料
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  deletePlaceHandler: {
    type: Function,
    required: false,
  }, hide: {
    type: Boolean,
    required: false
  }
});
const Delete = (id) => {
  // 調用從父元件傳遞過來的刪除方法
  props.deletePlaceHandler(id);
};
</script>


<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  display: flex;
  align-items: center;
  background: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.PlaceCard-closebtn {
  /* margin-left: 180px; */
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.card-img {
  position: relative;
  height: 100%;
  border-radius: 10px;
  margin-right: 10px;
}

.card-content {
  flex: 1;
  text-align: left;
  padding: 12px 0px 0px 12px;
}

p {
  margin: auto;
}

.placecard-title {
  font-size: large;
}
</style>