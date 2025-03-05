<template>
    <div class="container border py-3 my-3">
        <div class="row">
            <div class="col-lg-3" v-if="itinerary.length > 0" v-for="(item, index) in itinerary" :key="index">
                <div class="card my-2 pointer rounded-3 hover-effect" :data-bs-toggle="'modal'"
                    :data-bs-target="'#modal-' + index" @click="selectedCard(item)">
                    <div class="card-body">
                        <img :src="item.itineraryImage" class="card-img-top rounded-3" alt="google api沒抓到圖"
                            :title="item.itineraryTitle">
                        <h5 class="card-text d-flex justify-content-center">{{ item.itineraryTitle }}</h5>
                        <p class="card-text text-center fs-3">
                            <rating v-if="infoData" :rating="infoData[index]?.rating" />
                        </p>
                        <h5 v-if="infoData" class="text-center"> {{ "立即訂購價: " + infoData[index]?.price }}</h5>
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
                                                        @click="setActiveTab(null, 0)"> 首頁
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
                                    <div v-if="activeTab === 0" class="tab-pane fade show active">
                                        <div class="container mt-5">
                                            <div class="row justify-content-center">
                                                <div class="col-md-8">
                                                    <div class="card shadow">
                                                        <!-- <img src="https://thumbor.4gamers.com.tw/Kr3aF4Mk53zGXn90q7nadNA-SZM=/adaptive-fit-in/1200x1200/filters:no_upscale():extract_cover():format(jpeg):quality(85)/https%3A%2F%2Fugc-media.4gamers.com.tw%2Fpuku-prod-zh%2Fanonymous-story%2F1a0eb606-3124-4f64-a157-6ab44faaced0.jpg"
                                                            class="card-img-top" alt="行程圖片" /> -->
                                                        <img :src="item.itineraryImage" alt="行程圖片" />
                                                        <div v-if="infoData" class="card-body">
                                                            <h2 class="card-title text-primary">
                                                                {{ item.itineraryTitle }}
                                                            </h2>
                                                            <p class="text-muted">
                                                                ⭐ 評分: {{ infoData[index]?.rating }} / 5
                                                            </p>
                                                            <p class="h5 text-success">💰 價格: {{
                                                                formatPrice(infoData[index]?.price) }}</p>
                                                            <hr />
                                                            <p class="card-text">
                                                                {{ infoData[index]?.description }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="row border rounded">
                                        <div class="col-lg-5 p-3 overflow-auto" style="max-height: 500px;">
                                            <div v-if="places.length > 0">
                                                <PlaceCard class="pointer hover-effect" v-for="(place, index) in places"
                                                    :key="place.id" :data="place" :hide="false"
                                                    @click="displayContentByDate(place)" />
                                            </div>
                                            <div v-else>
                                                <p>目前沒有行程資料</p>
                                            </div>
                                        </div>
                                        <div class="col-lg-7 p-3">
                                            <div class="details break-word">
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
                            </div>
                            <div class="modal-footer d-flex justify-content-end">
                                <div>
                                    <!-- <button class="btn btn-danger me-3" @click="test(item)">測試按鈕</button> -->
                                    <!-- <button class="btn btn-primary" @click="show(item)">加到購物車</button> -->
                                    <v-btn class="btn btn-primary" @click="selectItem(item)"
                                        :to="payUrl.to">立即結帳</v-btn>
                                </div>
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
import Rating from "./Rating.vue";
import { useProductPara } from "../stores/productPara";
import { components } from "vuetify/dist/vuetify-labs.js";
import testPayment from "../pages/testPayment.vue";
import { useRoute } from "vue-router";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import PlaceCard from "../components/PlaceCard.vue";
import axios, { Axios } from 'axios';

const props = defineProps({
    categoryArray: Array,
});
const activeTab = ref();
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

const profile = ref()
let count = ref(0);
const test = async (item) => {
    if (count.value >= 5)
        count.value = 0
    count.value++;
    if (count.value == 1)
        $Info("123")
    if (count.value == 2)
        $Success("123")
    if (count.value == 3)
        $Error("123")
    if (count.value == 4)
        $Warning("123")

    // await getProfile();
    // await getPlace(item.itineraryId);
    // item.itineraryCreateUser = profile.value.userId;
    // item.place = place.value;
    // $Success(JSON.stringify(item.place))
    // await addItinerary(item);
};
// const place = ref();
// const getPlace = async (ItineraryId) => {
//     const response = await axios.get(`${baseAddress}/api/Places/GetPlaceByScheduleId/${ItineraryId}`)
//     if (response.data) {
//         place.value = response.data;
//         console.log("這是抓到的資料/n" + JSON.stringify(place.value))
//     }
// }
const getProfile = async () => {
    try {
        const response = await axios.get(`${baseAddress}/api/Profile`);
        profile.value = response.data;
    } catch (err) {
        console.error("取得資料錯誤：", err);
    }
};

// 攔截器：自動將 token 加入請求標頭（建議此設定放在全域 axios 攔截器中）
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))


