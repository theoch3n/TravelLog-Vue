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

// 建立 Vuetify 實例並設定主題
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
          background: "#FFFFFF",
          surface: "#FFFFFF",
          primary: "#1976D2",
          // 其他顏色
        },
      },
      dark: {
        dark: true,
        colors: {
          background: "#121212",
          surface: "#121212",
          primary: "#BB86FC",
          // 其他顏色
        },
      },
    },
  },
});

// 設定 axios 預設 API URL
import axios from "axios";
axios.defaults.baseURL = "https://localhost:7092";

// 引入 Bootstrap CSS 與 JS
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

// 創建 Vue 應用程式
createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
