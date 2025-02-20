import { createApp } from "vue";
import "./style.css"; // 全局樣式

import App from "./App.vue";
import router from "./router/router"; // 引入路由配置

// 引入 Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";//vuex 類似於bootstrap 提供現有樣式及元件
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // 引入 Material Design Icons
// 創建 Vuetify 物件，並註冊所有組件與指令
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
    },
});

// 引入 Pinia
import { createPinia } from "pinia";
const pinia = createPinia(); // 創建 Pinia 物件

// 引入 axios
import axios from "axios";
axios.defaults.baseURL = "https://localhost:7092"; // API 伺服器 URL

// bootstrap缺一不可
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// 將 bootstrap 掛載到 window 上
window.bootstrap = bootstrap;


// 創建 Vue 應用程式，並使用路由、Vuetify、Pinia
createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
