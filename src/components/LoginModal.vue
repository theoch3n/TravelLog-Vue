<template>
    <!-- Vuetify 對話框 -->
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card class="login-modal-card">
            <!-- Modal Header -->
            <v-card-title class="d-flex align-center login-modal-header">
                <div>
                    <span v-if="currentView === 'login'" class="text-h6">帳號登入</span>
                    <span v-else-if="currentView === 'register'" class="text-h6">帳號註冊</span>
                    <span v-else-if="currentView === 'forgotPassword'" class="text-h6">忘記密碼</span>
                    <span v-else-if="currentView === 'verifyEmail'" class="text-h6">Email 驗證</span>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click="hide" class="close-btn">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <!-- Modal Body -->
            <v-card-text class="login-modal-content">
                <!-- 登入視窗 -->
                <div v-if="currentView === 'login'">
                    <!-- 顯示錯誤提示 -->
                    <v-alert v-if="login.errors.general" type="error" dense text class="mb-2 custom-alert">
                        {{ login.errors.general }}
                    </v-alert>

                    <v-form @submit.prevent="loginHandler" class="login-form">
                        <!-- Email 輸入框 -->
                        <v-text-field label="Email" v-model="login.email" type="email" required
                            :error-messages="login.errors.email ? [login.errors.email] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 密碼輸入框 -->
                        <v-text-field label="密碼" v-model="login.password"
                            :type="login.showPassword ? 'text' : 'password'" required
                            :append-icon="login.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="toggleLoginPassword"
                            :error-messages="login.errors.password ? [login.errors.password] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 記住帳號 -->
                        <v-checkbox label="記住此帳號" v-model="login.rememberMe" class="custom-checkbox"></v-checkbox>
                        <!-- 忘記密碼連結 -->
                        <div class="mb-4">
                            <a @click="switchToForgotPassword" class="text--primary forgot-link">
                                忘記密碼?
                            </a>
                        </div>
                        <!-- 登入按鈕 -->
                        <div class="text-center">
                            <v-btn color="primary" type="submit" class="custom-btn">登入</v-btn>
                        </div>
                    </v-form>
                    <!-- 切換到註冊 -->
                    <div class="mt-3 text-center">
                        <p>
                            還沒有帳號嗎？
                            <v-btn text color="primary" @click="switchToRegister" class="switch-btn">註冊</v-btn>
                        </p>
                    </div>
                </div>

                <!-- 註冊視窗 -->
                <div v-else-if="currentView === 'register'">
                    <v-form @submit.prevent="validateForm" class="register-form">
                        <!-- 帳號名稱：增加 3~20 個字驗證 -->
                        <v-text-field label="帳號名稱" v-model="register.formData.accountName" required
                            @blur="validateAccountName"
                            :error-messages="register.errors.accountName ? [register.errors.accountName] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- Email：增加 Email 格式驗證 -->
                        <v-text-field label="Email" v-model="register.formData.email" type="email" required
                            @blur="validateEmail"
                            :error-messages="register.errors.email ? [register.errors.email] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 電話號碼 -->
                        <v-text-field label="電話號碼" v-model="register.formData.phone" type="tel" required
                            @blur="validatePhone"
                            :error-messages="register.errors.phone ? [register.errors.phone] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 密碼 -->
                        <v-text-field label="密碼 (6-20 字元，需包含大寫英文字母)" v-model="register.formData.password"
                            :type="register.showPassword ? 'text' : 'password'" required @blur="validatePassword"
                            :append-icon="register.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="toggleRegisterPassword"
                            :error-messages="register.errors.password ? [register.errors.password] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 確認密碼 -->
                        <v-text-field label="確認密碼" v-model="register.formData.confirmPassword"
                            :type="register.showPasswordConfirm ? 'text' : 'password'" required
                            @blur="validateConfirmPassword"
                            :append-icon="register.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="toggleRegisterPasswordConfirm"
                            :error-messages="register.errors.confirmPassword ? [register.errors.confirmPassword] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 切換到登入 -->
                        <div class="mb-3 text-right">
                            <p>
                                已經有帳號了?
                                <v-btn text color="primary" @click="switchToLogin" class="switch-btn">登入</v-btn>
                            </p>
                        </div>
                        <!-- 註冊按鈕 -->
                        <div class="text-center">
                            <v-btn color="primary" block type="submit" class="custom-btn">註冊</v-btn>
                        </div>
                    </v-form>
                </div>

                <!-- 忘記密碼視窗 -->
                <div v-else-if="currentView === 'forgotPassword'">
                    <v-form ref="forgotForm" class="forgot-form">
                        <!-- Email 輸入框 -->
                        <v-text-field label="請輸入您的 Email" v-model="forgotPasswordEmail" type="email" required
                            @blur="validateForgotPasswordEmail"
                            :error-messages="forgotPasswordErrors.email ? [forgotPasswordErrors.email] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 驗證碼輸入框 -->
                        <v-text-field label="請輸入驗證碼" v-model="verificationCode" type="text" required
                            @blur="validateVerificationCode"
                            :error-messages="forgotPasswordErrors.verificationCode ? [forgotPasswordErrors.verificationCode] : []"
                            class="custom-text-field"></v-text-field>
                        <!-- 發送驗證碼按鈕 -->
                        <v-btn color="secondary" class="mr-2 custom-btn-secondary" @click="sendVerificationCode">
                            發送驗證碼
                        </v-btn>
                        <!-- 提交驗證碼按鈕 -->
                        <v-btn color="primary" @click="submitVerificationCode" class="custom-btn">
                            提交驗證碼
                        </v-btn>
                    </v-form>
                    <v-alert v-if="forgotPasswordMessage" type="info" dense outlined class="mt-4 custom-alert">
                        {{ forgotPasswordMessage }}
                    </v-alert>
                    <div class="mt-3 text-center">
                        <v-btn text color="primary" @click="switchToLogin" class="switch-btn">返回登入</v-btn>
                    </div>
                </div>
                <!-- Email 驗證視窗 -->
                <div v-else-if="currentView === 'verifyEmail'">
                    <VerifyEmail :token="emailVerificationToken" @verified="onVerified" />
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" 
    :timeout="3000" 
    vertical 
    :color="snackbarColor"
    elevation="24" 
    location="top center"
    class="custom-snackbar">
    <p class="snackbar-title">{{ snackbarTitle }}</p>
    <div class="snackbar-text">{{ snackbarText }}</div>

    <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false" class="snackbar-btn">
            關閉
        </v-btn>
    </template>
