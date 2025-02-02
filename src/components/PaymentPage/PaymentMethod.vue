<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '../../stores/payment'

const paymentStore = usePaymentStore()
const router = useRouter()

const paymentMethods = [
    // { value: 'credit_card', label: '信用卡' },
    // { value: 'atm', label: 'ATM轉帳' },
    { value: 'ecpay', label: '綠界金流' }
]

const selectedPaymentMethod = ref(paymentMethods[0].value)
const errorMessage = ref('')
const isLoading = ref(false)

const handlePayment = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        switch (selectedPaymentMethod.value) {
            case 'ecpay':
                await handleEcpayPayment()
                break
            default:
                errorMessage.value = '尚未實作的付款方式'
        }
    } catch (error) {
        errorMessage.value = error.message || '付款失敗'
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    try {
        await paymentStore.createOrder({
            totalAmount: 2200,
            itemName: '台北一日遊',
            tradeDesc: '旅遊行程'
        })
    } catch (error) {
        console.error('初始化付款資訊失敗', error)
    }
})
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>選擇付款方式</v-card-title>
                    <v-card-text>
                        <v-radio-group v-model="selectedPaymentMethod">
                            <v-radio v-for="method in paymentMethods" :key="method.value" :label="method.label"
                                :value="method.value" />
                        </v-radio-group>

                        <v-btn color="primary" @click="handlePayment" :loading="isLoading" block>
                            前往付款
                        </v-btn>

                        <v-alert v-if="errorMessage" type="error" class="mt-3">
                            {{ errorMessage }}
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>