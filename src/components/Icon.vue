<template>

    <div class="background-panel">
        <div class="row">
            <img src="/src/assets/logo-removebg-preview.png" alt="">

            <div class="wrap">
                <router-link to="/itinerary" class="icon-container">
                    <img src="/icon/icon01.png" alt="行程規劃" class="img">
                    <span class="icon-text">行程規劃</span>
                </router-link>
                <router-link to="/Products" class="icon-container">
                    <img src="/icon/travel-and-tourism.png" alt="包套行程" class="img">
                    <span class="icon-text">包套行程</span>

                </router-link>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref } from 'vue';

</script>

<style scoped>
.background-panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.2);
    /* 背景透明度 */
    border-radius: 10px;
    backdrop-filter: blur(10px);
    /* 模糊背景 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* 輕微陰影 */
}

.wrap {
    display: flex;
    gap: 20px;
    /* 圖片之間的間距 */


}

.icon-container {
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease-in-out;
    padding-left: 150px;
}

.icon-container:hover {
    transform: scale(1.1);
    /* 整個按鈕區塊變大 */
}

.img {
    width: 100px;
    height: 100px;
    border-top: 2px solid white;
    border-left: 2px solid white;
    border-right: 2px solid white;
    border-radius: 10px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.2);
}

.icon-text {
    top: 80px;
    display: block;
    position: absolute;
    margin-top: 5px;
    /* 讓文字與圖片有點距離 */
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 5px;
    transition: transform 0.3s ease-in-out;
}

/* 讓文字跟著圖片一起變大 */
.icon-container:hover .icon-text {
    transform: scale(1.1);
}
</style>