<script setup>
import { inject, ref } from 'vue'

const { currentStep, setCurrentStep, steps } = inject('stepperContext', {
    currentStep: ref(1),
    setCurrentStep: () => { },
    steps: []
})
</script>

<template>
    <v-stepper-header>
        <v-stepper-item v-for="(step, index) in steps" :key="index" :complete="currentStep > index + 1"
            :value="index + 1">
            {{ step.title }}
        </v-stepper-item>
    </v-stepper-header>
</template>
