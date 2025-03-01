<template>
  <v-container class="reset-password" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">重設密碼</v-card-title>
          <v-card-text>
            <!-- 若 token 錯誤，顯示錯誤訊息 -->
            <v-alert v-if="tokenError" type="error" dense outlined>
              {{ tokenError }}
            </v-alert>
            <!-- token 有效則顯示表單 -->
            <v-form v-else @submit.prevent="resetPassword">
              <!-- 新密碼輸入框 -->
              <v-text-field
                label="新密碼"
                :type="showPassword ? 'text' : 'password'"
                v-model="newPassword"
                required
                @blur="validatePassword"
                :error-messages="passwordError ? [passwordError] : []"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="togglePasswordVisibility"
              ></v-text-field>
              <!-- 確認密碼輸入框 -->
              <v-text-field
                label="確認密碼"
                :type="showPasswordConfirm ? 'text' : 'password'"
                v-model="confirmPassword"
                required
                @blur="validateConfirmPassword"
                :error-messages="confirmError ? [confirmError] : []"
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="toggleConfirmVisibility"
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4" block>
                送出
              </v-btn>
            </v-form>
            <v-alert
              v-if="message"
              type="info"
              dense
              outlined
              class="mt-4"
            >
              {{ message }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ResetPassword',
  data() {
    return {
      token: '',
      newPassword: '',
      confirmPassword: '',
      message: '',
      tokenError: '',
      passwordError: '',
      confirmError: '',
      showPassword: false,
      showPasswordConfirm: false
    }
  },
  created() {
    // 從 URL query 取得 token
    this.token = this.$route.query.token
    if (!this.token) {
      this.tokenError = '連結中缺少 token，請確認連結正確。'
      console.error('ResetPassword: 缺少 token')
    } else {
      // 呼叫後端 API 驗證 token 是否有效
      axios
        .get(`/api/Account/ResetPassword?token=${this.token}`)
        .then(response => {
          console.log('Token 驗證成功：', response.data)
        })
        .catch(error => {
          console.error('Token 驗證失敗：', error)
          this.tokenError = '連結已失效或不正確，請重新發送忘記密碼請求。'
        })
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmVisibility() {
      this.showPasswordConfirm = !this.showPasswordConfirm
    },
    validatePassword() {
      // 檢查新密碼是否為 6-20 字元，且至少包含一個大寫英文字母
      const passwordRegex = /^(?=.*[A-Z]).{6,20}$/
      if (!passwordRegex.test(this.newPassword)) {
        this.passwordError = '密碼必須為 6-20 字元，並包含至少一個大寫英文字母。'
        return false
      } else {
        this.passwordError = ''
        return true
      }
    },
    validateConfirmPassword() {
      // 檢查確認密碼是否與新密碼一致
      if (this.newPassword !== this.confirmPassword) {
        this.confirmError = '確認密碼不一致！'
        return false
      } else {
        this.confirmError = ''
        return true
      }
    },
    async resetPassword() {
      // 先進行驗證
      const isPasswordValid = this.validatePassword()
      const isConfirmValid = this.validateConfirmPassword()
      if (!isPasswordValid || !isConfirmValid) {
        return
      }
      try {
        const response = await axios.post('/api/Account/ResetPassword', {
          token: this.token,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        })
        this.message =
          response.data.message || '密碼重置成功，請使用新密碼登入。'
        // 跳轉回首頁，例如等待 2 秒後跳轉
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      } catch (error) {
        console.error('重設密碼失敗：', error)
        if (error.response && error.response.data && error.response.data.message) {
          this.message = error.response.data.message
        } else {
          this.message = '重設密碼失敗，請確認連結是否正確或已過期。'
        }
      }
    }
  }
}
</script>

<style scoped>
.reset-password {
  margin-top: 40px;
}
</style>
