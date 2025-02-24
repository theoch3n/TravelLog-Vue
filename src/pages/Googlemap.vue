<!-- TripPlanner.vue -->
<template>
  <div class="trip-planner">
    <div class="flex-container">
      <div class="controls-container col-4 rounded-3">
        <h4 class="title mt-4">{{ Itinerarydata.itineraryTitle }}</h4>
        <img :src="Itinerarydata.itineraryImage" alt="" class="titleimg" :style="{ height: '30%', width: '100%' }" />
        <div class="date">
          <label for="itineraryStartDate">{{
            Itinerarydata.itineraryStartDate
          }}</label>
          <label for=""> ~ </label>
          <label for="itineraryEndDate">{{
            Itinerarydata.itineraryEndDate
          }}</label>
        </div>
        <button class="btn btn-primary mt-4 draw_btn" id="draw-route" @click="drawRoute">
          規劃路線
        </button>
        <!-------------動態生成日期導覽列--------------------->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" v-for="(date, index) in dateList" :key="index" role="presentation">
            <button class="nav-link btn btn-outline-secondary" id="home-tab" :class="{ active: selectedDate === date }"
              data-bs-toggle="tab" :data-bs-target="'#' + dateList[index]" type="button" role="tab" aria-selected="true"
              @click="handleDateClick(date)">
              {{ date }}
            </button>
          </li>
        </ul>
        <div class="tab-content" v-for="(date, index) in dateList" :key="index" id="myTabContent">
          <div class="tab-pane fade show" :id="dateList[index]" role="tabpanel" aria-labelledby="home-tab">
            {{ dateList[index] }}

            <!--呼叫PlaceCard-->

            <div class="container">
              <div v-if="places.length > 0">
                <PlaceCard v-for="(place, index) in places" :key="place.id" :data="place"
                  :deletePlaceHandler="deletePlace">
                  <li v-if="index < places.length - 1" class="list-group-item text-center text-muted route-info"
                    :id="`route-info-${index}`">
                    計算中...
                  </li>
                </PlaceCard>
              </div>
              <div v-else>
                <p>目前沒有行程資料</p>
              </div>
            </div>

            <!---------------->
          </div>
        </div>
        <!---------------------------------------------------------->
      </div>
      <div class="pt-2">
        <div class="input">
          <input v-model="textsearchInput" class="form-control search-input-overlay p-1 border-5 border-primary"
            placeholder="輸入類別" id="textsearch-input-overlay" />
          <button class="btn btn-danger" id="searchButton">搜尋</button>
          <!-- <input v-model="searchInput" class="form-control mt-2" placeholder="地點搜尋" id="search-input" /> -->
        </div>
      </div>
      <div id="map" class="map-container col-8"></div>
      <div class="additional-controls"></div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed } from "vue";
import PlaceCard from "../components/PlaceCard.vue";
import dayjs from "dayjs";
import { format } from "date-fns";
import { useRoute } from "vue-router";

// Constants
const baseAddress = "https://localhost:7092";
const API_KEY = "AIzaSyA0mSwZn2Mgu42RjWRxivjrSC3s84nINa0";

// Reactive references
const map = ref(null);
const textsearchInput = ref("");
const searchInput = ref("");
const itineraryItems = ref([]);
const itineraryList = ref(null);
const markers = ref([]);
const directionsService = ref(null);
const directionsRenderers = ref([]);
const infoWindow = ref(null);
const placesList = ref([]);
const route = useRoute();
const itineraryId = route.params.id; // 從建立行程取得 ID
const Itinerarydata = ref({
  //儲存從itinerary資料庫裡抓的資料
  itineraryId: "",
  itineraryTitle: "",
  itineraryStartDate: "",
  itineraryEndDate: "",
  itineraryImage: "",
});
// 初始化為當前時間，避免 undefined 問題
const date_St = ref(dayjs());
const date_Ed = ref(dayjs());

console.log("卡片ID:" + itineraryId);

// Lifecycle hooks
onMounted(() => {
  console.log("準備呼叫 fetchItineraryById 函式...");

  loadGoogleMapsAPI();
  // fetchPlaces();
  fetchPlacesByDate();
  fetchItineraryById();

  // initSortable()
});

// 使用 Vue 的 onMounted 來初始化地圖
window.onload = () => {
  if (typeof google !== "undefined" && google.maps) {
    initMap();
    console.log("Google Maps API 加載完成！");

  } else {
    console.error("Google Maps API 尚未加載完成！");
  }
};
//////////////////////////計算日期/////////////////////////////////////

