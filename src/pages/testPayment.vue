<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ECPayService from '../services/testECPayService';
import { useProductPara } from '../stores/productPara';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import CarouselsCycle from "@/components/CarouselsCycle.vue";

const router = useRouter();
const isDialogVisible = ref(false);
const productPara = useProductPara();
const selectedItem = computed(() => productPara.selectItem || {});
const peopleCount = ref(1);
const userStore = useUserStore();

onMounted(() => {
  document.body.classList.add('payment-page-body');
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.body.style.position = 'static';

  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');

  // 添加透明背景
  if (header) header.style.backgroundColor = 'transparent';
  if (footer) footer.style.backgroundColor = 'transparent';

  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  console.log("接收的商品數據:", selectedItem.value);
  console.log("商品ID:", selectedItem.value.id);
});

onUnmounted(() => {
  document.body.classList.remove('payment-page-body');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = 'auto';
  document.body.style.position = 'static';

  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');

  // 恢復原來的背景
  if (header) header.style.backgroundColor = '';
  if (footer) footer.style.backgroundColor = '';

  isDialogVisible.value = false;
});

const totalPrice = computed(() => selectedItem.value.price || 0);

async function initiatePayment() {
  if (!selectedItem.value?.title) {
    alert("請先選擇商品！");
    return;
  }

  try {
    const orderResult = await ECPayService.createOrder({
      totalAmount: selectedItem.value.price || 0,
      itemName: selectedItem.value.title,
      tradeDesc: `訂購行程：${selectedItem.value.title}`,
      userId: userStore.profile?.userId,
      productId: selectedItem.value.id,
    });

    console.log("訂單成功建立:", orderResult);
    ECPayService.submitToECPay(orderResult.orderParams);
  } catch (error) {
    console.error("訂單建立或提交失敗:", error);
    alert(error.response?.data?.message || error.message || "付款初始化失敗");
  }
}
</script>

<template>
  <div class="payment-page-container">
    <div class="overlay-mask"></div>
    <CarouselsCycle class="background-carousel" />

    <div class="payment-content">
      <div class="payment-grid">
        <div class="product-banner-section">
          <img v-if="selectedItem.img" :src="selectedItem.img" :alt="selectedItem.title" class="product-banner-image">
        </div>
        <!-- 商品詳情卡片 -->
        <div class="product-details-section">
          <div class="product-card">
            <div class="product-header">
              <h1 class="product-title">{{ selectedItem.title }}</h1>
              <div class="rating-container">
                <v-rating
                  v-model="selectedItem.rating"
                  color="amber-darken-2"
                  background-color="grey-lighten-2"
                  half-increments
                  readonly
                  dense
                  size="18"
                ></v-rating>
              </div>
            </div>
            <p class="product-days">天數：{{ selectedItem.days }}</p>
            <p class="product-description">{{ selectedItem.description }}</p>

            <div class="info-grid">
              <div class="info-item">
                <v-icon color="primary" class="info-icon">mdi-map-marker</v-icon>
                <div class="info-content">
                  <span class="info-label">目的地</span>
                  <span class="info-value">{{ selectedItem.location }}</span>
                </div>
              </div>

              <div class="info-item">
                <v-icon color="primary" class="info-icon">mdi-calendar-start</v-icon>
                <div class="info-content">
                  <span class="info-label">開始日期</span>
                  <span class="info-value">{{ selectedItem.starDate }}</span>
                </div>
              </div>

              <div class="info-item">
                <v-icon color="primary" class="info-icon">mdi-calendar-end</v-icon>
                <div class="info-content">
                  <span class="info-label">結束日期</span>
                  <span class="info-value">{{ selectedItem.endDate }}</span>
                </div>
              </div>

              <div class="info-item">
                <v-icon color="primary" class="info-icon">mdi-cash</v-icon>
                <div class="info-content">
                  <span class="info-label">價格</span>
                  <span class="info-value">NT$ {{ selectedItem.price?.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 訂單摘要卡片 -->
        <div class="order-summary-section">
          <div class="summary-card">
            <h2 class="summary-title">訂單摘要</h2>

            <div class="summary-content">
              <div class="summary-item">
                <span class="item-label">商品名稱</span>
                <span class="item-value">{{ selectedItem.title }}</span>
              </div>

              <div class="summary-item">
                <span class="item-label">人數</span>
                <span class="item-value">1 人</span>
              </div>

              <div class="total-section">
                <span class="total-label">總金額</span>
                <span class="total-value">NT$ {{ totalPrice.toLocaleString() }}</span>
              </div>
            </div>
            <div class="button-container">
              <v-btn
                color="primary"
                size="large"
                class="payment-button"
                elevation="2"
                @click="initiatePayment"
              >
                <v-icon left>mdi-credit-card</v-icon>
                確認付款
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7));
  z-index: 4;
  pointer-events: none;
}

.background-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.payment-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  margin: 80px auto;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* 商品詳情卡片樣式 */
.product-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-banner-section {
  grid-column: 1 / -1;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
}

.product-banner-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.product-banner-image:hover {
  transform: scale(1.05);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-details-section {
  width: 100%;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.product-days {
  font-size: 14px;
  color: #718096;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  flex-shrink: 0;
  margin-top: 4px;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.info-value {
  color: #2d3748;
  font-weight: 500;
}

/* 訂單摘要卡片樣式 */
.summary-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.order-summary-section {
  width: 100%;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.summary-content {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #4a5568;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
}

.total-label {
  font-weight: 600;
  color: #1a202c;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.payment-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 0 2rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
}

.payment-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5) !important;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .payment-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .payment-content {
    padding: 1.5rem;
    margin: 70px auto;
  }
}

@media (max-width: 768px) {
  .product-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .product-card, .summary-card {
    padding: 1.5rem;
  }
  
  .product-title {
    font-size: 1.25rem;
  }
  
  .summary-title {
    font-size: 1.25rem;
  }
  
  .total-value {
    font-size: 1.25rem;
  }
}
</style>

<style>
/* 全局樣式 */
body.payment-page-body {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
}

body.payment-page-body .desktop-header {
  background: transparent !important;
  z-index: 100;
}

body.payment-page-body .header-container {
  background: transparent !important;
}

body.payment-page-body footer.footer-container {
  background: transparent !important;
  z-index: 100;
  position: relative;
}

/* 確保頁面容器不受影響 */
body.payment-page-body .page-container {
  background: transparent !important;
}
</style>