<template>
    <!-- Vuetify 根組件，所有內容必須包在 <v-app> 內 -->
    <v-app>
        <!-- 使用 router-view 的作用域插槽獲取當前路由的 Component 與 route -->
        <router-view v-slot="{ Component, route }">
            <!-- 根據當前路由 meta 中的 layout 屬性值動態選擇佈局組件 -->
            <component :is="getLayout(route.meta.layout)">
                <!-- 在所選佈局內渲染對應的頁面組件 -->
                <div class="page-container">
                    <component :is="Component" />
                </div>
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
    width: 100vw;
    height: 100vh;
    /* 讓整個應用佔滿畫面 */
    display: flex;
    flex-direction: column;
    background-color: white;
}

/* 讓 v-app 撐滿整個畫面 */
.v-application {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 讓 router-view 內的佈局撐滿 */
.layout-container {
    display: flex;
    flex-direction: column;
    /* 讓佈局填滿剩餘空間 */
    flex-grow: 1;
}

/* 讓頁面內容填滿佈局 */
.page-container {
    flex-grow: 1;
    width: 100%;
    display: flex;
    overflow: auto;
    /* 避免內容過多時影響整個頁面 */
    flex-direction: column;
}
</style>
