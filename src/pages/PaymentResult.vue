<template>
    <div class="payment-result">
        <h1>付款結果</h1>
        <p>交易編號：{{ merchantTradeNo }}</p>
        <p>{{ message }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['merchantTradeNo'],
    data() {
        return {
            message: '正在檢查付款狀態...',
            retryCount: 0
        };
    },
    mounted() {
        this.checkPaymentStatus();
    },
    methods: {
        async checkPaymentStatus() {
            try {
                const response = await axios.get(`https://localhost:7092/api/Ecpay/GetOrderInfo/${this.merchantTradeNo}`);
                if (response.data && response.data.orderPaymentStatus === 2) {
                    this.message = '✅ 付款成功！';
                } else {
                    this.retryCheckPayment();
                }
            } catch (error) {
                this.retryCheckPayment();
            }
        },
        retryCheckPayment() {
            if (this.retryCount < 5) {
                setTimeout(() => {
                    this.retryCount++;
                    this.checkPaymentStatus();
                }, 3000);
            } else {
                this.message = '⚠️ 錯誤：無法確認付款狀態，請稍後再試。';
            }
        }
    }
};
</script>

<style scoped>
.payment-result {
    text-align: center;
    margin-top: 50px;
}
</style>
