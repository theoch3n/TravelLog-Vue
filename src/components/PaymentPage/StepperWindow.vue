<script setup>
const props = defineProps({
    modelValue: Number,
    steps: Array,
});
</script>

<template>
    <v-stepper-window :model-value="modelValue">
        <v-stepper-window-item v-for="(step, index) in steps" :key="index" :value="index + 1">
            <component :is="step.component"></component>
        </v-stepper-window-item>
    </v-stepper-window>
</template>
