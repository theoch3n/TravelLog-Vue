<template>
  <transition name="overlay-slide">
    <div v-if="show" class="overlay">
      <div class="inner">
        <slot>
          <h2>
            <div class="pacifico-regular">Traveling Your Log</div>
          </h2>

        </slot>
        <!-- 會員相關區塊（固定於右上角） -->
        <div class="member-area">
          <!-- 未登入：會員登入按鈕 -->
          <v-btn v-if="accountPage && !userStore.isAuthenticated" @click="handleLogin" class="btn_account"
            :class="accountPage.textClass" text>
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

        <!-- 導覽列：左右分割，分別置於左半邊與右半邊正中間 -->
        <nav class="overlay-nav" v-if="filteredPages && filteredPages.length">
          <div class="nav-left">
            <ul>
              <li v-for="page in leftPages" :key="page.value">
                <router-link :to="page.to" @click="emitClose">
                  {{ page.text }}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="nav-right">
            <ul>
              <li v-for="page in rightPages" :key="page.value">
                <router-link :to="page.to" @click="emitClose">
                  {{ page.text }}
                </router-link>
              </li>
            </ul>
          </div>
        </nav>

        <!-- 固定圖片區塊（挖出的空間） -->
        <div class="image-area">
          <!-- 在這裡放置你的圖片或任何想顯示的元素 -->
          <!-- 以下為示範，可以直接使用 @/assets/yourImage.jpg 或其他圖片路徑 -->
          <img src="@/assets/banner04.jpeg" alt="Demo Image" />
        </div>

        <!-- Overlay 主要內容（slot），可由父層覆寫 -->
 

        <!-- 關閉按鈕 -->
        <button class="close-btn" @click="emitClose">

          <v-icon left class="mr-2">mdi-close</v-icon>
        </button>
        <!-- 其他元件，例如 LoginModal -->
        <LoginModal />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import LoginModal from "@/components/LoginModal.vue";
import '@/assets/main.css';

const props = defineProps({
  show: { type: Boolean, required: true },
  filteredPages: { type: Array, default: () => [] },
  userStore: { type: Object, default: () => ({}) },
  router: { type: Object, default: () => ({}) },
  accountPage: { type: Object, required: false },
  openLoginModal: { type: Function, required: false },
  logout: { type: Function, required: false }
});
const emit = defineEmits(["close"]);

// 將 filteredPages 平均分割成左右兩組
const leftPages = computed(() => {
  return props.filteredPages.slice(0, Math.ceil(props.filteredPages.length / 2));
});
const rightPages = computed(() => {
  return props.filteredPages.slice(Math.ceil(props.filteredPages.length / 2));
});

// 簡化關閉事件
const emitClose = () => emit("close");

// 點擊會員登入：呼叫父層函式（如果有提供）後關閉 Overlay
const handleLogin = () => {
  if (props.openLoginModal) {
    props.openLoginModal();
  }
  emitClose();
};

// 點擊會員資料，導向後關閉 Overlay
const handleProfile = () => {
  props.router.push("/profile");
  emitClose();
};
</script>

<style scoped>
.btn_account {
  display: flex;
  justify-content: center;  /* 水平置中 */
  align-items: center;      /* 垂直置中 */

  /* 其他設定 */
  font-size: 24px;
  padding: 16px 20px;
  border: none;
  border-radius: 12px;
  box-sizing: border-box;
  box-shadow: none !important;
  gap: 2px;
  background-color: #fff; /* 舉例，如果需要白底 */
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

/* 內部容器設定 relative 以供內部絕對定位參考 */
.inner {
  position: relative;
  color: #fff;
  text-align: center;
  padding: 20px;
  background: #000;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0;
}

/* 會員區塊固定於右上角 */
.member-area {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
}

/* 導覽列左右分割 */
.overlay-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 左右兩邊各佔 50%，內容置中 */
.nav-left,
.nav-right {
  width: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-left ul,
.nav-right ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-left li,
.nav-right li {
  margin: 10px 20px;
}

/* 調整導覽列連結字體大小為 36px，移除外框，僅在 hover 時字體變色 */
.nav-left li a,
.nav-right li a {
  color: #fff;
  text-decoration: none;
  font-size: 48px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  background: transparent;
  transition: color 0.3s ease;
}

.nav-left li a:hover,
.nav-right li a:hover {
  color: #f08400;
}

/* 圖片區塊：位置與大小可自訂 */
.image-area {
  /* 使用絕對定位，使此區塊脫離正常文檔流，可透過 top、left 來精準控制位置 */
  position: absolute;
  /* 固定此區塊的寬度與高度為 300×300 像素 */
  width: 500px;
  height: 500px;
  /* 以視窗的 50% 作為定位點，並透過 transform 置中 */
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 設定容器為圓形 (圓角 50%) */
  border-radius: 50%;
  /* 使超出容器邊界的內容(圖片)被隱藏，防止超出範圍 */
  overflow: hidden;
  /* 添加 2px 寬的白色實線邊框，方便視覺辨識該區塊範圍 */
}

.image-area img {
  /* 讓圖片寬度填滿容器 100% */
  width: 100%;
  /* 讓圖片高度自動填滿容器，並維持圖片本身的比例 */
  height: 100%;
  /* 使圖片自動裁切或放大來覆蓋容器，常用於背景式填滿效果 */
  object-fit: cover;
}

h2 {
  font-size: 100px;
  /* 字體大小 */
  font-weight: bold;
  /* 粗細 */
  color: #ffa600;
  /* 文字顏色 */
  font-family: 'Arial', sans-serif;
  margin-top: -40px;
}

/* 圖片自訂樣式 */
.image-area img {
  max-width: 100%;
  height: auto;
}

/* 關閉按鈕 */
.close-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  background: #fff;
  border-radius: 12px;
  color: #000;
  border: none;
  cursor: pointer;
}

/* Overlay 進出場動畫 */
.overlay-slide-enter-active {
  animation: slideIn 1000ms ease-out forwards;
}

.overlay-slide-leave-active {
  animation: slideOut 1000ms ease-in forwards;
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
