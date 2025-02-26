<template>
    <div class="reset-password">
        <h2>重設密碼</h2>
        <form @submit.prevent="resetPassword">
            <div>
                <label for="newPassword">新密碼：</label>
                <input type="password" id="newPassword" v-model="newPassword" required />
            </div>
            <div>
                <label for="confirmPassword">確認密碼：</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" required />
            </div>
            <button type="submit">送出</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ResetPassword',
    data() {
        return {
            token: '',
            newPassword: '',
            confirmPassword: '',
            message: ''
        }
    },
    created() {
        // 從 URL query 取得 token，假設你已使用 Vue Router
        this.token = this.$route.query.token;
        if (!this.token) {
            this.message = '連結中缺少 token，請確認連結正確。';
        }
    },
    methods: {
        async resetPassword() {
            if (this.newPassword !== this.confirmPassword) {
                this.message = '密碼與確認密碼不一致';
                return;
            }
            try {
                // 呼叫後端重設密碼 API，傳送 token 與新密碼
                const response = await axios.post('/api/Account/ResetPassword', {
                    token: this.token,
                    newPassword: this.newPassword,
                    confirmPassword: this.confirmPassword
                });
                this.message = response.data.message || '密碼重置成功，請使用新密碼登入。';
            } catch (error) {
                console.error(error);
                this.message = '重設密碼失敗，請確認連結是否正確或已過期。';
            }
        }
    }
}
</script>

<style scoped>
.reset-password {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

.reset-password div {
    margin-bottom: 15px;
}
</style>