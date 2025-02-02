import axios from "axios";

const BackendUrl = "https://localhost:7092"; // .NET Core 後端地址

export const ecpayService = {
    async createEcpayOrder(orderDetails) {
        try {
            const response = await axios.post(
                `${BackendUrl}/api/Ecpay/CreateOrder`,
                {
                    totalAmount: orderDetails.totalAmount || 2200, // 預設金額
                    itemName: orderDetails.itemName || "測試商品", // 預設商品名稱
                    tradeDesc: orderDetails.tradeDesc || "測試交易描述", // 預設交易描述
                    merchantID: "2000132", // 傳遞 MerchantID
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("創建訂單失敗", error);

            if (error.response) {
                console.error("伺服器回應錯誤:", error.response.data);
                throw new Error(
                    error.response.data.message || "付款伺服器發生錯誤"
                );
            } else if (error.request) {
                console.error("未收到回應:", error.request);
                throw new Error("無法連接到付款伺服器");
            } else {
                console.error("錯誤:", error.message);
                throw new Error("付款過程發生未知錯誤");
            }
        }
    },
};
