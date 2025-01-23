<script setup>
// 導入頁首和頁尾元件
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
    <!-- 頁首區域 -->
    <Header />
    <!-- 主要內容區域，使用 Vuetify 的 v-main 元件 -->
    <v-main>
        <!-- 
            路由視圖區域：
            - v-slot="{ Component }" 接收當前路由對應的元件
            - 使用動態元件渲染路由內容
        -->
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
    </v-main>
    <!-- 頁尾區域 -->
    <Footer />
</template>

<style scoped>
/* 主要內容區域的樣式，設定上方內距為 64px，避免被 Header 遮擋 */
.v-main {
    padding-top: 64px;
}
</style>
