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
    <v-footer rounded class="mt-auto py-3 bg-white">
        <v-container fluid class="pa-0">
            <v-row justify="center" no-gutters>
                <v-col class="col-12 col-lg-12 order-lg-1 mb-4" cols="12" style="border-top: 1px solid #dbdbdb;">
                    <h2 class="mt-4 mb-4">
                        聯絡我們
                    </h2>
                    <p>
                        電話 / 09XXXXXXXX<br>
                        專線服務時間：週一至週五10:00 - 19:00
                        Email / XXX@gmail.com
                    </p>
                    <p>
                        聯絡地址 / XX市XX區XX街XX號XX樓
                    </p>
                    <p>
                        TravelLog<br>
                    </p>
                </v-col>
                <v-col class="col-12 col-lg-4 order-lg-2 mb-3 " cols="12">
                    <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon.icon" :href="icon.link"
                        variant="text"></v-btn>
                </v-col>

                <v-col class="footer-text col-12 col-lg-4 order-lg-3 mb-3" cols="12">
                    <p>© 2024-2025 TravelLog. All Rights Reserved. 旅遊產品由 TravelLog 負責提供<br>
                        旅行業註冊編號：交觀甲第XXXXXX號
                        品保協會會員編號：北XXXX號 統一編號：XXXXXXXX 代表人姓名：XXX <br>
                        其他產品由 TravelLog 負責提供 統一編號：XXXXXXXX
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>
<style scoped>
.v-footer {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    position: relative;
    border: none;
}

.footer-text {
    font-size: 12px;
    color: rgb(80, 80, 80);
}
</style>