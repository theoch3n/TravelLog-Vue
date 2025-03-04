<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as signalR from "@microsoft/signalr";

// SignalR 伺服器地址
const hubUrl = "https://localhost:7092/chatHub";
const connection = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl)
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

// 聊天資料
const messages = ref([]);
const user = ref("");
const message = ref("");
const connected = ref(false);
const connecting = ref(true);
const messagesContainer = ref(null);

// 自動滾動到最新訊息
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 監聽 SignalR 來的訊息
const setupSignalR = async () => {
  connection.on(
    "ReceiveMessage",
    (userName, userMessage, timestamp = new Date().toISOString()) => {
      messages.value.push({
        userName,
        userMessage,
        timestamp,
        isOwnMessage: userName === user.value,
      });
      scrollToBottom();
    }
  );

  try {
    await connection.start();
    console.log("SignalR 連線成功！");
    connected.value = true;
    connecting.value = false;
  } catch (err) {
    console.error("SignalR 連線失敗:", err);
    connecting.value = false;
  }
};

// 傳送訊息到後端
const sendMessage = async () => {
  if (!user.value || !message.value) return;

  try {
    await connection.invoke("SendMessage", user.value, message.value);
    message.value = "";
  } catch (err) {
    console.error("傳送訊息失敗:", err);
  }
};

// 格式化時間
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// 在元件掛載時連線 SignalR
onMounted(() => {
  setupSignalR();
});

// 在元件卸載時斷開 SignalR
onUnmounted(() => {
  connection.stop();
});
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>客戶服務</h2>
      <div v-if="connecting" class="status connecting">
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
      </div>
      <div v-else-if="connected" class="status connected">
        <span class="status-icon">✓</span> 已連線
      </div>
      <div v-else class="status disconnected">
        <span class="status-icon">!</span> 連線中斷
      </div>
    </div>

    <div class="messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">還沒有訊息！</div>

      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="[
          'message-bubble',
          msg.isOwnMessage ? 'own-message' : 'other-message',
        ]"
      >
        <div class="message-header">
          <strong>{{ msg.userName }}</strong>
          <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
        </div>
        <div class="message-content">{{ msg.userMessage }}</div>
      </div>
    </div>

    <div class="input-area">
      <input v-model="user" placeholder="輸入你的名稱" class="name-input" />
      <div class="message-input-container">
        <input
          v-model="message"
          placeholder="輸入訊息..."
          @keyup.enter="sendMessage"
          class="message-input"
          :disabled="!connected || !user"
        />
        <button
          @click="sendMessage"
          class="send-button"
          :disabled="!connected || !user || !message"
        >
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 450px;
  margin: auto;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 550px;
  background-color: #f9f9f9;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.status {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.status-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
  font-size: 12px;
}

.connected .status-icon {
  background-color: #4caf50;
}

.disconnected .status-icon {
  background-color: #f44336;
}

.connecting {
  display: flex;
  align-items: center;
}

@keyframes loadingDot {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.loading-dot {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: loadingDot 1.5s infinite ease-in-out;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.5s;
}

.loading-dot:nth-child(3) {
  animation-delay: 1s;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  color: #999;
  margin-top: 40%;
  font-style: italic;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 15px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  word-break: break-word;
}

.own-message {
  align-self: flex-end;
  background-color: #e1f5fe;
  border-bottom-right-radius: 5px;
}

.other-message {
  align-self: flex-start;
  background-color: #f0f2f5;
  border-bottom-left-radius: 5px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 13px;
}

.message-time {
  color: #999;
  font-size: 11px;
  margin-left: 8px;
}

.message-content {
  font-size: 15px;
  line-height: 1.4;
}

.input-area {
  padding: 15px;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  width: 100%;
}

.message-input-container {
  display: flex;
  gap: 8px;
}

.message-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
}

.send-button {
  background-color: #3a7bd5;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #2c6ac3;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

input:focus {
  outline: none;
  border-color: #3a7bd5;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>