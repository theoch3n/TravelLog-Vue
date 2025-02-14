<template>
    <div ref="modalElement" class="modal fade" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <h5 class="modal-title" id="loginModalLabel">
                        <template v-if="currentView === 'login'">帳號登入</template>
                        <template v-else>帳號註冊</template>
                    </h5>
                    <button type="button" class="btn-close" @click="hide" aria-label="Close"></button>
                </div>
                <!-- Modal Body -->
                <div class="modal-body">
                    <!-- 登入視窗 -->
                    <div v-if="currentView === 'login'">
                        <div class="auth-form">
                            <form @submit.prevent="loginHandler">
                                <!-- Email 輸入框 -->
                                <div class="mb-3">
                                    <label for="loginEmail" class="form-label"><strong>Email</strong></label>
                                    <input type="email" class="form-control" id="loginEmail" v-model="login.email"
                                        required />
                                    <span v-if="login.errors.email" class="text-danger">{{ login.errors.email }}</span>
                                </div>
                                <!-- 密碼輸入框 -->
                                <div class="mb-3">
                                    <label for="loginPassword" class="form-label"><strong>密碼</strong></label>
                                    <div class="input-group">
                                        <input :type="login.showPassword ? 'text' : 'password'" class="form-control"
                                            id="loginPassword" v-model="login.password" required />
                                        <button type="button" class="btn btn-outline-secondary"
                                            @click="toggleLoginPassword">
                                            <i :class="login.showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <span v-if="login.errors.password" class="text-danger">{{ login.errors.password
                                        }}</span>
                                </div>
                                <!-- 記住帳號與忘記密碼 -->
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="rememberMe"
                                        v-model="login.rememberMe" />
                                    <label class="form-check-label" for="rememberMe">記住此帳號</label>
                                </div>
                                <div class="mb-3">
                                    <router-link to="/reset-password" class="text-primary">忘記密碼?</router-link>
                                </div>
                                <!-- 登入按鈕 -->
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary">登入</button>
                                </div>
                            </form>
                            <!-- 切換到註冊 -->
                            <div class="mt-3 text-center">
                                <p>
                                    還沒有帳號嗎？
                                    <a href="#" class="text-primary" @click.prevent="switchToRegister">註冊</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- 註冊視窗 -->
                    <div v-else>
                        <div class="auth-form">
                            <form @submit.prevent="validateForm">
                                <!-- 帳號名稱 -->
                                <div class="mb-3">
                                    <label for="registerName" class="form-label"><strong>帳號名稱</strong></label>
                                    <input type="text" class="form-control" id="registerName"
                                        v-model="register.formData.accountName" required />
                                </div>
                                <!-- Email -->
                                <div class="mb-3">
                                    <label for="registerEmail" class="form-label"><strong>Email</strong></label>
                                    <input type="email" class="form-control" id="registerEmail"
                                        v-model="register.formData.email" required />
                                </div>
                                <!-- 電話號碼 -->
                                <div class="mb-3">
                                    <label for="registerPhone" class="form-label"><strong>電話號碼</strong></label>
                                    <input type="tel" class="form-control" id="registerPhone"
                                        v-model="register.formData.phone" required @blur="validatePhone" />
                                    <div v-if="register.errors.phone" class="text-danger mt-1">
                                        {{ register.errors.phone }}
                                    </div>
                                </div>
                                <!-- 密碼 -->
                                <div class="mb-3">
                                    <label for="registerPassword" class="form-label"><strong>密碼 (6-20
                                            字元，需包含大寫英文字母)</strong></label>
                                    <div class="input-group">
                                        <input :type="register.showPassword ? 'text' : 'password'" class="form-control"
                                            id="registerPassword" v-model="register.formData.password" required
                                            @blur="validatePassword" />
                                        <button type="button" class="btn btn-outline-secondary"
                                            @click="toggleRegisterPassword">
                                            <i :class="register.showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <div v-if="register.errors.password" class="text-danger mt-1">
                                        {{ register.errors.password }}
                                    </div>
                                </div>
                                <!-- 確認密碼 -->
                                <div class="mb-3">
                                    <label for="registerPasswordConfirm"
                                        class="form-label"><strong>確認密碼</strong></label>
                                    <div class="input-group">
                                        <input :type="register.showPasswordConfirm ? 'text' : 'password'"
                                            class="form-control" id="registerPasswordConfirm"
                                            v-model="register.formData.confirmPassword" required
                                            @blur="validateConfirmPassword" />
                                        <button type="button" class="btn btn-outline-secondary"
                                            @click="toggleRegisterPasswordConfirm">
                                            <i
                                                :class="register.showPasswordConfirm ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                                        </button>
                                    </div>
                                    <div v-if="register.errors.confirmPassword" class="text-danger mt-1">
                                        {{ register.errors.confirmPassword }}
                                    </div>
                                </div>
                                <!-- 切換到登入 -->
                                <div class="mb-3 text-end">
                                    <p>
                                        已經有帳號了?
                                        <a href="#" class="text-primary" @click.prevent="switchToLogin">登入</a>
                                    </p>
                                </div>
                                <!-- 註冊按鈕 -->
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary w-100">註冊</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <!-- 可選：modal-footer 如有需要 -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const userStore = useUserStore();

