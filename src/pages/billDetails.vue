<template>
    <div class="bill-details-page-container">
        <!-- 背景輪播 -->
        <CarouselsCycle class="background-carousel" />
        
        <!-- 遮罩層 -->
        <div class="overlay-mask"></div>
        
        <div class="modal fade" id="modalDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content custom-modal">
                    <div class="modal-header text-center">
                        <h5 class="modal-title w-100" id="staticBackdropLabel"> {{ itinerary.itineraryTitle }} </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="bill-info mb-4" v-if="datas">
                            <div class="info-card">
                                <div class="info-item">
                                    <span class="info-label">品項：</span>
                                    <span class="info-value">{{ datas.title }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">總金額：</span>
                                    <span class="info-value">{{ datas.totalAmount }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">付款人：</span>
                                    <span class="info-value">{{ datas.paidBy }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">建立時間：</span>
                                    <span class="info-value">{{ datas.createdAt }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive rounded">
                            <table class="table table-bordered table-hover custom-table">
                                <thead class="table-header">
                                    <tr class="text-center">
                                        <th>#</th>
                                        <th>姓名</th>
                                        <th>金額</th>
                                        <th>已支付</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-center pointer" v-for="(data, index) in datas?.billDetails"
                                        @click="paidStatusUpdate(data)" :key="data.id">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ data.memberName }}</td>
                                        <td>{{ data.amount }}</td>
                                        <td>
                                            <span v-if="data?.paid" class="paid-status">✅</span>
                                            <span v-else class="unpaid-status">❌</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn custom-btn" @click="backToList()">回到列表</button>
                        <button type="button" class="btn custom-btn-secondary" data-bs-dismiss="modal">關閉</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, onBeforeUnmount } from 'vue';
import CarouselsCycle from "@/components/CarouselsCycle.vue"; // 引入輪播組件

// 添加頁面掛載和卸載時的樣式處理
onMounted(() => {
    document.body.classList.add('bill-details-page');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    
    // 獲取header和footer元素
    const header = document.querySelector('.desktop-header');
    const footer = document.querySelector('footer.footer-container');
    
    // 添加透明背景
    if (header) header.style.backgroundColor = 'transparent';
    if (footer) footer.style.backgroundColor = 'transparent';
});

onBeforeUnmount(() => {
    document.body.classList.remove('bill-details-page');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    
    // 獲取header和footer元素
    const header = document.querySelector('.desktop-header');
    const footer = document.querySelector('footer.footer-container');
    
    // 恢復原來的背景
    if (header) header.style.backgroundColor = '';
    if (footer) footer.style.backgroundColor = '';
});

const props = defineProps({
    billWithDetails: {
        Type: Object,
        required: true
    },
    toggleModal: {
        Type: Function,
        required: true
    },
    modelValue: Object
})
const baseAddress = "https://localhost:7092";
const datas = computed(() => props.billWithDetails)
const itinerary = computed(() => props.modelValue?.itinerary || "");
const groupInfo = computed(() => props.groupInfo);
const paidStatusUpdate = async (item) => {
    if (item.paid) {
        alert("已付款的項目不可修改")
        return
    }

    var Confirmed = confirm("確定要將 " + item.memberName + " 的付款狀態修改為已支付嗎?");
    if (!Confirmed) {
        alert("操作已取消")
        return;
    }

    const response = await axios.post(`${baseAddress}/api/Bill/updatePaidStatus/${item.id}`)
    if (response.data) {
        item.paid = true;
        emit('refreshData');
        alert("狀態修改成功!")
    }
}
const emit = defineEmits(['refreshData'])
const backToList = () => {
    props.toggleModal('modalDetails', 'hide')
    props.toggleModal('modalBillList', 'show')
}
</script>

<style scoped>
.bill-details-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

.background-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
  z-index: 4;
  pointer-events: none;
}

.custom-modal {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: none;
  animation: fadeIn 0.5s ease-out;
}

.modal-header {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-bottom: none;
}

.modal-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.modal-body {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
}

.bill-info {
  margin-bottom: 20px;
}

.info-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 15px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: #4f46e5;
  margin-right: 8px;
}

.info-value {
  color: #333;
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.table-header {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white;
}

.pointer {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pointer:hover {
  background-color: rgba(79, 70, 229, 0.05);
}

.paid-status {
  color: #10b981;
  font-size: 1.2rem;
}

.unpaid-status {
  color: #ef4444;
  font-size: 1.2rem;
}

.custom-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 8px 24px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4) !important;
  border: none;
}

.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5) !important;
}

.custom-btn-secondary {
  background: linear-gradient(135deg, #6366f1, #818cf8) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 8px 24px !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
  border: none;
}

.custom-btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .info-card {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 全局樣式 */
body.bill-details-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

body.bill-details-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.bill-details-page .header-container {
  background: transparent !important;
}

body.bill-details-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  body.bill-details-page .desktop-header,
  body.bill-details-page footer.footer-container {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }
}
</style>