</v-snackbar>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import VerifyEmail from '@/components/VerifyEmail.vue'

const snackbarColor = ref("primary")
const router = useRouter()
const userStore = useUserStore()

// 控制 v-dialog 的顯示與否
const dialog = ref(false)
// 切換視窗的變數，目前值可為 "login", "register", "forgotPassword", "verifyEmail"
const currentView = ref("login")

// Snackbar 狀態與訊息
const snackbar = ref(false)
const snackbarText = ref("")
const snackbarTitle = ref("")

// 登入資料與驗證邏輯
const login = ref({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: false,
    errors: {}
})

// 註冊資料與驗證邏輯
const register = ref({
    formData: {
        accountName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    },
    showPassword: false,
    showPasswordConfirm: false,
    errors: {}
})

// 忘記密碼相關變數
const forgotPasswordEmail = ref("")
const verificationCode = ref("")
const forgotPasswordMessage = ref("")
const emailVerificationToken = ref("")
const forgotPasswordErrors = reactive({
    email: "",
    verificationCode: ""
})

// 切換視窗方法
function switchToRegister() {
    currentView.value = "register"
}
function switchToLogin() {
    currentView.value = "login"
}
function switchToForgotPassword() {
    currentView.value = "forgotPassword"
}

// 密碼顯示切換
function toggleLoginPassword() {
    login.value.showPassword = !login.value.showPassword
}
function toggleRegisterPassword() {
    register.value.showPassword = !register.value.showPassword
}
function toggleRegisterPasswordConfirm() {
    register.value.showPasswordConfirm = !register.value.showPasswordConfirm
}

