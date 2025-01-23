# [Vite 建置基本的 Vue 專案 ( npm )](https://vite.dev/guide/)

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

## [Vue Router](https://router.vuejs.org/installation.html)

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

## [Vuetify](https://vuetifyjs.com/en/getting-started/installation/#installation)

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

## [Pinia ( 狀態管理工具 )](https://pinia.vuejs.org/getting-started.html)

### 安裝

1. 在 Terminal 執行

    ```shell
    npm install pinia
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

    // 引入 Pinia
    import { createPinia } from "pinia";
    const pinia = createPinia(); // 創建 Pinia 物件

    // 創建 Vue 應用程式，並使用路由、Vuetify、Pinia
    createApp(App).use(router).use(vuetify).use(pinia).mount("#app");
    ```

### 如何使用

> Pinia 是一個專為 Vue.js 設計的狀態管理庫，其主要目的是用來管理應用程式中的狀態。你可以把它想像成一個存放應用程式資料的中央倉庫，讓不同的組件都能夠方便地存取和修改這些資料。

例如:

-   購物車中的商品
-   使用者的登入狀態
-   表單中的資料
-   全域性的設定
-   跨組件共享資料： 不同組件之間可以共享相同的狀態，無需通過 props 或 events 來傳遞資料。
-   簡化狀態管理： Pinia 提供了一套簡單易用的 API，讓你可以輕鬆地定義和管理狀態。

以購物車為例，需儲存購物車狀態時

1. 在 src 目錄下新增 stores 資料夾並新增 cart.js <br />
   ![20250123113605](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123113605.png) <br />
2. 配置 cart.js

    ```js
    import { defineStore } from "pinia";

    export const useCartStore = defineStore("cart", {
        // 狀態，像 Vue 的 Data
        state: () => ({
            cartItems: [], // 購物車中的商品列表 (陣列)
        }),
        // 計算屬性，像 Vue 的 Computed
        getters: {
            totalPrice: (state) => {
                // 計算購物車總金額，透過 reduce 函式累計每個商品的價格
                return state.cartItems.reduce(
                    (total, item) => total + item.price,
                    0
                );
            },
        },
        // 動作，像 Vue 的 function
        actions: {
            // 將商品加入購物車
            addToCart(product) {
                this.cartItems.push(product);
            },
            // 從購物車中移除商品
            removeFromCart(productId) {
                this.cartItems = this.cartItems.filter(
                    (item) => item.id !== productId
                );
            },
        },
    });
    ```

3. 在 components 資料夾裡新增一個 Cart.vue

    ```js
     <script setup>
     import { reactive, computed } from "vue";
     import { useCartStore } from "../stores/cart";

    const cartStore = useCartStore(); // 取得購物車的狀態

    const state = reactive({
    // 購物車中的商品 (計算屬性，直接使用購物車的狀態)
    cartItems: computed(() => cartStore.cartItems),
    // 購物車中的總金額 (計算屬性，直接使用購物車的狀態)
    totalPrice: computed(() => {
    // 如果購物車中有商品，計算總金額、若無商品則直接返回 0
    return cartStore.cartItems.length > 0
    ? cartStore.cartItems.reduce((total, item) => total + item.price, 0)
    : 0;
    }),
    });
    </script>

    <template>
        <div>
            <ul>
                <li v-for="item in state.cartItems" :key="item.id">
                    {{ item.name }} - {{ item.price }}
                    <button @click="cartStore.removeFromCart(item.id)">移除</button>
                </li>
            </ul>
            <p>總價：{{ state.totalPrice }}</p>
            <button
                @click="cartStore.addToCart({ id: 1, name: '蘋果', price: 20 })"
            >
                加入蘋果
            </button>
            <button
                @click="cartStore.addToCart({ id: 2, name: '香蕉', price: 30 })"
            >
                加入香蕉
            </button>
            <button
                @click="cartStore.addToCart({ id: 3, name: '鳳梨', price: 30 })"
            >
                加入鳳梨
            </button>
        </div>
    </template>
    ```

此時執行並打開開發者工具可以看到 stores 裡的 cart 成功載入的訊息<br />
![20250123142834](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123142834.png) <br />

並可以在購物車裡 加入/移除 商品<br />
![20250123143132](https://raw.githubusercontent.com/theoch3n/PicGo/main/images/20250123143132.png) <br />
