import { createApp } from "vue";
import "./style.css"; // 全局樣式
import App from "./App.vue";
import router from "./router/router";

// 引入 Vuetify 相關
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

// 引入 Pinia 與持久化插件
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 設定 axios 預設 API URL
import axios from "axios";
axios.defaults.baseURL = "https://localhost:7092";

// 引入 Bootstrap CSS 與 JS
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
window.bootstrap = bootstrap;

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
    },
    theme: {
        defaultTheme: "light",
        themes: {
            light: {
                dark: false,
                colors: {
                    background: "#FFFFFF", // 應用程式背景色
                    surface: "#FFFFFF", // 元件表面顏色
                    primary: "#1976D2", // 主要操作或品牌色
                    secondary: "#424242", // 次要元素顏色
                    accent: "#82B1FF", // 強調顏色
                    error: "#FF5252", // 錯誤提示色
                    info: "#2196F3", // 資訊提示色
                    success: "#4CAF50", // 成功提示色
                    warning: "#FFC107", // 警告提示色
                    // 如有需要還可以擴充更多自定義顏色
                },
            },
            dark: {
                dark: true,
                colors: {
                    background: "#121212", // 深色背景
                    surface: "#121212", // 深色元件表面
                    primary: "#BB86FC", // 深色模式下的主要色
                    secondary: "#03DAC6", // 深色模式下的次要色
                    accent: "#FF4081", // 深色模式下的強調色
                    error: "#CF6679", // 深色模式下的錯誤色
                    info: "#2196F3", // 資訊提示色（可與亮色模式一致）
                    success: "#4CAF50", // 成功提示色（可與亮色模式一致）
                    warning: "#FB8C00", // 深色模式下的警告色
                    // 根據需求可添加其他自定義顏色
                },
            },
        },
    },
});

// 創建 Vue 應用程式
createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
