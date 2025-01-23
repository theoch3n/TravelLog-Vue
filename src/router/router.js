import { createRouter, createWebHistory } from "vue-router";

// 導入預設定路由的頁面
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";

// 定義路由配置
const routes = [
    {
        path: "/", // 路由路徑 (根目錄)
        name: "Home", // 路由名稱 (用於程式內部識別)
        component: Home, // 顯示的頁面
    },
    {
        path: "/about", // 路由路徑 (根目錄)
        name: "About", // 路由名稱 (用於程式內部識別)
        component: About, // 顯示的頁面
    },
];

// 建立路由實例
const router = createRouter({
    history: createWebHistory(), // 使用瀏覽器歷史模式
    routes, // 設定路由配置
});

// 匯出路由實例
export default router;
