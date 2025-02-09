<template>
    <div class="card mb-1" style="max-width: 540px; ">
        <div class="row g-0">
            <div class="col-4">
                <img :src="data.image" alt="景點圖片" class="card-img">
            </div>
            <div class="col-8">
                <div class="card-content ">
                    <i class="bi bi-x PlaceCard-closebtn    "></i>
                    <h4 class="placecard-title">{{ data.title }}</h4>
                    <p>評分：{{ data.rating }}</p>
                    <div class="rating">
                        <!-- 根據評分顯示星星 -->
                        <span v-for="index in 5" :key="index" :class="{ 'filled': index <= data.rating }">
                            {{ index <= data.rating ? '★' : '☆' }} </span>
                    </div>
                    <p>到達時間: {{ data.time }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';



// 使用 defineProps 接收父元件傳遞的資料
defineProps({
    data: {
        type: Object,
        required: true
    }
});

</script>


<style scoped>
.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    margin: 10px;
    display: flex;
    align-items: center;
    background: white;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.PlaceCard-closebtn {
    /* margin-left: 180px; */
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.card-img {
    position: relative;
    height: 100%;
    border-radius: 10px;
    margin-right: 10px;

}

.card-content {
    flex: 1;
    text-align: left;
    padding: 12px 0px 0px 12px;


}

p {
    margin: auto;
}

.placecard-title {
    font-size: large;
}
</style>