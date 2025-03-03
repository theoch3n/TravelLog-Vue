<template>
    <header class="sidebar" @mouseenter="show = true" @mouseleave="show = false">
        <div class="sidebar-inner" :class="{ 'sidebar-show': show }">
            <ul class="sidebar-menu">
                <!-- 第一個選單項：觸發 overlay -->
                <li>
                    <div>
                        <button @click="openOverlay" class="overlay-btn">顯示 Overlay</button>
                        <transition name="overlay-slide">
                            <div v-if="showOverlay" class="overlay">
                                <div class="inner">
                                    <h2>這是 Overlay</h2>
                                    <p>從上方滑落進場動畫</p>
                                    <button @click="closeOverlay" class="close-btn">關閉</button>
                                </div>
                            </div>
                        </transition>
                    </div>
                </li>
                <!-- 其他選單項目 -->
                <li>
                    <button @click="toggleDarkMode" class="tool-button text-black"
                        style="display: flex; align-items: center; background: none; border: none; padding: 0;">
                        <i class="mdi" style="font-size: 24px; margin-right: 8px;">
                            <template v-if="isDark">
                                <i class="bi bi-sun-fill" style="font-size: 24px;"></i>
                            </template>
                            <template v-else>
                                <i class="bi bi-cloud-moon-fill" style="font-size: 24px;"></i>
                            </template>
                        </i>
                    </button>
                </li>
                <li>
                    <i class="mdi mdi-account" style="font-size: 24px;"></i>
                    <button @click="handleProfileClick">
                        <span>會員中心</span>
                    </button>
                </li>
                <li>
                    <i class="mdi mdi-storefront" style="font-size: 24px;"></i>
                    <button @click="navigateToStore">
                        <span>包套行程</span>
                    </button>
                </li>
                <li>
                    <i class="mdi mdi-chat" style="font-size: 24px;"></i>
                    <button @click="navigateToContact">
                        <span>聯絡我們</span>
                    </button>
                </li>
                <li>
                    <i class="mdi mdi-cart" style="font-size: 24px;"></i>
                    <button @click="navigateToCart">
                        <span>購物車</span>
                    </button>
                </li>
            </ul>
        </div>
    </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import* as DarkReader from "darkreader"; // 若有使用 DarkReader 的話

// 控制側邊欄顯示狀態
const show = ref(false);
// 定義 overlay 狀態
const showOverlay = ref(false);

// 定義其他狀態與 router
const isDark = ref(false);
const router = useRouter();

// 點擊按鈕時顯示 overlay
function openOverlay() {
    showOverlay.value = true;
}

// 點擊 overlay 內關閉按鈕時隱藏 overlay
function closeOverlay() {
    showOverlay.value = false;
}

// 切換深色模式（僅作示範）
function toggleDarkMode() {
    isDark.value = !isDark.value;
    if (isDark.value) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({
            brightness: 100,
            contrast: 90,
            sepia: 10,
        });
    } else {
        DarkReader.disable();
    }
}

// 以下方法僅供參考，你可依據實際需求修改
function handleProfileClick() {
    const isAuthenticated = false; // 實際應從狀態管理獲取
    if (!isAuthenticated) {
        // 如需彈出登入模態框，請自行處理
        alert("請先登入！");
    } else {
        router.push("/profile");
    }
}

function navigateToStore() {
    router.push("/store");
}

function navigateToContact() {
    router.push("/contact");
}

function navigateToCart() {
    router.push("/cart");
}
</script>

<style scoped>
/* 側邊欄樣式 */
header.sidebar {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 50px;
    z-index: 1000;
    background-color: #f0f4f8;
    transition: width 0.3s ease;
    overflow: hidden;
    display: flex;
}

.sidebar:hover {
    width: 200px;
}

.sidebar-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 20px 0;
    overflow: hidden;
}

.sidebar-show {
    width: 220px;
}

.sidebar-logo img {
    width: 60px;
    margin-bottom: 20px;
}

.sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.sidebar-menu li {
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;
    transition: background 0.3s;
}

.sidebar-menu li:hover {
    background: #d9e4fc;
}

.sidebar-menu li span {
    margin-left: 10px;
    font-size: 16px;
    color: #333;
    transition: opacity 0.3s ease;
    opacity: 0;
}

.sidebar-show .sidebar-menu li span {
    opacity: 1;
}

/* Overlay 與動畫樣式 */
.overlay-btn {
    padding: 10px;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.inner {
    color: #fff;
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
}

.close-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background: #fff;
    color: #000;
    border: none;
    cursor: pointer;
}

/* 定義從上方滑落進場與離場動畫 */
.overlay-slide-enter-active {
    animation: slideIn 500ms ease-out forwards;
}

.overlay-slide-leave-active {
    animation: slideOut 500ms ease-in forwards;
}

@keyframes slideIn {
    0% {
        opacity: 0;
        transform: translateY(-100%) rotate(10deg);
    }

    100% {
        opacity: 1;
        transform: translateY(0) rotate(0);
    }
}

@keyframes slideOut {
    0% {
        opacity: 1;
        transform: translateY(0) rotate(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-100%) rotate(-10deg);
    }
}
</style>