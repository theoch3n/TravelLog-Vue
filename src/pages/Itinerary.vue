<template>

  <!-- <v-tabs
    bg-color="indigo-darken-2"
    fixed-tabs
  >
    <v-tab text="我的旅遊"></v-tab>

    <v-tab text="旅遊群組"></v-tab>
  </v-tabs> -->

  <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
    <v-tab :value="1">我的旅遊</v-tab>
    <v-tab :value="2">旅遊群組</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item :value="0">

    </v-tabs-window-item>
  </v-tabs-window>
  <div>
    <div class="container mt-5 mb-5">
      <div class="row">
        <div class="col-3">
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                  aria-expanded="false" aria-controls="collapseOne">
                  新增行程
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
                data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <form>
                    <div class="mb-3">
                      <label for="travel-themes" class="col-form-label">旅程主題</label>
                      <input type="text" class="form-control" id="travel-themes" placeholder="請輸入主題"
                        v-model="itinerarytitle" />
                    </div>
                    <div class="mb-3">
                      <label for="travel-location" class="col-form-label">旅程地點</label>
                      <input type="text" class="form-control" id="travel-location" placeholder="請輸國家或城市"
                        v-model="itinerarylocation" />
                    </div>
                    <label class="col-form-label">旅程日期</label>
                    <div class="container">
                      <div class="row">
                        <div class="col-6">
                          <!-- 開始日期輸入框 -->
                          <input type="text" id="startdate" class="form-control" @click="openDatePicker('start')"
                            :value="startDate" placeholder="開始日期" readonly style="padding: 5px 10px; cursor: pointer" />
                        </div>
                        <div class="col-6">
                          <!-- 結束日期輸入框 -->
                          <input type="text" id="enddate" class="form-control" @click="openDatePicker('end')"
                            :value="endDate" placeholder="結束日期" readonly style="padding: 5px 10px; cursor: pointer" />
                        </div>
                        <!-- 日期選擇器 -->
                        <v-menu v-model="showDatePicker" transition="scale-transition" offset-y :style="{
                          position: 'absolute',
                          left: '35%',
                          transform: 'translateX(-50%)',
                          top: '70%',
                          transform: 'translateY(-50%)',
                        }">
                          <v-card>
                            <v-date-picker v-model="selectedDate" :min="minDate"
                              @update:model-value="setDate"></v-date-picker>
                          </v-card>
                        </v-menu>
                      </div>
                    </div>
                  </form>
                  <br />
                  <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary" data-bs-target="#collapseOne"
                      @click="insertdata()"> 完成</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <v-container>
          <v-row>
            <v-col cols="12" md="6" v-for="card in CardData" :key="card.itineraryId"
              @click="navigateToGoogleMap(card.itineraryId)">
              <v-card class="fixed-size-card" max-width="344">
                <v-img :src="card.itineraryImage" cover></v-img>
                <v-card-title>{{ card.itineraryTitle }}</v-card-title>
                <v-card-subtitle>{{ card.itineraryStartDate.split("T")[0] + " ~ " + card.itineraryEndDate.split("T")[0]
                }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click.stop="showDialog(card.itineraryId)">
                  </v-btn>
                  <button class="btn btn-outline-primary" @click.stop="openBillList(card.itineraryId)">拆帳</button>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" width="400">
                    <v-card max-width="400" prepend-icon="mdi-star" title="邀請好友"><v-text-field :rules="rules"
                        hide-details="auto" label="請輸入帳號" v-model="GroupEmmail"></v-text-field>
                      <template v-slot:actions>
                        <v-btn class="ms-auto" text="加入" @click="invitefriends(card.itineraryId)"></v-btn>
                      </template>
                    </v-card>
                  </v-dialog>
                </v-card-actions>

              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <!-- <div class="col" v-for="card in CardData" :key="card.itineraryId"
          @click="navigateToGoogleMap(card.itineraryId)">
          <div class="card h-100">
            <img :src="card.itineraryImage" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">{{ card.itineraryTitle }}</h5>
              <p class="card-text">
                {{
                  card.itineraryStartDate.split("T")[0] +
                  " ~ " +
                  card.itineraryEndDate.split("T")[0]
                }}
              </p>
            </div>
          </div>
        </div> -->
      </div>
  </div>
  <BillList :getParaId="selectedItineraryId"></BillList>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { format } from "date-fns"; // 格式化日期
  // import LocationSearch from "../components/LocationSearch.vue";
  import { useRouter } from "vue-router";
  import BillList from "./billList.vue";



  const baseAddress = "https://localhost:7092";
  const selectedItineraryId = ref(null);


  //拆帳
  const selectedId = ref(0);
  const openBillList = (id) => {
    if (selectedItineraryId.value === id) {
      selectedItineraryId.value = -1; // 清空 ID 以確保 watch 會觸發
      setTimeout(() => {
        selectedItineraryId.value = id;
      }, 10); // **使用 setTimeout 確保值改變**
    } else {
      selectedItineraryId.value = id;
    }
    console.log("ItineraryId: " + id);
  };
  //拆帳

  // 控制 v-date-picker 顯示與隱藏
  const showDatePicker = ref(false);

  const itinerarytitle = ref("");
  const itinerarylocation = ref("");
  const startDate = ref(""); // 顯示格式 YYYY-MM-DD
  const endDate = ref("");
  const selectedDate = ref(null); // v-date-picker 使用 Date 物件

  // 追蹤當前選擇的是哪個輸入框
  const activeInput = ref(null);

  // 限制結束日期不能早於開始日期
  const minDate = ref(null);

  const profile = ref({
    userId: '',
    userName: '',
    userEmail: '',
    userPhone: ''
  })

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

  onMounted(async () => {
    await fetchProfile();
    await itineraryData();
    loadGoogleMapsAPI();
  });

  const insertdata = async () => {
    try {
      if (!profile.value.userId) {
        await fetchProfile();
      }
      alert(profile.value.userId)
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
      const response = await axios.post(
        `${baseAddress}/api/Itinerary/Itinerary`,
        insert
      );

      // console.log(itinerarytitle.value);
      // console.log(startDate.value);
      // console.log(endDate.value);
      console.log(JSON.stringify(response.data));
      await itineraryData();

      // 手動摺疊 Accordion
      // const collapseElement = document.getElementById('collapseOne');
      // const bsCollapse = new bootstrap.Collapse(collapseElement, {
      //     toggle: false
      // });
      // bsCollapse.hide();
    } catch (error) {
      alert(error.message);
      alert(error.message + "\n檢查你的api有沒有開");
    }
  };

  const API_KEY = "AIzaSyA0mSwZn2Mgu42RjWRxivjrSC3s84nINa0";
  //const map = ref(null);

  // Load Google Maps API
  const loadGoogleMapsAPI = () => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap&region=TW&language=zh-TW`;
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

  const CardName = ref("");
  const CardImg = ref("");
  const CardCoordinate = ref("");
  const CardData = ref([]);

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

  // 取得卡片資料
  const itineraryData = async () => {
    try {
      console.log("ID:" + profile.value.userId);

      const response = await axios.get(
        `${baseAddress}/api/Itinerary/ByUser/${profile.value.userId}`
      );
      CardData.value = response.data;

      //console.log(JSON.stringify(response.data));
    } catch (error) {
      alert(error.message + "\n檢查你的api有沒有開");
    }
  };

  // 路由導向 傳遞行程ID
  const router = useRouter();

  const navigateToGoogleMap = (itineraryId) => {
    console.log(itineraryId);
    router.push({
      name: "Googlemap",
      params: { id: itineraryId }, // 只有 id 放 params
    });
  };

  const dialog = ref(false);

  function showDialog(itineraryId) {
    dialog.value = true;
    selectedItineraryId.value = itineraryId; // 儲存當前卡片的 itineraryId
  }

  // 不需要 export default {}，<script setup> 會自動導出
  defineExpose({ dialog, showDialog });

  const GroupEmmail = ref("");

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
      alert(error.message);
      alert(error.message + "\n檢查你的api有沒有開");
    }
    dialog.value = false;
  }

</script>


<style scoped>
  .custom-modal {
    top: 25%;
  }

  .fixed-size-card {
    width: 300px; /* 設定卡片寬度 */
    height: 400px; /* 設定卡片高度 */
    /* overflow: auto; */
  }

  /* 確保圖片縮放以適應卡片大小 */
  .fixed-size-card .v-img {
    width: 100%;
    height: 60%;
    /* object-fit: cover;  */
  }
  .row {
    margin-left: 0; /* 移除預設的 margin */
  }
</style>