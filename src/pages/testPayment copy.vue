<script setup>
import { ref, computed, nextTick } from 'vue';
import ECPayService from '../services/testECPayService';

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
    <v-container fluid class="payment-container">
        <v-row>
            <!-- 行程資訊 -->
            <v-col cols="12" md="7" class="order-details">
                <v-card flat>
                    <v-card-title class="text-h5 font-weight-bold">
                        {{ orderDetails.itemName }}
                    </v-card-title>

                    <v-divider class="my-4"></v-divider>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-calendar</v-icon>
                                <span class="subtitle-1">出發日期：{{ orderDetails.departureDate }}</span>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-icon left color="primary">mdi-map-marker</v-icon>
                                <span class="subtitle-1">出發地點：{{ orderDetails.departureLocation }}</span>
                            </v-col>
                        </v-row>

                        <!-- 參加人資料表單 -->
                        <v-card class="mt-6" outlined>
                            <v-card-title class="subtitle-1 font-weight-bold">
                                參加人資料
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="participantFormRef" v-model="isParticipantFormValid">
                                    <v-row v-for="(participant, index) in participants" :key="index">
                                        <v-col cols="12">
                                            <v-subheader class="pl-0 font-weight-bold">
                                                參加人 {{ index + 1 }}:
                                            </v-subheader>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="participant.lastName" label="姓"
                                                :rules="[v => !!v || '請輸入姓']" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field v-model="participant.firstName" label="名"
                                                :rules="[v => !!v || '請輸入名']" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select v-model="participant.gender" :items="['男', '女']" label="性別"
                                                :rules="[v => !!v || '請選擇性別']" required></v-select>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>

                        <!-- 聯絡資料表單 -->
                        <v-card class="mt-6" outlined>
                            <v-card-title class="subtitle-1 font-weight-bold">
                                聯絡資料
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="contactFormRef" v-model="isContactFormValid">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="contactInfo.name" label="聯絡人姓名"
                                                :rules="[v => !!v || '請輸入聯絡人姓名']" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="contactInfo.email" label="電子信箱" :rules="[
                                                v => !!v || '請輸入電子信箱',
                                                v => /.+@.+\..+/.test(v) || '請輸入有效的電子信箱'
                                            ]" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="contactInfo.phone" label="聯絡電話" :rules="[
                                                v => !!v || '請輸入聯絡電話',
                                                v => /^09\d{8}$/.test(v) || '請輸入有效的手機號碼'
                                            ]" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="contactInfo.country" label="國籍"
                                                :rules="[v => !!v || '請輸入國籍']" required></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
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
                                <span>行程費用</span>
                            </v-col>
                            <v-col cols="4" class="text-right">
                                <span>NT$ {{ unitPrice.toLocaleString() }}</span>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="8">
                                <span>人數</span>
                            </v-col>
                            <v-col cols="4" class="text-right">
                                <span>{{ peopleCount }} 人</span>
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
                        <v-btn block color="primary" large @click="initiatePayment"
                            :disabled="!isParticipantFormValid || !isContactFormValid">
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