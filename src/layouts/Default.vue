<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Overlay from "@/components/Overlay.vue";
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
import PageTop from "@/components/PageTop.vue";
import Footer from "@/components/Footer.vue";
import { useUserStore } from "@/stores/userStore";

// 初始化 router 與 userStore
const router = useRouter();
const userStore = useUserStore();

const showOverlay = ref(false);
function openOverlay() {
  showOverlay.value = true;
}
function closeOverlay() {
  showOverlay.value = false;
}

// 調整頁面列表，移除會員登入與會員資料的選項
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
</script>

<template>
  <v-app>
    <!-- 全域 Overlay -->
    <Overlay 
      :show="showOverlay" 
      @close="closeOverlay" 
      :filteredPages="filteredPages" 
      :userStore="userStore" 
      :router="router" 
    />

    <!-- 側邊欄，不再傳入 openOverlay -->
    <!-- <aside>
      <Sidebar />
    </aside> -->

    <!-- Header 傳入 openOverlay 以供觸發 Overlay -->
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
      <!-- Page-Top -->
      <PageTop />
    </main>

    <!-- 頁尾 -->
    <footer>
      <Footer />
    </footer>
  </v-app>
</template>

<style scoped>

nav {
  padding-left: 0; 
  display: flex;
  align-items: center;
  height: 60px;
  background-color: transparent;
  width: 100%;
  box-shadow: none;
  position: fixed; /* 改為固定定位 */
  top: 0;          /* 固定在螢幕上方 */
  left: 0;         /* 固定在螢幕左側 */
  z-index: 1000;   /* 設定一個高的 z-index 以確保最上層 */
}



main {
  margin-left: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  position: relative;
  z-index: 5;
}

Footer {
  margin-left: 20px;
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
