<template>
  <v-container>
    <!-- 使用 align="stretch" 使 v-col 等高 -->
    <v-row align="stretch">
      <!-- 左半邊：個人資料面板 -->
      <v-col cols="12" md="6">
        <v-card class="profile">
          <v-card-title class="justify-center">
            <h2>個人資料</h2>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- 隱藏 User ID 欄位 -->
              <v-text-field v-if="false" label="User ID" v-model="profile.userId" disabled></v-text-field>
              <!-- Email -->
              <v-text-field label="Email" v-model="profile.userEmail" type="email" :rules="emailRules" required
                disabled></v-text-field>
              <!-- 帳號名稱 -->
              <v-text-field label="帳號名稱" v-model="profile.userName" :rules="accountNameRules" required></v-text-field>
              <!-- 電話 -->
              <v-text-field label="電話" v-model="profile.userPhone" :rules="phoneRules" required></v-text-field>
              <!-- 更新資料按鈕 -->
              <v-btn color="primary" class="mt-4" @click="updateProfile" :disabled="!valid">
                更新資料
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- 如果使用者尚未驗證 Email，顯示補救措施 -->
        <v-alert v-if="!profile.isEmailVerified" type="warning" dense outlined class="mt-3">
          您的 Email 尚未驗證，請點擊下方按鈕重新發送驗證信。
          <v-btn color="secondary" class="mt-2" @click="resendVerificationEmail">重新寄送驗證信</v-btn>
        </v-alert>
        <v-alert v-else type="success" dense outlined class="mt-3">
          您的 Email 已經驗證！
        </v-alert>



        <!-- 錯誤提示 -->
        <v-alert v-if="error" type="error" class="mt-3">
          {{ error }}
        </v-alert>
        <!-- 載入中提示 -->
        <v-progress-linear v-if="loading" indeterminate class="mt-3"></v-progress-linear>
      </v-col>

      <!-- 右半邊：變更密碼面板 -->
      <v-col cols="12" md="6">
        <!-- 假設 ChangePassword 元件已正確建立 -->
        <ChangePassword />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import ChangePassword from '@/components/ChangePassword.vue'

// 驗證規則
const accountNameRules = [
  (v: string) => !!v || '帳號名稱不可空白',
  (v: string) => (v && v.length >= 3 && v.length <= 20) || '帳號名稱必須介於 3 到 20 個字元'
]
const emailRules = [
  (v: string) => !!v || 'Email 不可空白',
  (v: string) => /.+@.+\..+/.test(v) || 'Email 格式不正確'
]
const phoneRules = [
  (v: string) => !!v || '電話不可空白',
  (v: string) => /^09\d{8}$/.test(v) || '電話格式不正確，必須以09開頭且為10位數字'
]

// 表單驗證狀態與參考
const valid = ref(false)
const form = ref<any>(null)

// 個人資料資料結構
const profile = ref({
  userId: '',
  userName: '',
  userEmail: '',
  userPhone: '',
  isEmailVerified: false // 小寫 i，與後端回傳一致
})


const loading = ref(true)
const error = ref('')

const router = useRouter()

// 取得個人資料
async function fetchProfile() {
  try {
    const response = await axios.get("https://localhost:7092/api/Profile")
    // 將回傳的資料存入 profile
    profile.value = response.data
  } catch (err) {
    console.error("取得資料錯誤：", err)
    error.value = "無法取得使用者資料。"
  } finally {
    loading.value = false
  }
}


// 攔截器：自動將 token 加入請求標頭（建議此設定放在全域 axios 攔截器中）
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// 更新個人資料
async function updateProfile() {
  if (form.value && !form.value.validate()) return
  try {
    const response = await axios.put("https://localhost:7092/api/Profile", profile.value)
    alert("個人資料更新成功！")
  } catch (err) {
    console.error("更新資料錯誤：", err)
    alert("更新資料失敗！")
  }
}

// 補救措施：重新寄送 Email 驗證信
async function resendVerificationEmail() {
  try {
    const response = await axios.post("https://localhost:7092/api/Account/ResendVerificationEmail", {
      email: profile.value.userEmail
    });
    alert(response.data.message || "驗證信已寄出！");
  } catch (err: any) {
    console.error("重新寄送驗證信失敗：", err);
    alert(err.response?.data?.message || "發生錯誤，請稍後再試。");
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile {
  /* 統一使用相同的 v-card 格式 */
  margin: 20px;
  padding: 20px;
  background-color: #fdfdfd;
  border-radius: 20px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin: 0;
}
</style>
