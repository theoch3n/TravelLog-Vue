<template>
    <div class="authincation">
        <div class="container">
            <div class="spacer"></div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="authincation-content">
                        <div class="auth-form">
                            <h4 class="text-center mb-4 fw-bold fs-2"><strong>帳號註冊</strong></h4>
                            <form @submit.prevent="validateForm">
                                <!-- 帳號名稱 -->
                                <div class="mb-3">
                                    <label for="registerName" class="form-label"><strong>帳號名稱</strong></label>
                                    <input type="text" class="form-control" id="registerName"
                                        v-model="formData.accountName" required />
                                </div>

                                <!-- Email -->
                                <div class="mb-3">
                                    <label for="registerEmail" class="form-label"><strong>Email</strong></label>
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
                                        密碼必須為 6-20 字元，並包含至少一個大寫英文字母。
                                    </div>
                                </div>

                                <!-- 確認密碼 -->
                                <div class="mb-3">
                                    <label for="registerPasswordConfirm"
                                        class="form-label"><strong>確認密碼</strong></label>
                                    <div class="input-group">
                                        <input :type="showPasswordConfirm ? 'text' : 'password'" class="form-control"
                                            id="registerPasswordConfirm" v-model="formData.confirmPassword" required
                                            @blur="validateConfirmPassword" />
                                        <button type="button" class="btn-merge-input" @click="togglePasswordConfirm">
                                            <i :class="showPasswordConfirm ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <div v-if="errors.confirmPassword" class="text-danger mt-1">與密碼不相符!</div>
                                </div>

                                <div class="spacer"></div>

                                <!-- 註冊按鈕 -->
                                <div class="mb-3">
                                    <button type="submit" class="btn btn-primary w-100">註冊</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="new-account mt-3 text-center">
                        <p>已經有帳號了? <router-link to="/account" class="text-primary">登入</router-link></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 原有樣式可以保留 */
/* 讓畫面置中，並增加上方的空白 */
.authincation {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding-top: 100px; /* 增加上方空白 */
}

.auth-form h4 {
    font-size: 2rem; /* 放大字體 */
    font-weight: 700; /* 加粗 */
    text-align: center; /* 置中 */
    margin-bottom: 20px; /* 增加底部間距 */
    color: #212529; /* 深色字體，確保清晰度 */
}
/* 控制上方空白的高度 */
.spacer {
    height: 100px;
}

/* 登入框的樣式 */
.authincation-content {
    max-width: 500px; /* 桌面版最大寬度 */
    width: 90%; /* 手機、平板時，最大寬度為螢幕的90% */
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
    background-color: #f3f4f6; /* 預設淺灰色背景 */
    border: 1px solid #d1d5db; /* 預設邊框顏色 */
    border-radius: 6px;
    transition: all 0.3s ease-in-out; /* 增加動畫，使變化更順暢 */
}

/* 當輸入框被點擊（聚焦）時改變顏色 */
.auth-form input:focus {
    background-color: #ffffff; /* 點擊後變成白色 */
    border: 1px solid #a290f5; /* 點擊後邊框變成紫色 */
    box-shadow: 0 0 5px rgba(89, 59, 219, 0.3); /* 增加輕微陰影 */
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