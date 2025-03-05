<!-- TripPlanner.vue -->
<template>
  <div class="googlemap-page-container">
    <!-- 背景輪播 -->
    <CarouselsCycle class="background-carousel" />
    
    <!-- 遮罩層 -->
    <div class="overlay-mask"></div>
    
    <div class="wrap">
      <div class="item">
        <div class="content-wrapper">
          <!-- 頁面標題 -->
          <div class="page-title-container">
            <h1 class="page-title">{{ Itinerarydata.itineraryTitle }}</h1>
            <p class="page-subtitle">
              {{ Itinerarydata.itineraryStartDate }} ~ {{ Itinerarydata.itineraryEndDate }}
            </p>
          </div>
          
          <div class="map-content-container">
            <div class="controls-container">
              <div class="search-box">
                <input
                  v-model="textsearchInput"
                  class="search-input"
                  placeholder="搜尋景點、餐廳或活動"
                  id="textsearch-input-overlay"
                />
                <button class="search-button" id="searchButton">
                <i class="mdi mdi-magnify"></i>
              </button>
              </div>
              
              <button class="route-btn" id="draw-route" @click="drawRoute">
                <i class="fas fa-route me-2"></i> 規劃路線
              </button>
              
              <!-- 日期導覽列 -->
              <div class="date-tabs-container">
                <ul class="date-tabs">
                  <li
                    v-for="(date, index) in dateList"
                    :key="index"
                    class="date-tab-item"
                  >
                    <button
                      class="date-tab-btn"
                      :class="{ active: selectedDate.value === date }"
                      @click="handleDateClick(date)"
                    >
                      {{ formatDisplayDate(date) }}
                    </button>
                  </li>
                </ul>
              </div>
              
              <!-- 行程卡片區域 -->
              <div class="places-container">
                <div v-if="places.length > 0" class="places-list">
                  <PlaceCard
                    v-for="(place, index) in places"
                    :key="place.id"
                    :data="place"
                    :hide="true"
                    :deletePlaceHandler="deletePlace"
                  >
                    <li
                      v-if="index < places.length - 1"
                      class="route-info-item"
                      :id="`route-info-${index}`"
                    >
                      <i class="fas fa-walking me-2"></i> 計算中...
                    </li>
                  </PlaceCard>
                </div>
                <div v-else class="no-places">
                  <div class="no-data-container">
                    <i class="fas fa-map-marked-alt no-data-icon"></i>
                    <p class="no-data-text">目前沒有行程資料</p>
                    <p class="no-data-hint">搜尋並添加景點開始規劃您的旅程</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="map" class="map-container"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from "vue";
import PlaceCard from "../components/PlaceCard.vue";
import CarouselsCycle from "@/components/CarouselsCycle.vue";
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
  itineraryLocation: "",
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
  // fetchPlacesByDate();
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
      selectedDate.value = date_St.value.format("YYYY-MM-DD");
      fetchPlacesByDate();
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

// 格式化顯示日期為 MM/DD
const formatDisplayDate = (date) => {
  return dayjs(date).format("MM/DD");
};

// console.log(dateList.value); // 測試輸出

////////////////////////得知當前所選的導覽業面////////////////////////////////
// 當前選擇的日期
const selectedDate = ref('');
// 處理點擊事件
const handleDateClick = (date) => {
  selectedDate.value = date;
  // console.log("選擇的日期是：", date); // 這裡你可以改成發 API 請求
};

///////////////////////////////////////////////////////////////

//假的vard資料

const places = ref([]);

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
    // 假設 itineraryLocation 是 "22.6234049,120.2951227" 格式的字串
    const itineraryLocation = Itinerarydata.value.itineraryLocation.split(","); //從行程抓取經緯度

    // 轉換為 { lat, lng } 物件
    const itineraryLocationObj = {
      lat: parseFloat(itineraryLocation[0]), // 解析為浮點數
      lng: parseFloat(itineraryLocation[1]), // 解析為浮點數
    };
    map.value.setCenter(itineraryLocationObj);
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
    console.log(place);
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
      itineraryLocation: itinerary.itineraryCoordinate,
    };
    console.log("取得的資料1:", String(Itinerarydata.value.itineraryStartDate));

    console.log("取得的資料2:", Itinerarydata.value.itineraryLocation);
  } catch (error) {
    console.error("獲取資料時發生錯誤：", error);
  }
};

// 添加頁面掛載和卸載時的樣式處理
onMounted(() => {
  document.body.classList.add('googlemap-page');
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  
  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 添加透明背景
  if (header) header.style.backgroundColor = 'transparent';
  if (footer) footer.style.backgroundColor = 'transparent';
});

onBeforeUnmount(() => {
  document.body.classList.remove('googlemap-page');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  
  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 恢復原來的背景
  if (header) header.style.backgroundColor = '';
  if (footer) footer.style.backgroundColor = '';
});
</script>

<style scoped>
.googlemap-page-container {
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
  z-index: 2;
  pointer-events: none;
}

.wrap {
  position: relative;
  z-index: 3;
  width: 100%;
  min-height: 100vh;
  padding: 80px 20px 40px;
}

.item {
  width: 100%;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title-container {
  text-align: center;
  margin-bottom: 30px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.map-content-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 500px;
}

.controls-container {
  flex: 0 0 350px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border-radius: 30px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  background: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.search-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
}

.search-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
}

.route-btn {
  width: 100%;
  padding: 12px 20px;
  border-radius: 30px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.route-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
}

.date-tabs-container {
  margin: 15px 0;
  overflow-x: auto;
}

.date-tabs {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 10px;
}

.date-tab-item {
  flex: 0 0 auto;
}

.date-tab-btn {
  padding: 8px 15px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(79, 70, 229, 0.3);
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-tab-btn.active {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}

.date-tab-btn:hover:not(.active) {
  background: rgba(79, 70, 229, 0.1);
  border-color: rgba(79, 70, 229, 0.5);
}

.places-container {
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
}

.places-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.route-info-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 5px 0;
  font-size: 14px;
  color: #333;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-container {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.no-places {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-container {
  text-align: center;
  padding: 30px;
}

.no-data-icon {
  font-size: 4rem;
  color: rgba(79, 70, 229, 0.3);
  margin-bottom: 15px;
}

.no-data-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.no-data-hint {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 992px) {
  .map-content-container {
    flex-direction: column;
    height: auto;
  }
  
  .controls-container {
    flex: 0 0 auto;
    width: 100%;
  }
  
  .map-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .wrap {
    padding: 60px 15px 30px;
  }
}
</style>

<style>
/* 全局樣式 */
body.googlemap-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

body.googlemap-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.googlemap-page .header-container {
  background: transparent !important;
}

body.googlemap-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  body.googlemap-page .desktop-header,
  body.googlemap-page footer.footer-container {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }
}
</style>