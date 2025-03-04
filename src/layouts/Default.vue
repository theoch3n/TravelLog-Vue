<template>
  <v-app>
    <!-- 全域 Overlay -->
    <Overlay
      :show="showOverlay"
      @close="closeOverlay"
      :filteredPages="filteredPages"
      :userStore="userStore"
      :router="router"
      :accountPage="accountPage"
      :openLoginModal="openLoginModal"
      :logout="logout"
    >
      <!-- 預設內容，可覆寫 -->
      <template #default>
        <h2>Default Overlay Content</h2>
        <p>This is the default content that you can customize.</p>
      </template>
    </Overlay>

    <!-- 背景內容包裹容器，根據 showOverlay 改變背景色 -->
    <div class="page-container" :class="{ 'move-bg': showOverlay }">
      <!-- Header -->
      <nav style="width: 100%;">
        <Header
          :openOverlay="openOverlay"
          :showOverlay="showOverlay"
          :closeOverlay="closeOverlay"
        />
      </nav>

      <!-- 主要內容區域 -->
      <main>
        <v-main class="content d-flex flex-column">
          <router-view v-slot="{ Component }" class="router-view-container">
            <component :is="Component" />
          </router-view>
        </v-main>
        <!-- PageTop -->
        <PageTop />
      </main>

      <!-- 頁尾 -->
      <footer>
        <Footer />
      </footer>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Overlay from "@/components/Overlay.vue";
import Header from "@/components/Header.vue";
import PageTop from "@/components/PageTop.vue";
import Footer from "@/components/Footer.vue";
import { useUserStore } from "@/stores/userStore";

// 初始化 router 與 userStore
const router = useRouter();
const userStore = useUserStore();

// 控制顯示或關閉 Overlay
const showOverlay = ref(false);
function openOverlay() {
  showOverlay.value = true;
}
function closeOverlay() {
  showOverlay.value = false;
}

// 定義頁面列表
const pages = [
  { value: "payment", text: "Payment", textClass: "text-brown-darken-1", to: "/payment" },
  { value: "about", text: "關於我們", textClass: "text-blue", to: "/about" },
  { value: "contact", text: "客服中心", textClass: "text-yellow-darken-4", to: "/contact" },
  { value: "TravelPackage", text: "TravelPackage", textClass: "text-purple-darken-4", to: "/TravelPackage" },
  { value: "Itinerary", text: "行程", icon: "mdi-phone-incoming", textClass: "text-yellow-darken-4", to: "/Itinerary" },
  { value: "OrderDetail", text: "訂單詳情", textClass: "text-yellow-darken-4", to: "/orderDetail" },
  { value: "PaymentResult", text: "付款結果", textClass: "text-yellow-darken-4", to: "/paymentResult" },
  { value: "MyOrder", text: "我的訂單", textClass: "text-yellow-darken-4", to: "/myorder" }
];

const filteredPages = computed(() => pages);

// 如果需要帳號相關功能
const accountPage = computed(() => pages.find(page => page.value === "Account"));
function openLoginModal() {
  // 這個函式需要搭配 LoginModal 元件的引用
}
function logout() {
  userStore.clearToken();
  router.push("/").then(() => {
    window.location.reload();
  });
}
</script>

<style scoped>
/* 包裹背景內容的容器，對 transform 與 background-color 做過渡 */
.page-container {
  transition: transform 1000ms ease-out, background-color 1000ms ease-out;
  background-color: rgb(255, 255, 255);
}


/* 以下為原有樣式，可依需求調整 */
nav {
  padding-left: 0; 
  display: flex;
  align-items: center;
  height: 60px;
  background-color: transparent;
  width: 100%;
  box-shadow: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

main {
  margin-left: 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  position: relative;
  z-index: 5;
  margin-top: 60px;
}

footer {
  margin-left: 0px;
  flex: none;
  display: flex;
  flex-direction: column;
  background-color: transparent !important;
  padding: 10px 0;
  min-height: 60px;
  position: relative;
  z-index: 10;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  position: relative;
}

.router-view-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: transparent;
}
</style>
