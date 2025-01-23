# 建置基本的 Vue 專案 ( npm )

1. 找到要建構的資料夾位置，輸入
    ```shell
    npm create vite@latest
    ```
2. 接下來 Vite 會問你專案名稱、需不需要安裝一些工具，根據需求選擇即可。
   ![20250122230427](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230427.png)
   ![20250122230513](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230513.png)
   ![20250122230602](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230602.png)
3. 專案建置完成
   切到專案目錄後，輸入
    ```shell
    npm install
    ```
    npm 會自動依照 package.json 的內容下載套件。
    ![20250122230818](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122230818.png)
4. 完成後的專案目錄
   ![20250122231127](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122231127.png)

此時執行

```shell
npm run dev
```

可以看到
![20250122231239](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250122231239.png)

---

# 引入第三方套件

## Vue Router

### 安裝

1. 在 Terminal 執行

    ```shell
    npm install vue-router@4
    ```

2. 在 src 目錄下新增 router 資料夾並新增 router.js (路由配置檔)
   ![20250123003704](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123003704.png)

3. 配置 main.js

    ```js
    import { createApp } from "vue";
    import "./style.css"; // 全局樣式

    import App from "./App.vue";
    import router from "./router/router"; // 引入路由配置

    createApp(App).use(router).mount("#app");
    ```

### 如何使用

1.  在 src 目錄下新增 pages 資料夾並新增 Home.vue & About.vue (演示用，可依需求調整)
    ![20250123005213](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123005213.png)
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

`http://localhost:5173/`
![20250123011427](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123011427.png)
`http://localhost:5173/about`
![20250123011545](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123011545.png)
