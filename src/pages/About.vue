<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import CarouselsCycle from "@/components/CarouselsCycle.vue";

// 團隊成員資料
const teamMembers = ref([
  {
    name: '陳小明',
    position: '創辦人 & CEO',
    description: '擁有10年旅遊產業經驗，致力於打造最佳旅遊規劃體驗',
    avatar: '/images/team/member1.jpg'
  },
  {
    name: '林美玲',
    position: '產品總監',
    description: '前Google地圖產品經理，熱愛探索世界各地的美食與文化',
    avatar: '/images/team/member2.jpg'
  },
  {
    name: '王大偉',
    position: '技術總監',
    description: '資深全端工程師，專注於地理資訊系統與旅遊科技整合',
    avatar: '/images/team/member3.jpg'
  },
  {
    name: '張雅婷',
    position: '市場行銷總監',
    description: '擁有豐富的品牌行銷經驗，專注於數位行銷與社群經營',
    avatar: '/images/team/member4.jpg'
  },
  {
    name: '李志豪',
    position: '資深UI/UX 設計師',
    description: '致力於打造直覺且易用的旅遊規劃介面，讓使用者享受最佳體驗',
    avatar: '/images/team/member5.jpg'
  }
]);

// 公司里程碑
const milestones = ref([
  { year: '2020', event: '公司成立，推出第一版旅遊規劃平台' },
  { year: '2021', event: '用戶數突破10萬，獲得天使輪投資' },
  { year: '2022', event: '推出AI智能行程推薦功能，合作夥伴超過500家' },
  { year: '2023', event: '擴展至亞洲主要旅遊市場，月活躍用戶突破50萬' }
]);

// 在組件掛載時添加特殊類，卸載時移除
onMounted(() => {
  document.body.classList.add('about-page');
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  
  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 添加透明背景
  if (header) header.style.backgroundColor = 'transparent';
  if (footer) footer.style.backgroundColor = 'transparent';
});

onBeforeUnmount(() => {
  document.body.classList.remove('about-page');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  
  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 恢復原來的背景
  if (header) header.style.backgroundColor = '';
  if (footer) footer.style.backgroundColor = '';
});
</script>

