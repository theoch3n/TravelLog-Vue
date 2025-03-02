<template>
  <v-card>
    <v-card-title class="headline">Email 驗證</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error" dense outlined>
        {{ error }}
      </v-alert>
      <v-alert v-if="message" type="success" dense outlined>
        {{ message }}
        <!-- 如果倒數尚未結束則顯示倒數提示 -->
        <div v-if="redirectCountdown > 5">
          將於 {{ redirectCountdown }} 秒後自動跳轉...
        </div>
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <!-- 按鈕文字修改為「驗證已完成，關閉此頁面」 -->
      <v-btn color="primary" @click="handleVerified">
        驗證已完成，請關閉此頁面，或等待跳轉至首頁
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// 定義 token 這個 prop
const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

// 定義發送給父組件的事件（如果有需要）
const emit = defineEmits(['verified'])
const router = useRouter()

// 定義用於顯示錯誤與成功訊息的 ref
const error = ref('')
const message = ref('')

// 定義倒數秒數，預設 5 秒
const redirectCountdown = ref(5)

// 當元件掛載時呼叫 API 驗證 Email
onMounted(() => {
  axios
    .get(`https://localhost:7092/api/Account/VerifyEmail?token=${props.token}`)
    .then(response => {
      message.value = response.data.message || 'Email 驗證成功！'
    })
    .catch(err => {
      console.error(err)
      error.value = err.response?.data?.message || 'Email 驗證失敗！'
    })
})

// 當驗證成功且沒有錯誤時，啟動倒數計時自動跳轉
watch([message, error], ([newMessage, newError]) => {
  if (newMessage && !newError) {
    const intervalId = setInterval(() => {
      if (redirectCountdown.value > 0) {
        redirectCountdown.value--
      } else {
        clearInterval(intervalId)
        // 這裡可依需求關閉頁面或返回首頁
        router.push('/') // 或者使用 window.close() 來關閉視窗（注意瀏覽器限制）
      }
    }, 1000)
  }
})

// 當使用者點擊按鈕時，發出 verified 事件並關閉此頁面
function handleVerified() {
  emit('verified', message.value)
  // 依需求選擇下列其中一個方案：
  
  // 若該頁面是透過程式開啟的視窗，則可使用 window.close()
  // window.close()
  
  // 或者利用 router 返回首頁
  router.push('/')
}
</script>

<style scoped>
/* 根據需求調整樣式 */
</style>
