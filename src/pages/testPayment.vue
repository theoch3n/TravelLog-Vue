<script setup>
// import { ref } from "vue";
// import StepperHeader from "@/components/PaymentPage/StepperHeader.vue";
// import StepperWindow from "@/components/PaymentPage/StepperWindow.vue";
// import OrderSummary from "@/components/PaymentPage/OrderSummary.vue";
// import OrderConfirmation from "@/components/PaymentPage/OrderConfirmation.vue";
// import PaymentMethod from "@/components/PaymentPage/PaymentMethod.vue";
// import OrderComplete from "@/components/PaymentPage/OrderComplete.vue";

// // 定義步驟
// const steps = [
//     { title: "選擇方案", component: OrderConfirmation },
//     { title: "填寫資料", component: PaymentMethod },
//     { title: "完成訂單", component: OrderComplete },
// ];

// // 當前步驟
// const currentStep = ref(1);

// // 上一步
// const prevStep = () => {
//     if (currentStep.value > 1) {
//         currentStep.value--;
//     }
// };

// // 下一步
// const nextStep = () => {
//     if (currentStep.value < steps.length) {
//         currentStep.value++;
//     }
// };
import { inject } from "vue";

const currentStep = inject("currentStep");

// 改變步驟
const goToStep2 = () => {
    currentStep.value = 2;
};
</script>

<template>
    <v-container>
        <v-btn color="primary" @click="goToStep2">跳到第 2 步</v-btn>
    </v-container>
</template>

<style scoped>
.v-container {
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
}

.payment-stepper {
    background-color: transparent;
}
</style>
