<template>
    <div class="container border py-3 my-3">
        <div class="row">
            <div class="col-lg-3" v-if="itinerary.length > 0" v-for="(item, index) in itinerary" :key="index">
                <div class="card my-2 pointer rounded-3 hover-effect" :data-bs-toggle="'modal'"
                    :data-bs-target="'#modal-' + index" @click="selectedCard(item)">
                    <div class="card-body">
                        <img :src="item.itineraryImage ? item.itineraryImage : '/imgs/noImage.png'"
                            class="card-img-top rounded-3" alt="google api沒抓到圖" :title="item.itineraryTitle">
                        <h5 class="card-text d-flex justify-content-center">{{ item.itineraryTitle }}</h5>
                        <p class="card-text d-flex justify-content-center fs-3">
                            <!-- <rating :rating="itinerary.rating" /> -->
                        </p>
                    </div>
                </div>

                <div class="modal fade" :id="'modal-' + index" tabindex="-1" :aria-labelledby="'modalLabel-' + index"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-xl">
                        <div class="modal-content">
                            <div class="modal-header ">
                                <h5 class="modal-title" :id="'modalLabel-' + index">{{ item.itineraryTitle }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <!-- tab -->
                                <div class="container">
                                    <!-- 按鈕 -->
                                    <div class="row mb-3">
                                        <div class="col border rounded">
                                            <ul class="nav nav-pills flex-nowrap overflow-auto "
                                                style="white-space: nowrap;">

                                                <li class="nav-item">
                                                    <button class="nav-link" :class="{ active: activeTab === 0 }"
                                                        @click="setActiveTab(null, 0)">
                                                        首頁
                                                    </button>
                                                </li>

                                                <li v-for="(date, index) in dateList" :key="index + 1" class="nav-item">
                                                    <button class="nav-link"
                                                        :class="{ active: activeTab === index + 1 }"
                                                        @click="setActiveTab(date, index + 1)">
                                                        {{ date }}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- 內容 -->
                                    <div v-if="activeTab === 0" class="tab-pane fade show active border rounded">
                                        <p>這是首頁的內容</p>
                                    </div>
                                    <div v-else class="row border rounded">
                                        <div class="col-lg-5 p-3 overflow-auto" style="max-height: 500px;">
                                            <!-- <div > -->
                                            <div v-if="places.length > 0">
                                                <PlaceCard class="pointer hover-effect" v-for="(place, index) in places"
                                                    :key="place.id" :data="place" :hide="false"
                                                    @click="displayContentByDate(place)" />
                                            </div>
                                            <div v-else>
                                                <p>目前沒有行程資料</p>
                                            </div>
                                            <!-- </div> -->
                                        </div>
                                        <!-- 右側詳細資訊區域 -->
                                        <div class="col-lg-7 p-3">
                                            <div class="details break-word">
                                                <!-- <p>詳細資料顯示區</p> -->
                                                <div v-if="imgs">
                                                    <div :id="'carousel-' + index" class="carousel slide"
                                                        data-bs-ride="carousel">
                                                        <div class="carousel-inner">
                                                            <div v-for="(img, i) in imgs" :key="i" class="carousel-item"
                                                                :class="{ active: i === 0 }">
                                                                <img :src="img" class="d-block w-100" alt="圖片">
                                                            </div>
                                                        </div>
                                                        <button class="carousel-control-prev" type="button"
                                                            :data-bs-target="'#carousel-' + index" data-bs-slide="prev">
                                                            <span class="carousel-control-prev-icon"
                                                                aria-hidden="true"></span>
                                                            <span class="visually-hidden">Previous</span>
                                                        </button>
                                                        <button class="carousel-control-next" type="button"
                                                            :data-bs-target="'#carousel-' + index" data-bs-slide="next">
                                                            <span class="carousel-control-next-icon"
                                                                aria-hidden="true"></span>
                                                            <span class="visually-hidden">Next</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <p>{{ detailsData.detail }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- tab -->
                                <!-- <div class="d-flex justify-content-between">
                                    <p>聯絡電話: {{ item.contactInfo }}</p>
                                    <p>售價: {{ item.price }}</p>
                                </div> -->
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-danger" @click="test()">測試按鈕</button>
                                <!-- <button class="btn btn-primary" @click="show(item)">加到購物車</button> -->
                                <v-btn class="btn btn-primary" @click="selectItem(item)" :to="payUrl.to">立即結帳</v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <!-- 查無資料 -->
                <img class="w-25"
                    src="https://thumbor.4gamers.com.tw/Kr3aF4Mk53zGXn90q7nadNA-SZM=/adaptive-fit-in/1200x1200/filters:no_upscale():extract_cover():format(jpeg):quality(85)/https%3A%2F%2Fugc-media.4gamers.com.tw%2Fpuku-prod-zh%2Fanonymous-story%2F1a0eb606-3124-4f64-a157-6ab44faaced0.jpg"
                    title="找不到資料才會看到">
            </div>
        </div>
    </div>
</template>

<script setup>
import Rating from './Rating.vue';
import { useProductPara } from '../stores/productPara';
import { components } from 'vuetify/dist/vuetify-labs.js';
import testPayment from '../pages/testPayment.vue';
import { useRoute } from 'vue-router';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import dayjs from "dayjs";
import PlaceCard from "../components/PlaceCard.vue";
import axios, { Axios } from 'axios';

//原始資料
const props = defineProps({
    categoryArray: Array
});

//分頁
const activeTab = ref();

//東西在底下

const date_St = ref(dayjs());
const date_Ed = ref(dayjs());
const dateDiff = computed(() => date_Ed.value.diff(date_St.value, "day"));
const dateList = computed(() => {
    return Array.from({ length: dateDiff.value + 1 }, (_, i) =>
        date_St.value.add(i, "day").format("YYYY-MM-DD")
    );
});

const displayContentByDate = (item) => {
    detailsData.value = item
    getDetails(item.id);
    // console.log(JSON.stringify(item))
}
const test = () => {
    alert("123");
}
const detailsData = ref("");
const getDetails = async (id) => {
    const response = await axios.get(`${baseAddress}/api/PlaceDetails/${id}`)
    if (response.data) {
        // alert(JSON.stringify(response.data))
    } else {
        alert("初四了阿伯!沒抓到資料!")
    }
    detailsData.value = response.data;
    imgs.value = [];
    nextTick(() =>
        imgs.value = [
            //隨便抓的，之後抓api
            "https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1589720631052.jpg",
            "https://megapx-assets.dcard.tw/images/3bf423a4-3729-4189-aa04-e207fd65d24b/full.jpeg",
            "https://megapx-assets.dcard.tw/images/a7baca03-0434-4a49-ae83-9ba5bb229e1d/640.jpeg"
        ]
    )
}
const imgs = ref([])
//date

//tabs
const setActiveTab = (date, index) => {
    detailsData.value = "";
    selectedDate.value = date;
    activeTab.value = index;
    imgs.value = [];
    //這裡寫預設
}
onMounted(() => {
    if (dateList.value.length > 0) {
        activeTab.value = 0;
        selectedDate.value = null;
    }
});
const places = ref([]);
const selectedDate = ref();
watch(selectedDate, (newVal) => {
    if (newVal) {
        fetchPlacesByDate();
    }
});
const fetchPlacesByDate = async () => {
    try {
        const response = await fetch(
            `${baseAddress}/api/Places?date=2025-02-22`
        );
        if (!response.ok) throw new Error("無法取得資料");

        const allData = await response.json();
        console.log("============");
        console.log(allData);
        places.value = allData.filter((place) => {
            const placeDate = place.date.split("T")[0]; // 去掉時間部分
            const selectedDateStr = selectedDate.value.split("T")[0]; // 去掉時間部分
            return placeDate === selectedDateStr;
        });
        console.log("取得的資料:", JSON.stringify(places.value));
    } catch (error) {
        console.error("獲取資料時發生錯誤：", error);
    }
};

const selectedId = ref(null);
const baseAddress = "https://localhost:7092";
const itinerary = computed(() => props.categoryArray)




const selectedCard = (item) => {
    activeTab.value = 0;
    selectedId.value = null;
    selectedDate.value = item.itineraryStartDate.split("T")[0];
    nextTick(() => selectedId.value = item.itineraryId)
}

watch(
    () => selectedId.value,
    (newData) => {
        if (newData) {
            const selectedItem = itinerary.value.find(item => item.itineraryId === newData);
            date_St.value = dayjs(selectedItem.itineraryStartDate);
            date_Ed.value = dayjs(selectedItem.itineraryEndDate);
            // console.log(
            //     "更新後的日期:",
            //     date_St.value.format("YYYY-MM-DD"),
            //     date_Ed.value.format("YYYY-MM-DD"),
            // );
            // fetchPlacesByDate()
        }
    },
    { deep: true, immediate: true }
);


//東西在上面

//泰智
const route = useRoute();
const path = computed(() => route.path.replace("/", ""));
const productPara = useProductPara();
const payUrl = {
    components: testPayment,
    to: "/payment"
}

const selectItem = (item) => {
    console.log(productPara.selectItem);
    productPara.selectToPay(item);
}

</script>

<style scoped>
.card-img-top {
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 16/9;
}

.hover-effect {
    background-color: #ffffff;
    transition: background-color 0.3s ease;
}

.hover-effect:hover {
    background-color: #a0a0a0;
}

.break-word {
    word-wrap: break-word;
    white-space: normal;
    overflow-wrap: break-word;
}

.carousel-item img {
    width: 100%;
    height: auto;
    max-height: 400px;
    /* 您可以根據需要調整這個值 */
    object-fit: contain;
    /* 確保圖片完整顯示 */
}
</style>