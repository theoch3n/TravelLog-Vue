<template>
    <!-- Vuetify 根組件，所有內容必須包在 <v-app> 內 -->
    <v-app>
        <!-- 使用 router-view 的作用域插槽獲取當前路由的 Component 與 route -->
        <router-view v-slot="{ Component, route }">
            <!-- 根據當前路由 meta 中的 layout 屬性值動態選擇佈局組件 -->
            <component :is="getLayout(route.meta.layout)">
                <!-- 在所選佈局內渲染對應的頁面組件 -->
                <component :is="Component" />
            </component>
        </router-view>
    </v-app>
</template>

<script setup>
/* 引入三個佈局元件：
   - DefaultLayout: 預設佈局（一般情況下使用）
   - PaymentLayout: 付款頁面專用的佈局
   - AccountLayout: 會員登入頁面專用的佈局 */
import DefaultLayout from "./layouts/Default.vue";
import PaymentLayout from "./layouts/PaymentLayout.vue";
import AccountLayout from "./layouts/AccountLayout.vue";

/**
 * 根據傳入的佈局名稱，返回對應的佈局組件
 * @param {string} layoutName - 從路由 meta 中傳入的佈局名稱
 * @returns {Component} 返回相對應的佈局元件
 *
 * 如果 layoutName 為 "PaymentLayout"，則返回 PaymentLayout 組件；
 * 如果 layoutName 為 "AccountLayout"，則返回 AccountLayout 組件；
 * 若不符合上述條件，則返回 DefaultLayout 組件作為預設。
 */
function getLayout(layoutName) {
    if (layoutName === "PaymentLayout") return PaymentLayout;
    if (layoutName === "AccountLayout") return AccountLayout;
    return DefaultLayout;
}
</script>
<style>
#app {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    background-color: white;
}

body {
    background-color: white;
    margin: 0;
    padding: 0;
}

.v-application,
.v-application__wrap {
    background-color: white;
    margin: 0 !important;
    padding: 0 !important;
}
</style>
