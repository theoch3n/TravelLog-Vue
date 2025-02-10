import { createRouter, createWebHistory } from "vue-router";

// 導入預設定路由的頁面
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Payment from "../pages/Payment.vue";
import DefaultLayout from "../layouts/Default.vue";
import PaymentLayout from "../layouts/PaymentLayout.vue";
import AccountLayout from "../layouts/AccountLayout.vue";
import testPayment from "../pages/testPayment.vue";
import Account from "../pages/Account.vue";
import Register from "../pages/Register.vue";

// 定義路由配置
const routes = [
    {
        path: "/",
        component: DefaultLayout, // 使用 DefaultLayout 作為根組件
        children: [
            {
                path: "",
                name: "Home",
                component: Home,
            },
            {
                path: "/about",
                name: "About",
                component: About,
            },
        ],
    },
    {
        path: "/payment", // 路由路徑 (根目錄)
        name: "PaymentPage", // 路由名稱 (用於程式內部識別)
        component: PaymentLayout, // 使用 PaymentLayout 作為根組件
        meta: {
            layout: "PaymentLayout",
        },
        children: [
            {
                path: "",
                name: "Payment",
                component: testPayment,
            },
        ],
    },

    {
        path: "/account",
        // 移除這裡的 name 屬性
        component: AccountLayout,
        meta: {
            layout: "AccountLayout",
        },
        children: [
            {
                path: "",
                name: "Account", // 只有這裡保留 name
                component: Account,
            },
            {
                path: "/",
                name: "Register", // 只有這裡保留 name
                component: Register,
            },

        ],
    }
    
];

// 建立路由實例
const router = createRouter({
    history: createWebHistory(), // 使用瀏覽器歷史模式
    routes, // 設定路由配置
});

// 匯出路由實例
export default router;
