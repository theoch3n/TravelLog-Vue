import { defineStore } from "pinia";

export const usePaymentStore = defineStore("payment", {
    state: () => ({
        isPaymentSuccessful: false,
        orderDetails: null,
        paymentParams: null,
        orderId: null,
    }),
    actions: {
        async createOrder(orderData) {
            try {
                const response = await axios.post(
                    "/api/Ecpay/CreateOrder",
                    orderData
                );

                // 存儲訂單參數和訂單ID
                this.paymentParams = response.data.orderParams;
                this.orderId = response.data.orderId;

                return response.data;
            } catch (error) {
                console.error("創建訂單失敗", error);
                // 更詳細的錯誤日誌
                if (error.response) {
                    // 伺服器返回了錯誤狀態碼
                    console.error("Error response:", error.response.data);
                    console.error("Error status:", error.response.status);
                } else if (error.request) {
                    // 請求已發出，但沒有收到回應
                    console.error("Error request:", error.request);
                } else {
                    // 發生了在設置請求時觸發的錯誤
                    console.error("Error message:", error.message);
                }
                throw error;
            }
        },
        setPaymentSuccess(orderDetails) {
            this.isPaymentSuccessful = true;
            this.orderDetails = orderDetails;
        },
        resetPaymentStatus() {
            this.isPaymentSuccessful = false;
            this.orderDetails = null;
            this.paymentParams = null;
            this.orderId = null;
        },
    },
});
