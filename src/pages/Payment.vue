<script setup>
import ParentStepper from "../components/PaymentPage/ParentStepper.vue";

const productPara = useProductPara();
</script>

<template>
    <div class="container">
        <ParentStepper />
    </div>
</template>

<style scoped>
.v-container {
    background-color: #f5f5f5;
}
</style>