<template>
  <div class="about-page-container">
    <!-- 背景輪播 -->
    <CarouselsCycle class="background-carousel" />
    
    <!-- 遮罩層 -->
    <div class="overlay-mask"></div>
    
    <div class="wrap">
      <div class="item">
        <div class="content-wrapper">
          <!-- 頁面標題 -->
          <div class="page-title-container">
            <h1 class="page-title">關於我們</h1>
            <p class="page-subtitle">探索、規劃、體驗 - 您的旅程，由此開始</p>
          </div>
          
          <!-- 關於我們內容 -->
          <div class="about-content">
            <div class="about-card">
              <h2 class="section-title">我們的故事</h2>
              <div class="section-content story-content">
                <p>TravelLog 誕生於2020年，源於一群熱愛旅行的科技愛好者的共同願景 - 讓旅行規劃變得簡單而有趣。</p>
                <p>我們深知旅行規劃的複雜性和挑戰，因此致力於打造一個直觀、智能且全面的旅遊規劃平台，幫助旅行者輕鬆創建完美的行程。</p>
                <p>從最初的小型創業團隊，到如今服務全球數十萬用戶的旅遊科技公司，我們始終堅持以用戶體驗為核心，不斷創新和完善我們的服務。</p>
              </div>
            </div>
            
            <div class="about-card">
              <h2 class="section-title">我們的使命</h2>
              <div class="section-content mission-content">
                <div class="mission-item">
                  <div class="mission-icon">
                    <i class="mdi mdi-map-search"></i>
                  </div>
                  <h3>簡化旅行規劃</h3>
                  <p>提供直觀的工具，讓複雜的行程規劃變得簡單易行</p>
                </div>
                
                <div class="mission-item">
                  <div class="mission-icon">
                    <i class="mdi mdi-compass"></i>
                  </div>
                  <h3>發現獨特體驗</h3>
                  <p>幫助旅行者發現當地特色和隱藏寶藏</p>
                </div>
                
                <div class="mission-item">
                  <div class="mission-icon">
                    <i class="mdi mdi-account-group"></i>
                  </div>
                  <h3>連接全球旅行者</h3>
                  <p>建立旅行者社群，分享經驗和靈感</p>
                </div>
              </div>
            </div>
            
            <div class="about-card">
              <h2 class="section-title">我們的平台特色</h2>
              <div class="section-content features-content">
                <div class="feature-item">
                  <h3><i class="mdi mdi-map-marker-path"></i> 智能行程規劃</h3>
                  <p>基於AI技術的智能推薦系統，根據您的偏好和時間自動生成最佳行程</p>
                </div>
                
                <div class="feature-item">
                  <h3><i class="mdi mdi-map"></i> 互動式地圖</h3>
                  <p>直觀的地圖界面，輕鬆查看和調整您的行程路線</p>
                </div>
                
                <div class="feature-item">
                  <h3><i class="mdi mdi-database-search"></i> 豐富的目的地資訊</h3>
                  <p>包含全球數萬個景點、餐廳、住宿和活動的詳細資訊</p>
                </div>
                
                <div class="feature-item">
                  <h3><i class="mdi mdi-share-variant"></i> 行程分享與協作</h3>
                  <p>輕鬆與朋友和家人分享行程，共同規劃完美旅程</p>
                </div>
                
                <div class="feature-item">
                  <h3><i class="mdi mdi-cellphone"></i> 行動裝置支援</h3>
                  <p>隨時隨地通過手機或平板電腦訪問您的行程</p>
                </div>
                
                <div class="feature-item">
                  <h3><i class="mdi mdi-weather-partly-cloudy"></i> 即時天氣與提醒</h3>
                  <p>獲取目的地即時天氣資訊和重要提醒</p>
                </div>
              </div>
            </div>
            
            <div class="about-card">
              <h2 class="section-title">我們的成長歷程</h2>
              <div class="section-content">
                <div class="timeline">
                  <div v-for="(milestone, index) in milestones" :key="index" class="timeline-item">
                    <div class="timeline-year">{{ milestone.year }}</div>
                    <div class="timeline-connector" v-if="index < milestones.length - 1"></div>
                    <div class="timeline-content">
                      <p>{{ milestone.event }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="about-card">
              <h2 class="section-title">我們的團隊</h2>
              <div class="section-content team-content">
                <div v-for="(member, index) in teamMembers" :key="index" class="team-member">
                  <div class="member-avatar" :style="{ backgroundImage: `url(${member.avatar || '/images/default-avatar.jpg'})` }"></div>
                  <h3 class="member-name">{{ member.name }}</h3>
                  <p class="member-position">{{ member.position }}</p>
                  <p class="member-description">{{ member.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- <div class="about-card">
              <h2 class="section-title">聯絡我們</h2>
              <div class="section-content contact-content">
                <div class="contact-item">
                  <i class="mdi mdi-email-outline"></i>
                  <p>contact@travellog.com</p>
                </div>
                
                <div class="contact-item">
                  <i class="mdi mdi-phone"></i>
                  <p>+886 2 1234 5678</p>
                </div>
                
                <div class="contact-item">
                  <i class="mdi mdi-map-marker"></i>
                  <p>台北市信義區信義路五段7號</p>
                </div>
                
                <div class="social-media">
                  <a href="#" class="social-icon"><i class="mdi mdi-facebook"></i></a>
                  <a href="#" class="social-icon"><i class="mdi mdi-instagram"></i></a>
                  <a href="#" class="social-icon"><i class="mdi mdi-twitter"></i></a>
                  <a href="#" class="social-icon"><i class="mdi mdi-youtube"></i></a>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

.background-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
  z-index: 2;
  pointer-events: none;
}

.wrap {
  position: relative;
  z-index: 3;
  width: 100%;
  min-height: 100vh;
  padding: 80px 20px 40px;
}

.item {
  width: 100%;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title-container {
  text-align: center;
  margin-bottom: 40px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 50px;
}

.about-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  border-radius: 3px;
}

.section-content {
  color: #4b5563;
  font-size: 1.05rem;
  line-height: 1.7;
}

.section-content p {
  margin-bottom: 15px;
}

/* 故事樣式 */
.story-content{
    text-align: center;
}

/* 使命樣式 */
.mission-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;
}

.mission-item {
  flex: 1;
  min-width: 250px;
  text-align: center;
  padding: 20px;
}

.mission-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.mission-icon i {
  font-size: 36px;
  color: white;
}

.mission-item h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

/* 特色樣式 */
.features-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.feature-item {
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-item h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  align-items: center;
}

.feature-item h3 i {
  font-size: 24px;
  color: #4f46e5;
  margin-right: 10px;
}

/* 時間線樣式 */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  margin-bottom: 30px;
  position: relative;
}

.timeline-year {
  flex: 0 0 100px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
  padding-right: 20px;
  text-align: right;
}

.timeline-connector {
  position: absolute;
  top: 30px;
  left: 100px;
  width: 2px;
  height: calc(100% + 30px);
  background-color: #4f46e5;
}

.timeline-content {
  flex: 1;
  padding-left: 30px;
  position: relative;
}

.timeline-content::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4f46e5;
}

/* 團隊成員樣式 */
.team-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.team-member {
  flex: 0 0 300px;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin: 0 auto 15px;
  border: 3px solid #4f46e5;
}

.member-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.member-position {
  font-size: 1rem;
  color: #4f46e5;
  margin-bottom: 10px;
}

.member-description {
  font-size: 0.95rem;
  color: #4b5563;
}

/* 聯絡資訊樣式 */
.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.contact-item i {
  font-size: 24px;
  color: #4f46e5;
}

.contact-item p {
  margin: 0;
  font-size: 1.1rem;
}

.social-media {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
}

.social-icon i {
  font-size: 20px;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .timeline-year {
    flex: 0 0 80px;
    font-size: 1.3rem;
  }
  
  .timeline-connector {
    left: 80px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .wrap {
    padding: 60px 15px 30px;
  }
  
  .about-card {
    padding: 20px;
  }
  
  .timeline {
    padding-left: 20px;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-year {
    flex: none;
    text-align: left;
    padding-right: 0;
    padding-left: 30px;
    margin-bottom: 10px;
  }
  
  .timeline-connector {
    left: 6px;
    top: 10px;
  }
  
  .timeline-content {
    padding-left: 30px;
  }
  
  .timeline-content::before {
    left: 0;
  }
}
</style>

<style>
/* 全局樣式 */
body.about-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

body.about-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.about-page .header-container {
  background: transparent !important;
}

body.about-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  body.about-page .desktop-header,
  body.about-page footer.footer-container {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }
}
</style>
