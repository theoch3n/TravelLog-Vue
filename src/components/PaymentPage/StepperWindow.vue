<script setup>
import { inject, ref } from 'vue'

const { currentStep, steps } = inject('stepperContext', {
    currentStep: ref(1),
    steps: []
})
</script>

<template>
    <v-stepper-window v-model="currentStep">
        <v-stepper-window-item v-for="(step, index) in steps" :key="index" :value="index + 1">
            <component :is="step.component"></component>
        </v-stepper-window-item>
    </v-stepper-window>
</template>
<style scoped></style>