// 登入、註冊資料與驗證邏輯
const currentView = ref("login");

const login = ref({
    email: "Test@gmail.com",
    password: "T123456",
    showPassword: false,
    rememberMe: false,
    errors: {}
});

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
});

// 切換登入與註冊
function switchToRegister() {
    currentView.value = "register";
}
function switchToLogin() {
    currentView.value = "login";
}

// 密碼、電話驗證與表單提交函式（略，請依原邏輯補上）
function toggleLoginPassword() {
    login.value.showPassword = !login.value.showPassword;
}
function toggleRegisterPassword() {
    register.value.showPassword = !register.value.showPassword;
}
function toggleRegisterPasswordConfirm() {
    register.value.showPasswordConfirm = !register.value.showPasswordConfirm;
}
async function loginHandler() {
    const loginData = {
        email: login.value.email,
        password: login.value.password,
        rememberMe: login.value.rememberMe
    };
    try {
        const response = await axios.post("https://localhost:7092/api/User/login", loginData);
        console.log("登入成功：", response.data);
        alert("登入成功！歡迎回來！");
        // 使用 Pinia store 儲存 token，而不是直接存 localStorage
        userStore.setToken(response.data.token);
        // 如果需要，你也可以同步 localStorage 於 store 的 action 中進行保存
        hide();
        router.push("/");
    } catch (error) {
        console.error("登入錯誤：", error);
    }
}
async function validateForm() {
    // 請依原邏輯補上驗證與註冊流程
    await registerUser();
}
async function registerUser() {
    try {
        const response = await axios.post("https://localhost:7092/api/User/register", {
            userName: register.value.formData.accountName,
            email: register.value.formData.email,
            phone: register.value.formData.phone,
            password: register.value.formData.password
        });
        console.log("註冊成功：", response.data);
        alert("註冊成功！歡迎加入！");
        switchToLogin();
    } catch (error) {
        console.error("註冊錯誤：", error);
    }
}

// 取得 Modal DOM 元素並建立 Bootstrap Modal 實例
const modalElement = ref(null);
let modalInstance = null;

function show() {
    if (modalInstance) {
        modalInstance.show();
    }
}
function hide() {
    if (modalInstance) {
        modalInstance.hide();
    }
}

onMounted(() => {
    modalInstance = new bootstrap.Modal(modalElement.value);
});

// 將方法暴露給父組件
defineExpose({
    show,
    hide,
});
</script>

<style scoped>
/* 你可以根據需要調整樣式 */
</style>