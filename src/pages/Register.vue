<template>
    <div class="authincation">
        <div class="container">
            <div class="spacer"></div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="authincation-content">
                        <div class="auth-form">
                            <h4 class="text-center mb-4 fw-bold fs-2">
                                <strong>帳號註冊</strong>
                            </h4>
                            <!-- 表單提交時呼叫 validateForm 方法 -->
                            <form @submit.prevent="validateForm">
                                <!-- 帳號名稱 -->
                                <div class="mb-3">
                                    <label for="registerName" class="form-label">
                                        <strong>帳號名稱</strong>
                                    </label>
                                    <input type="text" class="form-control" id="registerName"
                                        v-model="formData.accountName" required />
                                </div>
                                <!-- Email -->
                                <div class="mb-3">
                                    <label for="registerEmail" class="form-label">
                                        <strong>Email</strong>
                                    </label>
                                    <input type="email" class="form-control" id="registerEmail" v-model="formData.email"
                                        required />
                                </div>
                                <!-- 密碼 -->
                                <div class="mb-3">
                                    <label for="registerPassword" class="form-label">
                                        <strong>密碼 (6-20 字元，需包含大寫英文字母)</strong>
                                    </label>
                                    <div class="input-group">
                                        <input :type="showPassword ? 'text' : 'password'" class="form-control"
                                            id="registerPassword" v-model="formData.password" required
                                            @blur="validatePassword" />
                                        <button type="button" class="btn-merge-input" @click="togglePassword">
                                            <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <div v-if="errors.password" class="text-danger mt-1">
                                        {{ errors.password }}
                                    </div>
                                </div>
                                <!-- 確認密碼 -->
                                <div class="mb-3">
                                    <label for="registerPasswordConfirm" class="form-label">
                                        <strong>確認密碼</strong>
                                    </label>
                                    <div class="input-group">
                                        <input :type="showPasswordConfirm ? 'text' : 'password'" class="form-control"
                                            id="registerPasswordConfirm" v-model="formData.confirmPassword" required
                                            @blur="validateConfirmPassword" />
                                        <button type="button" class="btn-merge-input" @click="togglePasswordConfirm">
                                            <i :class="showPasswordConfirm ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <div v-if="errors.confirmPassword" class="text-danger mt-1">
                                        {{ errors.confirmPassword }}
                                    </div>
                                </div>
                                <!-- 註冊按鈕 -->
                                <div class="mb-3">
                                    <button type="submit" class="btn btn-primary w-100">註冊</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="new-account mt-3 text-center">
                        <p>
                            已經有帳號了?
                            <router-link to="/account" class="text-primary">登入</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "Register",
    data() {
        return {
            // 初始化表單資料
            formData: {
                accountName: "",
                email: "",
                password: "",
                confirmPassword: ""
            },
            showPassword: false,
            showPasswordConfirm: false,
            errors: {}
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        togglePasswordConfirm() {
            this.showPasswordConfirm = !this.showPasswordConfirm;
        },
        validatePassword() {
            // 檢查密碼是否符合規定：6-20 字元且至少包含一個大寫英文字母
            if (!/^(?=.*[A-Z]).{6,20}$/.test(this.formData.password)) {
                this.errors.password = "密碼必須為 6-20 字元，並包含至少一個大寫英文字母。";
            } else {
                this.errors.password = "";
            }
        },
        validateConfirmPassword() {
            // 檢查確認密碼是否與密碼一致
            if (this.formData.confirmPassword !== this.formData.password) {
                this.errors.confirmPassword = "與密碼不相符!";
            } else {
                this.errors.confirmPassword = "";
            }
        },
        async validateForm() {
            // 先進行密碼與確認密碼的驗證
            this.validatePassword();
            this.validateConfirmPassword();
            // 如果驗證有錯誤，則不進行註冊請求
            if (this.errors.password || this.errors.confirmPassword) {
                return;
            }
            // 驗證通過，呼叫 register 方法發送 API 請求
            await this.register();
        },
        async register() {
            try {
                // 發送 POST 請求到後端註冊 API
                const response = await axios.post('https://localhost:7092/api/User/register', {
                    userName: this.formData.accountName,
                    email: this.formData.email,
                    phone: "", // 如果有電話欄位，可傳送；這裡設為空字串
                    password: this.formData.password
                });
                console.log("註冊成功，回應資料：", response.data);
                alert(response.data.message);
                // 註冊成功後導向登入頁
                this.$router.push('/account');
            } catch (error) {
                if (error.response && error.response.data) {
                    console.error("註冊失敗：", error.response.data);
                    alert("註冊失敗：" + error.response.data.message);
                } else {
                    console.error("註冊錯誤：", error.message);
                    alert("註冊時發生錯誤：" + error.message);
                }
            }
        }
    }
};
</script>

<style scoped>
/* 保持你的現有樣式 */
.authincation {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding-top: 100px;
}

.auth-form h4 {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
    color: #212529;
}

.spacer {
    height: 80px;
}

.authincation-content {
    max-width: 500px;
    width: 90%;
    margin: auto;
    padding: 50px;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.auth-form input {
    font-size: 1.1rem;
    padding: 12px;
    width: 100%;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
}

.auth-form input:focus {
    background-color: #ffffff;
    border: 1px solid #a290f5;
    box-shadow: 0 0 5px rgba(89, 59, 219, 0.3);
    outline: none;
}

.btn-primary {
    font-size: 1.2rem;
    padding: 14px;
    background-color: #a997fd;
    border: none;
    width: 100%;
    border-radius: 6px;
}

.btn-primary:hover {
    background-color: #a997fd;
}

.input-group .form-control {
    border-radius: 0.25rem;
}

.btn-merge-input {
    background: none;
    border: none;
    cursor: pointer;
}

@media (max-width: 768px) {
    .authincation-content {
        max-width: 90%;
        padding: 30px;
    }

    .auth-form input {
        font-size: 1rem;
        padding: 10px;
    }

    .btn-primary {
        font-size: 1rem;
        padding: 12px;
    }
}

@media (max-width: 480px) {
    .authincation-content {
        max-width: 95%;
        padding: 20px;
    }

    .auth-form input {
        font-size: 0.9rem;
        padding: 8px;
    }

    .btn-primary {
        font-size: 1rem;
        padding: 10px;
    }
}

body {
    background-color: #f8f9fa48;
}
</style>