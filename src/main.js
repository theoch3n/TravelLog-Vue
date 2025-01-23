import { createApp } from "vue";
import "./style.css"; // 全局樣式

import App from "./App.vue";
import router from "./router/router"; // 引入路由配置

// 引入 Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// 創建 Vuetify 物件，並註冊所有組件與指令
const vuetify = createVuetify({
    components,
    directives,
});

// 引入 Pinia
import { createPinia } from "pinia";
const pinia = createPinia(); // 創建 Pinia 物件

// 創建 Vue 應用程式，並使用路由、Vuetify、Pinia
createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
