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
                            <v-text-field label="新密碼" v-model="newPassword" type="password" required
                                @blur="validatePassword"></v-text-field>
                            <v-text-field label="確認密碼" v-model="confirmPassword" type="password" required
                                @blur="validateConfirmPassword"></v-text-field>
                            <v-btn type="submit" color="primary" class="mt-4" block>
                                送出
                            </v-btn>
                        </v-form>
                        <v-alert v-if="message" type="info" dense outlined class="mt-4">
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
            tokenError: ''
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
        validatePassword() {
            // 檢查新密碼是否為 6-20 字元，且至少包含一個大寫英文字母
            const passwordRegex = /^(?=.*[A-Z]).{6,20}$/
            if (!passwordRegex.test(this.newPassword)) {
                this.message = '密碼必須為 6-20 字元，並包含至少一個大寫英文字母。'
                return false
            } else {
                this.message = ''
                return true
            }
        },
        validateConfirmPassword() {
            // 檢查確認密碼是否與新密碼一致
            if (this.newPassword !== this.confirmPassword) {
                this.message = '確認密碼不一致！'
                return false
            } else {
                this.message = ''
                return true
            }
        },
        async resetPassword() {
            if (this.newPassword !== this.confirmPassword) {
                this.message = '密碼與確認密碼不一致'
                return
            }
            try {
                const response = await axios.post('/api/Account/ResetPassword', {
                    token: this.token,
                    newPassword: this.newPassword,
                    confirmPassword: this.confirmPassword
                })
                this.message = response.data.message || '密碼重置成功，請使用新密碼登入。'
                // 跳轉回首頁，例如等待幾秒再跳轉
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