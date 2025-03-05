<template>
  <div class="itinerary-page-container">
    <!-- 背景輪播 -->
    <CarouselsCycle class="background-carousel" />

    <!-- 遮罩層 -->
    <div class="overlay-mask"></div>

    <div class="wrap">
      <div class="item">
        <div class="content-wrapper">
          <!-- 頁面標題 -->
          <div class="page-title-container">
            <h1 class="page-title">探索旅遊行程</h1>
            <p class="page-subtitle">開啟你的下一個完美旅程</p>
          </div>

          <!-- 標籤頁 -->
          <div class="tabs-container">
            <v-tabs v-model="tab" align-tabs="center" color="white" class="custom-tabs">
              <v-tab :value="1" @click="handleTabClick('personal')" class="tab-item">我的旅遊</v-tab>
              <v-tab :value="2" @click="handleTabClick('group')" class="tab-item">旅遊群組</v-tab>
            </v-tabs>
          </div>

          <div class="container mt-4">
            <!-- 新增行程區塊 -->
            <div class="row mb-4">
              <div class="col-md-4 col-lg-3">
                <div class="accordion custom-accordion" id="accordionExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                        aria-expanded="false" aria-controls="collapseOne">
                        <i class="fas fa-plus-circle me-2"></i> 新增行程
                      </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample">
                      <div class="accordion-body">
                        <form>
                          <div class="mb-3">
                            <label for="travel-themes" class="col-form-label">旅程主題</label>
                            <input type="text" class="form-control custom-input" id="travel-themes" placeholder="請輸入主題"
                              v-model="itinerarytitle" />
                          </div>
                          <div class="mb-3">
                            <label for="travel-location" class="col-form-label">旅程地點</label>
                            <input type="text" class="form-control custom-input" id="travel-location" placeholder="請輸國家或城市"
                              v-model="itinerarylocation" />
                          </div>
                          <label class="col-form-label">旅程日期</label>
                          <div class="container" style="padding-left: 0px; padding-right: 0px;">
                            <div class="row">
                              <div class="col-6">
                                <!-- 開始日期選擇器 -->
                                <v-menu
                                  v-model="showStartDatePicker"
                                  :close-on-content-click="false"
                                  location="bottom"
                                  transition="scale-transition"
                                >
                                  <template v-slot:activator="{ props }">
                                    <input 
                                      type="text" 
                                      id="startdate" 
                                      class="form-control custom-input" 
                                      v-bind="props"
                                      @click="openDatePicker('start')"
                                      :value="startDate" 
                                      placeholder="開始日期" 
                                      readonly 
                                      style="padding: 5px 10px; cursor: pointer" 
                                    />
                                  </template>
                                  <v-card class="date-picker-card">
                                    <v-date-picker 
                                      v-model="selectedDate" 
                                      :min="minDate"
                                      @update:model-value="setDate" 
                                      class="custom-date-picker"
                                    ></v-date-picker>
                                  </v-card>
                                </v-menu>
                              </div>
                              <div class="col-6">
                                <!-- 結束日期選擇器 -->
                                <v-menu
                                  v-model="showEndDatePicker"
                                  :close-on-content-click="false"
                                  location="bottom"
                                  transition="scale-transition"
                                >
                                  <template v-slot:activator="{ props }">
                                    <input 
                                      type="text" 
                                      id="enddate" 
                                      class="form-control custom-input" 
                                      v-bind="props"
                                      @click="openDatePicker('end')"
                                      :value="endDate" 
                                      placeholder="結束日期" 
                                      readonly 
                                      style="padding: 5px 10px; cursor: pointer" 
                                    />
                                  </template>
                                  <v-card class="date-picker-card">
                                    <v-date-picker 
                                      v-model="selectedDate" 
                                      :min="minDate"
                                      @update:model-value="setDate" 
                                      class="custom-date-picker"
                                    ></v-date-picker>
                                  </v-card>
                                </v-menu>
                              </div>
                            </div>
                          </div>
                        </form>
                        <br />
                        <div class="modal-footer">
                          <button type="button" class="btn custom-btn" data-bs-target="#collapseOne"
                            @click="insertdata()">
                            <i class="fas fa-check me-1"></i> 完成
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 行程卡片區域 -->
            <div class="row">
              <div class="col-lg-3 col-md-4 col-sm-6 mb-4" v-for="card in CardData" :key="card.itineraryId">
                <div class="card itinerary-card hover-effect">
                  <div class="card-img-container">
                    <img class="card-img-top pointer" :src="card.itineraryImage || '/imgs/noImage.png'" 
                      @click.stop="navigateToGoogleMap(card.itineraryId)" alt="行程圖片">
                    <div class="image-overlay" @click.stop="navigateToGoogleMap(card.itineraryId)"></div>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">{{ card.itineraryTitle }}</h5>
                    <p class="card-text">{{ card.itineraryStartDate.split("T")[0] + " ~ " + card.itineraryEndDate.split("T")[0] }}</p>
                    <div class="card-actions">
                      <button class="btn action-btn" @click.stop="showDialog(card.itineraryId)">
                        <i class="fas fa-user-plus"></i> 邀請
                      </button>
                      <button class="btn custom-btn-secondary" @click.stop="openBillList(card)">
                        <i class="fas fa-receipt"></i> 拆帳
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 無資料時顯示 -->
              <div class="col-12 text-center no-data" v-if="CardData.length === 0">
                <div class="no-data-container">
                  <i class="fas fa-map-marked-alt no-data-icon"></i>
                  <p class="no-data-text">目前沒有行程資料</p>
                  <p class="no-data-hint">點擊「新增行程」開始您的旅程規劃</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 邀請好友對話框 -->
    <v-dialog v-model="dialog" width="400">
      <v-card max-width="400" prepend-icon="mdi-star" title="邀請好友" class="invite-card">
        <v-text-field :rules="rules" hide-details="auto" label="請輸入帳號" v-model="GroupEmmail" class="invite-input"></v-text-field>
        <template v-slot:actions>
          <v-btn class="ms-auto custom-btn" text="加入" @click="invitefriends(selectedItineraryId)"></v-btn>
        </template>
      </v-card>
    </v-dialog>
    
    <BillList v-model="selectedId"></BillList>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import axios from "axios";
