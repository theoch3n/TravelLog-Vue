<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const orderDetails = ref({
    merchantTradeNo: '',
    tradeDate: '',
    totalAmount: 0,
    paymentStatus: '',
});

// 取得訂單資訊
const fetchOrderDetails = async () => {
    const merchantTradeNo = route.query.MerchantTradeNo;

    if (!merchantTradeNo) {
        console.error("無法獲取訂單編號");
        return;
    }

    try {
        const response = await axios.get(`https://localhost:7092/api/Ecpay/GetOrder?merchantTradeNo=${merchantTradeNo}`);
        orderDetails.value = response.data;
    } catch (error) {
        console.error("獲取訂單失敗", error);
    }
};

// 初始化
onMounted(() => {
    fetchOrderDetails();
});
</script>

<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card elevation="2" class="pa-6">
                    <v-card-title class="text-h5 mb-4">
                        <!-- <v-icon left color="success">mdi-check-circle</v-icon> -->
                        訂單詳情
                    </v-card-title>

                    <v-divider class="mb-4"></v-divider>

                    <v-card-text>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>訂單編號</v-list-item-title>
                                    <v-list-item-subtitle>{{ orderDetails.merchantTradeNo }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>交易日期</v-list-item-title>
                                    <v-list-item-subtitle>{{ orderDetails.tradeDate }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>交易金額</v-list-item-title>
                                    <v-list-item-subtitle>NT$ {{ orderDetails.totalAmount }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>付款狀態</v-list-item-title>
                                    <v-list-item-subtitle>{{ orderDetails.paymentStatus }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="router.push('/')">返回首頁</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
