<template>
    <div>
        <!-- Vuetify 對話框 -->
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <!-- Modal Header -->
                <v-card-title class="d-flex align-center">
                    <div>
                        <span v-if="currentView === 'login'" class="text-h6">帳號登入</span>
                        <span v-else class="text-h6">帳號註冊</span>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="hide">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <!-- Modal Body -->
                <v-card-text>
                    <!-- 登入視窗 -->
                    <div v-if="currentView === 'login'">
                        <!-- 顯示錯誤提示 -->
                        <v-alert v-if="login.errors.general" type="error" dense text class="mb-2">
                            {{ login.errors.general }}
                        </v-alert>

                        <v-form @submit.prevent="loginHandler">
                            <!-- Email 輸入框 -->
                            <v-text-field label="Email" v-model="login.email" type="email" required
                                :error-messages="login.errors.email ? [login.errors.email] : []"></v-text-field>
                            <!-- 密碼輸入框 -->
                            <v-text-field label="密碼" v-model="login.password"
                                :type="login.showPassword ? 'text' : 'password'" required
                                :append-icon="login.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="toggleLoginPassword"
                                :error-messages="login.errors.password ? [login.errors.password] : []"></v-text-field>
                            <!-- 記住帳號 -->
                            <v-checkbox label="記住此帳號" v-model="login.rememberMe"></v-checkbox>
                            <!-- 忘記密碼 -->
                            <div class="mb-4">
                                <router-link to="/reset-password" class="text--primary">
                                    忘記密碼?
                                </router-link>
                            </div>
                            <!-- 登入按鈕 -->
                            <div class="text-center">
                                <v-btn color="primary" type="submit">登入</v-btn>
                            </div>
                        </v-form>
                        <!-- 切換到註冊 -->
                        <div class="mt-3 text-center">
                            <p>
                                還沒有帳號嗎？
                                <v-btn text color="primary" @click="switchToRegister">註冊</v-btn>
                            </p>
                        </div>
                    </div>

                    <!-- 註冊視窗 -->
                    <div v-else>
                        <v-form @submit.prevent="validateForm">
                            <!-- 帳號名稱：增加 3~20 個字驗證 -->
                            <v-text-field label="帳號名稱" v-model="register.formData.accountName" required
                                @blur="validateAccountName"
                                :error-messages="register.errors.accountName ? [register.errors.accountName] : []"></v-text-field>
                            <!-- Email：增加 Email 格式驗證 -->
                            <v-text-field label="Email" v-model="register.formData.email" type="email" required
                                @blur="validateEmail"
                                :error-messages="register.errors.email ? [register.errors.email] : []"></v-text-field>
                            <!-- 電話號碼 -->
                            <v-text-field label="電話號碼" v-model="register.formData.phone" type="tel" required
                                @blur="validatePhone"
                                :error-messages="register.errors.phone ? [register.errors.phone] : []"></v-text-field>
                            <!-- 密碼 -->
                            <v-text-field label="密碼 (6-20 字元，需包含大寫英文字母)" v-model="register.formData.password"
                                :type="register.showPassword ? 'text' : 'password'" required @blur="validatePassword"
                                :append-icon="register.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="toggleRegisterPassword"
                                :error-messages="register.errors.password ? [register.errors.password] : []"></v-text-field>
                            <!-- 確認密碼 -->
                            <v-text-field label="確認密碼" v-model="register.formData.confirmPassword"
                                :type="register.showPasswordConfirm ? 'text' : 'password'" required
                                @blur="validateConfirmPassword"
                                :append-icon="register.showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="toggleRegisterPasswordConfirm"
                                :error-messages="register.errors.confirmPassword ? [register.errors.confirmPassword] : []"></v-text-field>
                            <!-- 切換到登入 -->
                            <div class="mb-3 text-right">
                                <p>
                                    已經有帳號了?
                                    <v-btn text color="primary" @click="switchToLogin">登入</v-btn>
                                </p>
                            </div>
                            <!-- 註冊按鈕 -->
                            <div class="text-center">
                                <v-btn color="primary" block type="submit">註冊</v-btn>
                            </div>
                        </v-form>
                    </div>
                </v-card-text>

                <!-- 可選：如果需要 footer 區域，可在此加入 -->
                <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="hide">關閉</v-btn>
          </v-card-actions> -->
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userStore = useUserStore();

