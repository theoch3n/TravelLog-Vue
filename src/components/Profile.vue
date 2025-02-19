<template>
  <div class="profile">
    <h2>個人資料</h2>
    <div v-if="loading" class="text-center my-3">載入中…</div>
    <div v-else>
      <form @submit.prevent="updateProfile">
        <div class="mb-3">
          <label for="userId" class="form-label">User ID</label>
          <input type="text" id="userId" class="form-control" v-model="profile.userId" disabled />
        </div>
        <div class="mb-3">
          <label for="userName" class="form-label">姓名</label>
          <input type="text" id="userName" class="form-control" v-model="profile.userName" />
        </div>
        <div class="mb-3">
          <label for="userEmail" class="form-label">Email</label>
          <input type="email" id="userEmail" class="form-control" v-model="profile.userEmail" />
        </div>
        <div class="mb-3">
          <label for="userPhone" class="form-label">電話</label>
          <input type="text" id="userPhone" class="form-control" v-model="profile.userPhone" />
        </div>
        <button type="submit" class="btn btn-primary">更新資料</button>
      </form>
    </div>
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const profile = ref({
  userId: '',
  userName: '',
  userEmail: '',
  userPhone: ''
});
const loading = ref(true);
const error = ref(null);
const router = useRouter();

async function fetchProfile() {
  try {
    // 呼叫 GET /api/Profile 端點
    const response = await axios.get("https://localhost:7092/api/Profile");
    // 假設後端回傳的資料與 profile 結構一致
    profile.value = response.data;
  } catch (err) {
    console.error("取得資料錯誤：", err);
    error.value = "無法取得使用者資料。";
  } finally {
    loading.value = false;
  }
}

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


async function updateProfile() {
  try {
    // 呼叫 PUT /api/Profile 端點，將 profile.value 傳送到後端
    const response = await axios.put("https://localhost:7092/api/Profile", profile.value);
    alert("個人資料更新成功！");
    // 更新成功後，你可以選擇導向其他頁面或刷新頁面
    // router.push("/");
  } catch (err) {
    console.error("更新資料錯誤：", err);
    alert("更新資料失敗！");
  }
}

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>