import { format } from "date-fns"; // 格式化日期
import { useRouter } from "vue-router";
import BillList from "./billList.vue";
import CarouselsCycle from "@/components/CarouselsCycle.vue"; // 引入輪播組件

// 控制 v-date-picker 顯示與隱藏
const showDatePicker = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);

const itinerarytitle = ref("");



// 添加页面挂载和卸载时的样式处理
onMounted(() => {
  document.body.classList.add('itinerary-page');
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  
  // 获取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 添加透明背景
  if (header) header.style.backgroundColor = 'transparent';
  if (footer) footer.style.backgroundColor = 'transparent';
});

// 添加页面挂载和卸载时的样式处理
onMounted(() => {
  document.body.classList.add('itinerary-page');
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  
  // 获取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 添加透明背景
  if (header) header.style.backgroundColor = 'transparent';
  if (footer) footer.style.backgroundColor = 'transparent';
});

onBeforeUnmount(() => {
  document.body.classList.remove('itinerary-page');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  
  // 获取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 恢复原来的背景
  if (header) header.style.backgroundColor = '';
  if (footer) footer.style.backgroundColor = '';
});

const baseAddress = "https://localhost:7092";

//拆帳
const selectedId = ref(null);
const openBillList = (item) => {
  selectedId.value = null;
  nextTick(() => { selectedId.value = item });
};
//拆帳

//不宣告會跳警告
const tab = ref(1);
const show = ref('');
//

const itinerarylocation = ref("");
const startDate = ref(""); // 顯示格式 YYYY-MM-DD
const endDate = ref("");
const selectedDate = ref(null); // v-date-picker 使用 Date 物件

// 追蹤當前選擇的是哪個輸入框
const activeInput = ref(null);


// 限制結束日期不能早於開始日期
const minDate = ref(null);

//  使用者資訊
const profile = ref({
  userId: '',
  userName: '',
  userEmail: '',
  userPhone: ''
})

//  GoogleMap API 金鑰
const API_KEY = "AIzaSyA0mSwZn2Mgu42RjWRxivjrSC3s84nINa0";

//  選擇卡片ID
const selectedItineraryId = ref(null);

const CardName = ref("");
const CardImg = ref("");
const CardCoordinate = ref("");
const CardData = ref([]);

// 路由導向 傳遞行程ID
const router = useRouter();

// 顯示邀請好友
const dialog = ref(false);

// 邀請好友Email
const GroupEmmail = ref("");

//  初始化
onMounted(async () => {
  await fetchProfile();
  await itineraryData();
  loadGoogleMapsAPI();
});

//  會員資訊
async function fetchProfile() {
  try {
    const response = await axios.get(`${baseAddress}/api/Profile`);
    // 假設後端回傳的資料與 profile 結構一致
    profile.value = response.data;

    console.log(profile.value);
    console.log(profile.value.userId);
    console.log("會員資料");
  } catch (err) {
    console.error("取得資料錯誤：", err);
  }
}

