<template>
  <v-card>
    <v-card-title class="headline">Email 驗證</v-card-title>
    <v-card-text>
      <!-- 驗證成功訊息及倒數提示 (僅在成功時顯示) -->
      <v-alert v-if="message && !error" type="success" dense outlined>
        {{ message }}
        <div v-if="redirectCountdown > 0" style="margin-top: 8px;">
          將於 {{ redirectCountdown }} 秒後自動關閉此頁面...
        </div>
      </v-alert>
      <!-- 驗證失敗訊息 -->
      <v-alert v-if="error" type="error" dense outlined>
        {{ error }}
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <!-- 按鈕永遠顯示，點擊後嘗試關閉頁面 -->
      <v-btn color="primary" @click="handleClose">
        請關閉此頁面
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// 定義 token 這個 prop
const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

// 用於顯示成功與錯誤訊息的 ref
const message = ref('')
const error = ref('')

// 定義倒數秒數，預設 5 秒
const redirectCountdown = ref(5)
let intervalId: number | null = null

// 當元件掛載時呼叫 API 驗證 Email
onMounted(() => {
  axios
    .get(`https://localhost:7092/api/Account/VerifyEmail?token=${props.token}`)
    .then(response => {
      message.value = response.data.message || '驗證成功！'
    })
    .catch(err => {
      console.error(err)
      error.value = err.response?.data?.message || '驗證失敗！'
    })
})

// 若驗證成功且無錯誤，啟動倒數計時自動關閉頁面
watch([message, error], ([newMessage, newError]) => {
  if (newMessage && !newError) {
    if (intervalId !== null) return
    intervalId = window.setInterval(() => {
      if (redirectCountdown.value > 0) {
        redirectCountdown.value--
      } else {
        clearInterval(intervalId!)
        closePage()
      }
    }, 1000)
  }
})

// 嘗試關閉頁面的函式
function closePage() {
  // 嘗試自動關閉頁面
  window.close()
  // 如果 window.close() 失效，可考慮提示使用者自行關閉
  // 例如：alert("請關閉此頁面")
}

// 按鈕點擊事件：若使用者手動點擊，則清除倒數並關閉頁面
function handleClose() {
  if (intervalId) {
    clearInterval(intervalId)
  }
  closePage()
}
</script>

<style scoped>
/* 根據需求調整樣式 */
</style>
