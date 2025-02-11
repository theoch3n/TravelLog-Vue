<script setup>
import { reactive } from "vue";

const socialMedias = reactive([
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
    <v-footer rounded class="bg-grey-lighten-1">
        <v-row justify="center" no-gutters>
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/">Home</v-btn>
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/resume">Resume</v-btn>
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/about">About Me</v-btn>
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/contact">Contact Me</v-btn>
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/products">Products</v-btn>

            <v-col class="text-center mt-4" cols="12">
                <v-btn v-for="media in socialMedias" :key="media" class="mx-4" :icon="media.icon" :href="media.link"
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