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
    <!-- <v-footer rounded> -->
        <v-container fluid class="pa-2">
            <v-row>
                <v-col cols="12" lg="4" class="footer-text mb-3">
                    <h3 class="mb-1 pt-2">聯絡我們</h3>
                    <p>電話 / 09877287720</p>
                    <p>Email / sunsanrothree@gmail.com</p>
                    <p>聯絡地址 / 上善市若水區菩提街無樹號解鈴樓</p>
                </v-col>

                <v-col cols="12" lg="4" class="mb-3">
                    <v-btn v-for="icon in icons" :key="icon.icon" class="mx-2" :icon="icon.icon" :href="icon.link"
                        color="black" variant="text"></v-btn>
                </v-col>

                <v-col cols="12" lg="4" class="footer-text mb-3 mt-2">
                    <p>© 2024-2025 TravelLog. All Rights Reserved.</p>
                    <p>旅遊產品由 TravelLog 負責提供。</p>
                    <p>右丞說的。           因為去健身房，腦子持續成長中UP!</p>
                    <p>旅行業註冊編號：交觀甲第XXXXXX號。</p>
                </v-col>
            </v-row>
        </v-container>
    <!-- </v-footer> -->
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
    color: black;
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
}

.v-btn:hover {
    transform: scale(1.1);
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
