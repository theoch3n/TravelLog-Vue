import { createRouter, createWebHistory } from "vue-router";

// 導入預設定路由的頁面
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Payment from "../pages/Payment.vue";
import Products from "../pages/Products.vue";
import DefaultLayout from "../layouts/Default.vue";
import PaymentLayout from "../layouts/PaymentLayout.vue";
import AccountLayout from "../layouts/AccountLayout.vue";
import testPayment from "../pages/testPayment.vue";
import Googlemap from "../pages/Googlemap.vue";
import Account from "../pages/Account.vue";
import Register from "../pages/Register.vue";
import Itinerary from "../pages/Itinerary.vue";
import share from "../pages/Share.vue";
import Contact from "../pages/Contact.vue";
import OrderDetail from "../pages/OrderDetail.vue";
import PaymentResult from "../pages/PaymentResult.vue";

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
            {
                path: "/products", // 路由路徑 (根目錄)
                name: "Products", // 路由名稱 (用於程式內部識別)
                component: Products, // 顯示的頁面
            },
            {
                path: "/Googlemap", // 路由路徑 (根目錄)
                name: "Googlemap", // 路由名稱 (用於程式內部識別)
                component: Googlemap, // 顯示的頁面
            },
            {
                path: "/itinerary",
                name: "Itinerary",
                component: Itinerary,
            },
            {
                path: "/share", // 路由路徑 (根目錄)
                name: "share", // 路由名稱 (用於程式內部識別)
                component: share, // 顯示的頁面
            },
            {
                path: "/contact",
                name: "Contact",
                component: Contact,
            },
            {
                path: "/orderDetail",
                name: "OrderDetail",
                component: OrderDetail,
            },
            {
                path: "/paymentResult/:merchantTradeNo",
                name: "PaymentResult",
                component: PaymentResult,
                props: true,
            },
            // {
            //     path: "/:catchAll(.*)",
            //     redirect: "/",
            // },
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
        component: AccountLayout,
        meta: {
            layout: "AccountLayout",
        },
        children: [
            {
                path: "", // 當訪問 /account 時，顯示 Account 組件
                name: "Account",
                component: Account,
            },
            {
                path: "register", // 當訪問 /account/register 時，顯示 Register 組件
                name: "Register",
                component: Register,
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
