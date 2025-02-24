import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const profile = ref(null);
    const apiAddress = "https://localhost:7092";

    async function fetchProfile() {
        const token = localStorage.getItem("token");
        if (!token) {
            profile.value = null;
            return;
        }

        try {
            const response = await axios.get(
                `${apiAddress}/api/Profile/GetProfile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            profile.value = response.data;
        } catch (error) {
            console.error("取得用戶資料失敗:", error);
            profile.value = null;
        }
    }

    return {
        profile,
        fetchProfile,
    };
});
