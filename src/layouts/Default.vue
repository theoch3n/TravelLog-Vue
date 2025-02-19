<script setup>
// 導入頁首和頁尾元件
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Announcement from "../components/announcement.vue";
import PageTop from "../components/PageTop.vue";
</script>

<template>
    <v-app>
        <!-- 公告欄 -->
        <!-- 跑馬燈會擋到底下按鈕，修好再放回去 -->
        <!-- <Announcement /> -->
        <!-- 頁首區域 -->
        <Header />
        <!-- 主要內容區域，使用 Vuetify 的 v-main 元件 -->
        <v-main class="content d-flex flex-column">
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
        <!-- Page-Top -->
        <PageTop />
    </v-app>
</template>

<style scoped>
Header {
    padding-top: 40px;
}

Footer {
    flex-shrink: 0;
    margin-bottom: -1px;
    margin-top: auto;
}

.content {
    /* 讓主要內容區域佔據剩餘空間 */
    flex: 1;
    display: flex;
    flex-direction: column;
    /* flex-shrink: 0; */
    background-color: white;
}

/* 確保 <v-app> 佔滿視窗高度 */
.v-app {
    display: flex;
    flex-direction: column;
    /* 確保應用高度至少等於視窗高度 */
    min-height: 100vh;
}
</style>
