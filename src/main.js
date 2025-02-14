import { createApp } from "vue";
import "./style.css"; // 全局樣式

import App from "./App.vue";
import router from "./router/router"; // 引入路由配置

// 引入 Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // 引入 Material Design Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
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

// 假設你已經在 localStorage 儲存了 token
const token = localStorage.getItem("token");
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 或是使用攔截器，每次發送請求時都讀取最新的 token：
import axios from "axios";

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 創建 Vue 應用程式，並使用路由、Vuetify、Pinia
createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
