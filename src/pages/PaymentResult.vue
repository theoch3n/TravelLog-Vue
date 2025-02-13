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
            message: '正在檢查付款狀態...'
        };
    },
    mounted() {
        this.fetchOrderStatus();
    },
    methods: {
        async fetchOrderStatus() {
            try {
                const response = await axios.get(`https://localhost:7092/api/Ecpay/GetOrder?merchantTradeNo=${this.merchantTradeNo}`);
                if (response.data && response.data.orderPaymentStatus === 2) {
                    this.message = '✅ 付款成功！';
                } else {
                    this.message = '❌ 付款失敗或尚未完成。';
                }
            } catch (error) {
                this.message = '⚠️ 錯誤：無法取得付款狀態。';
            }
        }
    }
}
</script>

<style scoped>
.payment-result {
    text-align: center;
    margin-top: 50px;
}
</style>
