<!-- TripPlanner.vue -->
<template>
  <div class="trip-planner">
    <div class="flex-container">
      <div class="controls-container">
        <input
          v-model="searchInput"
          class="form-control mt-2"
          placeholder="地點搜尋"
          id="search-input"
        />
        <h4 class="mt-4">今日行程</h4>
        <ul
          class="list-group list-group-flush"
          ref="itineraryList"
          id="itinerary-list"
        >
          <div v-for="(place, index) in itineraryItems" :key="place.id">
            <!-- 行程項目 -->
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              :data-index="index"
            >
              <span>{{ place.name }}</span>
              <button
                class="btn-close remove"
                @click="deletePlace(place.id)"
              ></button>
            </li>
            <!-- 路線資訊 -->
            <li
              v-if="index < itineraryItems.length - 1"
              class="list-group-item text-center text-muted route-info"
              :id="`route-info-${index}`"
            >
              計算中...
            </li>
          </div>
        </ul>
        <button class="btn btn-primary mt-4" id="draw-route" @click="drawRoute">
          規劃路線
        </button>
      </div>
      <div>
        <div class="input">
          <input
            v-model="textsearchInput"
            class="form-control search-input-overlay"
            placeholder="關鍵字搜尋"
            id="textsearch-input-overlay"
          />
        </div>
      </div>
      <div id="map" class="map-container">
        <!-- 在地圖上顯示關鍵字搜尋框 -->
        <!-- <div class="search-overlay">
          <input
            v-model="textsearchInput"
            class="form-control search-input-overlay"
            placeholder="關鍵字搜尋"
            id="textsearch-input-overlay"
          />
        </div> -->
      </div>
      <div class="additional-controls"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

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

  initAutocomplete();
};

// Initialize autocomplete
const initAutocomplete = () => {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("search-input"),
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
          <h3>${place.name}</h3>
          <img src="${place.img}" style="height:250px">
          <div>地址：${place.address}</div>
          <div>電話：${place.phoneNumber}</div>
          <div>評分：${place.rating}</div>
          <div>營業時間：</div>
          <div>${place.opening}</div>
          <div>
            <button class="btn btn-primary mt-2" id="add-to-itinerary">
              加入行程
            </button>
          </div>
        `);

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
        date: 1,
        scheduleId: 1,
        name: place.name,
        address: place.address,
        latitude: place.lat,
        longitude: place.lng,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    searchInput.value = "";
    await fetchPlaces();
  } catch (error) {
    console.error("儲存地點時發生錯誤：", error);
    alert("儲存地點時發生錯誤，請稍後再試。");
  }
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

// Setup text search
const setupTextSearch = (autocomplete) => {
  const service = new google.maps.places.PlacesService(map.value);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const query = textsearchInput.value.trim();

    if (!query) {
      alert("請輸入搜尋關鍵字！");
      return;
    }

    const searchLocation = place.geometry?.location || map.value.getCenter();

    service.textSearch(
      {
        query: query,
        location: searchLocation,
        radius: 2000,
        type: "restaurant",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          clearMarkers();

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

          map.value.setCenter(searchLocation);
        } else {
          alert("搜尋失敗：" + status);
        }
      }
    );
  });
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

    await fetchPlaces();
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

  directionsRenderers.value.forEach((renderer) => renderer.setMap(null));
  directionsRenderers.value = [];

  const colors = ["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#800080"];

  for (let i = 0; i < itineraryItems.value.length - 1; i++) {
    const origin = {
      lat: itineraryItems.value[i].latitude,
      lng: itineraryItems.value[i].longitude,
    };
    const destination = {
      lat: itineraryItems.value[i + 1].latitude,
      lng: itineraryItems.value[i + 1].longitude,
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
  itineraryItems.value.forEach((place, index) => {
    const marker = new google.maps.Marker({
      position: { lat: place.latitude, lng: place.longitude },
      label: `${index + 1}`,
      map: map.value,
    });
    markers.value.push(marker);
  });
};

// Fetch places
const fetchPlaces = async () => {
  try {
    const response = await fetch(`${baseAddress}/api/Places`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    itineraryItems.value = data;
  } catch (error) {
    console.error("Error fetching places:", error);
  }
};

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

// Lifecycle hooks
onMounted(() => {
  loadGoogleMapsAPI();
  fetchPlaces();
  // initSortable()
});
</script>
  
  <style scoped>
.input {
  z-index: 1000; /* 讓搜尋框浮在地圖之上 */
  position: absolute;
}
.flex-container {
  display: flex;
  flex-direction: row; /* 讓控制項目在左邊 */
  height: 100vh;
}

.map-container {
  width: 100%; /* 讓地圖覆蓋剩餘空間 */
  height: 100vh;
  /* 為了定位覆蓋層 */
  border: none; /* 移除邊界 */
}

.controls-container {
  padding: 16px;
  width: 30%; /* 調整控制項目的寬度 */
  height: 100vh; /* 讓控制項目佔滿左邊空間 */
  overflow-y: auto; /* 如果控制項目內容超出，則允許滾動 */
}

.additional-controls {
  padding: 7px;
  width: 20%;
}

.search-overlay {
  position: relative;
  top: 10px;
  left: 10px;
  background-color: rgba(61, 118, 192, 0.9); /* 白色半透明背景 */
  padding: 5px;
  border-radius: 5px;
}

.search-input-overlay {
  width: 200px;
}
</style>
  