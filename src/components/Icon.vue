<template>
  <!-- 背景面板：完全置中 -->
  <div class="background-panel">
    <div class="row">
      <img src="/src/assets/logo-removebg-preview.png" alt="logo" class="logo" />
      <div class="wrap">
        <router-link to="/itinerary" class="icon-container">
          <img src="/icon/icon01.png" alt="行程規劃" class="icon-img" />
          <span class="icon-text">行程規劃</span>
        </router-link>
        <router-link to="/Products" class="icon-container">
          <img src="/icon/travel-and-tourism.png" alt="包套行程" class="icon-img" />
          <span class="icon-text">包套行程</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="background-panel">
    <div class="row">
      <img src="/src/assets/logo-removebg-preview.png" alt="logo" class="logo" />
      <div class="wrap">
        <router-link to="/itinerary" class="icon-container">
          <img src="/icon/icon01.png" alt="行程規劃" class="icon-img" />
          <span class="icon-text">行程規劃</span>
        </router-link>
        <router-link to="/Products" class="icon-container">
          <img src="/icon/travel-and-tourism.png" alt="包套行程" class="icon-img" />
          <span class="icon-text">包套行程</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 確保整個頁面高度充滿 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  min-height: 100%;
  position: relative;
}

/* 背景面板：完全置中、透明背景 */
.background-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  padding: 20px;
  min-width: 300px;
}

/* row：logo 與圖示區塊並排 */
.row {
  display: flex;
  align-items: center;
  gap: 50px;
}

/* logo 設定 */
.logo {
  max-height: 120px;
  object-fit: contain;
}

/* wrap：放置 icon 連結 */
.wrap {
  display: flex;
  gap: 100px;
  justify-content: center;
}

/* icon-container：直接顯示，不加 hover 效果 */
.icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

/* icon-img：圖示樣式 */
.icon-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: none;
  border-radius: 10px;
  padding: 10px;
  background-color: transparent;
}

/* icon-text：文字樣式 */
.icon-text {
  margin-top: 8px;
  color: #fff; /* 根據背景顏色選擇適合的文字色彩 */
  font-size: 14px;
  font-weight: bold;
}
</style>
