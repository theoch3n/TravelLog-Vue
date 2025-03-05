<script setup>
import { ref, onMounted, watchEffect, computed, onBeforeUnmount } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import CarouselsCycle from "@/components/CarouselsCycle.vue";

const userStore = useUserStore();

const orders = ref([]);
const loading = ref(false);
const userId = computed(() => userStore.profile?.userId);
const apiAddress = "https://localhost:7092/api";

// 獲取訂單
const fetchOrders = async () => {
    if (!userId.value) {
        console.warn("MyOrder.vue fetchOrders: userId 不存在，無法獲取訂單");
        return;
    }

    loading.value = true;
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("MyOrder.vue fetchOrders: Token 不存在，無法獲取訂單");
            return;
        }

        console.log("MyOrder.vue fetchOrders: 正在請求訂單，使用 userId:", userId.value);

        const response = await axios.get(
            `${apiAddress}/Ecpay/GetOrdersByUser/${userId.value}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        orders.value = response.data;
        console.log("MyOrder.vue fetchOrders: orders", orders.value);
        console.log("MyOrder.vue fetchOrders: 訂單獲取成功:", orders.value);
    } catch (error) {
        console.error("MyOrder.vue fetchOrders: 取得訂單失敗:", error);
    } finally {
        loading.value = false;
    }
};

// 依訂單日期排序訂單
const sortOrdersByDate = computed(() => {
    return [...orders.value].sort((a, b) => {
        const dateA = new Date(a.tradeDate);
        const dateB = new Date(b.tradeDate);
        return dateB - dateA;
    });
});

// 監聽 userId 變更
watchEffect(() => {
    if (userId.value) {
        fetchOrders();
    } else {
        orders.value = [];
    }
});

// 初始化
onMounted(async () => {
    try {
        document.body.classList.add('myorder-page');
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        
        // 獲取header和footer元素
        const header = document.querySelector('.desktop-header');
        const footer = document.querySelector('footer.footer-container');
        
        // 添加透明背景
        if (header) header.style.backgroundColor = 'transparent';
        if (footer) footer.style.backgroundColor = 'transparent';
        
        await userStore.fetchProfile();
        console.log("MyOrder.vue onMounted: Profile 加載完成:", userStore.profile);
        if (userStore.profile) {
            fetchOrders();
        }
    } catch (error) {
        console.error("MyOrder.vue onMounted: 無法獲取 Profile:", error);
    }
});

onBeforeUnmount(() => {
    document.body.classList.remove('myorder-page');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    
    // 獲取header和footer元素
    const header = document.querySelector('.desktop-header');
    const footer = document.querySelector('footer.footer-container');
    
    // 恢復原來的背景
    if (header) header.style.backgroundColor = '';
    if (footer) footer.style.backgroundColor = '';
});
</script>

<template>
    <div class="myorder-page-container">
        <!-- 背景輪播 -->
        <CarouselsCycle class="background-carousel" />
        
        <!-- 遮罩層 -->
        <div class="overlay-mask"></div>
        
        <div class="wrap">
            <div class="item">
                <div class="content-wrapper">
                    <!-- 頁面標題 -->
                    <div class="page-title-container">
                        <h1 class="page-title">我的訂單</h1>
                        <p class="page-subtitle">查看您的所有訂單記錄</p>
                    </div>
                    
                    <!-- 未登入顯示警告 -->
                    <div v-if="!userId" class="alert-container">
                        <div class="alert-card">
                            <i class="mdi mdi-alert-circle alert-icon"></i>
                            <h3 class="alert-title">尚未登入</h3>
                            <p class="alert-text">請先登入以查看您的訂單記錄</p>
                            <router-link to="/login" class="alert-button">
                                <i class="mdi mdi-login me-2"></i> 前往登入
                            </router-link>
                        </div>
                    </div>
                    
                    <!-- 訂單卡片列表 -->
                    <div v-else class="orders-container">
                        <div v-if="loading" class="loading-container">
                            <div class="loading-spinner"></div>
                            <p class="loading-text">載入訂單中...</p>
                        </div>
                        
                        <div v-else-if="orders.length" class="orders-list">
                            <div v-for="order in sortOrdersByDate" :key="order.OrderId" class="order-card">
                                <div class="order-header">
                                    <h3 class="order-title">{{ order.product?.eventName || '未知活動' }}</h3>
                                    <span class="order-date">{{ order.tradeDate }}</span>
                                </div>
                                
                                <div class="order-content">
                                    <div class="order-info">
                                        <div class="info-item">
                                            <i class="mdi mdi-identifier info-icon"></i>
                                            <div class="info-content">
                                                <span class="info-label">訂單編號</span>
                                                <span class="info-value">{{ order.merchantTradeNo }}</span>
                                            </div>
                                        </div>
                                        
                                        <div class="info-item">
                                            <i class="mdi mdi-cash-multiple info-icon"></i>
                                            <div class="info-content">
                                                <span class="info-label">總金額</span>
                                                <span class="info-value">NT$ {{ order.orderTotalAmount }}</span>
                                            </div>
                                        </div>
                                        
                                        <div class="info-item">
                                            <i class="mdi mdi-check-circle info-icon" :class="{'text-success': order.paymentStatus === '已付款', 'text-warning': order.paymentStatus !== '已付款'}"></i>
                                            <div class="info-content">
                                                <span class="info-label">付款狀態</span>
                                                <span class="info-value" :class="{'text-success': order.paymentStatus === '已付款', 'text-warning': order.paymentStatus !== '已付款'}">
                                                    {{ order.paymentStatus }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="order-actions">
                                    <button class="action-button" @click="order.expand = !order.expand">
                                        <i class="mdi" :class="order.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'"></i>
                                        {{ order.expand ? '收起詳情' : '查看詳情' }}
                                    </button>
                                </div>
                                
                                <div v-if="order.expand" class="order-details">
                                    <div class="details-item">
                                        <i class="mdi mdi-credit-card-clock details-icon"></i>
                                        <div class="details-content">
                                            <span class="details-label">付款時間</span>
                                            <span class="details-value">{{ order.paymentInfo?.paymentTime || '尚未付款' }}</span>
                                        </div>
                                    </div>
                                    
                                    <div class="details-item">
                                        <i class="mdi mdi-barcode details-icon"></i>
                                        <div class="details-content">
                                            <span class="details-label">綠界交易編號</span>
                                            <span class="details-value">{{ order.paymentInfo?.ecpayTransactionId || '無' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 無訂單時顯示提示 -->
                        <div v-else class="no-orders-container">
                            <div class="no-orders-card">
                                <i class="mdi mdi-cart-off no-orders-icon"></i>
                                <h3 class="no-orders-title">尚無訂單記錄</h3>
                                <p class="no-orders-text">您目前沒有任何訂單記錄</p>
                                <router-link to="/itinerary" class="no-orders-button">
                                    <i class="mdi mdi-shopping me-2"></i> 探索行程
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.myorder-page-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow-y: auto;
}

.background-carousel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.overlay-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
    z-index: 2;
    pointer-events: none;
}

.wrap {
    position: relative;
    z-index: 3;
    width: 100%;
    min-height: 100vh;
    padding: 80px 20px 40px;
}

.item {
    width: 100%;
}

.content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
}

.page-title-container {
    text-align: center;
    margin-bottom: 40px;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
}

.page-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* 警告卡片樣式 */
.alert-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.alert-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    width: 100%;
}

.alert-icon {
    font-size: 3rem;
    color: #f59e0b;
    margin-bottom: 20px;
}

.alert-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

.alert-text {
    font-size: 1rem;
    color: #666;
    margin-bottom: 20px;
}

.alert-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    border-radius: 30px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
}

.alert-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
}

/* 訂單列表樣式 */
.orders-container {
    width: 100%;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #4f46e5;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    color: white;
    font-size: 1.2rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.order-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.order-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.order-header {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
}

.order-date {
    font-size: 0.9rem;
    opacity: 0.9;
}

.order-content {
    padding: 20px;
}

.order-info {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 15px;
}

.info-icon {
    font-size: 1.5rem;
    color: #4f46e5;
    width: 30px;
    text-align: center;
}

.info-content {
    display: flex;
    flex-direction: column;
}

.info-label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 3px;
}

.info-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
}

.text-success {
    color: #10b981 !important;
}

.text-warning {
    color: #f59e0b !important;
}

.order-actions {
    padding: 0 20px 20px;
    display: flex;
    justify-content: center;
}

.action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #f3f4f6;
    color: #4b5563;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-button:hover {
    background-color: #e5e7eb;
    color: #1f2937;
}

.order-details {
    background-color: #f9fafb;
    padding: 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.details-item {
    display: flex;
    align-items: center;
    gap: 15px;
}

.details-icon {
    font-size: 1.5rem;
    color: #6b7280;
    width: 30px;
    text-align: center;
}

.details-content {
    display: flex;
    flex-direction: column;
}

.details-label {
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 3px;
}

.details-value {
    font-size: 1rem;
    color: #4b5563;
}

/* 無訂單時的樣式 */
.no-orders-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.no-orders-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    width: 100%;
}

.no-orders-icon {
    font-size: 3rem;
    color: #9ca3af;
    margin-bottom: 20px;
}

.no-orders-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

.no-orders-text {
    font-size: 1rem;
    color: #666;
    margin-bottom: 20px;
}

.no-orders-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    border-radius: 30px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
}

.no-orders-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
}

/* 響應式設計 */
@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }
    
    .wrap {
        padding: 60px 15px 30px;
    }
    
    .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
    
    .order-date {
        font-size: 0.8rem;
    }
    
    .info-item {
        gap: 10px;
    }
}
</style>

<style>
/* 全局樣式 */
body.myorder-page {
    overflow-y: auto !important;
    height: auto !important;
    position: relative;
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
}

body.myorder-page .desktop-header {
    background: transparent !important;
    z-index: 10;
}

body.myorder-page .header-container {
    background: transparent !important;
}

body.myorder-page footer.footer-container {
    background: transparent !important;
    z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
    body.myorder-page .desktop-header,
    body.myorder-page footer.footer-container {
        background: rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(10px);
    }
}
</style>