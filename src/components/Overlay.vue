<template>
    <transition name="overlay-slide">
      <div v-if="show" class="overlay">
        <div class="inner">
          <!-- 導覽列 -->
          <nav class="overlay-nav">
            <ul>
              <li>
                <router-link to="/payment" @click.native="emitClose">Payment</router-link>
              </li>
              <li>
                <router-link to="/about" @click.native="emitClose">關於我們</router-link>
              </li>
              <li>
                <router-link to="/contact" @click.native="emitClose">客服中心</router-link>
              </li>
              <li>
                <router-link to="/TravelPackage" @click.native="emitClose">TravelPackage</router-link>
              </li>
              <li>
                <router-link to="/Itinerary" @click.native="emitClose">行程</router-link>
              </li>
              <li>
                <router-link to="/orderDetail" @click.native="emitClose">訂單詳情</router-link>
              </li>
              <li>
                <router-link to="/paymentResult" @click.native="emitClose">付款結果</router-link>
              </li>
              <li>
                <router-link to="/myorder" @click.native="emitClose">我的訂單</router-link>
              </li>
            </ul>
          </nav>
  
          <!-- 會員相關區塊 -->
          <div class="member-area">
            <!-- 未登入：會員登入按鈕 -->
            <v-btn
              v-if="accountPage && !userStore.isAuthenticated"
              @click="handleLogin"
              class="btn_account"
              :class="accountPage.textClass"
              text>
              <v-icon left>{{ accountPage.icon }}</v-icon>
              {{ accountPage.text }}
            </v-btn>
            <!-- 已登入：會員下拉選單 -->
            <v-menu v-else-if="userStore.isAuthenticated" offset-y>
              <template #activator="{ props }">
                <v-btn text color="white" v-bind="props" class="btn_account">
                  <v-icon left>mdi-account-circle</v-icon>
                  會員
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="handleProfile">
                  <v-list-item-title>會員資料</v-list-item-title>
                </v-list-item>
                <v-list-item @click="logout">
                  <v-list-item-title>登出</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
  
          <!-- Overlay 主要內容 -->
          <slot>
            <h2>預設 Overlay 內容</h2>
            <p>這是預設內容，可自行覆寫。</p>
          </slot>
  
          <!-- 關閉按鈕 -->
          <button class="close-btn" @click="emitClose">關閉</button>
  
          <!-- 引入 LoginModal 來顯示登入畫面 -->
          <LoginModal ref="loginModalRef" />
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref } from "vue";
  import LoginModal from "@/components/LoginModal.vue";
  
  // 定義 Props 和 Emits
  const props = defineProps({
    show: {
      type: Boolean,
      required: true
    },
    accountPage: {
      type: Object,
      required: true
    },
    userStore: {
      type: Object,
      required: true
    },
    openLoginModal: {
      type: Function,
      required: true
    },
    router: {
      type: Object,
      required: true
    },
    logout: {
      type: Function,
      required: true
    }
  });
  
  const emit = defineEmits(["close"]);
  
  const loginModalRef = ref(null);
  
  // 當使用者點擊會員登入時，先呼叫 openLoginModal，再關閉 Overlay
  function handleLogin() {
    props.openLoginModal();
    emit("close");
  }
  
  // 當使用者點擊會員資料時，進行路由跳轉後關閉 Overlay
  function handleProfile() {
    props.router.push("/profile");
    emit("close");
  }
  
  // 提供一個簡單的方法，讓連結點擊後也能關閉 Overlay
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
  
  /* 會員區塊 */
  .member-area {
    margin-bottom: 20px;
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
  