<script setup>
// 導入頁首和頁尾元件
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Sidebar from "../components/Sidebar.vue";
import Announcement from "../components/announcement.vue";
import PageTop from "../components/PageTop.vue";
</script>

<template>
    <v-app>
        <!-- 公告欄 -->
        <!-- 跑馬燈會擋到底下按鈕，修好再放回去 -->
        <!-- <Announcement /> -->

        <!-- 側邊欄 -->
        <aside>
            <Sidebar></Sidebar>
        </aside>
        <!-- 上方導覽欄 -->
        <nav>
            <Header />
        </nav>

        <!-- 主要內容區域，使用 Vuetify 的 v-main 元件 -->
        <main>
            <v-main class="content d-flex flex-column">
                <!--
            路由視圖區域：
            - v-slot="{ Component }" 接收當前路由對應的元件
            - 使用動態元件渲染路由內容
        -->
                <router-view v-slot="{ Component }" class="router-view-container">
                    <component :is="Component" />
                </router-view>
            </v-main>
            <!-- Page-Top -->
            <PageTop />
        </main>
        <!-- 頁尾 -->
        <footer>
            <Footer />
        </footer>





    </v-app>
</template>

<style scoped>
nav {
    padding-left: 200px;
    display: flex;
    align-items: center;
    height: 60px;
    background-color: transparent;
    width: 100%;
    box-shadow: none;
    position: relative;
    z-index: 10;
}


/* 調整主內容區域 */
main {
    margin-left: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    position: relative;
    z-index: 5;
}


Footer {
    margin-left: 20px;
    flex: none;
    display: flex;
    flex-direction: column;
    background-color: transparent !important;
    padding: 10px 0;
    min-height: 60px;
    position: relative;
    z-index: 10;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    position: relative;
}

.router-view-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

/* 確保 <v-app> 佔滿視窗高度 */
.v-app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: transparent;
}
</style>
