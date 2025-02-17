import axios from "axios";

class testECPayService {
    ApiBaseUrl = "https://localhost:7092/api/Ecpay";

    /**
     * 建立訂單 (對應後端 `/CreateOrder`)
     * @param {Object} orderDetails 訂單資料
     * @returns {Promise<Object>} 訂單資訊
     */
    async createOrder(orderDetails) {
        try {
            const response = await axios.post(
                `https://localhost:7092/api/Ecpay/CreateOrder`,
                {
                    order: {
                        OrderTotalAmount: orderDetails.totalAmount,
                        UserId: 1,
                        OrderStatus: 1,
                        OrderPaymentStatus: 1,
                        OrderTime: new Date().toISOString(), // 確保時間不為 null
                    },
                }
            );

            console.log("✅ 訂單建立成功:", response.data);
            return response.data; // 回傳訂單資訊
        } catch (error) {
            console.error("❌ Order creation error:", error);
            throw error;
        }
    }

    /**
     * 發起綠界金流付款請求 (對應 `/Payment`)
     * @param {string} merchantTradeNo 訂單交易編號
     * @returns {Promise<void>} 直接導向綠界金流
     */
    async paymentRequest(merchantTradeNo) {
        try {
            const response = await axios.post(`${ApiBaseUrl}/Payment`, {
                order: {
                    MerchantTradeNo: merchantTradeNo,
                },
            });

            console.log("✅ 取得綠界付款參數:", response.data);
            this.submitToECPay(response.data);
        } catch (error) {
            console.error("❌ Payment initiation error:", error);
            throw error;
        }
    }

    /**
     * 提交表單至綠界 (用於將參數送出)
     * @param {Object} orderParams 綠界所需的付款參數
     */
    submitToECPay(orderParams) {
        const form = document.createElement("form");
        form.method = "POST";
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

    /**
     * 查詢訂單狀態 (對應 `/GetOrderInfo/{tradeNo}`)
     * @param {string} tradeNo 訂單交易編號
     * @returns {Promise<Object>} 訂單資訊
     */
    async getOrderStatus(tradeNo) {
        try {
            const response = await axios.get(
                `${ApiBaseUrl}/GetOrderInfo/${tradeNo}`
            );
            console.log("✅ 訂單查詢成功:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error fetching order status:", error);
            throw error;
        }
    }
}

export default new testECPayService();
