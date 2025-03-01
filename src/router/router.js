import { createRouter, createWebHistory } from "vue-router";

// 導入預設定路由的頁面
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Payment from "../pages/Payment.vue";
// import Products from "../pages/Products.vue";
import TravelPackage from "../pages/TravelPackage.vue";
import DefaultLayout from "../layouts/Default.vue";
import PaymentLayout from "../layouts/PaymentLayout.vue";
import AccountLayout from "../layouts/AccountLayout.vue";
import testPayment from "../pages/testPayment.vue";
import Googlemap from "../pages/Googlemap.vue";
import Account from "../pages/Account.vue";
import Register from "../pages/Register.vue";
import Itinerary from "../pages/Itinerary.vue";
import bill from "../pages/bill.vue";
import billList from "../pages/billList.vue";
import billDetails from "../pages/billDetails.vue";
import Contact from "../pages/Contact.vue";
import OrderDetail from "../pages/OrderDetail.vue";
import PaymentResult from "../pages/PaymentResult.vue";
import ItineraryTemp from "../pages/ItineraryTemp.vue";
import Profile from "@/components/Profile.vue";
import MyOrder from "@/pages/MyOrder.vue";
import VerifyEmail from "@/components/VerifyEmail.vue";
import ResetPassword from '@/pages/ResetPassword.vue'

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
                path: "/TravelPackage", // 路由路徑 (根目錄)
                name: "TravelPackage", // 路由名稱 (用於程式內部識別)
                component: TravelPackage, // 顯示的頁面
            },
            // {
            //     path: "/products", // 路由路徑 (根目錄)
            //     name: "Products", // 路由名稱 (用於程式內部識別)
            //     component: Products, // 顯示的頁面
            // },
            {
                path: "/Googlemap/:id", // 路由路徑 (根目錄)
                name: "Googlemap", // 路由名稱 (用於程式內部識別)
                component: Googlemap, // 顯示的頁面
            },
            {
                path: "/itinerary",
                name: "Itinerary",
                component: Itinerary,
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
            {
                path: "/ItineraryTemp",
                name: "ItineraryTemp",
                component: ItineraryTemp,
            },
            {
                path: "/profile",
                name: "Profile",
                component: Profile,
            },
            //防警告
            // [Vue Router warn]: No match found for location with path "/cart"
            {
                path: "/cart",
                name: "cart",
                // component: cart,
            },
            // 防警告
            // [Vue Router warn]: No match found for location with path "/paymentResult"
            {
                path: "/paymentResult",
                name: "paymentResult",
                // component: paymentResult,
            },
            // 防警告
            // [Vue Router warn]: No match found for location with path "/store"
            {
                path: "/store",
                name: "store",
                // component: store,
            },
            {
                path: "/myorder",
                name: "MyOrder",
                component: MyOrder,
            },
            {
                path: '/reset-password',
                name: 'ResetPassword',
                component: ResetPassword
              },
              {
                path: '/verify-email',
                name: 'VerifyEmail',
                component: VerifyEmail,
                props: route => ({ token: route.query.token })
              }
              
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
