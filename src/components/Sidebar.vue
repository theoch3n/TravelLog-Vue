<template>
    <!-- 引入子組件 -->
    <LoginModal ref="loginModalRef" />

    <header class="sidebar" @mouseenter="show = true" @mouseleave="show = false">
        <div class="sidebar-inner" :class="{ 'sidebar-show': show }">
            <ul class="sidebar-menu">
                <li>
                    <button @click="toggleDarkMode" class="tool-button text-black"
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

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import LoginModal from "@/components/LoginModal.vue"; // 引入 LoginModal 組件

export default {
    components: {
        LoginModal, // 註冊子組件
    },
    setup() {
        // 控制登入對話框 & 行動選單
        const loginDialog = ref(false);
        const mobileMenu = ref(false);
        const show = ref(false);
        const isDark = ref(false);
        const loginModalRef = ref(null); // 使用 ref 引用 LoginModal
        const router = useRouter(); // 引入 Vue Router
        // 從 pages 陣列中找出會員登入項目
        const accountPage = computed(() =>
            pages.find((page) => page.value === "Account")
        );

        const filteredPages = computed(() =>
            // 過濾條件：排除 value 為 "Account" 和 "Profile" 的項目
            pages.filter((page) => page.value !== "Account" && page.value !== "Profile")
        );
        // 切換深色模式
        const toggleDarkMode = () => {
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
        };
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
        // 控制登入模態框顯示
        const openLoginModal = () => {
            if (loginModalRef.value) {
                loginModalRef.value.show();
            }
        };


        // 點擊會員中心按鈕，根據用戶登入狀態進行處理
        const handleProfileClick = () => {
            // 假設 userStore.isAuthenticated 是用來檢查登入狀態的
            const isAuthenticated = false; // 這邊應該從你的狀態管理（例如 Vuex 或 Pinia）獲取登入狀態
            if (!isAuthenticated) {
                openLoginModal(); // 未登入時打開登入模態框
            } else {
                router.push("/profile"); // 已登入則跳轉到 profile 頁面
            }
        };

        // 導向不同頁面
        const navigateToStore = () => {
            router.push("/store");
        };

        const navigateToContact = () => {
            router.push("/contact");
        };

        const navigateToCart = () => {
            router.push("/cart");
        };

        return {
            show,
            isDark,
            loginModalRef,
            toggleDarkMode,
            handleProfileClick,
            navigateToStore,
            navigateToContact,
            navigateToCart,
        };
    },
};

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
    min-height: 100vh;
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
</style>