// 登入表單提交
async function loginHandler() {
    login.value.errors.general = ""
    const loginData = {
        email: login.value.email,
        password: login.value.password,
        rememberMe: login.value.rememberMe
    }
    try {
        const response = await axios.post("https://localhost:7092/api/User/login", loginData)
        console.log("登入成功：", response.data)
        // 使用 Snackbar 顯示成功訊息
        snackbarTitle.value = "登入成功！"
        snackbarText.value = "歡迎回來！"
        snackbar.value = true
        userStore.setToken(response.data.token)
        hide()
        router.push("/")
    } catch (error) {
        console.error("登入錯誤：", error)
        login.value.errors.general = "帳號或密碼有誤"
    }
}

// 忘記密碼表單提交（這邊與原本邏輯相同）
async function forgotPasswordHandler() {
    if (!validateForgotPasswordEmail() || !validateVerificationCode()) return

    try {
        const response = await axios.post("https://localhost:7092/api/Account/ForgotPassword", {
            email: forgotPasswordEmail.value.trim(),
            verificationCode: verificationCode.value.trim()
        })

        forgotPasswordMessage.value = response.data.message || "如果該 Email 已註冊，我們將發送驗證碼。"
        forgotPasswordErrors.email = ""
        forgotPasswordErrors.verificationCode = ""
    } catch (error) {
        console.error("忘記密碼錯誤：", error)
        if (error.response) {
            if (error.response.status === 400) {
                forgotPasswordErrors.email = "請輸入有效的 Email 地址"
            } else if (error.response.status === 404) {
                forgotPasswordMessage.value = "該 Email 尚未註冊。"
            } else {
                forgotPasswordMessage.value = "發生錯誤，請稍後再試。"
            }
        } else {
            forgotPasswordMessage.value = "無法連線至伺服器，請檢查您的網路。"
        }
    }
}

// URL 帶 token 時切換到 Email 驗證視圖
onMounted(() => {
    const token = router.currentRoute.value.query.token
    if (token) {
        emailVerificationToken.value = token
        currentView.value = "verifyEmail"
    }
})

// 當 VerifyEmail 子組件發出 verified 事件後
function onVerified(msg) {
    currentView.value = "login"
    router.push({ query: {} })
}

// 驗證確認密碼是否一致
function validateConfirmPassword() {
    if (register.value.formData.confirmPassword !== register.value.formData.password) {
        register.value.errors.confirmPassword = "確認密碼不相符！"
    } else {
        register.value.errors.confirmPassword = ""
    }
}

// 帳號名稱驗證：必須為 3~20 個字元
function validateAccountName() {
    const name = register.value.formData.accountName
    if (name.length < 3 || name.length > 20) {
        register.value.errors.accountName = "帳號必須介於 3 到 20 個字元"
    } else {
        register.value.errors.accountName = ""
    }
}

// Email 格式驗證
function validateEmail() {
    const email = register.value.formData.email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        register.value.errors.email = "Email 格式不正確"
    } else {
        register.value.errors.email = ""
    }
}

// 驗證 Email（忘記密碼）
function validateForgotPasswordEmail() {
    const email = forgotPasswordEmail.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
        forgotPasswordErrors.email = "Email 欄位不能為空"
        return false
    } else if (!emailRegex.test(email)) {
        forgotPasswordErrors.email = "Email 格式不正確"
        return false
    } else {
        forgotPasswordErrors.email = ""
        return true
    }
}

