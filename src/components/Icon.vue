<template>
  <!-- 背景面板：永遠置中 -->
  <div class="background-panel">
    <div class="row">
      <img src="/src/assets/logo-removebg-preview.png" alt="logo" class="logo" />
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
/* 1. 背景面板：絕對置中 + 玻璃特效 */
.background-panel {
  position: absolute;   /* 直接相對於整個視窗 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* 玻璃化外觀 */
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* 內容排版 */
  display: flex;
  padding: 20px;
  /* 若想要最小寬度，避免太窄，可加上 min-width */
  min-width: 300px;
}

/* 2. row：可視需要讓 logo 和 wrap 並排，或垂直排 */
.row {
  display: flex;
  align-items: center;
  gap: 50px;
}

/* 如果 logo 要固定大小，可自行調整 */
.logo {
  max-height: 120px;
  object-fit: contain;
}

/* 3. wrap：放多個 icon-container */
.wrap {
  display: flex;
  gap: 100px;
  justify-content: center; /* 新增這行 */
}


/* 4. icon-container：改用正常 margin 而非絕對定位來控制文字 */
.icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;  /* 若想去掉 router-link 預設底線 */
  color: inherit;         /* 文字顏色跟隨父層 */
  transition: transform 0.3s ease-in-out;
}

.icon-container:hover {
  transform: scale(1.1);
}

/* 5. icon 圖片大小 & 風格 */
.icon-img {
  width: 80px;
  height: 80px;
  object-fit: contain;

  /* 類似你的邊框與背景 */
  border-top: 2px solid white;
  border-left: 2px solid white;
  border-right: 2px solid white;
  border-radius: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}

/* 6. icon 文字：改用 margin-top，而不是 position: absolute */
.icon-text {
  margin-top: 8px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  transition: transform 0.3s ease-in-out;
}

.icon-container:hover .icon-text {
  transform: scale(1.1);
}
</style>
