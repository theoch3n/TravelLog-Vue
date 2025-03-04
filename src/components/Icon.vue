<template>
  <div class="background-panel">
    <div class="hero-content">
      <h1 class="hero-title">Your Key<br>to Travel</h1>
      <div class="hero-buttons">
        <router-link to="/itinerary" class="btn-explore">
          <span>行程規劃</span>
        </router-link>
        <router-link to="/TravelPackage" class="btn-explore">
          <span>包套行程</span>
        </router-link>
      </div>
      <!-- <div class="play-video">
        <span class="play-text">PLAY VIDEO</span>
        <span class="play-icon">→</span>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.background-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 0 20px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.hero-title {
  font-size: 5rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 3rem;
  line-height: 1.1;
  letter-spacing: -1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-family: 'Times New Roman', serif;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 5rem;
}

.btn-explore {
  display: inline-block;
  padding: 12px 30px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 500;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-explore:hover {
  background-color: rgba(254, 102, 75, 0.9);
  color: #fff;
  transform: translateY(-3px);
}

@media (max-width: 1200px) {
  .hero-title {
    font-size: 4.5rem;
  }
}

@media (max-width: 992px) {
  .hero-title {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3.5rem;
    margin-bottom: 2rem;
  }
  
  .hero-buttons {
    margin-bottom: 3rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-explore {
    padding: 10px 25px;
    font-size: 13px;
  }
}

@media (max-width: 400px) {
  .hero-title {
    font-size: 2.2rem;
  }
}
</style>