// 驗證驗證碼
function validateVerificationCode() {
    const code = verificationCode.value.trim()
    if (!code) {
        forgotPasswordErrors.verificationCode = "驗證碼不能為空"
        return false
    } else if (code.length !== 6) {
        forgotPasswordErrors.verificationCode = "驗證碼必須是六位數"
        return false
    } else {
        forgotPasswordErrors.verificationCode = ""
        return true
    }
}

// 發送驗證碼按鈕的處理函式
async function sendVerificationCode() {
    if (!validateForgotPasswordEmail()) return
    try {
        const response = await axios.post("https://localhost:7092/api/ForgotPassword", {
            email: forgotPasswordEmail.value.trim()
        })
        forgotPasswordMessage.value = response.data.message || "驗證碼已發送，請檢查您的信箱。"
    } catch (error) {
        console.error("發送驗證碼錯誤：", error)
        forgotPasswordMessage.value = "發送驗證碼失敗，請稍後再試。"
    }
}

// 提交驗證碼按鈕的處理函式
async function submitVerificationCode() {
    if (!validateForgotPasswordEmail() || !validateVerificationCode()) return

    try {
        const emailInput = forgotPasswordEmail.value.trim()
        const codeInput = verificationCode.value.trim()

        const response = await axios.post("https://localhost:7092/api/ForgotPassword/ValidateCode", {
            email: emailInput,
            verificationCode: codeInput
        })
        forgotPasswordMessage.value = response.data.message || "驗證成功，請繼續進行密碼重置。"

        // 清除輸入框內容
        forgotPasswordEmail.value = ""
        verificationCode.value = ""

        hide()
        router.push({ name: 'ResetPassword', query: { token: codeInput, email: emailInput } })
    } catch (error) {
        console.error("驗證碼驗證失敗：", error)
        if (error.response && error.response.data && error.response.data.message) {
            forgotPasswordMessage.value = error.response.data.message
        } else {
            forgotPasswordMessage.value = "驗證碼驗證失敗，請確認驗證碼是否正確。"
        }
    }
}

// 驗證電話格式
function validatePhone() {
    if (!/^09\d{8}$/.test(register.value.formData.phone)) {
        register.value.errors.phone = "電話格式不正確，必須以09開頭且為10位數字。"
    } else {
        register.value.errors.phone = ""
    }
}

// 驗證密碼格式
async function validatePassword() {
    if (!/^(?=.*[A-Z]).{6,20}$/.test(register.value.formData.password)) {
        register.value.errors.password = "密碼必須為 6-20 字元，並包含至少一個大寫英文字母。"
    } else {
        register.value.errors.password = ""
    }
}

// 總驗證並發送註冊請求
async function validateForm() {
    validateAccountName()
    validateEmail()
    await validatePassword()
    validateConfirmPassword()
    validatePhone()
    if (
        register.value.errors.accountName ||
        register.value.errors.email ||
        register.value.errors.password ||
        register.value.errors.confirmPassword ||
        register.value.errors.phone
    ) {
        console.warn("驗證失敗，不提交註冊請求")
        return
    }
    await registerUser()
}

async function registerUser() {
    try {
        const response = await axios.post("https://localhost:7092/api/User/register", {
            userName: register.value.formData.accountName,
            email: register.value.formData.email,
            phone: register.value.formData.phone,
            password: register.value.formData.password
        })
        console.log("註冊成功：", response.data)
        snackbarTitle.value = "註冊成功！"
        snackbarText.value = "正在寄送Email驗證信..."
        snackbar.value = true

        // 在清除表單前先儲存必要的資訊
        const userEmail = register.value.formData.email
        const userPassword = register.value.formData.password

        // 清空表單資料（可選）
        register.value.formData.accountName = ""
        register.value.formData.email = ""
        register.value.formData.phone = ""
        register.value.formData.password = ""
        register.value.formData.confirmPassword = ""

        // 使用儲存的 email 與 password 自動登入
        const loginResponse = await axios.post("https://localhost:7092/api/User/login", {
            email: response.data.email || userEmail,
            password: userPassword,
            rememberMe: false  // 依需求設定
        })
        console.log("自動登入成功：", loginResponse.data)
        userStore.setToken(loginResponse.data.token)

        hide()
        router.push("/")
    } catch (error) {
        console.error("註冊錯誤：", error)
        if (error.response && error.response.data && error.response.data.message) {
            snackbarText.value = "註冊失敗"
            snackbarText.value =  error.response.data.message
        } else {
            snackbarText.value = "註冊時發生錯誤!可能是API沒開"
        }
        snackbar.value = true
    }
}


