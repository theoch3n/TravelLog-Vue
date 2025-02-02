<script setup>
import { ref, provide, computed } from "vue";
import StepperHeader from "./StepperHeader.vue";
import StepperWindow from "./StepperWindow.vue";
import OrderSummary from "./OrderSummary.vue";

import OrderConfirmation from "./OrderConfirmation.vue";
import PaymentMethod from "./PaymentMethod.vue";
import OrderComplete from "./OrderComplete.vue";

const steps = [
    { title: '確認訂單', component: OrderConfirmation },
    { title: '付款方式', component: PaymentMethod },
    { title: '完成訂單', component: OrderComplete }
]

const currentStep = ref(1)

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
    <v-container>
        <v-row>
            <v-col cols="12" md="8">
                <v-stepper v-model="currentStep" class="payment-stepper">
                    <stepper-header />
                    <stepper-window />

                    <div class="d-flex justify-space-between pa-4">
                        <v-btn :disabled="isFirstStep" color="secondary" @click="prevStep">
                            上一步
                        </v-btn>
                        <v-btn :disabled="isLastStep" color="primary" @click="nextStep">
                            下一步
                        </v-btn>
                    </div>
                </v-stepper>
            </v-col>
            <v-col cols="12" md="4">
                <order-summary />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.payment-stepper {
    background-color: transparent;
}
</style>