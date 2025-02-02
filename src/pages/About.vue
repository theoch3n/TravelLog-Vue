<script setup>
import { ref } from 'vue';
</script>

<template>
    <div class="about-page">
        <section class="hero-section">
            <h1>玩樂，從此開始</h1>
            <p>讓我們帶領你發現屬於自己的玩樂世界</p>
        </section>

        <section class="about-section">
            <h2>關於我們</h2>
            <p>無論何時何地，我們都能帶你找到最棒的吃喝玩樂體驗！</p>
            <p>想知道附近有什麼好吃好玩？想享受最超值的服務優惠？或想來趟放鬆身心靈的旅程？</p>
            <p>我們通通有！輕鬆動動手指，玩樂一手掌握！</p>
        </section>
    </div>
</template>

<style scoped>
.about-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.hero-section,
.about-section,
.mission-section,
.promise-section,
.investment-section,
.legal-section {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
}

h1,
h2 {
    color: #333;
    margin-bottom: 1rem;
}

p {
    color: #666;
    line-height: 1.6;
    max-width: 800px;
    margin: 0.5rem auto;
}

.legal-section {
    background-color: #f4f4f4;
    border-radius: 8px;
}

.legal-details p {
    margin: 0.3rem 0;
    font-size: 0.9rem;
}
</style>