// 監聽 Itinerarydata 變化，確保有值後才設定日期
watch(
  () => Itinerarydata.value,
  (newData) => {
    if (newData?.itineraryStartDate && newData?.itineraryEndDate) {
      date_St.value = dayjs(newData.itineraryStartDate);
      date_Ed.value = dayjs(newData.itineraryEndDate);
      console.log(
        "更新後的日期:",
        date_St.value.format("YYYY-MM-DD"),
        date_Ed.value.format("YYYY-MM-DD")
      );
    }
  },
  { deep: true, immediate: true }
);

// 計算相差天數
const dateDiff = computed(() => date_Ed.value.diff(date_St.value, "day"));

// 生成日期列表
const dateList = computed(() => {
  return Array.from({ length: dateDiff.value + 1 }, (_, i) =>
    date_St.value.add(i, "day").format("YYYY-MM-DD")
  );
});

// console.log(dateList.value); // 測試輸出

////////////////////////得知當前所選的導覽業面////////////////////////////////
// 當前選擇的日期
const selectedDate = ref(dateList.value[0]); // 預設為第一天
// 處理點擊事件
const handleDateClick = (date) => {
  selectedDate.value = date;
  // console.log("選擇的日期是：", date); // 這裡你可以改成發 API 請求
};

///////////////////////////////////////////////////////////////

//假的vard資料

const places = ref([
  {
    title: "一蘭拉麵 心齋橋店",
    rating: "3.6",
    img: "/湯婆婆.jpg",
    time: "19:00",
  },
  {
    title: "大阪城",
    rating: "2",
    img: "/湯婆婆.jpg",
    time: "10:00",
  },
  {
    title: "TST麵包坊",
    rating: "4.5",
    img: "/777.jpeg",
    time: "10:00",
  },
]);

const places2 = ref([
  {
    title: "TST麵包坊",
    rating: "4.5",
    img: "/777.jpeg",
    time: "10:00",
  },
  {
    title: "光之穹頂",
    rating: "4",
    img: "/666.jpeg",
    time: "10:00",
  },
]);

// Load Google Maps API
const loadGoogleMapsAPI = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&loading=async&loading=async&libraries=places&callback=initMap&region=TW&language=zh-TW`;
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
  map.value = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 23.553118, lng: 121.0211024 },
    zoom: 7,
  });

  navigator.geolocation.getCurrentPosition((position) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    map.value.setCenter(currentPosition);
    map.value.setZoom(16);
  });

  // initAutocomplete();
  initAutocomplete1();
};

// Initialize autocomplete
// const initAutocomplete = () => {
//   const autocomplete = new google.maps.places.Autocomplete(
//     document.getElementById("search-input"),
//     { type: ["restaurant"] }
//   );

//   setupMarkerListener(autocomplete);
//   setupTextSearch(autocomplete);
// };

// Initialize autocomplete
const initAutocomplete1 = () => {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("textsearch-input-overlay"),
    { type: ["restaurant"] }
  );
  setupMarkerListener(autocomplete);
  setupTextSearch(autocomplete);
};

// Add marker
const addMarker = (place) => {
  const marker = new google.maps.Marker({
    position: place.location,
    map: map.value,
  });

  markers.value.push(marker);

  return marker;
};

// Setup info window
const setupInfoWindow = (marker, place) => {
  marker.addListener("click", () => {
    if (!infoWindow.value) {
      infoWindow.value = new google.maps.InfoWindow();
    }

    infoWindow.value.setContent(`
  <div style="
    font-family: 'Arial', sans-serif; 
    max-width: 350px; 
    border-radius: 12px; 
    background-color: #ffffff; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    overflow: hidden;
  ">
    <!-- 標題區塊 -->
    <div style="
      background-color: #007bff; 
      color: white; 
      padding: 15px; 
      font-size: 20px; 
      font-weight: bold;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    ">
      ${place.name}
    </div>

    <!-- 內容區塊 -->
    <div style="
      padding: 20px; 
      background-color: #f8f9fa; 
      color: #333; 
      font-size: 15px; 
      line-height: 1.6;
    ">
      <img src="${place.img}" style="
        height: 200px; 
        width: 100%; 
        object-fit: cover; 
        border-radius: 10px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
      
      <div style="margin-top: 15px;">
        <p>📍 <strong>地址：</strong> ${place.address}</p>
        <p>📞 <strong>電話：</strong> ${place.phoneNumber}</p>
        <p>⭐ <strong>評分：</strong> ${place.rating}</p>
        <p>⏰ <strong>營業時間：</strong><br>${place.opening}</p>
      </div>
    </div>

    <!-- 按鈕 -->
    <button id="add-to-itinerary" style="
      width: 100%; 
      background-color: #007bff; 
      color: white; 
      border: none; 
      padding: 14px; 
      font-size: 18px; 
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border-radius: 0 0 12px 12px;
    "
      onmouseover="this.style.backgroundColor='#0056b3'"
      onmouseout="this.style.backgroundColor='#007bff'"
    >
      ➕ 加入行程
    </button>
  </div>
