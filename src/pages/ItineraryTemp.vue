<template>
    <!-- <input class="form-control mt-2" placeholder="地點搜尋" id="search-input"/> -->
    <!-- <div class="container mt-5 mb-5">
        <button type="button" class="btn btn-outline-primary bi bi-plus-lg" data-bs-toggle="modal" data-bs-target="#ItineraryModal" data-bs-whatever="@mdo"> 新增行程</button>

        <div class="modal fade" id="ItineraryModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog custom-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">建立行程</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                           
                            <div class="mb-3">
                                <label for="travel-location" class="col-form-label">旅程地點</label>
                                <input type="text" class="form-control" id="travel-location" placeholder="請輸國家或城市" v-model="itinerarylocation">
                              <input class="form-control mt-2" placeholder="地點搜尋" id="search-input"/> 
                            </div>
                           
                            
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="insertdata()">完成</button>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-4">
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                新增行程
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <input class="form-control mt-2" placeholder="地點搜尋" id="search-input" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>



</template>

<script setup>

import { ref, onMounted } from "vue";



const baseAddress = 'https://localhost:7092';



onMounted(() => {
    loadGoogleMapsAPI();

});

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


const CardName = ref("");
const CardImg = ref("");
const CardCoordinate = ref("");


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
        CardCoordinate.value = place.geometry.location.lat() + ',' + place.geometry.location.lng();

        console.log(place.name);
        console.log(place.geometry.location.lat() + ',' + place.geometry.location.lng());
        console.log(place.geometry.location.lng());
        console.log(place.geometry.location.lat());
        console.log(place.photos[0].getUrl());
        //map.value.setCenter(selectRestaurant.location);
    });
};



</script>


<style scoped>
.custom-modal {
    top: 25%;
}

/* .modal-fade{
        z-index: 1000;
    } */

.pac-container {
    z-index: 1050 !important;
    /* Ensure this is higher than the modal's z-index */
}
</style>