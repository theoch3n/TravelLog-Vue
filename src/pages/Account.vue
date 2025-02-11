<template>
    <!-- 將 h-100 移除，改用 min-height -->
    <div class="authincation" style="min-height: 100vh;">
        <div class="container-fluid">
            <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                <!-- 調整欄位寬度，例如 col-md-8 -->
                <div class="col-md-6 col-lg-4">
                    <div class="authincation-content">
                        <div class="row no-gutters">
                            <div class="col-xl-12">
                                <div class="auth-form">
                                    <h4 class="text-center mb-4 fw-bold fs-2"><strong>帳號登入</strong></h4>
                                    <form @submit.prevent="login">
                                        <!-- Email 輸入框 -->
                                        <div class="mb-6">
                                            <label for="loginEmail" class="form-label"><strong>Email</strong></label>
                                            <input type="email" class="form-control" id="loginEmail" v-model="email"
                                                required />
                                            <span v-if="errors.email" class="text-danger">{{ errors.email }}</span>
                                        </div>
                                        <!-- 密碼輸入框 -->
                                        <div class="mb-6">
                                            <label for="loginPassword" class="form-label"><strong>密碼</strong></label>
                                            <div class="input-group">
                                                <input :type="showPassword ? 'text' : 'password'" class="form-control"
                                                    id="loginPassword" v-model="password" required />
                                                <button type="button" class="btn-merge-input" @click="togglePassword">
                                                    <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                                </button>
                                            </div>
                                            <span v-if="errors.password" class="text-danger">{{ errors.password
                                                }}</span>
                                        </div>
                                        <!-- 記住帳號與忘記密碼 -->
                                        <div class="form-row d-flex justify-content-between mt-4 mb-2">
                                            <div class="form-group">
                                                <div class="form-check ml-2">
                                                    <input class="form-check-input" type="checkbox" id="rememberMe"
                                                        v-model="rememberMe" />
                                                    <label class="form-check-label" for="rememberMe">記住此帳號</label>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <router-link to="/reset-password"
                                                    class="text-primary">忘記密碼?</router-link>
                                            </div>
                                        </div>
                                        <!-- 登入按鈕 -->
                                        <div class="text-center">
                                            <button type="submit" class="btn btn-primary btn-block">登入</button>
                                        </div>
                                    </form>
                                    <!-- 註冊連結 -->
                                    <div class="new-account mt-3">
                                        <p>還沒有帳號嗎？<router-link to="/account/register"
                                                class="text-primary">註冊</router-link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> <!-- authincation-content -->
                </div> <!-- col -->
            </div> <!-- row -->
        </div> <!-- container-fluid -->
    </div> <!-- authincation -->
</template>

<script>
import axios from 'axios';

export default {
    name: "Login",
    data() {
        return {
            email: "Test@gmail.com",
            password: "T123456",
            showPassword: false,
            rememberMe: false,
            errors: {}
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        async login() {
            const loginData = {
                email: this.email,
                password: this.password,
                rememberMe: this.rememberMe
            };

            try {
                const response = await axios.post('https://localhost:7092/api/User/login', loginData);
                console.log("登入成功，後端回應：", response.data);
                // 取得回應資料，例如 token
                const { message, userId, userName, token } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userName);
                alert(message);
                this.$router.push('/');
            } catch (error) {
                if (error.response && error.response.data) {
                    console.error("登入失敗：", error.response.data);
                    alert("登入失敗：" + error.response.data.message);
                } else {
                    console.error("連線錯誤：", error.message);
                    alert("連線到後端失敗，請確認服務是否啟動且 CORS 設定正確。");
                }
            }
        }
    }
};
</script>
<!-- Required vendors -->

<style scoped>
/* 原有樣式可以保留 */
/* 讓畫面置中，並增加上方的空白 */
.authincation {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding-top: 100px;
    /* 增加上方空白 */
}

.auth-form h4 {
    font-size: 2rem;
    /* 放大字體 */
    font-weight: 700;
    /* 加粗 */
    text-align: center;
    /* 置中 */
    margin-bottom: 20px;
    /* 增加底部間距 */
    color: #212529;
    /* 深色字體，確保清晰度 */
}

/* 控制上方空白的高度 */
.spacer {
    height: 80px;
}

/* 登入框的樣式 */
.authincation-content {
    max-width: 500px;
    /* 桌面版最大寬度 */
    width: 90%;
    /* 手機、平板時，最大寬度為螢幕的90% */
    margin: auto;
    padding: 50px;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* 讓輸入框更大，適應各種裝置 */
.auth-form input {
    font-size: 1.1rem;
    padding: 12px;
    width: 100%;
    background-color: #f3f4f6;
    /* 預設淺灰色背景 */
    border: 1px solid #d1d5db;
    /* 預設邊框顏色 */
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
    /* 增加動畫，使變化更順暢 */
}

/* 當輸入框被點擊（聚焦）時改變顏色 */
.auth-form input:focus {
    background-color: #ffffff;
    /* 點擊後變成白色 */
    border: 1px solid #a290f5;
    /* 點擊後邊框變成紫色 */
    box-shadow: 0 0 5px rgba(89, 59, 219, 0.3);
    /* 增加輕微陰影 */
    outline: none;
}

/* 讓按鈕更大，方便點擊 */
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

/* 讓眼睛圖示與密碼框對齊 */
.input-group .form-control {
    border-radius: 0.25rem;
}

.btn-merge-input {
    background: none;
    border: none;
    cursor: pointer;
}

/* 響應式設計，適應不同裝置 */
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

/* 設定背景色，讓整體畫面更柔和 */
body {
    background-color: #f8f9fa48;
}
</style>