`);

    // console.log(place);
    infoWindow.value.open(map.value, marker);

    google.maps.event.addListenerOnce(infoWindow.value, "domready", () => {
      const addButton = document.getElementById("add-to-itinerary");
      if (addButton) {
        addButton.addEventListener("click", () => addToItinerary(place));
      }
    });
  });
};

// Add to itinerary
const addToItinerary = async (place) => {
  try {
    const response = await fetch(`${baseAddress}/api/Places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: selectedDate.value,
        scheduleId: itineraryId,
        name: place.name,
        address: place.address,
        latitude: place.lat,
        longitude: place.lng,
        img: place.img,
        rating: String(place.rating),
      }),
    });
    // console.log(selectedDate.value);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // searchInput.value = "";
    // await fetchPlaces();
    await fetchPlacesByDate();
  } catch (error) {
    console.error("儲存地點時發生錯誤：", error);
    alert("儲存地點時發生錯誤，請稍後再試。");
  }
};

// Setup marker listener
const setupMarkerListener = (autocomplete1) => {
  autocomplete1.addListener("place_changed", () => {
    const place = autocomplete1.getPlace();
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

    placesList.value.push(selectRestaurant);

    const newMarker = addMarker(selectRestaurant);
    setupInfoWindow(newMarker, selectRestaurant);
    map.value.setCenter(selectRestaurant.location);
  });
};

// Clear markers
const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
};

//setupTextSearch
const setupTextSearch = (autocomplete) => {
  const service = new google.maps.places.PlacesService(map.value); // Google Places API

  // 確保 autocomplete 存在
  if (autocomplete) {
    clearMarkers();

    // 監聽 Autocomplete 事件（當選擇地點時觸發）
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      // 確保 place 有效
      if (!place.geometry) {
        alert("請選擇有效的地點！");
        return;
      }

      // 使用 autocomplete 提供的地點，否則用地圖中心
      const searchLocation = place.geometry.location || map.value.getCenter();

      // 搜尋該地點
      setupMarkerListener(searchLocation);

      // performSearch(service, "", searchLocation);
    });
  }

  // 新增搜尋按鈕功能（使用當前地圖中心點搜尋）
  document.getElementById("searchButton").addEventListener("click", () => {
    const query = textsearchInput.value.trim();
    if (!query) {
      alert("請輸入搜尋關鍵字！");
      return;
    }

    // 直接使用目前地圖的中心點作為搜尋位置
    const searchLocation = map.value.getCenter();

    performSearch(service, query, searchLocation);

    // 清空輸入框
    document.getElementById("textsearchInput").value = "";
  });
};

// 範圍搜尋標記點位
const performSearch = (service, query, searchLocation) => {
  service.textSearch(
    {
      query: query,
      location: searchLocation,
      radius: 2000, // 搜尋範圍
      type: "restaurant",
    },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearMarkers(); // 只清除標記，不重新載入地圖

        results.forEach((result) => {
          const placeData = {
            location: result.geometry.location,
            placeId: result.place_id,
            name: result.name,
            address: result.formatted_address || "地址未知",
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
            phoneNumber: result.formatted_phone_number || "無資料",
            rating: result.rating || "無評分",
            img: result.photos?.[0]?.getUrl() || "",
            opening:
              result.current_opening_hours?.weekday_text || "無營業時間資訊",
          };

          const newMarker = addMarker(placeData);
          setupInfoWindow(newMarker, placeData);
        });

        // **不要呼叫 initMap()，直接將地圖中心設為搜尋位置**
        map.value.setCenter(searchLocation);
      } else {
        alert("搜尋失敗：" + status);
      }
    }
  );
};

