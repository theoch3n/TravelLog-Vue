<template>
    <header class="sidebar" @mouseenter="show = true" @mouseleave="show = false">
      <div class="sidebar-inner" :class="{ 'sidebar-show': show }">
        <ul class="sidebar-menu">
          <!-- 第一個選單項：觸發 overlay -->
          <li>
            <button @click="openOverlay" class="overlay-btn">顯示 Overlay</button>
          </li>
          <!-- 其他選單項目 -->
          <li>
            <button
              @click="toggleDarkMode"
              class="tool-button text-black"
              style="display: flex; align-items: center; background: none; border: none; padding: 0;">
              <i class="mdi" style="font-size: 24px; margin-right: 8px;">
                <template v-if="isDark">
                  <i class="bi bi-sun-fill" style="font-size: 24px;"></i>
                </template>
                <template v-else>
                  <i class="bi bi-cloud-moon-fill" style="font-size: 24px;"></i>
                </template>
              </i>
            </button>
          </li>
          <li>
            <i class="mdi mdi-account" style="font-size: 24px;"></i>
            <button @click="handleProfileClick">
              <span>會員中心</span>
            </button>
          </li>
          <li>
            <i class="mdi mdi-storefront" style="font-size: 24px;"></i>
            <button @click="navigateToStore">
              <span>包套行程</span>
            </button>
          </li>
          <li>
            <i class="mdi mdi-chat" style="font-size: 24px;"></i>
            <button @click="navigateToContact">
              <span>聯絡我們</span>
            </button>
          </li>
          <li>
            <i class="mdi mdi-cart" style="font-size: 24px;"></i>
            <button @click="navigateToCart">
              <span>購物車</span>
            </button>
          </li>
        </ul>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import * as DarkReader from "darkreader";
  
  // 從父層接收 openOverlay 方法
  const props = defineProps({
    openOverlay: {
      type: Function,
      required: true
    }
  });
  
  const router = useRouter();
  const show = ref(false);
  const isDark = ref(false);
  
  // 點擊按鈕時呼叫父層 openOverlay 方法
  function openOverlay() {
    props.openOverlay();
  }
  
  // 切換深色模式（示範用，請依需求調整）
  function toggleDarkMode() {
    isDark.value = !isDark.value;
    if (isDark.value) {
      DarkReader.setFetchMethod(window.fetch);
      DarkReader.enable({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      DarkReader.disable();
    }
  }
  
  // 點擊會員中心，依狀態決定行為（此處僅示範）
  function handleProfileClick() {
    const isAuthenticated = false; // 實際應從狀態管理取得
    if (!isAuthenticated) {
      alert("請先登入！");
    } else {
      router.push("/profile");
    }
  }
  
  function navigateToStore() {
    router.push("/store");
  }
  
  function navigateToContact() {
    router.push("/contact");
  }
  
  function navigateToCart() {
    router.push("/cart");
  }
  </script>
  
  <style scoped>
  header.sidebar {
    display: flex;
    min-height: 100vh;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 50px;
    z-index: 1000;
    background-color: #f0f4f8;
    transition: width 0.3s ease;
    overflow: hidden;
    display: flex;
  }
  
  .sidebar:hover {
    width: 200px;
  }
  
  .sidebar-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 20px 0;
    overflow: hidden;
  }
  
  .sidebar-show {
    width: 220px;
  }
  
  .sidebar-logo img {
    width: 60px;
    margin-bottom: 20px;
  }
  
  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  
  .sidebar-menu li {
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .sidebar-menu li:hover {
    background: #d9e4fc;
  }
  
  .sidebar-menu li span {
    margin-left: 10px;
    font-size: 16px;
    color: #333;
    transition: opacity 0.3s ease;
    opacity: 0;
  }
  
  .sidebar-show .sidebar-menu li span {
    opacity: 1;
  }
  
  /* 按鈕樣式 */
  .overlay-btn {
    padding: 10px;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  