<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentStore } from '../../stores/payment'

const paymentStore = usePaymentStore()
const route = useRoute()
const router = useRouter()

const orderDetails = ref(null)
const errorMessage = ref('')

onMounted(() => {
    // 從 URL 查詢參數檢查訂單狀態
    const { MerchantTradeNo, RtnCode } = route.query

    if (MerchantTradeNo) {
        // 根據回傳的交易號碼和狀態碼處理訂單
        if (RtnCode === '1') {
            // 付款成功
            paymentStore.setPaymentSuccess({
                orderNumber: MerchantTradeNo,
                paymentStatus: '付款成功'
            })
            orderDetails.value = {
                orderNumber: MerchantTradeNo,
                paymentStatus: '付款成功'
            }
        } else {
            // 付款失敗
            errorMessage.value = '付款未成功'
            router.push({ name: 'Payment' })
        }
    } else if (!paymentStore.isPaymentSuccessful) {
        // 如果沒有付款成功的狀態，導回付款頁面
        router.push({ name: 'Payment' })
    }
})
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card v-if="orderDetails">
                    <v-card-title>訂單完成</v-card-title>
                    <v-card-text>
                        <h2>訂單編號：{{ orderDetails.orderNumber }}</h2>
                        <p>付款狀態：{{ orderDetails.paymentStatus }}</p>
                    </v-card-text>
                </v-card>

                <v-alert v-if="errorMessage" type="error">
                    {{ errorMessage }}
                </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>