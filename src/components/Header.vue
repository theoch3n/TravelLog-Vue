<script setup>
import { ref, computed, defineProps } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay, useTheme } from "vuetify";
import LoginModal from "@/components/LoginModal.vue";
import Overlay from "@/components/Overlay.vue";
import { useUserStore } from "@/stores/userStore";

// 接收父層傳入的 overlay 相關 props
const props = defineProps({
  openOverlay: { type: Function, required: true },
  showOverlay: { type: Boolean, required: true },
  closeOverlay: { type: Function, required: true }
});



// 控制登入對話框與行動選單
const loginDialog = ref(false);
const mobileMenu = ref(false);
const { mdAndUp, mobile } = useDisplay();

const route = useRoute();
const pageTitle = ref("");

const userStore = useUserStore();
const router = useRouter();

function logout() {
  userStore.clearToken();
  router.push("/").then(() => {
    window.location.reload();
  });
}

// 定義選單（包含會員登入與會員資料）
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

const accountPage = computed(() => pages.find((page) => page.value === "Account"));
const filteredPages = computed(() =>
  pages.filter((page) => page.value !== "Account" && page.value !== "Profile")
);

// 取得 LoginModal 實例並提供開啟方法
const loginModalRef = ref(null);
function openLoginModal() {
  loginModalRef.value.show();
}

function handleProfileClick() {
  if (!userStore.isAuthenticated) {
    openLoginModal();
  } else {
    router.push("/profile");
  }
}


</script>

<template>
  <div>
    <!-- 引入登入對話框 -->
    <LoginModal ref="loginModalRef" />
    <!-- Header 區塊 -->
    <div class="desktop-header" >
      <div class="header-container">
        <!-- 左側：Overlay 區塊 -->
        <div class="left-section">
          <div class="overlay-container">
            <button class="overlay-btn" @click="props.openOverlay">
              ☰
            </button>
            <Overlay :show="props.showOverlay" @close="props.closeOverlay" :filteredPages="filteredPages"
              :userStore="userStore" :router="router" />

          </div>
        </div>
        <!-- 中間：LOGO 區塊 -->
        <!-- <div class="center-section">
          <div class="headerLogo">
            <a href="/">
              <img class="img-fluid" src="../assets/logo-removebg-preview.png" alt="TravelLog" />
            </a>
          </div>
        </div> -->
        <!-- 右側：會員系統區塊 -->
        <div class="right-section">
          <nav class="desktop-nav">

            <!-- 未登入：會員登入按鈕 -->
            <v-btn v-if="accountPage && !userStore.isAuthenticated" @click="openLoginModal" class="btn_account"
              :class="accountPage.textClass" text>
              <v-icon left>{{ accountPage.icon }}</v-icon>
              {{ accountPage.text }}
            </v-btn>
            <!-- 已登入：會員下拉選單 -->
            <v-menu v-else-if="userStore.isAuthenticated" offset-y>
              <template #activator="{ props: menuProps }">
                <v-btn text color="white" v-bind="menuProps" class="btn_account">
                  <v-icon left>mdi-account-circle</v-icon>
                  會員
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="router.push('/profile')">
                  <v-list-item-title>會員資料</v-list-item-title>
                </v-list-item>
                <v-list-item @click="logout">
                  <v-list-item-title>登出</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Header 整體容器：使用 flex 分左右中 */
.desktop-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  /* 你的 header 高度 */
  background-color: transparent;
  /* 或你想要的背景 */
  z-index: 1000;
  /* 確保在主內容上方 */
}


.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
}

/* 左側：固定寬度 */
.left-section {
  flex: 0 0 50px;
  display: flex;
  align-items: center;
}

/* 中間：自動擴展並置中 */
.center-section {
  flex: 1;
  text-align: center;
}

/* 右側：固定寬度 */
.right-section {
  flex: 0 0 50px;
  text-align: right;
}

/* overlay 區塊 */
.overlay-container {
  display: flex;
  align-items: center;
}

.overlay-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: rgb(0, 0, 0);
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  border-radius: 12px;
  padding: 12 12px;
  box-shadow: none !important;
}

/* LOGO 區塊 */
.headerLogo {
  display: inline-block;
  height: 50px;
  width: 200px;
}

/* Nav 相關 */
.desktop-nav .nav-bar  {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: transparent;
  z-index: 9999; /* 提升 z-index */
}

.btn_account {
  font-size: 24px;
  border-radius: 12px;
  padding: 12 12px;
  box-shadow: none !important;
  gap: 0px;
}

.tool-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
