<script setup>
import { ref, provide, computed } from "vue";
import StepperHeader from "./StepperHeader.vue";
import StepperWindow from "./StepperWindow.vue";
import OrderSummary from "./OrderSummary.vue";

import OrderConfirmation from "./OrderConfirmation.vue";
import PaymentMethod from "./PaymentMethod.vue";
import OrderComplete from "./OrderComplete.vue";

const steps = [
    { title: '選擇方案', component: OrderConfirmation },
    { title: '填寫資料', component: PaymentMethod },
    { title: '完成訂單', component: OrderComplete }
]

const currentStep = ref(2)

const setCurrentStep = (step) => {
    currentStep.value = step + 1
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

const nextStep = () => {
    if (currentStep.value < steps.length) {
        currentStep.value++
    }
}

const isLoading = ref(false)

const handlePayment = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        switch (selectedPaymentMethod.value) {
            case 'ecpay':
                await handleEcpayPayment()
                break
            default:
                errorMessage.value = '尚未實作的付款方式'
        }
    } catch (error) {
        errorMessage.value = error.message || '付款失敗'
    } finally {
        isLoading.value = false
    }
}

const isFirstStep = computed(() => currentStep.value === 1)
const isLastStep = computed(() => currentStep.value === steps.length)

provide("stepperContext", {
    currentStep,
    setCurrentStep,
    steps,
    prevStep,
    nextStep
})
</script>

<template>
    <v-stepper v-model="currentStep" class="payment-stepper">
        <stepper-header />
        <v-container>
            <v-row>
                <v-col cols="12" md="8">
                    <stepper-window />


                </v-col>
                <v-col cols="12" md="4">
                    <order-summary />
                    <div class="d-flex justify-space-between pa-4">
                        <v-btn color="primary" @click="handlePayment" :loading="isLoading" block>
                            前往付款
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>

    </v-stepper>
</template>

<style scoped></style>