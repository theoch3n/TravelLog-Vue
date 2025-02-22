<template>
    <div class="payment-result">
        <h1>付款結果</h1>

        <div v-if="isLoading" class="loading-container">
            <p>正在檢查付款狀態...</p>
            <div class="loader"></div>
        </div>

        <div v-else>
            <p><strong>交易編號：</strong>{{ merchantTradeNo }}</p>
            <p><strong>交易時間：</strong>{{ tradeDate }}</p>
            <p><strong>付款金額：</strong>{{ formattedAmount }}</p>

            <div class="payment-status" :class="paymentStatusClass">
                <p>{{ paymentStatusText }}</p>
            </div>

            <p v-if="paymentInfo">
                <strong>付款資訊：</strong>{{ paymentInfo }}
            </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const merchantTradeNo = route.params.merchantTradeNo;

        return { merchantTradeNo };
    },
    data() {
        return {
            isLoading: true,
            tradeDate: "",
            orderTotalAmount: 0,
            orderPaymentStatus: 0,
            paymentStatusText: "未知狀態",
            paymentInfo: null,
        };
    },
    computed: {
        formattedAmount() {
            return new Intl.NumberFormat("zh-TW", {
                style: "currency",
                currency: "TWD",
            }).format(this.orderTotalAmount);
        },
        paymentStatusClass() {
            return {
                "success": this.orderPaymentStatus === 2,
                "pending": this.orderPaymentStatus === 1,
                "failed": this.orderPaymentStatus === 0,
            };
        }
    },
    mounted() {
        if (!this.merchantTradeNo || typeof this.merchantTradeNo !== 'string') {
            this.paymentStatusText = "⚠️ 錯誤：無效的交易編號";
            return;
        }
        this.checkPaymentStatus();
    },
    methods: {
        async checkPaymentStatus() {
            console.log("檢查付款狀態，merchantTradeNo:", this.merchantTradeNo);
            try {
                const response = await axios.get(`https://localhost:7092/api/Ecpay/GetOrderInfo?merchantTradeNo=${this.merchantTradeNo}`);
                console.log("後端回應:", response.data);

                this.tradeDate = response.data.tradeDate || "未知時間";
                this.orderTotalAmount = response.data.orderTotalAmount || 0;
                this.orderPaymentStatus = response.data.orderPaymentStatus || 0;
                this.paymentInfo = response.data.paymentInfo || "無";

                switch (this.orderPaymentStatus) {
                    case 2:
                        this.paymentStatusText = "✅ 付款成功";
                        break;
                    case 1:
                        this.paymentStatusText = "⏳ 待付款";
                        break;
                    default:
                        this.paymentStatusText = "❌ 付款失敗或未完成";
                        break;
                }
            } catch (error) {
                console.error("檢查付款狀態失敗:", error);
                this.paymentStatusText = "⚠️ 錯誤：無法獲取付款資訊，請稍後再試";
            } finally {
                this.isLoading = false;
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

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.loader {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-top: 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.payment-status {
    padding: 10px;
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 8px;
    display: inline-block;
}

.success {
    background-color: #d4edda;
    color: #155724;
}

.pending {
    background-color: #fff3cd;
    color: #856404;
}

.failed {
    background-color: #f8d7da;
    color: #721c24;
}
</style>
