// src/stores/userStore.js
import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
    state: () => ({
        token: null,
        userInfo: null,
        profile: null,
        apiAddress: "https://localhost:7092",
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem("token", token);
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem("token");
        },
        async fetchProfile() {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("Token 不存在，請先登入");
                this.profile = null;
                return;
            }

            try {
                const response = await axios.get(
                    `${this.apiAddress}/api/Profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                this.profile = response.data;
                console.log("Profile 加載成功:", this.profile);
            } catch (error) {
                console.error("取得用戶資料失敗:", error);
                this.profile = null;
            }
        },
    },
    persist: true, // 如果你有使用持久化插件
});
