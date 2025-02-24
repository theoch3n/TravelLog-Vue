<template>
  <input class="form-control mt-2" placeholder="地點搜尋" id="search-input" />
</template>

<script setup>
import { onMounted } from "vue";
const baseAddress = "https://localhost:7092";
const API_KEY = "AIzaSyA0mSwZn2Mgu42RjWRxivjrSC3s84nINa0";

// Load Google Maps API
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
    document.getElementById("search-input"),
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

    console.log(place.geometry.location.lng());
    console.log(place.geometry.location.lat());
    console.log(place.photos[0].getUrl());
    //map.value.setCenter(selectRestaurant.location);
  });
};

onMounted(() => {
  loadGoogleMapsAPI();
});
</script>


<style scoped></style>