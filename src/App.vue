<script setup>
// 引入 Default.vue 作為預設佈局元件
import DefaultLayout from "./layouts/Default.vue";
</script>

<template>
    <!-- 使用 Vuetify 的 v-app 組件作為應用程式的根元素 -->
    <v-app id="app">
        <!-- 在 v-app 內部渲染 DefaultLayout 元件，將 DefaultLayout 定義的佈局套用到整個應用程式中。 -->
        <DefaultLayout />
    </v-app>
    
</template>

<style>
#app {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
}
</style>