// Delete place
const deletePlace = async (placeId) => {
  try {
    const response = await fetch(`${baseAddress}/api/Places/${placeId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("刪除失敗");
    }

    // await fetchPlaces();
    await fetchPlacesByDate();

    initMap();
  } catch (error) {
    console.error("刪除請求錯誤:", error);
  }
};

// Draw route
const drawRoute = () => {
  if (!directionsService.value) {
    directionsService.value = new google.maps.DirectionsService();
  }
  initMap();
  directionsRenderers.value.forEach((renderer) => renderer.setMap(null));
  directionsRenderers.value = [];

  const colors = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080"];

  for (let i = 0; i < places.value.length - 1; i++) {
    const origin = {
      lat: places.value[i].latitude,
      lng: places.value[i].longitude,
    };
    const destination = {
      lat: places.value[i + 1].latitude,
      lng: places.value[i + 1].longitude,
    };

    const renderer = new google.maps.DirectionsRenderer({
      map: map.value,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: colors[i % colors.length],
        strokeWeight: 6,
      },
    });
    directionsRenderers.value.push(renderer);

    directionsService.value.route(
      {
        origin: origin,
        destination: destination,
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          renderer.setDirections(response);
          const leg = response.routes[0].legs[0];
          const routeInfo = document.getElementById(`route-info-${i}`);
          if (routeInfo) {
            routeInfo.textContent = `距離: ${leg.distance.text}, 預估時間: ${leg.duration.text}`;
          }
        } else {
          alert("無法規劃路線：" + status);
        }
      }
    );
  }

  markers.value.forEach((marker) => marker.setMap(null));
  places.value.forEach((place, index) => {
    const marker = new google.maps.Marker({
      position: { lat: place.latitude, lng: place.longitude },
      label: `${index + 1}`,
      map: map.value,
    });
    markers.value.push(marker);
  });
};

//傳送選擇的日期抓對應的地點
const fetchPlacesByDate = async () => {
  try {
    const response = await fetch(
      `${baseAddress}/api/Places?date=${selectedDate.value}`
    );
    if (!response.ok) throw new Error("無法取得資料");

    const allData = await response.json();
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

// 監聽 selectedDate 變化，自動讀取對應日期的資料
watch(selectedDate, () => {
  fetchPlacesByDate();
});

//根據建立行程ID抓取資料庫
const fetchItineraryById = async () => {
  console.log("進入 fetchItineraryById 函式...");

  try {
    // if (!itineraryId.value) {
    //   throw new Error("行程 ID 未設定！");
    // }
    console.log("卡片IklklD:", itineraryId); // 輸出獲取的 itineraryId

    // 改正請求的 URL 格式
    const response = await fetch(
      `${baseAddress}/api/Itinerary/Itinerary/${itineraryId}`
    );
    if (!response.ok) throw new Error("無法取得資料");

    // 直接處理返回的單一物件
    const itinerary = await response.json();
    if (!itinerary) throw new Error("查無資料");

    // 更新行程資料
    Itinerarydata.value = {
      itineraryId: itinerary.itineraryId,
      itineraryTitle: itinerary.itineraryTitle,
      itineraryStartDate: itinerary.itineraryStartDate.split("T")[0], // 去掉時間部分
      itineraryEndDate: itinerary.itineraryEndDate.split("T")[0], // 去掉時間部分
      itineraryImage: itinerary.itineraryImage,
    };
    console.log("取得的資料1:", String(Itinerarydata.value.itineraryStartDate));

    console.log("取得的資料2:", "2025-02-16");
  } catch (error) {
    console.error("獲取資料時發生錯誤：", error);
  }
};

//////////////////////////////////////////////

// Initialize Sortable
// const initSortable = () => {
//   if (itineraryList.value) {
//     new Sortable(itineraryList.value, {
//       animation: 150,
//       onEnd: (event) => {
//         const newItems = [...itineraryItems.value]
//         const [movedItem] = newItems.splice(event.oldIndex, 1)
//         newItems.splice(event.newIndex, 0, movedItem)
//         itineraryItems.value = newItems
//       }
//     })
//   }
// }
</script>

<style scoped>
.input {
  z-index: 1000;
  /* 讓搜尋框浮在地圖之上 */
  position: absolute;
}

.flex-container {
  display: flex;
  flex-direction: row;
  /* 讓控制項目在左邊 */
  height: 100vh;
  width: 100%;
}

.draw_btn {
  display: block;
  margin-left: auto;
}

.title {
  position: absolute;
  top: 100px;
  /* 確保標題貼近圖片頂部 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 10px 15px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  /* 半透明黑色背景提升可讀性 */
  border-radius: 5px;
  text-align: center;
}

.titleimg {
  max-width: 100%;
  /* 圖片寬度不超過容器 */
  max-height: 100%;
  /* 圖片高度不超過容器 */
  object-fit: cover;
  /* 圖片填滿容器，可能會裁剪部分內容 */
}

.map-container {
  width: 100%;
  /* 讓地圖覆蓋剩餘空間 */
  height: 100vh;
  /* 為了定位覆蓋層 */
  /* border: none; */
  /* 移除邊界 */
}

.controls-container {
  padding: 0px;
  width: 400px;
  /* 調整控制項目的寬度 */
  height: 100vh;
  /* 讓控制項目佔滿左邊空間 */
  overflow-y: auto;
  /* 如果控制項目內容超出，則允許滾動 */
  background-color: rgb(245, 235, 236);
  position: relative;
  /* 確保內部元素可以相對於它進行絕對定位 */
}

.additional-controls {
  padding: 7px;
  width: 20%;
}

.search-overlay {
  top: 10px;
  /* right: 5px; */
  background-color: rgba(61, 118, 192, 0.9);
  /* 白色半透明背景 */
  padding: 5px;
  border-radius: 5px;
}

.search-input-overlay {
  width: 200px;
}
</style>