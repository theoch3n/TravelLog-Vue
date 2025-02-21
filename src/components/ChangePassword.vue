<template>
    <v-card class="profile">
        <v-card-title class="justify-center">
              <h2>變更密碼</h2>
            </v-card-title>
        <v-card-text>
            <v-form ref="formRef" v-model="valid" lazy-validation>
                <!-- 原密碼欄位 -->
                <v-text-field v-model="form.oldPassword" :rules="requiredRules" label="原密碼" type="password"
                    required></v-text-field>

                <!-- 新密碼欄位 -->
                <v-text-field v-model="form.newPassword" :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="toggleNewPassword" :rules="newPasswordRules" label="新密碼 (6-20 字元，需包含至少一個大寫字母)"
                    :type="showNewPassword ? 'text' : 'password'" required></v-text-field>

                <!-- 確認新密碼欄位 -->
                <v-text-field v-model="form.confirmNewPassword"
                    :append-icon="showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="toggleConfirmNewPassword" :rules="confirmPasswordRules" label="確認新密碼"
                    :type="showConfirmNewPassword ? 'text' : 'password'" required></v-text-field>

                <!-- 送出按鈕 -->
                <v-btn :disabled="!valid" color="primary" class="mt-4" @click="ChangePassword">
                    變更密碼
                </v-btn>
            </v-form>

            <!-- 成功或錯誤提示 -->
            <v-alert v-if="message" type="success" class="mt-4">
                {{ message }}
            </v-alert>
            <v-alert v-if="error" type="error" class="mt-4">
                {{ error }}
            </v-alert>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface ChangePasswordRequest {
    oldPassword: string
    newPassword: string
}

// 表單驗證旗標與參考
const valid = ref(false)
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

// 成功與錯誤提示訊息
const message = ref('')
const error = ref('')

// 驗證規則：必填
const requiredRules = [
    (v: string) => !!v || '此欄位必填'
]

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

// 送出變更密碼請求
async function ChangePassword() {
    const isValid = await formRef.value.validate()
    if (!isValid) return

    try {
        const requestData: ChangePasswordRequest = {
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword
        }
        const response = await axios.put('https://localhost:7092/api/ChangePassword', requestData)
        message.value = response.data.message || '密碼變更成功！'
        error.value = ''
        // 變更成功後清空表單
        form.value.oldPassword = ''
        form.value.newPassword = ''
        form.value.confirmNewPassword = ''
    } catch (err: any) {
        console.error('變更密碼錯誤：', err)
        error.value = err.response?.data?.message || '變更密碼失敗！'
        message.value = ''
    }
}
</script>

<style scoped>
 .profile {
  /* 這裡設定左半邊的個人資料面板的樣式 */
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