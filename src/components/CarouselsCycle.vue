<script setup>
import { ref } from "vue";

// 導入 banner 圖片
import banner01 from "../assets/banner01.jpg";
import banner02 from "../assets/banner02.jpg";
import banner03 from "../assets/banner03.jpg";
import banner04 from "../assets/banner04.jpeg";
import banner05 from "../assets/banner05.jpg";

const banners = ref([
    { src: banner01, alt: "Banner 1" },
    { src: banner02, alt: "Banner 2" },
    { src: banner03, alt: "Banner 3" },
    { src: banner04, alt: "Banner 4" },
    { src: banner05, alt: "Banner 5" }
]);
</script>

<template>
    <div class="carousel-container">
        <v-carousel hide-delimiters :show-arrows="false" height="100vh" cycle hide-delimiter-background
            class="full-width-carousel">
            <v-carousel-item v-for="(banner, i) in banners" :key="i">
                <v-img :src="banner.src" :alt="banner.alt" cover height="100%" class="banner-image" />
            </v-carousel-item>
        </v-carousel>
    </div>
</template>

<style scoped>
.carousel-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
}

.full-width-carousel {
    width: 100%;
    height: 100%;
}

.banner-image {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>
