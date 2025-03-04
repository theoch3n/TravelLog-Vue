<template>
  <div class="background-panel">
    <div class="row">
      <!-- <img src="/src/assets/logo-removebg-preview.png" alt="logo" class="logo" /> -->
      <div class="wrap">
        <router-link to="/itinerary" class="icon-container">
          <img src="/icon/icon01.png" alt="行程規劃" class="icon-img" />
          <span class="icon-text">行程規劃</span>
        </router-link>
        <router-link to="/TravelPackage" class="icon-container">
          <img src="/icon/travel-and-tourism.png" alt="包套行程" class="img" />
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
  position: fixed;
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
  max-height: 200px;
  margin-top: -120px;
  object-fit: contain;
}

/* wrap：放置 icon 連結 */
.wrap {
  display: flex;
  gap: 100px;
  justify-content: center;
}

/* icon-container：直接顯示，不加入 hover 效果 */
.icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  border-radius: 18px;
  /* 新增：白底與橘框 */
  background-color: rgba(255, 255, 255, 0.537);      /* 白色背景 */
  border: 10px double rgb(255, 119, 0);    /* 橘色框線 */
  padding: 10px;               /* 建議加點內距，避免內容貼邊 */
}


/* icon-img：放大圖示 */
.icon-img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border: none;
  border-radius: 10px;
  padding: 10px;
  background-color: transparent;
}

/* icon-text：放大文字 */
.icon-text {
  margin-top: 24px;
  color: #000000; /* 根據背景選擇合適的文字色彩 */
  font-size: 28px !important; 
  font-weight: bold;
}
</style>
