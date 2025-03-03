<template>
    <transition name="overlay-slide">
      <div v-if="show" class="overlay">
        <div class="inner">
          <!-- 導覽列 -->
          <nav class="overlay-nav">
            <ul>
              <li>
                <router-link to="/payment" @click="emitClose">Payment</router-link>
              </li>
              <li>
                <router-link to="/about" @click="emitClose">關於我們</router-link>
              </li>
              <li>
                <router-link to="/contact" @click="emitClose">客服中心</router-link>
              </li>
              <li>
                <router-link to="/TravelPackage" @click="emitClose">TravelPackage</router-link>
              </li>
              <li>
                <router-link to="/Itinerary" @click="emitClose">行程</router-link>
              </li>
              <li>
                <router-link to="/orderDetail" @click="emitClose">訂單詳情</router-link>
              </li>
              <li>
                <router-link to="/paymentResult" @click="emitClose">付款結果</router-link>
              </li>
              <li>
                <router-link to="/myorder" @click="emitClose">我的訂單</router-link>
              </li>
            </ul>
          </nav>
  
          <!-- Overlay 主要內容（可透過 slot 自訂） -->
          <slot>
            <h2>預設 Overlay 內容</h2>
            <p>這是預設內容，可自行覆寫。</p>
          </slot>
  
          <!-- 關閉按鈕 -->
          <button class="close-btn" @click="emitClose">關閉</button>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  defineProps({
    show: {
      type: Boolean,
      required: true
    }
  });
  const emit = defineEmits(["close"]);
  function emitClose() {
    emit("close");
  }
  </script>
  
  <style scoped>
  /* Overlay 全螢幕覆蓋 */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 內部容器 */
  .inner {
    color: #fff;
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
  }
  
  /* 導覽列樣式 */
  .overlay-nav {
    margin-bottom: 20px;
  }
  .overlay-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .overlay-nav li a {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    padding: 8px 12px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.2);
    transition: background 0.3s ease;
  }
  .overlay-nav li a:hover {
    background: rgba(255, 255, 255, 0.4);
  }
  
  /* 關閉按鈕 */
  .close-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background: #fff;
    color: #000;
    border: none;
    cursor: pointer;
  }
  
  /* 進出場動畫：由上而下滑落 */
  .overlay-slide-enter-active {
    animation: slideIn 500ms ease-out forwards;
  }
  .overlay-slide-leave-active {
    animation: slideOut 500ms ease-in forwards;
  }
  
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-100%);
    }
  }
  </style>
  