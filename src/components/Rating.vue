<template>
    <div class="star">
        <i v-for="i in maxValue" 
        class="bi bi-star-fill" 
        :class="i <= rating ? 'bi bi-star-fill' : 'bi bi-star'"
        :key="i"></i>
    </div>
    <!-- <i class="bi bi-star"></i>  -->
    <!-- <i class="bi bi-star-fill"></i> -->
    <!-- <i class="bi bi-star-half"></i> -->
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import "bootstrap-icons/font/bootstrap-icons.css";
const maxValue = 5;


defineProps({
    rating: {
        type: Number,
        default: null
    }
})
</script>

<style scoped>
.star {
    color: #FFD306;
}
</style>