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
                <router-view v-slot="{ Component }">
                    <component :is="Component" />
                </router-view>
            </v-main>
            <!-- Page-Top -->
            <PageTop />
        </main>


        <footer> <!-- 頁尾區域 -->
            <Footer />
        </footer>





    </v-app>
</template>

<style scoped>
nav {
    padding-left: 200px;
    /* 讓內部內容向右偏移 */
    display: flex;
    align-items: center;
    /* 垂直置中 */
    justify-content: flex-end;
    /* 水平靠右 */
    height: 60px;
    /* 高度設定 */
    background-color: white;
    /* 背景色 */
    width: 100%;
    /* 讓 nav 佔滿整個寬度 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    /* 陰影美化 */
    padding-right: 20px;
    /* 新增的右側間隔 */
}



/* 調整主內容區域 */
main {
    margin-left: 20px;
    /* 確保內容不被側邊欄擋住 */
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
}

Footer {
    margin-left: 20px;
    /* 確保內容不被側邊欄擋住 */
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
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
