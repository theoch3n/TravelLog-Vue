<script setup>
import { ref, provide } from "vue";
import Header from "../components/Header.vue";
import StepperHeader from "../components/PaymentPage/StepperHeader.vue";

// 步驟狀態
const currentStep = ref(2);

provide("currentStep", currentStep);
</script>

<template>
    <Header />

    <v-container fluid class="content-container">
        <v-stepper v-model="currentStep" class="stepper-container">
            <!-- 固定在 Header 下方的 StepperHeader -->
            <v-sheet class="stepper-header-wrapper">
                <StepperHeader
                    v-model="currentStep"
                    :steps="[
                        { title: '選擇方案' },
                        { title: '確認方案' },
                        { title: '完成訂單' }
                    ]"
                />
            </v-sheet>

            <!-- 主要內容區域 -->
            <v-main class="main-content">
                <v-container fluid class="content-area">
                    <router-view />
                </v-container>
            </v-main>
        </v-stepper>
    </v-container>
</template>

<style scoped>
.content-container {
    height: 100%;
    width: 100%;
    max-width: 100%;
    padding: 0;
    background-color: #f8f9fa;
}

.stepper-container {
    min-height: 100vh;
    background: transparent;
    box-shadow: none;
}

.stepper-header-wrapper {
    position: sticky;
    /* top: 64px; */
    left: 0;
    right: 0;
    z-index: 2;
    background-color: white;
    padding: 1rem 2rem;
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); */
}

.main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background: transparent;
    max-width: 100%;
    width: 100vw;
}

.content-area {
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

:deep(.v-stepper) {
    box-shadow: none;
    background: transparent;
}

:deep(.v-stepper__header) {
    box-shadow: none;
    background: transparent;
}

:deep(.v-stepper__step) {
    font-size: 14px;
}

:deep(.v-stepper__step__step) {
    margin-right: 8px;
}

/* 響應式調整 */
@media (max-width: 960px) {
    .stepper-header-wrapper {
        padding: 1rem;
    }

    .content-area {
        padding: 1rem;
    }
}

@media (max-width: 600px) {
    .stepper-header-wrapper {
        padding: 0.75rem;
    }

    .content-area {
        padding: 0.75rem;
    }
}
</style>