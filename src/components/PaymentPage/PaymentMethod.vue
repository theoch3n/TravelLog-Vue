<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '../../stores/payment'

const orderDetails = ref({
    name: '',
    email: '',
    phone: ''
})

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
    <!-- <v-container> -->
    <!-- <v-row justify="center"> -->
    <!-- <v-col cols="12" md="8"> -->
    <v-card id="InfoBlock">
        <v-card-title>
            <v-row>
                <h2>填寫資料</h2>
            </v-row>
        </v-card-title>
        <v-card-text class="mt-5">
            <div id="ContactInfo">
                <v-row>
                    <h2>聯絡資料</h2>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="姓名" variant="outlined" v-model="orderDetails.name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="電子郵件" variant="outlined" v-model="orderDetails.email"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="聯絡電話" variant="outlined" v-model="orderDetails.phone"></v-text-field>
                    </v-col>
                </v-row>
            </div>
        </v-card-text>
        <!-- <v-btn color="primary" @click="handlePayment" :loading="isLoading" block>
                        前往付款
                    </v-btn> -->
    </v-card>
    <!-- </v-col> -->
    <!-- </v-row> -->
    <!-- </v-container> -->
</template>
<style scoped>
.v-card-title {
    border-bottom: 1px solid black;
}

.v-card-title h2 {
    text-align: start;
    color: #ff5b00;
}

#InfoBlock {
    background-color: white;
    padding: 20px;
}

/* .v-container {
    background-color: white;
    margin: 0;
} */
</style>