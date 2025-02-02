import { createRouter, createWebHistory } from "vue-router";

// 導入預設定路由的頁面
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Payment from "../pages/Payment.vue";
import DefaultLayout from "../layouts/Default.vue";
import PaymentLayout from "../layouts/PaymentLayout.vue";
import OrderConfirmation from "../components/PaymentPage/OrderConfirmation.vue";
import PaymentMethod from "../components/PaymentPage/PaymentMethod.vue";
import OrderComplete from "../components/PaymentPage/OrderComplete.vue";

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
                component: Payment,
            },
        ],
    },
];

// 建立路由實例
const router = createRouter({
    history: createWebHistory(), // 使用瀏覽器歷史模式
    routes, // 設定路由配置
});

// 匯出路由實例
export default router;
