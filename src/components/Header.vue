<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

const route = useRoute();
const path = computed(() => route.path.replace("/", ""));
const pageTitle = ref("");
const { mobile } = useDisplay();

onMounted(() => {
    pageTitle.value = path.value;
});

const buttons = [
    {
        value: "Home",
        text: "Home",
        icon: "mdi-home",
        textClass: "text-green",
        to: "/",
    },
    {
        value: "resume",
        text: "Resume",
        icon: "mdi-file-account",
        textClass: "text-brown-darken-1",
        to: "/resume",
    },
    {
        value: "about",
        text: "About Me",
        icon: "mdi-information",
        textClass: "text-blue",
        to: "/about",
    },
    {
        value: "contact",
        text: "Contact Me",
        icon: "mdi-phone-incoming",
        textClass: "text-yellow-darken-4",
        to: "/contact",
    },
];
</script>

<template>
    <v-app-bar :elevation="5" color="white" class="header">
        <v-container class="pa-0" fluid>
            <v-btn-toggle v-model="pageTitle">
                <v-btn
                    v-for="button in buttons"
                    :key="button.value"
                    rounded="xl"
                    size="large"
                    :class="button.textClass"
                    :value="button.value"
                    :to="button.to"
                >
                    <v-icon :icon="button.icon" />
                    <span v-if="!mobile">{{ button.text }}</span>
                </v-btn>
            </v-btn-toggle>

            <v-spacer></v-spacer>
        </v-container>
    </v-app-bar>
</template>

<style scoped>
.header {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 100%;
}

.v-container {
    width: 100%;
    padding: 0;
}
</style>
