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
          <!-- 如有其他欄位，也可以繼續添加 -->
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
  import { useUserStore } from '@/stores/userStore'; // 若需要使用 Pinia 存取登入資訊，可加入
  
  // 這裡定義一個 reactive 物件儲存使用者資料
  const profile = ref({
    userId: '',
    userName: '',
    userEmail: '',
    userPhone: ''
  });
  
  const loading = ref(true);
  const error = ref(null);
  
  // 取得使用者資料，假設後端提供 GET /api/User/profile 端點
  async function fetchProfile() {
    try {
      const response = await axios.get("https://localhost:7092/api/User/profile");
      // 假設回傳的資料格式與 profile 結構一致
      profile.value = response.data;
    } catch (err) {
      console.error("取得資料錯誤：", err);
      error.value = "無法取得使用者資料。";
    } finally {
      loading.value = false;
    }
  }
  
  // 更新使用者資料，假設後端提供 PUT /api/User/profile 端點
  async function updateProfile() {
    try {
      const response = await axios.put("https://localhost:7092/api/User/profile", profile.value);
      alert("資料更新成功！");
      // 若需要，可以更新 Pinia store 中的資訊
      // userStore.setUserInfo(response.data);
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
    box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  