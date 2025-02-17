<template>
    <!-- <input class="form-control mt-2" placeholder="地點搜尋" id="search-input"/>
    <div class="container mt-5 mb-5">
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
                                <label for="travel-themes" class="col-form-label">旅程主題</label>
                                <input type="text" class="form-control" id="travel-themes" placeholder="請輸入主題" v-model="itinerarytitle">
                            </div>
                            <div class="mb-3">
                                <label for="travel-location" class="col-form-label">旅程地點</label>
                                <input type="text" class="form-control" id="travel-location" placeholder="請輸國家或城市" v-model="itinerarylocation">
                              
                            </div>
                            <label class="col-form-label">旅程日期</label>
                            <div class="container">
                                <div class="row">
                                    <div class="col-6">
                                        <input type="text" id="startdate"  @click="openDatePicker('start')" :value="startDate" placeholder="開始日期" readonly style="border: 1px solid black; padding: 5px 10px; cursor: pointer;">
                                    </div> 
                                    <div class="col-6">
                                        <input type="text" id="enddate"  @click="openDatePicker('end')" :value="endDate" placeholder="結束日期" readonly style="border: 1px solid black; padding: 5px 10px; cursor: pointer;">
                                    </div> 
                                    <v-menu v-model="showDatePicker" transition="scale-transition" offset-y :style="{ position: 'absolute', left: '35%', transform: 'translateX(-50%)', top: '70%', transform: 'translateY(-50%)' }">
                                        <v-card>
                                            <v-date-picker v-model="selectedDate" :min="minDate" @update:model-value="setDate"></v-date-picker>
                                        </v-card>
                                    </v-menu>
                                </div>
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

    
    <!-- <input class="form-control mt-2" placeholder="地點搜尋" id="search-input"/> -->
    <!-- <input
          class="form-control mt-2"
          placeholder="地點搜尋"
          id="search-input"
        /> -->
        <!-- <div
        v-show="showMap"
        id="map"
        style="height: 400px; width: 100%"
        class="hiden"
        ></div> -->


    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-4">
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            新增行程
                        </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <form>
                                <div class="mb-3">
                                    <label for="travel-themes" class="col-form-label">旅程主題</label>
                                    <input type="text" class="form-control" id="travel-themes" placeholder="請輸入主題" v-model="itinerarytitle">
                                </div>
                                <div class="mb-3">
                                    <label for="travel-location" class="col-form-label">旅程地點</label>
                                    <input type="text" class="form-control" id="travel-location" placeholder="請輸國家或城市" v-model="itinerarylocation">
                                </div>
                                <label class="col-form-label">旅程日期</label>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-6">
                                            <!-- 開始日期輸入框 -->
                                            <input type="text" id="startdate" class="form-control"  @click="openDatePicker('start')" :value="startDate" placeholder="開始日期" readonly style="padding: 5px 10px; cursor: pointer;">
                                        </div> 
                                        <div class="col-6">
                                            <!-- 結束日期輸入框 -->
                                            <input type="text" id="enddate" class="form-control"  @click="openDatePicker('end')" :value="endDate" placeholder="結束日期" readonly style="padding: 5px 10px; cursor: pointer;">
                                        </div> 
                                        <!-- 日期選擇器 -->
                                        <v-menu v-model="showDatePicker" transition="scale-transition" offset-y :style="{ position: 'absolute', left: '35%', transform: 'translateX(-50%)', top: '70%', transform: 'translateY(-50%)' }">
                                            <v-card>
                                                <v-date-picker v-model="selectedDate" :min="minDate" @update:model-value="setDate"></v-date-picker>
                                            </v-card>
                                        </v-menu>
                                    </div>
                                </div>
                            </form>
                            <br>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-primary" data-bs-target="#collapseOne" @click="insertdata()">完成</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-5">
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="card in CardData" :key="card.itineraryId" @click="navigateToGoogleMap(card.itineraryId)">
                <div class="card h-100">
                    <img :src="card.itineraryImage" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">{{ card.itineraryTitle }}</h5>
                        <p class="card-text">{{ card.itineraryStartDate.split('T')[0] + ' ~ ' + card.itineraryEndDate.split('T')[0] }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import { ref, onMounted } from "vue";
    import axios from 'axios';
    import { format } from "date-fns"; // 格式化日期
    import LocationSearch from "../components/LocationSearch.vue";
    import { useRouter } from 'vue-router';
    // import 'bootstrap/dist/css/bootstrap.min.css';
    // import 'bootstrap/dist/js/bootstrap.bundle.min.js';

    const baseAddress = 'https://localhost:7092';

    // 控制 v-date-picker 顯示與隱藏
    const showDatePicker = ref(false);

    const itinerarytitle = ref("");
    const itinerarylocation = ref("");
    const startDate = ref("");  // 顯示格式 YYYY-MM-DD
    const endDate = ref("");  
    const selectedDate = ref(null); // v-date-picker 使用 Date 物件

    // 追蹤當前選擇的是哪個輸入框
    const activeInput = ref(null);

    // 限制結束日期不能早於開始日期
    const minDate = ref(null);

    // 打開日期選擇器
    const openDatePicker = (type) => 
    {
        activeInput.value = type;
        showDatePicker.value = true;

        // 設定 v-date-picker 的當前日期
        if (type === "start" && startDate.value) 
        {
            selectedDate.value = new Date(startDate.value);
        } 
        else if (type === "end" && endDate.value) 
        {
            selectedDate.value = new Date(endDate.value);
        } 
        else
        {
            selectedDate.value = new Date(); // 預設為今天
        }

        // 限制結束日期不能早於開始日期
        if (type === "end" && startDate.value) 
        {
            minDate.value = startDate.value;
        } 
        else {
            minDate.value = null;
        }
    };

    // 設定選擇的日期並關閉選擇器
    const setDate = (date) => 
    {
        if (!date) return;
        
        const formattedDate = format(new Date(date), "yyyy-MM-dd"); // 轉換為 YYYY-MM-DD

        if (activeInput.value === "start") 
        {
            startDate.value = formattedDate;
            endDate.value = ""; // 選擇新的開始日期時，重置結束日期
        } 
        else if (activeInput.value === "end") 
        {
            endDate.value = formattedDate;
        }

        showDatePicker.value = false;
    };

    onMounted(() => {
        loadGoogleMapsAPI();
        itineraryData();
    });
    
    const insertdata = async () => 
    {
        try
        {
            const insert = {itineraryId: 0, itineraryTitle: itinerarytitle.value, itineraryLocation: CardName.value, itineraryCoordinate: CardCoordinate.value, itineraryImage: CardImg.value, itineraryStartDate: startDate.value ,ItineraryEndDate: endDate.value, itineraryCreateDate: null };
            const response = await axios.post(`${baseAddress}/api/Itinerary/Itinerary`, insert);

            
            // console.log(itinerarytitle.value);
            // console.log(startDate.value);
            // console.log(endDate.value);
            // console.log(JSON.stringify(response.data));
            await itineraryData();

            // 手動摺疊 Accordion
            const collapseElement = document.getElementById('collapseOne');
            import('bootstrap').then(({ Collapse }) => {
            const bsCollapse = new Collapse(collapseElement, {
                toggle: false
            });
            bsCollapse.toggle(); // 使用 toggle 方法來切換摺疊狀態
        });
        } 
        catch (error)
        {
            alert(error.message)
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
        CardCoordinate.value = place.geometry.location.lat()+','+place.geometry.location.lng();

        console.log(place.name);
        console.log(place.geometry.location.lat()+','+place.geometry.location.lng());
        console.log(place.geometry.location.lng());
        console.log(place.geometry.location.lat());
        console.log(place.photos[0].getUrl());
        //map.value.setCenter(selectRestaurant.location);
    });
    };

    // 取得卡片資料
    const itineraryData = async () => 
    {
        try
        {
            const response = await axios.get(`${baseAddress}/api/Itinerary/getitineraryData`);
            CardData.value = response.data;

            //console.log(JSON.stringify(response.data));
        } 
        catch (error)
        {
            alert(error.message + "\n檢查你的api有沒有開");
        }
    };

    // 路由導向 傳遞行程ID
    const router = useRouter();

    const navigateToGoogleMap = (itineraryId) => {
        console.log(itineraryId);
         router.push({ name: 'Googlemap', params: { id: itineraryId } });
    };
</script>


<style scoped>

    .custom-modal {
        top: 25%; 
    }

</style>