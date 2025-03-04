<script setup>
import { reactive } from "vue";

const icons = reactive([
    {
        icon: "mdi-phone",
        link: "",
    },
    {
        icon: "mdi-gmail",
        link: "",
    },
    {
        icon: "mdi-instagram",
        link: "",
    },
    {
        icon: "mdi-facebook",
        link: "",
    },
]);
</script>

<template>
    <footer class="footer-container">
        <v-container fluid class="py-1">
            <v-row class="align-center">
                <!-- 聯絡資訊 -->
                <v-col cols="12" lg="4" class="footer-text py-1">
                    <div class="d-flex align-center">
                        <h3 class="mr-2 mb-0">聯絡我們</h3>
                        <div class="d-flex align-center ml-auto d-lg-none">
                            <v-btn v-for="icon in icons" :key="icon.icon" 
                                class="mx-1" :icon="icon.icon" :href="icon.link"
                                color="black" variant="text" density="compact" size="small"></v-btn>
                        </div>
                    </div>
                    <div class="contact-info d-flex flex-wrap">
                        <p class="mr-3"><v-icon size="x-small" class="mr-1">mdi-phone</v-icon> 09877287720</p>
                        <p class="mr-3"><v-icon size="x-small" class="mr-1">mdi-email</v-icon> sunsanrothree@gmail.com</p>
                    </div>
                </v-col>

                <!-- 社交媒體圖標 - 僅在大屏幕顯示 -->
                <v-col cols="12" lg="4" class="text-center py-1 d-none d-lg-flex justify-center">
                    <v-btn v-for="icon in icons" :key="icon.icon" 
                        class="mx-1" :icon="icon.icon" :href="icon.link"
                        color="#7B7B7B" variant="text" density="compact"></v-btn>
                </v-col>

                <!-- 版權信息 -->
                <v-col cols="12" lg="4" class="footer-text text-lg-end py-1">
                    <p class="mb-0">© 2024-2025 TravelLog. All Rights Reserved.</p>
                </v-col>
            </v-row>
        </v-container>
    </footer>
</template>

<style scoped>
footer {
    background-color: #FFDAC8 !important;
    color: #7B7B7B;
    padding: 0px 0;
    /* 減少上下內邊距，讓頁腳更矮 */
}

h3 {
    font-size: 18px;
    /* 調整標題字體大小 */
    color: #7B7B7B;
}

.footer-text p {
    font-size: 12px;
    /* 調整文字大小 */
    color: #7B7B7B;
    margin: 5px 0;
    /* 減少段落間距 */

}

.v-btn {
    transition: transform 0.2s ease-in-out;
    height: 32px !important;
    width: 32px !important;
}

.v-btn:hover {
    transform: scale(1.1);
    color: #ff6b6b !important;
}

.v-container {
    max-width: 1200px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    footer {
        text-align: center;
    }

    .v-btn {
        margin: 5px;
    }
}
</style>