// 控制 dialog 顯示與關閉
function show() {
    currentView.value = "login"
    dialog.value = true
}

function hide() {
    dialog.value = false
}

// 將方法暴露給父組件
defineExpose({
    show,
    hide,
})
</script>

<style scoped>
.login-dialog :deep(.v-overlay__content) {
  overflow: visible;
}

.login-modal-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0) !important;
}

.close-btn {
  transition: all 0.3s ease !important;
  background-color: rgba(255, 255, 255,0.1) !important;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
  transform: rotate(90deg);
}

.close-btn :deep(.v-icon) {
  color: rgba(133,133,133, 0.9) !important;
}

.login-modal-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 背景輪播與遮罩 */
.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
  z-index: 0;
}

.modal-carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.modal-overlay-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
  z-index: 2;
  pointer-events: none;
}

.login-modal-header {
  position: relative;
  background: transparent;
  color: rgb(133, 133, 133);
  padding: 16px 24px;
  z-index: 3;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.login-modal-content {
  position: relative;
  padding: 24px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
}

.custom-text-field {
  margin-bottom: 16px;
}

.custom-text-field :deep(.v-field__outline__start),
.custom-text-field :deep(.v-field__outline__end),
.custom-text-field :deep(.v-field__outline__notch) {
  border-color: rgba(79, 70, 229, 0.3) !important;
}

.custom-text-field:hover :deep(.v-field__outline__start),
.custom-text-field:hover :deep(.v-field__outline__end),
.custom-text-field:hover :deep(.v-field__outline__notch) {
  border-color: rgba(79, 70, 229, 0.5) !important;
}

.custom-text-field:focus-within :deep(.v-field__outline__start),
.custom-text-field:focus-within :deep(.v-field__outline__end),
.custom-text-field:focus-within :deep(.v-field__outline__notch) {
  border-color: #4f46e5 !important;
}

.custom-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 0 2rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4) !important;
}

.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5) !important;
}

.custom-btn-secondary {
  background: linear-gradient(135deg, #6366f1, #818cf8) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 0 1.5rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
}

.custom-btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
}

.switch-btn {
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
}

.switch-btn:hover {
  transform: translateY(-2px);
  text-decoration: underline;
}

.forgot-link {
  color: #4f46e5;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.forgot-link:hover {
  color: #6366f1;
  text-decoration: underline;
}

.close-btn {
  transition: all 0.3s ease !important;
  color: white !important;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  transform: rotate(90deg);
}

.custom-alert {
  border-radius: 10px !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

.custom-checkbox :deep(.v-selection-control__input) {
  color: #4f46e5 !important;
}

/* 添加動畫效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.login-form, .register-form, .forgot-form {
  animation: fadeIn 0.5s ease-out;
}

/* Snackbar 樣式 */
.custom-snackbar {
  border-radius: 12px !important;
}

.snackbar-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.snackbar-text {
  font-size: 0.9rem;
  opacity: 0.9;
}

.snackbar-btn {
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .login-modal-content {
    padding: 16px;
  }
}

@media (max-width: 576px) {
  .login-modal-header {
    padding: 12px 16px;
  }
  
  .login-modal-content {
    padding: 12px;
  }
}
</style>