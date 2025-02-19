import { createApp } from "vue";
import "./style.css"; // 全局樣式

import App from "./App.vue";
import router from "./router/router"; // 引入路由配置

// 引入 Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";//vuex 類似於bootstrap 提供現有樣式及元件
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./style.css";

// 建立 Vuetify 實例
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
    },
});

// 引入 Pinia
const pinia = createPinia(); // 創建 Pinia 物件

// 引入 axios
import axios from "axios";
axios.defaults.baseURL = "https://localhost:7092"; // API 伺服器 URL

// 創建 Vue 應用程式，並使用路由、Vuetify、Pinia
createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
