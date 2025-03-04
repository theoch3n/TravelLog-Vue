<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import CarouselsCycle from "@/components/CarouselsCycle.vue";
import Chat from "../components/Chat.vue";

// 表單數據
const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: ""
});

// 表單驗證
const errors = ref({});
const isSubmitting = ref(false);
const submitSuccess = ref(false);

// 驗證表單
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.value.name.trim()) {
    newErrors.name = "請輸入您的姓名";
  }
  
  if (!formData.value.email.trim()) {
    newErrors.email = "請輸入您的電子郵件";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    newErrors.email = "請輸入有效的電子郵件地址";
  }
  
  if (!formData.value.subject.trim()) {
    newErrors.subject = "請輸入主旨";
  }
  
  if (!formData.value.message.trim()) {
    newErrors.message = "請輸入訊息內容";
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// 提交表單
const submitForm = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  
  try {
    // 這裡可以添加實際的表單提交邏輯
    // 例如使用 axios 發送請求到後端 API
    
    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 重置表單
    formData.value = {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
    
    submitSuccess.value = true;
    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
    
  } catch (error) {
    console.error("提交表單時發生錯誤:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// 在組件掛載時添加特殊類，卸載時移除
onMounted(() => {
  document.body.classList.add('contact-page');
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
  document.body.classList.remove('contact-page');
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
  <div class="contact-page-container">
    <!-- 背景輪播 -->
    <CarouselsCycle class="background-carousel" />
    
    <!-- 遮罩層 -->
    <div class="overlay-mask"></div>
    
    <div class="wrap">
      <div class="item">
        <div class="content-wrapper">
          <!-- 頁面標題 -->
          <div class="page-title-container">
            <h1 class="page-title">聯絡我們</h1>
            <p class="page-subtitle">有任何問題或建議，請隨時與我們聯繫</p>
          </div>
          
          <div class="contact-content">
            <!-- 聯絡表單 -->
            <div class="contact-form-container">
              <div class="form-card">
                <!-- <h2 class="form-title">發送訊息</h2>
                
                <form @submit.prevent="submitForm" class="contact-form">
                  <div class="form-group">
                    <label for="name" class="form-label">姓名</label>
                    <div class="input-wrapper">
                      <i class="mdi mdi-account input-icon"></i>
                      <input 
                        type="text" 
                        id="name" 
                        v-model="formData.name" 
                        class="form-input" 
                        :class="{ 'error': errors.name }"
                        placeholder="請輸入您的姓名"
                      />
                    </div>
                    <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
                  </div>
                  
                  <div class="form-group">
                    <label for="email" class="form-label">電子郵件</label>
                    <div class="input-wrapper">
                      <i class="mdi mdi-email input-icon"></i>
                      <input 
                        type="email" 
                        id="email" 
                        v-model="formData.email" 
                        class="form-input" 
                        :class="{ 'error': errors.email }"
                        placeholder="請輸入您的電子郵件"
                      />
                    </div>
                    <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
                  </div>
                  
                  <div class="form-group">
                    <label for="subject" class="form-label">主旨</label>
                    <div class="input-wrapper">
                      <i class="mdi mdi-format-title input-icon"></i>
                      <input 
                        type="text" 
                        id="subject" 
                        v-model="formData.subject" 
                        class="form-input" 
                        :class="{ 'error': errors.subject }"
                        placeholder="請輸入主旨"
                      />
                    </div>
                    <p v-if="errors.subject" class="error-message">{{ errors.subject }}</p>
                  </div>
                  
                  <div class="form-group">
                    <label for="message" class="form-label">訊息</label>
                    <div class="input-wrapper textarea-wrapper">
                      <i class="mdi mdi-message-text input-icon textarea-icon"></i>
                      <textarea 
                        id="message" 
                        v-model="formData.message" 
                        class="form-input form-textarea" 
                        :class="{ 'error': errors.message }"
                        placeholder="請輸入您的訊息"
                        rows="5"
                      ></textarea>
                    </div>
                    <p v-if="errors.message" class="error-message">{{ errors.message }}</p>
                  </div>
                  
                  <button 
                    type="submit" 
                    class="submit-button" 
                    :disabled="isSubmitting"
                  >
                    <i class="mdi mdi-send me-2"></i>
                    {{ isSubmitting ? '發送中...' : '發送訊息' }}
                  </button>
                  
                  <div v-if="submitSuccess" class="success-message">
                    <i class="mdi mdi-check-circle me-2"></i>
                    您的訊息已成功發送，我們將盡快回覆您！
                  </div>
                </form> -->
                <h2 class="chat-title">即時客服</h2>
              <p class="chat-description">與我們的客服人員即時對話，獲得更快速的回應</p>
              <Chat class="chat-component"></Chat>
              </div>
            </div>
            
            <!-- 聯絡資訊 -->
            <div class="contact-info-container">
              <div class="info-card">
                <h2 class="info-title">聯絡資訊</h2>
                
                <div class="info-list">
                  <div class="info-item">
                    <div class="info-icon-wrapper">
                      <i class="mdi mdi-map-marker info-icon"></i>
                    </div>
                    <div class="info-content">
                      <h3 class="info-label">地址</h3>
                      <p class="info-text">台北市信義區信義路五段7號</p>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-icon-wrapper">
                      <i class="mdi mdi-phone info-icon"></i>
                    </div>
                    <div class="info-content">
                      <h3 class="info-label">電話</h3>
                      <p class="info-text">+886 2 1234 5678</p>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-icon-wrapper">
                      <i class="mdi mdi-email info-icon"></i>
                    </div>
                    <div class="info-content">
                      <h3 class="info-label">電子郵件</h3>
                      <p class="info-text">contact@travellog.com</p>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-icon-wrapper">
                      <i class="mdi mdi-clock info-icon"></i>
                    </div>
                    <div class="info-content">
                      <h3 class="info-label">營業時間</h3>
                      <p class="info-text">週一至週五: 9:00 - 18:00</p>
                      <p class="info-text">週六至週日: 10:00 - 17:00</p>
                    </div>
                  </div>
                </div>
                
                <div class="social-media">
                  <h3 class="social-title">關注我們</h3>
                  <div class="social-icons">
                    <a href="#" class="social-icon-wrapper">
                      <i class="mdi mdi-facebook social-icon"></i>
                    </a>
                    <a href="#" class="social-icon-wrapper">
                      <i class="mdi mdi-instagram social-icon"></i>
                    </a>
                    <a href="#" class="social-icon-wrapper">
                      <i class="mdi mdi-twitter social-icon"></i>
                    </a>
                    <a href="#" class="social-icon-wrapper">
                      <i class="mdi mdi-youtube social-icon"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 聊天機器人 -->
          <!-- <div class="chat-container">
            <h2 class="chat-title">即時客服</h2>
            <p class="chat-description">與我們的客服人員即時對話，獲得更快速的回應</p>
            <Chat class="chat-component"></Chat>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page-container {
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

.contact-content {
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
}

/* 聯絡表單樣式 */
.contact-form-container {
  flex: 1;
}

.form-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 18px;
}

.textarea-icon {
  top: 20px;
  transform: none;
}

.form-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-textarea {
  padding-top: 12px;
  resize: vertical;
  min-height: 120px;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 5px;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  margin-top: 10px;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.success-message {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 12px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  color: #10b981;
}

/* 聯絡資訊樣式 */
.contact-info-container {
  width: 40%;
}

.info-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  height: 100%;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.info-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  color: white;
  font-size: 20px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.info-text {
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0;
}

.social-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icon-wrapper {
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

.social-icon-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
}

.social-icon {
  font-size: 20px;
}

/* 聊天機器人樣式 */
.chat-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 50px;
  text-align: center;
}

.chat-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.chat-description {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 20px;
}

.chat-component {
  max-width: 800px;
  margin: 0 auto;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .contact-content {
    flex-direction: column;
  }
  
  .contact-info-container {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .wrap {
    padding: 60px 15px 30px;
  }
  
  .form-card, .info-card, .chat-container {
    padding: 20px;
  }
}
</style>

<style>
/* 全局樣式 */
body.contact-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

body.contact-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.contact-page .header-container {
  background: transparent !important;
}

body.contact-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  body.contact-page .desktop-header,
  body.contact-page footer.footer-container {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }
}
</style>