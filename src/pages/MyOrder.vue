<script setup>
import { ref, onMounted, watchEffect, computed } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

const orders = ref([]);
const loading = ref(false);
const userId = computed(() => userStore.profile?.userId);
const apiAddress = "https://localhost:7092/api";

// 獲取訂單
const fetchOrders = async () => {
    if (!userId.value) {
        console.warn("MyOrder.vue fetchOrders: userId 不存在，無法獲取訂單");
        return;
    }

    loading.value = true;
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("MyOrder.vue fetchOrders: Token 不存在，無法獲取訂單");
            return;
        }

        console.log("MyOrder.vue fetchOrders: 正在請求訂單，使用 userId:", userId.value);

        const response = await axios.get(
            `${apiAddress}/Ecpay/GetOrdersByUser/${userId.value}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        orders.value = response.data;
        console.log("MyOrder.vue fetchOrders: orders", orders.value);
        console.log("MyOrder.vue fetchOrders: 訂單獲取成功:", orders.value);
    } catch (error) {
        console.error("MyOrder.vue fetchOrders: 取得訂單失敗:", error);
    } finally {
        loading.value = false;
    }
};

// 依訂單日期排序訂單
const sortOrdersByDate = computed(() => {
    return [...orders.value].sort((a, b) => {
        const dateA = new Date(a.tradeDate);
        const dateB = new Date(b.tradeDate);
        return dateB - dateA;
    });
});

// 監聽 userId 變更
watchEffect(() => {
    if (userId.value) {
        fetchOrders();
    } else {
        orders.value = [];
    }
});

// 初始化
onMounted(async () => {
    try {
        await userStore.fetchProfile();
        console.log("MyOrder.vue onMounted: Profile 加載完成:", userStore.profile);
        if (userStore.profile) {
            fetchOrders();
        }
    } catch (error) {
        console.error("MyOrder.vue onMounted: 無法獲取 Profile:", error);
    }
});
</script>


<template>
    <v-container>
        <h1 class="text-h4 mb-4">我的訂單</h1>

        <!-- 未登入顯示警告 -->
        <v-alert v-if="!userId" type="warning">
            你尚未登入，請先登入以查看訂單。
        </v-alert>

        <!-- 訂單卡片列表 -->
        <v-row v-else-if="orders.length">
            <v-col v-for="order in sortOrdersByDate" :key="order.OrderId" cols="12">
                <v-card class="pa-3" outlined>
                    <v-card-title>
                        {{ order.product?.itineraryTitle || '未知活動' }}
                    </v-card-title>
                    <v-card-subtitle>
                        訂單日期: {{ order.tradeDate }}
                    </v-card-subtitle>
                    <v-card-text>
                        <p><strong>訂單編號:</strong> {{ order.merchantTradeNo }}</p>
                        <p><strong>總金額:</strong> {{ order.orderTotalAmount }} 元</p>
                        <p><strong>付款狀態:</strong> {{ order.paymentStatus }}</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="order.expand = !order.expand">
                            {{ order.expand ? '收起' : '查看更多' }}
                        </v-btn>
                    </v-card-actions>
                    <v-expand-transition>
                        <div v-if="order.expand" class="pa-3">
                            <p>
                                <v-icon color="green">mdi-credit-card</v-icon>
                                <strong>付款時間：</strong> {{ order.paymentInfo?.paymentTime || '尚未付款' }}
                            </p>
                            <p>
                                <v-icon color="blue">mdi-barcode</v-icon>
                                <strong>綠界交易編號：</strong> {{ order.paymentInfo?.ecpayTransactionId || '無' }}
                            </p>
                        </div>
                    </v-expand-transition>
                </v-card>
            </v-col>
        </v-row>

        <!-- 無訂單時顯示提示 -->
        <v-alert v-else type="info" outlined>
            尚無訂單記錄
        </v-alert>
    </v-container>
</template>
