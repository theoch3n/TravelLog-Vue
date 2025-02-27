<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay, useTheme } from "vuetify";
import LoginModal from "@/components/LoginModal.vue";
import { useUserStore } from "@/stores/userStore";
// import * as DarkReader from 'darkreader';

// // 取得主題物件
// const theme = useTheme()
// // 宣告一個 isDark 的 ref 來追蹤目前是否為暗色模式
// const isDark = ref(theme.global.name.value === 'dark')
// // 定義切換主題的函式
// function toggleDarkMode() {
//   isDark.value = !isDark.value
//   // 使用 theme 對象更新 Vuetify 的主题設定
//   theme.global.name.value = isDark.value ? 'dark' : 'light'
// }

const isDark = ref(false);
function toggleDarkMode() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    // 設定 Dark Reader 使用 window.fetch 處理跨來源請求
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

// 控制登入對話框 & 行動選單
const loginDialog = ref(false);
const mobileMenu = ref(false);

// 使用 Vuetify 提供的裝置偵測
const { mdAndUp, mobile } = useDisplay();

// 取得當前路由
const route = useRoute();
const pageTitle = ref("");

// 取得 Pinia store 與 router
const userStore = useUserStore();
const router = useRouter();

// 登出方法
function logout() {
  userStore.clearToken(); // 清除 Pinia 中的 token
  // 導向首頁後強制刷新頁面
  router.push("/").then(() => {
    window.location.reload();
  });
}

// 定義按鈕選單
// const buttons = [
//     { value: "", text: "首頁", icon: "mdi-home", textClass: "text-green", to: "/" },
//     { value: "payment", text: "Payment", icon: "mdi-file-account", textClass: "text-brown-darken-1", to: "/payment" },
//     { value: "about", text: "關於我們", icon: "mdi-information", textClass: "text-blue", to: "/about" },
//     { value: "contact", text: "客服中心", icon: "mdi-phone-incoming", textClass: "text-yellow-darken-4", to: "/contact" },
//     { value: "products", text: "Products", icon: "mdi-shopping", textClass: "text-purple-darken-4", to: "/products" },
// ];
// 定義選單
const pages = [
  {
    value: "payment",
    text: "Payment",
    textClass: "text-brown-darken-1",
    to: "/payment",
  },
  {
    value: "about",
    text: "關於我們",
    textClass: "text-blue",
    to: "/about",
  },
  {
    value: "contact",
    text: "客服中心",
    textClass: "text-yellow-darken-4",
    to: "/contact",
  },
  {
    value: "products",
    text: "Products",
    textClass: "text-purple-darken-4",
    to: "/products",
  },
  {
    value: "Itinerary",
    text: "行程",
    icon: "mdi-phone-incoming",
    textClass: "text-yellow-darken-4",
    to: "/Itinerary",
  },
  {
    value: "OrderDetail",
    text: "訂單詳情",
    textClass: "text-yellow-darken-4",
    to: "/orderDetail",
  },
  // {
  //   value: "Itinerary",
  //   text: "行程",
  //   icon: "mdi-phone-incoming",
  //   textClass: "text-yellow-darken-4",
  //   to: "/Googlemap",
  // },
  {
    value: "Account",
    text: "會員登入",
    icon: "mdi-account",
    textClass: "text-black",
    to: "/account",
  },
  {
    value: "Profile",
    text: "會員資料",
    icon: "mdi-account",
    textClass: "text-black",
    to: "/profile",
  },
  {
    value: "PaymentResult",
    text: "付款結果",
    textClass: "text-yellow-darken-4",
    to: "/paymentResult",
  },
  {
    value: "MyOrder",
    text: "我的訂單",
    textClass: "text-yellow-darken-4",
    to: "/myorder",
  },
];

// 監聽路由變化，確保導航按鈕與路由同步
// watch(route, () => {
//     const matchedButton = buttons.find((btn) => btn.to === route.path);
//     pageTitle.value = matchedButton ? matchedButton.value : "";
// });

// 頁面載入時同步導航按鈕狀態
// onMounted(() => {
//     const matchedButton = buttons.find((btn) => btn.to === route.path);
//     pageTitle.value = matchedButton ? matchedButton.value : "";
// });

// 從 pages 陣列中找出會員登入項目
const accountPage = computed(() =>
  pages.find((page) => page.value === "Account")
);

