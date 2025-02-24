import axios from "axios";

class testECPayService {
    constructor() {
        this.ApiBaseUrl = "https://localhost:7092/api";
    }

    async createOrder(orderDetails) {
        try {
            console.log("送出 API 的訂單資料:", orderDetails);
            const response = await axios.post(
                `${this.ApiBaseUrl}/Ecpay/CreateOrder`,
                {
                    totalAmount: orderDetails.totalAmount,
                    itemName: orderDetails.itemName,
                    tradeDesc: orderDetails.tradeDesc || "旅遊訂單",
                    userId: orderDetails.userId,
                },
                {
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                    withCredentials: false,
                }
            );

            console.log("後端回應:", response.data);
            return response.data;
        } catch (error) {
            console.error("Order creation error", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                config: error.config,
            });
            throw new Error(
                `付款初始化失敗：${
                    error.response?.data?.message || error.message || "未知錯誤"
                }`
            );
        }
    }

    submitToECPay(orderParams) {
        console.log("提交到 ECPay 的參數:", orderParams);
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
