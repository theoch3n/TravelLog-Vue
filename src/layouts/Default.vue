<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Overlay from "@/components/Overlay.vue";
import LoginModal from "@/components/LoginModal.vue";
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
import PageTop from "@/components/PageTop.vue";
import Footer from "@/components/Footer.vue";
import { useUserStore } from "@/stores/userStore";

// 先初始化 router 與 userStore
const router = useRouter();
const userStore = useUserStore();

// 定義 logout 函式（確保 userStore 與 router 已定義）
function logout() {
  userStore.clearToken();
  router.push("/").then(() => {
    window.location.reload();
  });
}

const showOverlay = ref(false);
function openOverlay() {
  showOverlay.value = true;
}
function closeOverlay() {
  showOverlay.value = false;
}

const pages = [
  { value: "payment", text: "Payment", textClass: "text-brown-darken-1", to: "/payment" },
  { value: "about", text: "關於我們", textClass: "text-blue", to: "/about" },
  { value: "contact", text: "客服中心", textClass: "text-yellow-darken-4", to: "/contact" },
  { value: "TravelPackage", text: "TravelPackage", textClass: "text-purple-darken-4", to: "/TravelPackage" },
  { value: "Itinerary", text: "行程", icon: "mdi-phone-incoming", textClass: "text-yellow-darken-4", to: "/Itinerary" },
  { value: "OrderDetail", text: "訂單詳情", textClass: "text-yellow-darken-4", to: "/orderDetail" },
  { value: "Account", text: "會員登入", icon: "mdi-account", textClass: "text-black", to: "/account" },
  { value: "Profile", text: "會員資料", icon: "mdi-account", textClass: "text-black", to: "/profile" },
  { value: "PaymentResult", text: "付款結果", textClass: "text-yellow-darken-4", to: "/paymentResult" },
  { value: "MyOrder", text: "我的訂單", textClass: "text-yellow-darken-4", to: "/myorder" }
];

const accountPage = computed(() => pages.find(page => page.value === "Account") || {});
const filteredPages = computed(() =>
  pages.filter(page => page.value !== "Account" && page.value !== "Profile")
);

const loginModalRef = ref(null);
function openLoginModal() {
  if (loginModalRef.value && loginModalRef.value.show) {
    loginModalRef.value.show();
  } else {
    console.warn("LoginModal 沒有正確定義 show 方法");
  }
}
</script>

<template>
  <v-app>
    <!-- 全域 Overlay -->
    <Overlay 
      :show="showOverlay" 
      @close="closeOverlay" 
      :filteredPages="filteredPages" 
      :accountPage="accountPage" 
      :userStore="userStore" 
      :openLoginModal="openLoginModal" 
      :router="router" 
      :logout="logout"
    />

    <!-- Login Modal -->
    <LoginModal ref="loginModalRef" />

    <!-- 公告欄（根據需要啟用） -->
    <!-- <Announcement /> -->

    <!-- 側邊欄 -->
    <aside>
      <Sidebar :openOverlay="openOverlay" />
    </aside>

    <!-- Header -->
    <nav>
      <Header />
    </nav>

    <!-- 主要內容區域 -->
    <main>
      <v-main class="content d-flex flex-column">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-main>
      <PageTop />
    </main>

    <!-- Footer -->
    <footer>
      <Footer />
    </footer>
  </v-app>
</template>

<style scoped>
nav {
  padding-left: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  background-color: white;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding-right: 20px;
}

main {
  margin-left: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
}

footer {
  margin-left: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