const filteredPages = computed(() =>
  // 過濾條件：排除 value 為 "Account" 和 "Profile" 的項目
  pages.filter((page) => page.value !== "Account" && page.value !== "Profile")
);

// 建立 ref 以存取子組件 LoginModel 的實例
const loginModalRef = ref(null);

// 按鈕點擊觸發子組件的方法
function openLoginModal() {
  loginModalRef.value.show();
}

// 點擊按鈕時依據登入狀態處理
function handleProfileClick() {
  if (!userStore.isAuthenticated) {
    // 未登入時打開登入模態框
    openLoginModal();
  } else {
    // 已登入則導向 /profile
    router.push("/profile");
  }
}
</script>

<template>
  <div>
    <!-- 引入子組件 -->
    <LoginModal ref="loginModalRef" />
    <!-- #region Header -->
    <!-- Desktop Header -->
    <div class="desktop-header">
      <div class="container">
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">登入</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- #region 表單 -->
                <!-- form
                            label.form-label{account}
                            input.form-control#account
                            label.form-label{password}
                            input.font-control#password[type="password"]
                            input:submit.btn.btn-primary[value="Log In"] -->
                <div class="container mt-3">
                  <div class="row">
                    <div class="col-md-8 offset-md-2">
                      <form action="" class="needs-validation" novalidate>
                        <div class="form-group mb-3">
                          <input type="text" class="form-control" id="account" name="account" placeholder="電郵或手機號碼"
                            required />
                          <div class="invalid-feedback">
                            電郵或手機號碼是必須的
                          </div>
                        </div>
                        <div class="form-group mb-3">
                          <input type="password" class="form-control" id="password" name="password" placeholder="密碼"
                            required />
                          <div class="invalid-feedback">密碼是必須的</div>
                        </div>
                        <p class="text-start">
                          <a href="" class="text-primary text-decoration-none a-pwd">忘記密碼?</a>
                        </p>
                        <div class="text-center btn-login">
                          <input type="submit" value="開始購物吧!" class="btn text-white" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <!-- #endregion -->
              </div>
              <!-- <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div> -->
            </div>
          </div>
        </div>


        <div class="py-3 headerLogo">

          <a href="/">
            <img class="img-fluid " src="../assets/logo-removebg-preview.png" alt="TravelLog" />
          </a>

        </div>

        <!-- 導航菜單 -->
        <nav class="desktop-nav">
          <v-btn v-for="(page, index) in filteredPages" :to="page.to" :key="index">
            {{ page.text }}
          </v-btn>

          <!-- 未登入：會員登入按鈕 -->
          <v-btn v-if="accountPage && !userStore.isAuthenticated" @click="openLoginModal" class="mx-2"
            :class="accountPage.textClass" text>
            <v-icon left>{{ accountPage.icon }}</v-icon>
            {{ accountPage.text }}
          </v-btn>

          <!-- 已登入：會員資料 -->
          <v-btn v-if="userStore.isAuthenticated" @click="router.push('/profile')" class="mx-2" color="primary" text>
            <v-icon left>mdi-account-circle</v-icon>
            會員資料
          </v-btn>

          <!-- 已登入：登出 -->
          <v-btn v-if="userStore.isAuthenticated" @click="logout" class="mx-2" color="error" text>
            <v-icon left>mdi-logout</v-icon>
            登出
          </v-btn>
        </nav>
        <!-- <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form> -->
      </div>
    </div>


  </div>
</template>

<style scoped>
.img-sunmoon {
  height: 10px;
}

.headerLogo {
  position: absolute;
  /* 設定絕對定位 */
  top: 0;
  /* 距離頂部 0 */
  left: 0;
  /* 距離左側 0 */
  height: 50px;
  /* LOGO 高度 */
  width: 200px;
  /* LOGO 寬度 */
  z-index: 999;
  /* 確保 LOGO 在最上層 */
  padding-left: 80px;

}




/* Desktop Header 樣式 */
.desktop-nav {
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 0;
  font-size: 11.2px;
  line-height: 16px;
  padding-left: 60px;

}







/* 工具列按鈕樣式 */
.tool-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.tool-button svg {
  width: 20px;
  height: 20px;
}

#mobileMenu {
  max-width: 280px;
}

#cartMenu {
  max-width: 280px;
}

.tool-button {
  transition: transform 0.1s ease;
}

/* 當按鈕被點擊（active 狀態），縮小至 95% */
.tool-button:active {
  transform: scale(0.75);
}
</style>
