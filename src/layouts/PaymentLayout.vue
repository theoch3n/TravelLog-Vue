<script setup>
import Header from '../components/Header.vue';
import StepperHeader from '../components/PaymentPage/StepperHeader.vue';
</script>
<template>
    <!-- <Header />
    <StepperHeader /> -->
    <v-app>
        <v-main>
            <v-sheet class="stepper-header-container" position="fixed">
                <StepperHeader />
            </v-sheet>

            <v-container fluid class="content-container">
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>
<style scoped>
.stepper-header-container {
    top: 64px;
    /* 與 Header 高度對應 */
    left: 0;
    right: 0;
    z-index: 2;
    background-color: white;
}

.content-container {
    margin-top: 128px;
    /* Header + Stepper 高度 */
}
</style>