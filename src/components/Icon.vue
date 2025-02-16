<template>
    <div class="wrap">
        <router-link to="/itinerary">
            <img src="/public/icon.png" alt="行程規劃" class="img">
        </router-link>
        <router-link to="/Products"><img src="/public/icon1.png" alt="" class="img"></router-link>
    </div>

</template>

<script setup>
import { ref } from 'vue';

</script>

<style scoped>
.img {
    max-height: 200px;
}
</style>