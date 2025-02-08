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
                <component :is="Component" />
            </component>
        </router-view>
    </v-app>

</template>

<style>
#app {
    position: relative;
    width: 100%;
    max-width: 100%;
    padding-left: 0px;
    padding-right: 0px;
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