// 用來控制 v-dialog 顯示與否
const dialog = ref(false);

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

// 密碼顯示切換
function toggleLoginPassword() {
    login.value.showPassword = !login.value.showPassword;
}
function toggleRegisterPassword() {
    register.value.showPassword = !register.value.showPassword;
}
function toggleRegisterPasswordConfirm() {
    register.value.showPasswordConfirm = !register.value.showPasswordConfirm;
}

// 登入表單提交
async function loginHandler() {
    // 清除先前的錯誤提示
    login.value.errors.general = "";
    const loginData = {
        email: login.value.email,
        password: login.value.password,
        rememberMe: login.value.rememberMe
    };
    try {
        const response = await axios.post("https://localhost:7092/api/User/login", loginData);
        console.log("登入成功：", response.data);
        alert("登入成功！歡迎回來！");
        userStore.setToken(response.data.token);
        hide();
        router.push("/");
    } catch (error) {
        console.error("登入錯誤：", error);
        // 登入失敗時顯示提示訊息
        login.value.errors.general = "帳號或密碼有誤";
    }
}

// 驗證確認密碼是否一致
function validateConfirmPassword() {
    if (register.value.formData.confirmPassword !== register.value.formData.password) {
        register.value.errors.confirmPassword = "確認密碼不相符！";
    } else {
        register.value.errors.confirmPassword = "";
    }
}

// 帳號名稱驗證：必須為3-20個字元
function validateAccountName() {
    const name = register.value.formData.accountName;
    if (name.length < 3 || name.length > 20) {
        register.value.errors.accountName = "帳號必須介於 3 到 20 個字元";
    } else {
        register.value.errors.accountName = "";
    }
}

// Email 格式驗證
function validateEmail() {
    const email = register.value.formData.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        register.value.errors.email = "Email 格式不正確";
    } else {
        register.value.errors.email = "";
    }
}

// 驗證電話格式
function validatePhone() {
    if (!/^09\d{8}$/.test(register.value.formData.phone)) {
        register.value.errors.phone = "電話格式不正確，必須以09開頭且為10位數字。";
    } else {
        register.value.errors.phone = "";
    }
}

// 驗證密碼格式
async function validatePassword() {
    if (!/^(?=.*[A-Z]).{6,20}$/.test(register.value.formData.password)) {
        register.value.errors.password = "密碼必須為 6-20 字元，並包含至少一個大寫英文字母。";
    } else {
        register.value.errors.password = "";
    }
}

// 總驗證並發送註冊請求
async function validateForm() {
    // 呼叫所有驗證函式
    validateAccountName();
    validateEmail();
    await validatePassword();
    validateConfirmPassword();
    validatePhone();
    // 若有任一驗證錯誤，不提交請求
    if (
        register.value.errors.accountName ||
        register.value.errors.email ||
        register.value.errors.password ||
        register.value.errors.confirmPassword ||
        register.value.errors.phone
    ) {
        console.warn("驗證失敗，不提交註冊請求");
        return;
    }
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
        hide();
        router.push("/");
    } catch (error) {
        console.error("註冊錯誤：", error);
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            alert("註冊失敗：" + error.response.data.message);
        } else {
            alert("註冊時發生錯誤!可能是API沒開");
        }
    }
}

// 控制 dialog 顯示與關閉
function show() {
    dialog.value = true;
}
function hide() {
    dialog.value = false;
}

// 將方法暴露給父組件
defineExpose({
    show,
    hide,
});
</script>

<style scoped>
/* 根據需要調整樣式 */
.text-center {
    text-align: center;
}
</style>