<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ECPayService from '../services/testECPayService';
import { useProductPara } from '../stores/productPara';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const isDialogVisible = ref(false);
const productPara = useProductPara();
const selectedItem = computed(() => productPara.selectItem || {});
const peopleCount = ref(1);
const userStore = useUserStore();

onMounted(() => {
  document.body.style.overflow = 'auto';
  document.body.style.position = 'static';
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  console.log("接收的商品數據:", selectedItem.value);
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
  document.body.style.position = 'static';
  isDialogVisible.value = false;
});

const totalPrice = computed(() => selectedItem.value.price || 0);

async function initiatePayment() {
  if (!selectedItem.value?.eventName) {
    alert("請先選擇商品！");
    return;
  }

  try {
    const orderResult = await ECPayService.createOrder({
      totalAmount: selectedItem.value.price || 0,
      itemName: selectedItem.value.eventName,
      tradeDesc: `訂購行程：${selectedItem.value.eventName}`,
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
  <div class="payment-page">
    <!-- 商品詳情卡片 -->
    <div class="content-grid">
      <div class="product-details-section">
        <div class="product-card">
          <div class="product-header">
            <h1 class="product-title">{{ selectedItem.eventName }}</h1>
            <div class="rating-container">
              <v-rating
                v-model="selectedItem.ratings"
                color="amber-darken-2"
                background-color="grey-lighten-2"
                half-increments
                readonly
                dense
                size="18"
              ></v-rating>
            </div>
          </div>

          <p class="product-description">{{ selectedItem.eventDescription }}</p>

          <div class="info-grid">
            <div class="info-item">
              <v-icon color="primary" class="info-icon">mdi-map-marker</v-icon>
              <div class="info-content">
                <span class="info-label">目的地</span>
                <span class="info-value">{{ selectedItem.destination }}</span>
              </div>
            </div>

            <div class="info-item">
              <v-icon color="primary" class="info-icon">mdi-airplane-takeoff</v-icon>
              <div class="info-content">
                <span class="info-label">出發地點</span>
                <span class="info-value">{{ selectedItem.startingPoint }}</span>
              </div>
            </div>

            <div class="info-item">
              <v-icon color="primary" class="info-icon">mdi-calendar-start</v-icon>
              <div class="info-content">
                <span class="info-label">開始日期</span>
                <span class="info-value">{{ selectedItem.firstDate }}</span>
              </div>
            </div>

            <div class="info-item">
              <v-icon color="primary" class="info-icon">mdi-calendar-end</v-icon>
              <div class="info-content">
                <span class="info-label">結束日期</span>
                <span class="info-value">{{ selectedItem.lastDate }}</span>
              </div>
            </div>

            <div class="info-item">
              <v-icon color="primary" class="info-icon">mdi-phone</v-icon>
              <div class="info-content">
                <span class="info-label">聯絡電話</span>
                <span class="info-value">{{ selectedItem.contactInfo }}</span>
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
              <span class="item-value">{{ selectedItem.eventName }}</span>
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

          <v-btn
            block
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
</template>

<style scoped>
.payment-page {
  min-height: 100vh;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

/* 商品詳情卡片樣式 */
.product-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  position: sticky;
  top: calc(68px + 2rem);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 1.25rem;
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
  border-top: 1px solid #e2e8f0;
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

.payment-button {
  margin-top: 1.5rem;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 640px) {
  .product-card,
  .summary-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .product-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .product-title {
    font-size: 1.5rem;
  }
}
</style>