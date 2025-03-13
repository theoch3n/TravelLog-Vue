# TravelLog-Vue

一個基於 Vue 3 和 Vite 構建的旅遊規劃平台，幫助使用者規劃旅行。

## 📌 專案簡介

TravelLog-Vue 是一個旅遊規劃平台，允許使用者：
- 📖 創建和管理個人旅遊行程
- 🌍 提供使用者推薦行程
- 👥 群組規劃行程，讓多人共同規劃與協作
- 💰 分帳功能，幫助旅伴公平分攤費用

## 🛠 技術棧

- **前端框架**：Vue 3
- **構建工具**：Vite
- **組件語法**：`<script setup>` SFCs
- **UI 組件庫**：Vuetify
- **狀態管理**：Pinia
- **路由**：Vue Router
- **API 通信**：Axios

## ✨ 功能特點

- 📱 響應式設計，支援多種設備訪問
- 🔐 使用者認證與授權系統
- 📖 旅遊行程創建與編輯
- 👥 群組規劃行程，支援多人協作
- 🗺 地圖整合，顯示旅行路線
- 💰 分帳功能，幫助旅伴公平分攤費用

## 🚀 安裝與運行

### 📌 前提條件

- Node.js (v14.0.0 或更高版本)
- npm 或 yarn

### 📥 安裝步驟

1. **克隆倉庫**
   ```bash
   git clone https://github.com/yourusername/TravelLog-Vue.git
   cd TravelLog-Vue
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **構建生產版本**
   ```bash
   npm run build
   ```

## 📂 專案結構

```plaintext
TravelLog-Vue/
├── public/             # 靜態資源
├── src/
│   ├── assets/         # 項目資源文件
│   ├── components/     # 可復用組件
│   ├── views/          # 頁面視圖
│   ├── router/         # 路由配置
│   ├── store/          # 狀態管理
│   ├── services/       # API 服務
│   ├── utils/          # 工具函數
│   ├── App.vue         # 根組件
│   └── main.js         # 入口文件
├── .gitignore          # Git 忽略文件
├── index.html          # HTML 模板
├── package.json        # 項目依賴
├── vite.config.js      # Vite 配置
└── README.md           # 項目說明
```

## 📖 開發資源

- [Vue 3 官方文檔](https://vuejs.org/)
- [Vite 官方文檔](https://vitejs.dev/)
- [`<script setup>` 文檔](https://vuejs.org/api/sfc-script-setup.html)
- [Vue IDE 支援指南](https://github.com/vuejs/language-tools)
- [Vuetify 官方文檔](https://vuetifyjs.com/)
- [Pinia 官方文檔](https://pinia.vuejs.org/)
- [Google Maps API 文檔](https://developers.google.com/maps/documentation)
- [ExchangeRate-API 官方文檔](https://www.exchangerate-api.com/)