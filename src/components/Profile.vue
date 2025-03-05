<template>
  <div class="profile-page-container">
    <div class="overlay-mask"></div>
    <CarouselsCycle class="background-carousel" />
    
    <div class="content-wrapper">
      <div class="profile-header">
        <h1 class="page-title">會員中心</h1>
        <p class="page-subtitle">管理您的個人資料與帳戶設定</p>
      </div>
      
      <v-container class="profile-content">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between" style="gap: 8px;">
              <h2 class="section-title">
                <v-icon class="mr-2">mdi-account-box</v-icon>
                個人資訊
              </h2>
              <v-tooltip bottom>
                <template #activator="{ props }">
                  <v-btn icon color="white" class="refresh-btn" @click="fetchProfile" v-bind="props">
                    <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </template>
                <span>重新載入資料</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>

        <v-row align="stretch" class="profile-cards">
          <!-- 左半邊：個人資料面板 -->
          <v-col cols="12" md="6">
            <v-card class="profile-card">
              <v-card-title class="justify-center">
                <h3>個人資料</h3>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field v-if="false" label="User ID" v-model="profile.userId" disabled></v-text-field>
                  <v-text-field label="Email" v-model="profile.userEmail" type="email" :rules="emailRules" required
                    disabled></v-text-field>
                  <v-text-field label="帳號名稱" v-model="profile.userName" :rules="accountNameRules" required></v-text-field>
                  <v-text-field label="電話" v-model="profile.userPhone" :rules="phoneRules" required></v-text-field>
                  <v-btn color="primary" class="update-btn mt-4" @click="updateProfile" :disabled="!valid">
                    <v-icon left class="mr-2">mdi-book-refresh</v-icon>更新資料
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 右半邊：變更密碼面板 -->
          <v-col cols="12" md="6">
            <ChangePassword class="password-card" />
          </v-col>
        </v-row>
        
        <v-row>
          <v-col>
            <div class="verification-section">
              <!-- 切換警示框顯示/隱藏的按鈕 -->
              <v-btn @click="toggleAlert" class="toggle-btn">
                {{ showAlert ? '隱藏Email驗證' : '顯示Email驗證' }}
              </v-btn>
              <!-- 透過條件渲染與縮合功能來顯示警示框 -->
              <div class="d-flex align-center flex-grow-1 justify-end" style="gap: 8px; margin-top: 16px;">
                <v-alert v-if="showAlert && !profile.isEmailVerified" type="warning" dense outlined
                  class="verification-alert">
                  您的 Email 未驗證，請點擊下方按鈕重新發送驗證信
                  <v-btn color="secondary" class="mt-2 resend-btn" @click="resendVerificationEmail" style="float: right;">
                    <v-icon left class="mr-2">mdi-email-arrow-right</v-icon>
                    重新寄送
                  </v-btn>
                </v-alert>
                <v-alert v-else-if="showAlert && profile.isEmailVerified" type="success" dense outlined
                  class="verification-alert">
                  您的 Email 已經驗證！
                </v-alert>
              </div>

              <!-- 錯誤提示 -->
              <v-alert v-if="error && errorAlertVisible" type="error" v-model:active="errorAlertVisible" dismissible
                class="mt-3 error-alert">
                {{ error }}
              </v-alert>
              <!-- 載入中提示 -->
              <v-progress-linear v-if="loading" indeterminate class="mt-3"></v-progress-linear>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Snackbar 通知訊息 -->
    <v-snackbar v-model="snackbar" :timeout="3000" vertical :color="snackbarColor" elevation="24"
      class="custom-snackbar">
      <p class="snackbar-title">{{ snackbarTitle }}</p>
      <div class="snackbar-text">{{ snackbarText }}</div>

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          關閉
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import ChangePassword from "../components/ChangePassword.vue"
import CarouselsCycle from "@/components/CarouselsCycle.vue"

// 驗證規則（簡短文字）
const showAlert = ref(true)
const errorAlertVisible = ref(true)

const accountNameRules = [
  (v: string) => !!v || '必填',
  (v: string) => (v && v.length >= 3 && v.length <= 20) || '3~20 字元'
]
const emailRules = [
  (v: string) => !!v || '必填',
  (v: string) => /.+@.+\..+/.test(v) || '格式錯誤'
]
const phoneRules = [
  (v: string) => !!v || '必填',
  (v: string) => /^09\d{8}$/.test(v) || '格式：09XXXXXXXX'
]

// 表單驗證狀態與參考
const valid = ref<boolean | null>(false)
const form = ref<any>(null)

// 個人資料資料結構
const profile = ref({
  userId: '',
  userName: '',
  userEmail: '',
  userPhone: '',
  isEmailVerified: false
})

const toggleAlert = () => {
  showAlert.value = !showAlert.value
}
const loading = ref(true)
const error = ref('')
const router = useRouter()

// Snackbar 相關狀態
const snackbar = ref(false)
const snackbarTitle = ref('')
const snackbarText = ref('')
const snackbarColor = ref('success')

