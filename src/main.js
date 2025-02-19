// 導入必需的庫與全局樣式
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router"; // 或 "./router" 根據你的實際路徑
import { createVuetify } from "vuetify";
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

// 建立 Pinia 實例
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 建立 Vue 應用並掛載
const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(pinia);
app.mount("#app");

// 配置 axios（這部分可以放在單獨的檔案中，如 api.js）
import axios from "axios";
axios.defaults.baseURL = "https://localhost:7092"; // API 伺服器 URL

// 每次發送請求時自動附加最新 token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
