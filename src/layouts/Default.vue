<script setup>
// 導入頁首和頁尾元件
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Sidebar from "../components/Sidebar.vue";
import Announcement from "../components/announcement.vue";
import PageTop from "../components/PageTop.vue";
import { ref } from 'vue'

// 定義用來控制 overlay 顯示狀態的 reactive 變數
const showOverlay = ref(false)

// 開啟 overlay 的方法（你可以從頁面中觸發，例如按鈕）
function openOverlay() {
    showOverlay.value = true
}

// 關閉 overlay 的方法
function closeOverlay() {
    showOverlay.value = false
}
</script>

<template>
    <v-app>
        <!-- 全域 Overlay -->
        <transition name="fade">
            <div v-if="showOverlay" class="overlay">
                <div class="inner">
                    <h2>新視窗內容</h2>
                    <p>這個區塊會覆蓋整個頁面。</p>
                    <button class="close-btn" @click="closeOverlay">關閉</button>
                </div>
            </div>
        </transition>
        <!-- 公告欄 -->
        <!-- 跑馬燈會擋到底下按鈕，修好再放回去 -->
        <!-- <Announcement /> -->

        <!-- 側邊欄 -->
        <aside>
            <Sidebar :openOverlay="openOverlay" />
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

/* Overlay 基本樣式 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.inner {
    color: #fff;
    text-align: center;
}

.close-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background: #fff;
    color: #000;
    border: none;
    cursor: pointer;
}

/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
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
