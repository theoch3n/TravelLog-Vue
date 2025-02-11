
<template>

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
                                <input type="text" class="form-control" id="travel-location" placeholder="請輸國家或城市">
                            </div>
                            <label class="col-form-label">旅程日期</label>
                            <div class="container">
                                <div class="row">
                                    <div class="col-6">
                                        <!-- 開始日期輸入框 -->
                                        <input type="text" id="startdate"  @click="openDatePicker('start')" :value="startDate" placeholder="開始日期" readonly style="border: 1px solid black; padding: 5px 10px; cursor: pointer;">
                                    </div> 
                                    <div class="col-6">
                                        <!-- 結束日期輸入框 -->
                                        <input type="text" id="enddate"  @click="openDatePicker('end')" :value="endDate" placeholder="結束日期" readonly style="border: 1px solid black; padding: 5px 10px; cursor: pointer;">
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
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="insertdata()">完成</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-5">

        <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col">
            <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
            </div>
        </div>
        <div class="col">
            <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
            </div>
        </div>
        <div class="col">
            <div class="card h-100">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
            </div>
        </div>
        </div>
    </div>

</template>

<script setup>
     

    import { ref } from "vue";
    import axios from 'axios';
    import { format } from "date-fns"; // 格式化日期

    // 控制 v-date-picker 顯示與隱藏
    const showDatePicker = ref(false);

    // 存儲選擇的日期
    const startDate = ref("");  // 顯示格式 YYYY-MM-DD
    const endDate = ref("");  
    const selectedDate = ref(null); // v-date-picker 使用 Date 物件
    const baseAddress = 'https://localhost:7092';
    const itinerarytitle = ref("");

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

    
    const insertdata = async () => 
    {
        try
        {
            const insert = {itineraryId: 0, itineraryTitle: itinerarytitle.value, itineraryImage: "t", itineraryStartDate: startDate.value ,ItineraryEndDate: endDate.value, itineraryCreateDate: null };
            const response = await axios.post(`${baseAddress}/api/Itinerary/Itinerary`, insert);


            console.log(itinerarytitle.value);
            console.log(startDate.value);
            console.log(endDate.value);
            console.log(JSON.stringify(response.data));
            //categoryArray.value = response.data;
        } 
        catch (error)
        {
            alert(error.message + "\n檢查你的api有沒有開");
        }


    };

    // const categoryArray = ref([]);

    //     const getData = async (keyword = '') => 
    //     {
    //         try
    //         {
    //             const insert = {  "itineraryId": 0,
    //   "itineraryTitle": "string",
    //   "itineraryImage": "string",
    //   "itineraryCreateDate": null };

            
    //             const response = await axios.post(`${baseAddress}/api/Itinerary`, insert);
    //             alert(JSON.stringify(response.data));
    //             //categoryArray.value = response.data;
    //         } 
    //         catch (error)
    //         {
    //             alert(error.message + "\n檢查你的api有沒有開");
    //         }
    //     };

</script>


<style scoped>

    .custom-modal {
        top: 25%; 
    }

</style>