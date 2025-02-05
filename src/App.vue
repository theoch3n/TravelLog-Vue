<script setup>
// 引入 Default.vue 作為預設佈局元件
import DefaultLayout from "./layouts/Default.vue";
// 引入 PaymentLayout.vue 作為付款頁面佈局元件
import PaymentLayout from "./layouts/PaymentLayout.vue";
</script>

<template>
    <!-- 使用 Vuetify 的 v-app 組件作為應用程式的根元素 -->
    <v-app>
        <!-- 使用 router-view 的作用域插槽來動態渲染佈局 -->
        <router-view v-slot="{ Component, route }">
            <!-- 根據路由的 meta 資訊動態選擇佈局組件 -->
            <component :is="route.meta.layout === 'PaymentLayout' ? PaymentLayout : DefaultLayout">
                <!-- 在選定的佈局中渲染對應的頁面組件 -->
                <div class="page-container">
                    <component :is="Component" />
                </div>
            </component>
        </router-view>
    </v-app>
</template>

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
