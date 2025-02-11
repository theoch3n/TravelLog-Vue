<script setup>
import { ref, provide } from "vue";
import Header from "../components/Header.vue";
import StepperHeader from "../components/PaymentPage/StepperHeader.vue";
import StepperWindow from "../components/PaymentPage/StepperWindow.vue";

// 共享步驟狀態
const currentStep = ref(1);

// 提供 `currentStep`，讓子頁面可以透過 inject 來控制步驟
provide("currentStep", currentStep);
</script>

<template>
    <Header />

    <v-container fluid class="content-container">
        <v-stepper v-model="currentStep">
            <!-- 固定在 Header 下方的 StepperHeader -->
            <v-sheet class="stepper-header-container" position="fixed">
                <!-- 確保 StepperHeader 在 v-stepper 內 -->
                <StepperHeader v-model="currentStep" :steps="[
                    { title: '選擇方案' },
                    { title: '填寫資料' },
                    { title: '完成訂單' }
                ]" />
            </v-sheet>

            <v-main class="content">
                <v-container fluid class="content-container">
                    <router-view />
                </v-container>
            </v-main>
        </v-stepper>
    </v-container>
</template>

<style scoped>
.stepper-header-container {
    top: 244px;
    left: 0;
    right: 0;
    z-index: 2;
    background-color: white;
}

.content-container {
    margin-top: 136px;
    /* Header + StepperHeader 的高度 */
    height: 100%;
    width: 100%;
    /* background-color: #f5f5f5; */
}

.content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