const addItinerary = async (item) => {
    const response = await axios.post(`${baseAddress}/api/TravelPackage/addItinerary`, item)
    if (response.data) {
        $Success("ProductList.vue: \n" + "成功添加到資料庫")
    } else {
        $Error("ProductList.vue: \n" + "發生錯誤")
    }
}


const infoData = ref();
const getInfo = async () => {
    const response = await axios.get(`${baseAddress}/api/TravelPackage/GetTravelPackageInfo`)
    if (response.data) {
        infoData.value = response.data;
    } else {
        $Error("發生錯誤，無法取得行程資料!")
    }
}

const formatPrice = (price) => {
    return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD" }).format(price);
};

const detailsData = ref("");
const getPlaceImgs = async (id) => {
    const response = await axios.get(`${baseAddress}/api/PlaceDetails/GetPlaceImgs/${id}`)
    if (response.data) {
        console.log(response.data)
        const imageUrls = response.data.map(p => p.imageUrl);
        imgs.value = imageUrls;
    } else {
        $Error("沒抓到東西")
    }
}
const getDetails = async (id) => {
    const response = await axios.get(`${baseAddress}/api/PlaceDetails/${id}`)
    if (response.data) {
        // $Success(JSON.stringify(response.data))
        detailsData.value = response.data;
        getPlaceImgs(detailsData.value.placeId);
    } else {
        $Error("初四了阿伯!沒抓到資料!")
    }
}
const imgs = ref([])

const setActiveTab = (date, index) => {
    detailsData.value = "";
    selectedDate.value = date;
    activeTab.value = index;
    imgs.value = [];
}

onMounted(() => {
    getInfo();
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
        // console.log(allData);
        places.value = allData.filter((place) => {
            const placeDate = place.date.split("T")[0];
            const selectedDateStr = selectedDate.value.split("T")[0];
            return placeDate === selectedDateStr;
        });
        // console.log("取得的資料:", JSON.stringify(places.value));
    } catch (error) {
        console.error("獲取資料時發生錯誤：", error);
    }
};
const selectedId = ref(null);
const baseAddress = "https://localhost:7092";
const itinerary = computed(() => props.categoryArray)

const travelInfo = ref();
const selectedCard = (item) => {
    activeTab.value = 0;
    selectedId.value = null;
    selectedDate.value = item.itineraryStartDate.split("T")[0];
    nextTick(() => selectedId.value = item.itineraryId)
}
const GetTravelPackageInfo = async (id) => {
    const response = await axios.get(`${baseAddress}/api/TravelPackage/GetTravelPackageInfo/${id}`)
    if (response.data) {
        console.log(JSON.stringify(response.data))
        travelInfo.value = response.data;
    } else {
        $Error("沒東西抓")
    }
}

watch(
    () => selectedId.value,
    (newData) => {
        if (newData) {
            const selectedItem = itinerary.value.find(item => item.itineraryId === newData);
            date_St.value = dayjs(selectedItem.itineraryStartDate);
            date_Ed.value = dayjs(selectedItem.itineraryEndDate);
            // fetchPlacesByDate()
            GetTravelPackageInfo(selectedId.value)
        }
    },
    { deep: true, immediate: true }
);

//泰智
const route = useRoute();
const path = computed(() => route.path.replace("/", ""));
const productPara = useProductPara();
const payUrl = {
  components: testPayment,
  to: "/payment",
};

const selectItem = (item) => {
    //id 名字 地點 開始日 結束日 天數 價格 描述 評分 聯絡方式
    const date_St = dayjs(item.itineraryStartDate);
    const date_Ed = dayjs(item.itineraryEndDate);
    const days = computed(() => date_Ed.diff(date_St, "day"));
    const para = {
        id: item.itineraryId,
        title: item.itineraryTitle,
        location: item.itineraryLocation,
        starDate: item.itineraryStartDate,
        endDate: item.itineraryEndDate,
        days: days.value,
        price: travelInfo.value.price,
        description: infoData.value[item.itineraryId].description,
        rating: infoData.value[item.itineraryId].rating,
        img: item.itineraryImage
    };
    // console.log(productPara.selectItem);
    productPara.selectToPay(para);
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
    object-fit: contain;
}
</style>