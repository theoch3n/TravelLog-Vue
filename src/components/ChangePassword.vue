<template>
    <v-card class="profile">
      <v-card-title class="justify-center">
        <h2>變更密碼</h2>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <!-- 原密碼欄位 -->
          <v-text-field
            v-model="form.oldPassword"
            :rules="requiredRules"
            label="原密碼"
            type="password"
            required
          ></v-text-field>
  
          <!-- 新密碼欄位 -->
          <v-text-field
            v-model="form.newPassword"
            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="toggleNewPassword"
            :rules="newPasswordRules"
            label="新密碼 (6-20 字元，需包含至少一個大寫字母)"
            :type="showNewPassword ? 'text' : 'password'"
            required
          ></v-text-field>
  
          <!-- 確認新密碼欄位 -->
          <v-text-field
            v-model="form.confirmNewPassword"
            :append-icon="showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="toggleConfirmNewPassword"
            :rules="confirmPasswordRules"
            label="確認新密碼"
            :type="showConfirmNewPassword ? 'text' : 'password'"
            required
          ></v-text-field>
  
          <!-- 送出按鈕 -->
          <v-btn :disabled="!valid" color="primary" class="mt-4" @click="ChangePassword">
            <v-icon left class="mr-2">mdi-rename</v-icon>變更密碼
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  
    <!-- 使用 v-snackbar 顯示通知訊息 -->
    <v-snackbar
      v-model="snackbar"
      location=""
      :timeout="3000"
      :color="snackbarColor"
      style="font-size: 1.2rem; font-weight: bold; min-width: 300px; padding: 16px;"
    >
      {{ snackbarText }}
    </v-snackbar>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'
  
  interface ChangePasswordRequest {
    oldPassword: string
    newPassword: string
  }
  
  // 表單驗證旗標與參考
  const valid = ref<boolean | null>(false)
  const formRef = ref()
  
  // 表單資料：原密碼、新密碼與確認新密碼
  const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  
  // 控制密碼欄位是否顯示明文
  const showNewPassword = ref(false)
  const showConfirmNewPassword = ref(false)
  
  // 驗證規則：必填
  const requiredRules = [(v: string) => !!v || '此欄位必填']
  
  // 驗證新密碼格式：必須 6-20 字元且至少包含一個大寫字母
  const newPasswordRules = [
    (v: string) => !!v || '新密碼必填',
    (v: string) => (v && v.length >= 6 && v.length <= 20) || '密碼需為 6-20 字元',
    (v: string) => /^(?=.*[A-Z]).*$/.test(v) || '必須包含至少一個大寫字母'
  ]
  
  // 驗證確認新密碼必須與新密碼一致
  const confirmPasswordRules = [
    (v: string) => !!v || '確認密碼必填',
    (v: string) => v === form.value.newPassword || '確認密碼與新密碼不一致'
  ]
  
  // 切換新密碼可見性
  function toggleNewPassword() {
    showNewPassword.value = !showNewPassword.value
  }
  
  // 切換確認新密碼可見性
  function toggleConfirmNewPassword() {
    showConfirmNewPassword.value = !showConfirmNewPassword.value
  }
  
  // Snackbar 相關狀態與通知訊息
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('success')
  
  // 送出變更密碼請求，並以 snackbar 顯示通知
  async function ChangePassword() {
  const isValid = await formRef.value.validate() as boolean
  if (!isValid) return

  try {
    const requestData: ChangePasswordRequest = {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    }
    const response = await axios.put('https://localhost:7092/api/ChangePassword', requestData)
    snackbarText.value = response.data.message || '密碼變更成功！'
    snackbarColor.value = 'success'
    snackbar.value = true

    // 變更成功後清空表單資料
    form.value.oldPassword = ''
    form.value.newPassword = ''
    form.value.confirmNewPassword = ''

    // 重置表單驗證狀態，避免驗證因欄位清空而觸發警告
    formRef.value.resetValidation()
  } catch (err: any) {
    console.error('變更密碼錯誤：', err)
    snackbarText.value = err.response?.data?.message || '變更密碼失敗！'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}
  </script>
  
  <style scoped>
  .profile {
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
  