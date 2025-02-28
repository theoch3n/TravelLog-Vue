<template>
    <v-card>
      <v-card-title class="headline">Email 驗證</v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" dense outlined>
          {{ error }}
        </v-alert>
        <v-alert v-if="message" type="success" dense outlined>
          {{ message }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="handleVerified">前往登入</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  
  // 定義要從父組件接收的 props（例如 token，也可以直接從 URL 讀取）
  const props = defineProps({
    token: {
      type: String,
      required: true
    }
  })
  
  // 定義向父組件傳送事件的 emit
  const emit = defineEmits(['verified'])
  const router = useRouter()
  
  // 用於顯示訊息的變數
  const message = ref('')
  const error = ref('')
  
  onMounted(() => {
    // 呼叫後端 API 驗證 token 是否有效
    axios.get(`https://localhost:7092/api/Account/VerifyEmail?token=${props.token}`)
      .then(response => {
        message.value = response.data.message || 'Email 驗證成功！'
      })
      .catch(err => {
        console.error(err)
        error.value = err.response?.data?.message || 'Email 驗證失敗！'
      })
  })
  
  // 當使用者點擊按鈕後，發出 verified 事件通知父組件
  function handleVerified() {
    emit('verified', message.value)
    // 或者直接跳轉到登入頁面： router.push('/account')
  }
  </script>
  
  <style scoped>
  /* 根據需求調整樣式 */
  </style>
  