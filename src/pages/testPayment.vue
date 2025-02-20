<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ECPayService from '../services/testECPayService';
import { useProductPara } from '../stores/productPara';
import { useRouter } from 'vue-router';

const router = useRouter();
const isDialogVisible = ref(false);
const productPara = useProductPara();
const selectedItem = computed(() => productPara.selectItem || {});
const peopleCount = ref(1);

// 確保 body 樣式恢復正常
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

const contactInfo = ref({
    name: '',
    email: '',
    phone: '',
    country: ''
});

const totalPrice = computed(() => {
    return selectedItem.value.price || 0;
});

async function initiatePayment() {
    if (!selectedItem.value || !selectedItem.value.eventName) {
        alert("請先選擇商品！");
        return;
    }

    const orderDetails = {
        totalAmount: selectedItem.value.price || 0,
        itemName: selectedItem.value.eventName,
        tradeDesc: `訂購行程：${selectedItem.value.eventName}`,
    };

    console.log("傳送至後端的訂單資料:", orderDetails);

    try {
        const orderResult = await ECPayService.createOrder(orderDetails);

        console.log("訂單成功建立:", orderResult);

        ECPayService.submitToECPay(orderResult.orderParams);
    } catch (error) {
        console.error("訂單建立失敗:", error);
        alert("付款初始化失敗，請稍後再試");
    }
}

const goToProduct = () => {
    router.push("/products");
}

</script>

<template>
    <v-container fluid class="payment-container">
        <v-row>
            <v-col cols="12" md="7" class="order-details">
                <v-card flat>
                    <v-card-title class="text-h4 font-weight-bold">
                        {{ selectedItem.eventName }}
                    </v-card-title>

                    <v-divider class="my-4"></v-divider>

                    <v-card-text>
                        <p class="product-description">{{ selectedItem.eventDescription }}</p>
                        <v-row class="mt-4 product-details">
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-map-marker</v-icon>
                                <span class="subtitle-1 font-weight-bold">目的地：</span>
                                <span>{{ selectedItem.destination }}</span>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-airplane-takeoff</v-icon>
                                <span class="subtitle-1 font-weight-bold">出發地點：</span>
                                <span>{{ selectedItem.startingPoint }}</span>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-calendar-start</v-icon>
                                <span class="subtitle-1 font-weight-bold">開始日期：</span>
                                <span>{{ selectedItem.firstDate }}</span>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-calendar-end</v-icon>
                                <span class="subtitle-1 font-weight-bold">結束日期：</span>
                                <span>{{ selectedItem.lastDate }}</span>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-phone</v-icon>
                                <span class="subtitle-1 font-weight-bold">聯絡電話：</span>
                                <span>{{ selectedItem.contactInfo }}</span>
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex align-center">
                                <v-icon left color="primary">mdi-star</v-icon>
                                <span class="subtitle-1 font-weight-bold">評分：</span>
                                <v-rating v-model="selectedItem.ratings" color="amber" background-color="grey lighten-2"
                                    half-increments readonly dense size="25">
                                </v-rating>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-cash</v-icon>
                                <span class="subtitle-1 font-weight-bold">價格：</span>
                                <span>NT$ {{ selectedItem.price }}</span>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- 訂單摘要 -->
            <v-col cols="12" md="5" class="payment-section">
                <v-card elevation="4" class="sticky-card">
                    <v-card-title class="text-h6 font-weight-bold">
                        訂單摘要
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-card-text>
                        <v-row>
                            <v-col cols="8">
                                <span class="font-weight-bold">商品名稱</span>
                            </v-col>
                            <v-col cols="4" class="text-right">
                                <span>{{ selectedItem.eventName }}</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="8">
                                <span class="font-weight-bold">人數</span>
                            </v-col>
                            <v-col cols="4" class="text-right">
                                <span>1 人</span>
                            </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <v-row class="total-price">
                            <v-col cols="8">
                                <span class="font-weight-bold">總金額</span>
                            </v-col>
                            <v-col cols="4" class="text-right">
                                <span class="text-h6 font-weight-bold primary--text">
                                    NT$ {{ totalPrice.toLocaleString() }}
                                </span>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn block color="primary" large @click="initiatePayment">
                            確認付款
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.payment-container {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 24px;
}

.order-details {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.payment-section {
    position: sticky;
    top: 24px;
}

.sticky-card {
    position: sticky;
    top: 24px;
    padding: 16px;
}

.total-price {
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 10px;
    font-size: 1.2rem;
}

.product-description {
    font-size: 24px;
}

.product-details {
    font-size: 16px;
}
</style>
