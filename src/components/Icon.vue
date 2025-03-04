<template>
  <div class="background-panel">
    <div class="row">
      <div class="wrap">
        <router-link to="/itinerary" class="icon-container">
          <div class="icon-inner">
            <img src="/icon/icon01.png" alt="行程規劃" class="icon-img" />
            <span class="icon-text">行程規劃</span>
          </div>
        </router-link>
        <router-link to="/TravelPackage" class="icon-container">
          <div class="icon-inner">
            <img src="/icon/travel-and-tourism.png" alt="包套行程" class="icon-img" />
            <span class="icon-text">包套行程</span>
          </div>
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

/* wrap：放置 icon 連結 */
.wrap {
  display: flex;
  gap: 100px;
  justify-content: center;
}

/* 新設計的 icon-container */
.icon-container {
  text-decoration: none;
  color: inherit;
  width: 220px;
  height: 280px;
  perspective: 1000px;
  transition: transform 0.3s;
}

.icon-container:hover {
  transform: translateY(-10px);
}

.icon-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 119, 0, 0.6);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.icon-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #ff7700, #ff9955);
}

/* icon-img：放大圖示 */
.icon-img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  transition: transform 0.3s;
  margin-bottom: 15px;
}

.icon-container:hover .icon-img {
  transform: scale(1.1);
}

/* icon-text：放大文字 */
.icon-text {
  color: #333;
  font-size: 24px !important; 
  font-weight: bold;
  text-align: center;
  position: relative;
  padding-bottom: 5px;
}

.icon-text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #ff7700;
  transition: width 0.3s;
}

.icon-container:hover .icon-text::after {
  width: 80%;
}
</style>