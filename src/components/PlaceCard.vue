<template>
  <div class="card mb-1" style="max-width: 540px">
    <div class="row g-0">
      <div class="col-4">
        <img :src="data.img" alt="景點圖片" class="card-img" />
      </div>
      <div class="col-8">
        <div class="card-content">
          <i
            v-if="hide"
            class="bi bi-x PlaceCard-closebtn"
            @click="Delete(data.id)"
          ></i>
          <h4 class="placecard-title">{{ data.name }}</h4>

          <div class="rating">
            <!-- 根據評分顯示星星 -->
            <p class="rating-score">{{ data.rating }}</p>
            <span
              v-for="index in 5"
              :key="index"
              :class="{ filled: index <= data.rating }"
              :style="{ color: index <= data.rating ? 'blue' : 'gray' }"
            >
              {{ index <= data.rating ? "★" : "☆" }}
            </span>
          </div>
          <div class="address-container">
            <i class="bi bi-geo-alt address-icon"></i>
            <span class="address-text" :title="data.address">{{
              data.address
            }}</span>
          </div>

          <!-- <p v-if="hide">到達時間: {{ data.time }}</p> -->
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
  },
  hide: {
    type: Boolean,
    required: false,
  },
});
const Delete = (id) => {
  // 調用從父元件傳遞過來的刪除方法
  props.deletePlaceHandler(id);
};
</script>


<style scoped>
.card {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 10px;
  margin: 10px;
  display: flex;
  align-items: center;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.popular-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #ff5a5f;
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: bold;
}

.PlaceCard-closebtn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.PlaceCard-closebtn:hover {
  color: #ff5a5f;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s;
}

.card-img:hover {
  transform: scale(1.05);
}

.card-content {
  flex: 1;
  text-align: left;
  padding: 12px 0px 0px 12px;
  position: relative;
}

p {
  margin: 6px 0;
  color: #555;
}

.placecard-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.rating-container {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.rating-score {
  font-weight: bold;
  color: #ff9529;
  margin-right: 6px;
  font-size: 16px;
}

.rating {
  display: flex;
  align-items: center;
}

.reviews-count {
  font-size: 12px;
  color: #888;
  margin-left: 3px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 8px 0;
}

.tag {
  background-color: #f0f8ff;
  color: #3a7bd5;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn-add,
.btn-navigate {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;
}

.btn-add {
  background-color: #3a7bd5;
  color: white;
}

.btn-add:hover {
  background-color: #2c6ac3;
}

.btn-navigate {
  background-color: #f5f5f5;
  color: #555;
}

.btn-navigate:hover {
  background-color: #e5e5e5;
}

.bi-bookmark {
  cursor: pointer;
  font-size: 16px;
  color: #aaa;
  transition: color 0.2s;
}

.bi-bookmark:hover,
.bi-bookmark.active {
  color: #3a7bd5;
}
.address-container {
  display: flex;
  align-items: center;
  margin-top: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #666;
}

.address-icon {
  color: #3a7bd5; /* 藍色位置圖標 */
  margin-right: 5px;
  flex-shrink: 0;
}

.address-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.4;
}
</style>