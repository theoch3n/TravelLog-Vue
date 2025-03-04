<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between" style="gap: 8px;">
          <h1 class="font-weight-bold my-4 d-flex align-center">
            <v-icon class="mr-2">mdi-account-box</v-icon>
            會員系統
          </h1>
          <v-tooltip bottom>
            <template #activator="{ props }">
              <v-btn icon color="info" class="mt-3" @click="fetchProfile" v-bind="props">
                <v-icon>mdi-reload</v-icon>
              </v-btn>
            </template>
            <span>重新載入資料</span>
          </v-tooltip>

        </div>
      </v-col>
    </v-row>

    <!-- 主表單區塊與其他內容保持不變 -->
    <v-row align="stretch">
      <!-- 左半邊：個人資料面板 -->
      <v-col cols="12" md="6">
        <v-card class="profile">
          <v-card-title class="justify-center">
            <h2>個人資料</h2>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-if="false" label="User ID" v-model="profile.userId" disabled></v-text-field>
              <v-text-field label="Email" v-model="profile.userEmail" type="email" :rules="emailRules" required
                disabled></v-text-field>
              <v-text-field label="帳號名稱" v-model="profile.userName" :rules="accountNameRules" required></v-text-field>
              <v-text-field label="電話" v-model="profile.userPhone" :rules="phoneRules" required></v-text-field>
              <v-btn color="primary" class="mt-4" @click="updateProfile" :disabled="!valid">
                <v-icon left class="mr-2">mdi-book-refresh</v-icon>更新資料
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 右半邊：變更密碼面板 -->
      <v-col cols="12" md="6">
        <ChangePassword />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <!-- 切換警示框顯示/隱藏的按鈕 -->
          <v-btn @click="toggleAlert">
            {{ showAlert ? '隱藏Email驗證' : '顯示Email驗證' }}
          </v-btn>
          <!-- 透過條件渲染與縮合功能來顯示警示框 -->
          <div class="d-flex align-center flex-grow-1 justify-end" style="gap: 8px; margin-top: 16px;">
            <v-alert v-if="showAlert && !profile.isEmailVerified" type="warning" dense outlined
              style="max-width: 600px; margin-left: auto;">
              您的 Email 未驗證，請點擊下方按鈕重新發送驗證信
              <v-btn color="secondary" class="mt-2" @click="resendVerificationEmail" style="float: right;">
                <v-icon left class="mr-2">mdi-email-arrow-right</v-icon>
                重新寄送
              </v-btn>
            </v-alert>
            <v-alert v-else-if="showAlert && profile.isEmailVerified" type="success" dense outlined
              style="max-width: 500px; margin-left: auto;">
              您的 Email 已經驗證！
            </v-alert>
          </div>

          <!-- 錯誤提示 -->
          <v-alert v-if="error && errorAlertVisible" type="error" v-model:active="errorAlertVisible" dismissible
            class="mt-3" style="max-width: auto; width: auto;">
            {{ error }}
          </v-alert>
          <!-- 載入中提示 -->
          <v-progress-linear v-if="loading" indeterminate class="mt-3"></v-progress-linear>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar 通知訊息 -->
    <!-- 提示的 snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" vertical :color="snackbarColor" elevation="24"
      style="font-size: 2rem; font-weight: bold; min-width: 400px; padding: 16px;">
      <p style="color: white; font-size: 1.5rem;">{{ snackbarTitle }}</p>
      <div style="color: white;">{{ snackbarText }}</div>

      <template v-slot:actions>
        <v-btn color="indigo" variant="text" @click="snackbar = false" style="color: white;">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import ChangePassword from "../components/ChangePassword.vue"

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
})
</script>

<style scoped>
.profile {
  margin: 20px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #c4c4c4d7;
  /* 細邊框 */
  border-radius: 20px;
  box-shadow: 0px 6px 6px rgba(52, 52, 52, 0.1);
}

h2 {
  text-align: center;
  margin: 0;
}
</style>