// 攔截器：自動將 token 加入請求標頭（建議此設定放在全域 axios 攔截器中）
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 檢查是否已登入
function checkLogin() {
  const token = localStorage.getItem('token')
  if (!token) {
    // 假設沒 token 就視為未登入，導向登入或執行登出
    // 例如導向登入頁
    router.push('/login')
  }
}

// 取得個人資料
async function fetchProfile() {
  try {
    const response = await axios.get('https://localhost:7092/api/Profile')
    profile.value = response.data
  } catch (err) {
    console.error('取得資料錯誤：', err)
    error.value = '無法取得使用者資料。'
  } finally {
    loading.value = false
  }
}

// 更新個人資料：用 Snackbar 顯示通知訊息
async function updateProfile() {
  if (form.value && !form.value.validate()) return
  try {
    await axios.put('https://localhost:7092/api/Profile', profile.value)
    snackbarTitle.value = '更新成功！'
    snackbarText.value = '個人資料已完成變更'
    snackbarColor.value = 'success'
    snackbar.value = true
  } catch (err) {
    console.error('更新資料錯誤：', err)
    snackbarTitle.value = '更新失敗'
    snackbarText.value = '資料更新失敗！'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

// 補救措施：重新寄送 Email 驗證信
async function resendVerificationEmail() {
  try {
    const response = await axios.post('https://localhost:7092/api/Account/ResendVerificationEmail', {
      email: profile.value.userEmail
    })
    snackbarTitle.value = '驗證信已寄出！'
    snackbarText.value = response.data.message || '請查看信箱，尋找驗證信'
    snackbarColor.value = 'success'
    snackbar.value = true
  } catch (err: any) {
    console.error('重新寄送驗證信失敗：', err)
    snackbarTitle.value = err.response?.data?.message || '請稍後再試。'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}

onMounted(() => {
  // 1. 先檢查是否已登入
  checkLogin()

  // 2. 若已登入，再抓取會員資料
  fetchProfile()
  
  // 3. 設置頁面樣式
  document.body.classList.add('profile-page');
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  
  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 添加透明背景
  if (header) header.style.backgroundColor = 'transparent';
  if (footer) footer.style.backgroundColor = 'transparent';
})

onBeforeUnmount(() => {
  document.body.classList.remove('profile-page');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  
  // 獲取header和footer元素
  const header = document.querySelector('.desktop-header');
  const footer = document.querySelector('footer.footer-container');
  
  // 恢復原來的背景
  if (header) header.style.backgroundColor = '';
  if (footer) footer.style.backgroundColor = '';
})
</script>

<style scoped>
.profile-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  z-index: 4;
  pointer-events: none;
}

.background-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-family: 'Times New Roman', serif;
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.profile-content {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.profile-cards {
  margin-top: 20px;
}

.profile-card, :deep(.password-card) {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  height: 100%;
}

.profile-card:hover, :deep(.password-card:hover) {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}

.profile-card h3, :deep(.password-card h3) {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1.5rem;
}

.update-btn, :deep(.update-btn) {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 0 2rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4) !important;
}

.update-btn:hover, :deep(.update-btn:hover) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5) !important;
}

.verification-section {
  margin-top: 2rem;
  position: relative;
}

.toggle-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 0 1.5rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4) !important;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5) !important;
}

.verification-alert {
  width: 100%;
  margin-top: 1rem;
  border-radius: 10px !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

.resend-btn {
  background: linear-gradient(135deg, #6366f1, #818cf8) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 0 1.5rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
}

.resend-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
}

.error-alert {
  border-radius: 10px !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 50% !important;
  transition: all 0.3s ease !important;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: rotate(180deg);
}

/* Snackbar 樣式 */
.custom-snackbar {
  border-radius: 12px !important;
}

.snackbar-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.snackbar-text {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 70px 20px 30px;
  }

  .page-title {
    font-size: 3rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 60px 15px 20px;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .profile-content {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .profile-content {
    padding: 15px;
  }
  
  .profile-card, :deep(.password-card) {
    padding: 15px !important;
  }
  
  .profile-card h3, :deep(.password-card h3) {
    font-size: 1.3rem;
  }
}
</style>

<style>
/* 全局樣式 */
body.profile-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
}

body.profile-page .desktop-header {
  background: transparent !important;
  z-index: 100;
}

body.profile-page .header-container {
  background: transparent !important;
}

body.profile-page footer.footer-container {
  background: transparent !important;
  z-index: 100;
  position: relative;
}

/* 確保頁面容器不受影響 */
body.profile-page .page-container {
  background: transparent !important;
}

/* 自定義表單元素樣式 */
body.profile-page .v-text-field .v-field__outline__start,
body.profile-page .v-text-field .v-field__outline__end,
body.profile-page .v-text-field .v-field__outline__notch {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

body.profile-page .v-text-field:hover .v-field__outline__start,
body.profile-page .v-text-field:hover .v-field__outline__end,
body.profile-page .v-text-field:hover .v-field__outline__notch {
  border-color: rgba(79, 70, 229, 0.5) !important;
}

body.profile-page .v-text-field--focused .v-field__outline__start,
body.profile-page .v-text-field--focused .v-field__outline__end,
body.profile-page .v-text-field--focused .v-field__outline__notch {
  border-color: #4f46e5 !important;
}
</style>