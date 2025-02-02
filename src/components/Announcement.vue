<script setup>
import { ref, computed } from "vue";
// 預公告的訊息，最多四筆，可更改 @keyframes 調整
const announcements = ref([
    {
        text: "超人氣精選活動",
        link: "",
        target: "_self",
    },
    {
        text: "2025 日本滑雪季！北海道攻略",
        link: "",
        target: "_self",
    },
    {
        text: "加入會員即可開始規劃旅程",
    },
    {
        text: "超人氣精選活動",
        link: "",
        target: "_self",
    },
]);

// 確保至少有一個公告
const hasAnnouncements = computed(() => announcements.value.length > 0);
</script>

<template>
    <div v-if="hasAnnouncements" class="announcement announcement position-fixed start-0 top-0 w-100"
        data-text-block-size="3" data-countdown-block-size="0" data-block-size="3" ng-non-bindable="">
        <div class="announcement_slider-animation">
            <template v-for="(item, index) in announcements" :key="index">
                <a v-if="item.link" :href="item.link" :target="item.target">
                    <div class="announcement_text">
                        <p>
                            <span>{{ item.text }}</span>
                        </p>
                    </div>
                </a>
                <div v-else class="announcement_text">
                    <p>
                        <span>{{ item.text }}</span>
                    </p>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.announcement {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1100;
    height: 40px;
    overflow: hidden;
    background-color: #c0b9a5;
}

.announcement_slider-animation {
    animation: announcement_scroll-up 10s linear infinite;
}

@keyframes announcement_scroll-up {

    0%,
    28% {
        transform: translateY(-0%);
    }

    34%,
    62% {
        transform: translateY(-25%);
    }

    68%,
    96% {
        transform: translateY(-50%);
    }

    100% {
        transform: translateY(-75%);
    }
}

.announcement_text {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background-color: #c0b9a5; */
    background-color: #b81111;
    color: #fffb;
}

.announcement_text p {
    margin: 0;
    text-align: center;
    color: #fffb;
}

.announcement_text span {
    display: inline-block;
}

/* link 樣式 */
.announcement a {
    text-decoration: none;
    color: inherit;
    display: block;
}

/* hover 暫停效果 */
.announcement:hover .announcement_slider-animation {
    animation-play-state: paused;
}

/* 確保位置固定 */
.position-fixed {
    position: fixed;
}

.start-0 {
    left: 0;
}

.top-0 {
    top: 0;
}

.w-100 {
    width: 100%;
}
</style>
