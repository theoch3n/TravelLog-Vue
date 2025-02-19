<script setup>
const props = defineProps({
    modelValue: Number, // 綁定步驟數
    steps: Array,
});

const emit = defineEmits(["update:modelValue"]);

const goToStep = (step) => {
    emit("update:modelValue", step);
};
</script>

<template>
    <v-stepper-header>
        <v-stepper-item v-for="(step, index) in steps" :key="index" :value="index + 1"
            :complete="modelValue > index + 1" @click="goToStep(index + 1)">
            {{ step.title }}
        </v-stepper-item>
    </v-stepper-header>
</template>
