<script setup>
import { ref, computed, nextTick } from 'vue';
import ECPayService from '../services/testECPayService';

import { useProductPara } from "../stores/productPara";
const productPara = useProductPara();

const unitPrice = ref(5000);
const peopleCount = ref(2);
const participants = ref(
    Array.from({ length: peopleCount.value }, () => ({
        lastName: '',
        firstName: '',
        gender: ''
    }))
);

const contactInfo = ref({
    name: '',
    email: '',
    phone: '',
    country: ''
});

const participantFormRef = ref(null);
const contactFormRef = ref(null);
const isParticipantFormValid = ref(false);
const isContactFormValid = ref(false);

const orderDetails = ref({
    itemName: '東京自由行 5 天 4 夜',
    departureDate: '2024-07-15',
    departureLocation: '台北松山機場',
    description: `
    行程特色：
    - 暢遊東京知名景點
    - 享受日本美食與文化
    - 自由行程，彈性安排
    - 包含機場接送服務

    行程包含：
    1. 來回機票
    2. 四晚住宿
    3. 機場接送
    4. 旅遊保險
  `,
});

const totalPrice = computed(() => {
    return unitPrice.value * peopleCount.value;
});

async function initiatePayment() {
    try {
        // 驗證表單
        const participantFormValid = await validateForm(participantFormRef.value);
        const contactFormValid = await validateForm(contactFormRef.value);

        if (!participantFormValid || !contactFormValid) {
            return;
        }

        const orderResult = await ECPayService.createOrder({
            totalAmount: totalPrice.value,
            itemName: orderDetails.value.itemName,
            tradeDesc: `${peopleCount.value}人 - ${orderDetails.value.departureDate}`,
            participants: participants.value,
            contactInfo: contactInfo.value
        });

        ECPayService.submitToECPay(orderResult.orderParams);
    } catch (error) {
        console.error('Payment initiation failed', error);
        alert('付款初始化失敗，請稍後再試');
    }
}

// 表單驗證方法
async function validateForm(formRef) {
    if (!formRef) {
        console.error('Form reference is null');
        return false;
    }

    // 等待 DOM 更新
    await nextTick();

    // 調用 validate 方法
    const { valid } = await formRef.validate();
    return valid;
}
</script>

<template>
    <h2>您的購物車</h2>
        <ul v-if="productPara.selectItem.length">
            <li v-for="(item, index) in productPara.selectItem" :key="item.eventName">
                {{ item.eventName }} - 售價: {{ item.price }}
            </li>
        </ul>
        <p v-else>您的購物車是空的</p>
</template>


<style scoped>
.payment-container {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 24px;
}

.order-details {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
}

.payment-section {
    position: sticky;
    top: 24px;
}

.sticky-card {
    position: sticky;
    top: 24px;
}

.total-price {
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 8px;
}
</style>