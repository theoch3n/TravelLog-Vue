<script setup>
import { ref } from 'vue'
import StepperHeader from './StepperHeader.vue';

const orderDetails = ref({
    name: '',
    email: '',
    phone: ''
})
</script>
<template>
    <v-card flat>
        <v-card-title>訂單詳情</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-text-field label="姓名" variant="outlined" v-model="orderDetails.name"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field label="電子郵件" variant="outlined" v-model="orderDetails.email"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field label="聯絡電話" variant="outlined" v-model="orderDetails.phone"></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<style scoped></style>