// 攔截器：自動將 token 加入請求標頭
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// 打開日期選擇器
const openDatePicker = (type) => {
  activeInput.value = type;
  showDatePicker.value = true;

  // 設定 v-date-picker 的當前日期
  if (type === "start" && startDate.value) {
    selectedDate.value = new Date(startDate.value);
  } else if (type === "end" && endDate.value) {
    selectedDate.value = new Date(endDate.value);
  } else {
    selectedDate.value = new Date(); // 預設為今天
  }

  // 限制結束日期不能早於開始日期
  if (type === "end" && startDate.value) {
    minDate.value = startDate.value;
  } else {
    minDate.value = null;
  }
};

// 設定選擇的日期並關閉選擇器
const setDate = (date) => {
  if (!date) return;

  const formattedDate = format(new Date(date), "yyyy-MM-dd"); // 轉換為 YYYY-MM-DD

  if (activeInput.value === "start") {
    startDate.value = formattedDate;
    endDate.value = ""; // 選擇新的開始日期時，重置結束日期
  } else if (activeInput.value === "end") {
    endDate.value = formattedDate;
  }

  showDatePicker.value = false;
};

/*  GoogleMap  */
//  Google Maps API
const loadGoogleMapsAPI = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&loading=async&libraries=places&callback=initMap&region=TW&language=zh-TW`;
  script.async = true;
  script.defer = true;

  script.onerror = () => {
    console.error(
      "Google Maps API 載入失敗，請檢查金鑰是否正確或網路是否正常。"
    );
  };

  document.head.appendChild(script);

  // Define global callback
  window.initMap = initMap;
};

// Initialize map
const initMap = () => {
  initAutocomplete();
};

// Initialize autocomplete
const initAutocomplete = () => {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("travel-location"),
    { type: ["restaurant"] }
  );
  setupMarkerListener(autocomplete);
};

// Setup marker listener
const setupMarkerListener = (autocomplete) => {
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();


    if (!place.geometry || !place.geometry.location) {
      console.error("搜尋結果無法取得地點資訊");
      return;
    }
    const selectRestaurant = {
      location: place.geometry.location,
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      phoneNumber: place.formatted_phone_number || "無資料",
      rating: place.rating || "無評分",
      img: place.photos?.[0]?.getUrl() || "",
      opening: place.current_opening_hours?.weekday_text || "無營業時間資訊",
    };
    if (!place.geometry || !place.geometry.location) {
      console.error("搜尋結果無法取得地點資訊");
      return;
    }

    CardName.value = place.name;
    CardImg.value = place.photos?.[0]?.getUrl() || "";
    CardCoordinate.value =
      place.geometry.location.lat() + "," + place.geometry.location.lng();

    console.log(place.name);
    console.log(
      place.geometry.location.lat() + "," + place.geometry.location.lng()
    );
    console.log(place.geometry.location.lng());
    console.log(place.geometry.location.lat());
    console.log(place.photos[0].getUrl());
    //map.value.setCenter(selectRestaurant.location);
  });
};

//  新增行程
const insertdata = async () => {
  try {
    if (!profile.value.userId) {
      await fetchProfile();
    }
    // alert(profile.value.userId)
    const insert = {
      itineraryId: 0,
      itineraryTitle: itinerarytitle.value,
      itineraryLocation: CardName.value,
      itineraryCoordinate: CardCoordinate.value,
      itineraryImage: CardImg.value,
      itineraryStartDate: startDate.value,
      ItineraryEndDate: endDate.value,
      ItineraryCreateUser: profile.value.userId,
      itineraryCreateDate: null,
    };
    const response = await axios.post(`${baseAddress}/api/Itinerary/Itinerary`, insert);

    console.log(JSON.stringify(response.data));
    await itineraryData();

    // 手動摺疊 Accordion
    const collapseElement = document.getElementById('collapseOne');
    const bsCollapse = new bootstrap.Collapse(collapseElement, {
        toggle: false
    });
    bsCollapse.hide();
  } catch (error) {
    alert(error.message + "\n檢查你的api有沒有開");
  }
};

// Tab 切換
const handleTabClick = async (tabValue) => {

  console.log(tabValue);
  CardData.value = []; // 清除卡片資料

  if (tabValue === "personal") {
    await itineraryData();
  }
  else if (tabValue === "group") {
    await itinerarygroupData();
  }
};

// 取得卡片資料
const itineraryData = async () => {

  try {

    //console.log("ID:" + profile.value.userId);

    const response = await axios.get(`${baseAddress}/api/Itinerary/ByUser/${profile.value.userId}`);

    CardData.value = response.data;

    console.log("itineraryData");
    console.log(response.data);
    //console.log(JSON.stringify(response.data));

  } catch (error) {
    alert(error.message + "\n檢查你的api有沒有開");
  }
};

// 取得群組行程資料
const itinerarygroupData = async () => {
  try {
    var request = {};

    request.itineraryGroupUserEmail = profile.value.userEmail;

    //console.log(request);

    const response = await axios.post(`${baseAddress}/api/Itinerary/CheckItineraryGroup/`, request);
    console.log("itinerarygroupData");
    console.log(response.data);

    CardData.value = response.data;
  }
  catch (error) {
    alert(error.message + "\n檢查你的api有沒有開");
  }
};

// 顯示邀請好友
function showDialog(itineraryId) {
  dialog.value = true;
  selectedItineraryId.value = itineraryId; // 儲存當前卡片的 itineraryId
}


// 不需要 export default {}，<script setup> 會自動導出
defineExpose({ dialog, showDialog });

// 邀請好友
const invitefriends = async () => {
  try {

    const insertgroup = {
      itineraryGroupId: 0,
      itineraryGroupItineraryId: selectedItineraryId.value,
      itineraryGroupUserEmail: GroupEmmail.value
    };
    const response = await axios.post(
      `${baseAddress}/api/Itinerary/ItineraryGroup`,
      insertgroup
    );

    GroupEmmail.value = "";
    //console.log(selectedItineraryId.value);
    console.log(JSON.stringify(response.data));

  } catch (error) {

    alert(error.message + "\n檢查你的api有沒有開");
  }
  dialog.value = false;
}

// 跳轉至 GoogleMap 傳遞 ID
const navigateToGoogleMap = (itineraryId) => {
  console.log(itineraryId);
  router.push({
    name: "Googlemap",
    params: { id: itineraryId }, // 只有 id 放 params
  });
};
</script>

<style scoped>
.itinerary-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

.background-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
  z-index: 4;
  pointer-events: none;
}

.wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  margin: 0 auto;
  position: relative;
  overflow: visible;
}

.item {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.8s ease-out;
}

/* 頁面標題樣式 */
.page-title-container {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 標籤頁容器 */
.tabs-container {
  margin-bottom: 1.5rem;
}

/* 自定義標籤頁 */
.custom-tabs {
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 5px;
}

.tab-item {
  color: white !important;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  padding: 10px 20px;
}

.tab-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

/* 手風琴樣式 */
.custom-accordion {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
}

.accordion-button {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 15px 20px;
}

.accordion-body {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
}

/* 輸入框樣式 */
.custom-input {
  border-radius: 8px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
  padding: 10px 15px;
}

.custom-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

/* 日期選擇器樣式 */
.date-picker-menu {
  z-index: 100;
}

.date-picker-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.custom-date-picker {
  background: white;
}

/* 按鈕樣式 */
.custom-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 8px 24px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4) !important;
  border: none;
}

.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5) !important;
}

.custom-btn-secondary {
  background: linear-gradient(135deg, #6366f1, #818cf8) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 5px 15px !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
  border: none;
}

.custom-btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
}

/* 卡片樣式 */
.itinerary-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: none;
}

.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
}

.card-img-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-img-top:hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  z-index: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 15px 0 10px;
}

.card-text {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  /* background: rgba(255, 255, 255, 0.5); */
}

.action-btn {
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 20px;
  padding: 5px 15px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(79, 70, 229, 0.2);
  transform: translateY(-2px);
}

/* 邀請卡片樣式 */
.invite-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.invite-input {
  margin: 16px;
}

/* 無資料顯示樣式 */
.no-data {
  padding: 40px 0;
}

.no-data-container {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.no-data-icon {
  font-size: 4rem;
  color: #6366f1;
  margin-bottom: 20px;
}

.no-data-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.no-data-hint {
  color: #666;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式調整 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .content-wrapper {
    padding: 15px;
  }
  
  .card-img-container {
    height: 160px;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .custom-tabs {
    padding: 3px;
  }
  
  .tab-item {
    padding: 8px 15px;
  }
  
  .card-img-container {
    height: 140px;
  }
}
</style>

<style>
/* 全局樣式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body.itinerary-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

body.itinerary-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.itinerary-page .header-container {
  background: transparent !important;
}

body.itinerary-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  body.itinerary-page .desktop-header,
  body.itinerary-page footer.footer-container {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }
}
</style>