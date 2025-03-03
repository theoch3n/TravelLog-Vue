<template>
  <div class="container border py-3 my-3">
    <div class="row">
      <div
        class="col-lg-3"
        v-if="itinerary.length > 0"
        v-for="(item, index) in itinerary"
        :key="index"
      >
        <div
          class="card my-2 pointer rounded-3 hover-effect"
          :data-bs-toggle="'modal'"
          :data-bs-target="'#modal-' + index"
          @click="selectedCard(item)"
        >
          <div class="card-body">
            <h5 class="card-text d-flex justify-content-center">
              {{ item.itineraryTitle }}
            </h5>
            <img
              :src="
                item.itineraryImage ? item.itineraryImage : '/imgs/noImage.png'
              "
              class="card-img-top rounded-3"
              alt="google api沒抓到圖"
              :title="item.itineraryTitle"
            />

            <p class="card-text text-center fs-3">
              <rating v-if="infoData" :rating="infoData[index]?.rating" />
            </p>
            <h5>
              {{
                "NT$ : " +
                new Intl.NumberFormat().format(infoData[index]?.price)
              }}
            </h5>
          </div>
        </div>

        <div
          class="modal fade"
          :id="'modal-' + index"
          tabindex="-1"
          :aria-labelledby="'modalLabel-' + index"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" :id="'modalLabel-' + index">
                  {{ item.itineraryTitle }}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <!-- tab -->
                <div class="container">
                  <!-- 按鈕 -->
                  <div class="row mb-3">
                    <div class="col border rounded">
                      <ul
                        class="nav nav-pills flex-nowrap overflow-auto"
                        style="white-space: nowrap"
                      >
                        <li class="nav-item">
                          <button
                            class="nav-link"
                            :class="{ active: activeTab === 0 }"
                            @click="setActiveTab(null, 0)"
                          >
                            首頁
                          </button>
                        </li>

                        <li
                          v-for="(date, index) in dateList"
                          :key="index + 1"
                          class="nav-item"
                        >
                          <button
                            class="nav-link"
                            :class="{ active: activeTab === index + 1 }"
                            @click="setActiveTab(date, index + 1)"
                          >
                            {{ date }}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- 內容 -->
                  <div v-if="activeTab === 0" class="tab-pane fade show active">
                    <!-- <p>這是首頁的內容</p> -->
                    <div class="container mt-5">
                      <div class="row justify-content-center">
                        <div class="col-md-8">
                          <div class="card shadow">
                            <img
                              src="https://thumbor.4gamers.com.tw/Kr3aF4Mk53zGXn90q7nadNA-SZM=/adaptive-fit-in/1200x1200/filters:no_upscale():extract_cover():format(jpeg):quality(85)/https%3A%2F%2Fugc-media.4gamers.com.tw%2Fpuku-prod-zh%2Fanonymous-story%2F1a0eb606-3124-4f64-a157-6ab44faaced0.jpg"
                              class="card-img-top"
                              alt="行程圖片"
                            />
                            <div class="card-body">
                              <h2 class="card-title text-primary">
                                <!-- {{ itinerary.title }} -->
                                {{ "放標題" }}
                              </h2>
                              <p class="text-muted">
                                ⭐ 評分: {{ 5 }} / 5
                                <!-- ⭐ 評分: {{ itinerary.rating }} / 5 -->
                              </p>
                              <p class="h5 text-success">
                                💰 價格: {{ formatPrice(200000) }}
                              </p>
                              <!-- formatPrice(itinerary.price) }}</p> -->
                              <hr />
                              <!-- <p class="card-text">{{ itinerary.description }}</p> -->
                              <p class="card-text">
                                宜蘭溫泉之旅讓您在大自然環抱中放鬆身心，入住頂級溫泉飯店，享受蘇澳冷泉與礁溪溫泉的療癒效果。搭配農場採果體驗與傳統手作米香DIY，讓旅程更加豐富，並探索龜山島海域與冬山河風光。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- <p> {{ travelInfo }}</p>
                                        <p> {{ travelInfo?.description }}</p> -->
                  </div>
                  <div v-else class="row border rounded">
                    <div
                      class="col-lg-5 p-3 overflow-auto"
                      style="max-height: 500px"
                    >
                      <!-- <div > -->
                      <div v-if="places.length > 0">
                        <PlaceCard
                          class="pointer hover-effect"
                          v-for="(place, index) in places"
                          :key="place.id"
                          :data="place"
                          :hide="false"
                          @click="displayContentByDate(place)"
                        />
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
                          <div
                            :id="'carousel-' + index"
                            class="carousel slide"
                            data-bs-ride="carousel"
                          >
                            <div class="carousel-inner">
                              <div
                                v-for="(img, i) in imgs"
                                :key="i"
                                class="carousel-item"
                                :class="{ active: i === 0 }"
                              >
                                <img
                                  :src="img"
                                  class="d-block w-100"
                                  alt="圖片"
                                />
                              </div>
                            </div>
                            <button
                              class="carousel-control-prev"
                              type="button"
                              :data-bs-target="'#carousel-' + index"
                              data-bs-slide="prev"
                            >
                              <span
                                class="carousel-control-prev-icon"
                                aria-hidden="true"
                              ></span>
                              <span class="visually-hidden">Previous</span>
                            </button>
                            <button
                              class="carousel-control-next"
                              type="button"
                              :data-bs-target="'#carousel-' + index"
                              data-bs-slide="next"
                            >
                              <span
                                class="carousel-control-next-icon"
                                aria-hidden="true"
                              ></span>
                              <span class="visually-hidden">Next</span>
                            </button>
                          </div>
                        </div>
                        <p>{{ detailsData.detail }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- </div> -->
              </div>
              <div class="modal-footer d-flex justify-content-end">
                <!-- <p>售價: {{ travelInfo?.price }}</p> -->
                <div>
                  <!-- <button class="btn btn-danger me-3" @click="test()">測試按鈕</button> -->
                  <!-- <button class="btn btn-primary" @click="show(item)">加到購物車</button> -->
                  <v-btn
                    class="btn btn-primary"
                    @click="selectItem(item)"
                    :to="payUrl.to"
                    >立即結帳</v-btn
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- 查無資料 -->
        <img
          class="w-25"
          src="https://thumbor.4gamers.com.tw/Kr3aF4Mk53zGXn90q7nadNA-SZM=/adaptive-fit-in/1200x1200/filters:no_upscale():extract_cover():format(jpeg):quality(85)/https%3A%2F%2Fugc-media.4gamers.com.tw%2Fpuku-prod-zh%2Fanonymous-story%2F1a0eb606-3124-4f64-a157-6ab44faaced0.jpg"
          title="找不到資料才會看到"
        />
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
import axios, { Axios } from "axios";

//原始資料
const props = defineProps({
  categoryArray: Array,
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
  detailsData.value = item;
  getDetails(item.id);
  // console.log(JSON.stringify(item))
};
const test = () => {
  //    alert()
  // GetTravelPackageInfo();
};
onMounted(() => {
  getInfo();
});

const infoData = ref();
const getInfo = async () => {
  const response = await axios.get(
    `${baseAddress}/api/TravelPackage/GetTravelPackageInfo`
  );
  if (response.data) {
    infoData.value = response.data;
  } else {
    alert("不太對");
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
  }).format(price);
};

const detailsData = ref("");
const getPlaceImgs = async (id) => {
  const response = await axios.get(
    `${baseAddress}/api/PlaceDetails/GetPlaceImgs/${id}`
  );
  if (response.data) {
    console.log(response.data);
    const imageUrls = response.data.map((p) => p.imageUrl);
    imgs.value = imageUrls;
  } else {
    alert("沒抓到東西");
  }
};
const getDetails = async (id) => {
  const response = await axios.get(`${baseAddress}/api/PlaceDetails/${id}`);
  if (response.data) {
    // alert(JSON.stringify(response.data))
    detailsData.value = response.data;
    getPlaceImgs(detailsData.value.placeId);
  } else {
    alert("初四了阿伯!沒抓到資料!");
  }
};
const imgs = ref([]);
//date

//tabs
const setActiveTab = (date, index) => {
  detailsData.value = "";
  selectedDate.value = date;
  activeTab.value = index;
  imgs.value = [];
};
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
    const response = await fetch(`${baseAddress}/api/Places?date=2025-02-22`);
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
const itinerary = computed(() => props.categoryArray);

const selectedCard = (item) => {
  activeTab.value = 0;
  selectedId.value = null;
  selectedDate.value = item.itineraryStartDate.split("T")[0];
  nextTick(() => (selectedId.value = item.itineraryId));
};
const GetTravelPackageInfo = async (id) => {
  const response = await axios.get(
    `${baseAddress}/api/TravelPackage/GetTravelPackageInfo/${id}`
  );
  if (response.data) {
    console.log(JSON.stringify(response.data));
    travelInfo.value = response.data;
  } else {
    alert("沒東西抓");
  }
};

watch(
  () => selectedId.value,
  (newData) => {
    if (newData) {
      const selectedItem = itinerary.value.find(
        (item) => item.itineraryId === newData
      );
      date_St.value = dayjs(selectedItem.itineraryStartDate);
      date_Ed.value = dayjs(selectedItem.itineraryEndDate);
      // fetchPlacesByDate()
      GetTravelPackageInfo(selectedId.value);
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
    price: infoData.value[item.itineraryId].price,
    description: infoData.value[item.itineraryId].description,
    rating: infoData.value[item.itineraryId].rating,
  };
  // console.log(productPara.selectItem);
  productPara.selectToPay(para);
};
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