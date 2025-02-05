<script setup>
// 導入頁首和頁尾元件
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Announcement from "../components/announcement.vue";
import PageTop from "../components/PageTop.vue";
</script>

<template>
    <!-- 公告欄 -->
    <!-- <Announcement /> -->
    <!-- 頁首區域 -->
    <Header />
    <!-- 主要內容區域，使用 Vuetify 的 v-main 元件 -->
    <v-main class="content">
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
</template>

<style scoped>
Header {
    padding-top: 40px;
}

Footer {
    flex-shrink: 0;
    margin-bottom: -1px;
}

.content {
    padding-top: 104px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
</style>
