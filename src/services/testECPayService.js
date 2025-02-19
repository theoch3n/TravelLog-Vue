import axios from "axios";

class testECPayService {
    constructor() {
        this.ApiBaseUrl = "https://localhost:7092/api";
    }

    async createOrder(orderDetails) {
        try {
            const response = await axios.post(
                `${this.ApiBaseUrl}/Ecpay/CreateOrder`,
                {
                    totalAmount: orderDetails.totalAmount,
                    itemName: orderDetails.itemName,
                    tradeDesc: orderDetails.tradeDesc || "旅遊訂單",
                }
            );

            return response.data;
        } catch (error) {
            console.error("Order creation error", error);
            throw error;
        }
    }

    submitToECPay(orderParams) {
        // 創建一個動態表單並提交
        const form = document.createElement("form");
        form.method = "post";
        form.action =
            "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

        Object.keys(orderParams).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = orderParams[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }

    // 直接支付方法
    async processDirectPayment(paymentData) {
        try {
            const response = await axios.post(
                `${this.ApiBaseUrl}/Ecpay/DirectPayment`,
                {
                    paymentMethod: paymentData.paymentMethod,
                    cardInfo: paymentData.cardInfo,
                    orderDetails: paymentData.orderDetails,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Direct payment error", error);
            throw error;
        }
    }

    // 發送驗證碼方法
    async sendVerificationCode(cardInfo) {
        try {
            const response = await axios.post(
                `${this.ApiBaseUrl}/Ecpay/SendVerificationCode`,
                cardInfo
            );
            return response.data;
        } catch (error) {
            console.error("Send verification code error", error);
            throw error;
        }
    }

    // 驗證支付方法
    async verifyPayment(paymentData) {
        try {
            const response = await axios.post(
                `${this.ApiBaseUrl}/Ecpay/VerifyPayment`,
                paymentData
            );
            return response.data;
        } catch (error) {
            console.error("Verify payment error", error);
            throw error;
        }
    }
}

export default new testECPayService();
