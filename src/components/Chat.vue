

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as signalR from "@microsoft/signalr";

// SignalR 伺服器地址（需與後端的 Hub 路由一致）
const hubUrl = "https://localhost:7092/chatHub"; // 你的後端 SignalR 地址
const connection = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl)
  .withAutomaticReconnect() // 自動重新連線
  .configureLogging(signalR.LogLevel.Information)
  .build();

// 聊天資料
const messages = ref([]);
const user = ref(""); // 用戶名
const message = ref(""); // 訊息內容
const connected = ref(false); // 連線狀態

// 監聽 SignalR 來的訊息
const setupSignalR = async () => {
  connection.on("ReceiveMessage", (userName, userMessage) => {
    messages.value.push({ userName, userMessage });
  });

  try {
    await connection.start();
    console.log("SignalR 連線成功！");
    connected.value = true;
  } catch (err) {
    console.error("SignalR 連線失敗:", err);
  }
};

// 傳送訊息到後端
const sendMessage = async () => {
  if (!user.value || !message.value) return;

  try {
    await connection.invoke("SendMessage", user.value, message.value);
    message.value = ""; // 清空輸入框
  } catch (err) {
    console.error("傳送訊息失敗:", err);
  }
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
    <h2>聊天室</h2>

    <div v-if="!connected" class="status">連線中...</div>
    <div v-else class="status">✅ 已連線</div>

    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index">
        <strong>{{ msg.userName }}:</strong> {{ msg.userMessage }}
      </div>
    </div>

    <div class="input-area">
      <input v-model="user" placeholder="輸入你的名稱" />
      <input
        v-model="message"
        placeholder="輸入訊息..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">發送</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}
.input-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
input {
  flex: 1;
  padding: 8px;
}
button {
  padding: 8px 12px;
  cursor: pointer;
}
.status {
  margin-bottom: 10px;
  color: green;
}
</style>

