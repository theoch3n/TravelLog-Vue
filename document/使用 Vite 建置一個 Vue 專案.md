# 建置基本的 Vue 專案 ( npm )

1. 找到要建構的資料夾位置，輸入
    ```shell
    npm create vite@latest
    ```
2. 接下來 Vite 會問你專案名稱、需不需要安裝一些工具，根據需求選擇即可。<br />
   ![20250122230427](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230427.png) <br />
   ![20250122230513](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230513.png) <br />
   ![20250122230602](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230602.png) <br />
3. 專案建置完成
   切到專案目錄後，輸入
    ```shell
    npm install
    ```
    npm 會自動依照 package.json 的內容下載套件。<br />
    ![20250122230818](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230818.png) <br />
4. 完成後的專案目錄<br />
   ![20250122231127](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122231127.png) <br />

此時執行

```shell
npm run dev
```

可以看到<br />
![20250122231239](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122231239.png) <br />

---

# 引入第三方套件

## Vue Router

### 安裝

1. 在 Terminal 執行

    ```shell
    npm install vue-router@4
    ```

2. 在 src 目錄下新增 router 資料夾並新增 router.js (路由配置檔)<br />
   ![20250123003704](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123003704.png) <br />

3. 配置 main.js

    ```js
    import { createApp } from "vue";
    import "./style.css"; // 全局樣式

    import App from "./App.vue";
    import router from "./router/router"; // 引入路由配置

    createApp(App).use(router).mount("#app");
    ```

### 如何使用

1.  在 src 目錄下新增 pages 資料夾並新增 Home.vue & About.vue (演示用，可依需求調整)<br />
    ![20250123005213](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123005213.png) <br />
    Home.vue

    ```js
    <script setup>
    import { ref } from "vue";
    </script>
    <template>
        <div>首頁</div>
    </template>
    <style scoped></style>
    ```

    About.vue

    ```js
    <script setup>
    import { ref } from "vue";
    </script>
    <template>
        <div>關於我們</div>
    </template>
    <style scoped></style>
    ```

2.  配置路由設定
    router.js

    ```js
    import { createRouter, createWebHistory } from "vue-router";

    // 導入預設定路由的頁面
    import Home from "../pages/Home.vue";
    import About from "../pages/About.vue";

    // 定義路由配置
    const routes = [
        {
            path: "/", // 路由路徑 (根目錄)
            name: "Home", // 路由名稱 (用於程式內部識別)
            component: Home, // 顯示的頁面
        },
        {
            path: "/about", // 路由路徑 (根目錄)
            name: "About", // 路由名稱 (用於程式內部識別)
            component: About, // 顯示的頁面
        },
    ];

    // 建立路由實例
    const router = createRouter({
        history: createWebHistory(), // 使用瀏覽器歷史模式
        routes, // 設定路由配置
    });

    // 匯出路由實例
    export default router;
    ```

3.  在 App.vue 裡加上 `<router-view />`

    ```js
    <script setup></script>

    <template>
        <router-view />
    </template>

    <style scoped></style>
    ```

此時畫面就會依照不同路由顯示對應頁面

`http://localhost:5173/`<br />
![20250123011427](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123011427.png) <br />
`http://localhost:5173/about`<br />
![20250123011545](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123011545.png) <br />

## Vuetify

### 安裝

1. 在 Terminal 執行

    ```shell
    npm i vuetify
    ```

2. 配置 main.js

    ```js
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

    // 創建 Vue 應用程式，並使用路由、Vuetify
    createApp(App).use(router).use(vuetify).mount("#app");
    ```

### 加入 Icon 套件 ( Vuetify 預設使用 Material Design Icons )

1. 在 Terminal 執行
    ```shell
    npm install @mdi/font -D
    ```
2. 配置 main.js

    ```js
    import { createApp } from "vue";
    import "./style.css"; // 全局樣式

    import App from "./App.vue";
    import router from "./router/router"; // 引入路由配置

    // 引入 Material Design Icons 樣式
    import "@mdi/font/css/materialdesignicons.css";

    // 引入 Vuetify
    import "vuetify/styles";
    import { createVuetify } from "vuetify";
    import * as components from "vuetify/components";
    import * as directives from "vuetify/directives";
    // 創建 Vuetify 物件，並註冊所有組件與指令
    const vuetify = createVuetify({
        components,
        directives,
        icons: {
            defaultSet: "mdi", // 使用 mdi 作為預設 icon
        },
    });

    // 創建 Vue 應用程式，並使用路由、Vuetify
    createApp(App).use(router).use(vuetify).mount("#app");
    ```

### 如何使用

Vuetify 提供多種樣式 ( Styles and animations ) 及組件 ( Components ) 可以使用，可以參考 **[Vuetify](https://vuetifyjs.com/en/)** 官網文件

##### 以 Card 組件為例

可以在看到官網文件 Components (組件) 的分類裡有 Cards 的選項<br />
![20250123100127](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123100127.png) <br />
裡面有提供組件的源碼及預覽，並提供樣式選項可依需求選擇<br />
![20250123100507](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123100507.png) <br />

選完後即可加在我們的 vue 裡
Home.vue

```js
<script setup>
import { ref } from "vue";
</script>
<template>
    <div>
        首頁<br />
        <v-card loading title="Card title" subtitle="Subtitle" text="...">
            <v-card-actions>
                <v-btn>Click me</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<style scoped></style>
```

然後執行即可看到卡片組件已加入到首頁 ( 首頁樣式未調整 )<br />
![20250123101320](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123101320.png) <br />
