<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay, useTheme } from "vuetify";
import LoginModal from "@/components/LoginModal.vue";
import { useUserStore } from "@/stores/userStore";
import * as DarkReader from 'darkreader';

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
    <header class="desktop-header">
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


        <div class="d-flex gap-3 justify-content-end mt-5">
          <v-btn @click="toggleDarkMode" color="primary">
            {{ isDark ? '切換至亮色模式' : '切換至深色模式' }}
          </v-btn>
          <!-- 店面連結 -->
          <v-btn icon class="tool-button text-black" to="/store">
            <v-icon size="24">mdi-storefront</v-icon>
          </v-btn>
          <!-- 聯絡連結 -->
          <v-btn icon class="tool-button text-black" to="/contact">
            <v-icon size="24">mdi-chat</v-icon>
          </v-btn>
          <!-- 會員按鈕：點擊觸發 handleProfileClick -->
          <v-btn icon class="tool-button text-black" @click="handleProfileClick">
            <v-icon size="24">mdi-account</v-icon>
          </v-btn>
          <!-- 購物車連結 -->
          <v-btn icon class="tool-button text-black" to="/cart">
            <v-icon size="24">mdi-cart</v-icon>
          </v-btn>
        </div>

        <div class="d-flex justify-content-center align-items-center py-3">
          <div class="headerLogo">
            <a href="/">
              <img class="img-fluid" src="@/assets/logo.png" alt="TravelLog" />
            </a>
          </div>
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
    </header>

    <!-- Mobile Header -->
    <header class="mobile-header">
      <div class="container">
        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-sm">
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
                    <div class="col-sm-4 offset-sm-2">
                      <form action="" class="needs-validation" novalidate>
                        <div class="form-group mb-3">
                          <input type="text" class="form-control" id="sm-account" name="sm-account"
                            placeholder="電郵或手機號碼" required />
                          <div class="invalid-feedback">
                            電郵或手機號碼是必須的
                          </div>
                        </div>
                        <div class="form-group mb-3">
                          <input type="password" class="form-control" id="sm-password" name="sm-password"
                            placeholder="密碼" required />
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
        <div class="d-flex justify-content-between align-items-center px-3 py-2">
          <div class="d-flex gap-2">
            <a class="tool-button text-black" href="./store.html" data-bs-toggle="" aria-controls=""><i
                class="bi bi-shop-window fs-4 me-3"></i></a>
            <a class="tool-button text-black" href="javascript:;" data-bs-toggle="modal"
              data-bs-target="#exampleModal"><i class="bi bi-person-fill fs-3"></i></a>
          </div>
          <div class="logo " style="width: 80px">
            <a href="/">
              <img class="img-fluid " src="@/assets/logo-removebg-preview.png" alt="TravelLog" />
            </a>
          </div>
          <div class="d-flex gap-2">
            <a class="tool-button text-black" href="#cartMenu" data-bs-toggle="offcanvas" aria-controls="cartMenu"><i
                class="bi bi-bag-fill fs-3 me-3"></i></a>
            <button class="tool-button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile選單 -->
        <div class="offcanvas offcanvas-start" id="mobileMenu">
          <div class="offcanvas-body">
            <div class="d-flex flex-column">
              <a href="./product-list.html" class="nav-link">Payment</a>
              <a href="./index.html#brand" class="nav-link">關於我們</a>
              <a href="./faq.html" class="nav-link">客服中心</a>
              <a href="./faq.html" class="nav-link">Products</a>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!-- #endregion -->
  </div>
</template>

<style scoped>
.headerLogo {
  height: 100px;
  width: 187px;
  margin-left: 20px;
}

.header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 100%;
  z-index: 1000;
}

.v-container {
  width: 100%;
  padding: 0;
}

/* 通用樣式 */
.nav-link {
  color: #333 !important;
  font-size: 11.2px;
  line-height: 16px;
  font-family: "Noto Sans TC", sans-serif;
}

/* Desktop Header 樣式 */
.desktop-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  font-size: 11.2px;
  line-height: 16px;
}

@media (max-width: 992px) {
  .desktop-header {
    display: none;
  }
}

/* Mobile Header 樣式 */
.mobile-header {
  display: none;
}

@media (max-width: 992px) {
  .mobile-header {
    display: block;
  }
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
