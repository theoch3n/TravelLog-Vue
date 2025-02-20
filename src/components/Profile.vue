<template>
  <div class="profile">
    <v-card>
      <v-card-title>
        <h2>個人資料</h2>
      </v-card-title>
      <v-card-text>
        <!-- 使用 v-form 並設定 v-model 綁定表單驗證狀態 -->
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- User ID：只讀 -->
          <v-text-field
            label="User ID"
            v-model="profile.userId"
            disabled
          ></v-text-field>
          <!-- 帳號名稱 -->
          <v-text-field
            label="帳號名稱"
            v-model="profile.userName"
            :rules="accountNameRules"
            required
          ></v-text-field>
          <!-- Email -->
          <v-text-field
            label="Email"
            v-model="profile.userEmail"
            type="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <!-- 電話 -->
          <v-text-field
            label="電話"
            v-model="profile.userPhone"
            :rules="phoneRules"
            required
          ></v-text-field>
          <!-- 更新資料按鈕 -->
          <v-btn color="primary" class="mt-4" @click="updateProfile" :disabled="!valid">
            更新資料
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- 錯誤提示 -->
    <v-alert v-if="error" type="error" class="mt-3">
      {{ error }}
    </v-alert>

    <!-- 載入中提示 -->
    <v-progress-linear v-if="loading" indeterminate class="mt-3"></v-progress-linear>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const profile = ref({
  userId: '',
  userName: '',
  userEmail: '',
  userPhone: ''
})
const loading = ref(true)
const error = ref(null)
const valid = ref(false)
const form = ref(null)
const router = useRouter()

// 驗證規則
const accountNameRules = [
  v => !!v || '帳號名稱不可空白',
  v => (v && v.length >= 3 && v.length <= 20) || '帳號名稱必須介於 3 到 20 個字元'
]


const emailRules = [
  v => !!v || 'Email 不可空白',
  v => /.+@.+\..+/.test(v) || 'Email 格式不正確'
]

const phoneRules = [
  v => !!v || '電話不可空白',
  v => /^09\d{8}$/.test(v) || '電話格式不正確，必須以09開頭且為10位數字'
]

// 取得個人資料
async function fetchProfile() {
  try {
    const response = await axios.get("https://localhost:7092/api/Profile")
    // 假設後端回傳的資料與 profile 結構一致
    profile.value = response.data
  } catch (err) {
    console.error("取得資料錯誤：", err)
    error.value = "無法取得使用者資料。"
  } finally {
    loading.value = false
  }
}

// 攔截器：自動將 token 加入請求標頭
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

// 更新個人資料
async function updateProfile() {
  // 先驗證表單
  if (!form.value.validate()) {
    return
  }
  try {
    const response = await axios.put("https://localhost:7092/api/Profile", profile.value)
    alert("個人資料更新成功！")
    // 更新成功後可選擇刷新或導向其他頁面
  } catch (err) {
    console.error("更新資料錯誤：", err)
    alert("更新資料失敗！")
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile {
  width: 50%;          /* 占畫面左半邊 */
  margin: 20px;        /* 上下左右留出適當間隔 */
}
h2 {
  text-align: center;
  margin: 0;
}
</style>
