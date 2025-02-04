import { defineStore } from "pinia";
import axios from "axios";

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
                if (error.response) {
                    console.error("Error response:", error.response.data);
                    console.error("Error status:", error.response.status);
                } else if (error.request) {
                    // 請求已發出，但沒有收到回應
                    console.error("Error request:", error.request);
                } else {
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
