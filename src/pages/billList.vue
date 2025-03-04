<template>
    <div class="bill-list-page-container">
        <!-- 背景輪播 -->
        <CarouselsCycle class="background-carousel" />
        
        <!-- 遮罩層 -->
        <div class="overlay-mask"></div>
        
        <div class="modal fade" id="modalBillList" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                <div class="modal-content custom-modal">
                    <div class="modal-header text-center">
                        <h5 class="modal-title w-100" id="modalBillListLabel"> {{ itineraryTitle }} </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm()"></button>
                    </div>
                    <div class="modal-body">
                        <!-- 篩選條件下拉選單 -->
                        <div class="d-flex flex-column">
                            <div class="mb-3 w-50 d-flex align-items-center">
                                <input type="text" id="Search" class="form-control custom-input me-1" placeholder="搜尋明細"
                                    v-model="searchQuery">
                                <select class="form-select custom-select" id="filterSelect" v-model="selectedFilter">
                                    <option value="all">全部</option>
                                    <option value="paid">已結單</option>
                                    <option value="unpaid">未結單</option>
                                </select>
                            </div>
                        </div>

                        <div class="table-responsive rounded">
                            <table class="table table-hover table-bordered custom-table">
                                <thead class="table-header">
                                    <tr class="text-center">
                                        <th>#</th>
                                        <th>標題</th>
                                        <th>代墊人</th>
                                        <th>金額</th>
                                        <th>創建日期</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-center pointer" :class="getBillStatusClass(bill)"
                                        v-for="(bill, index) in filteredBills" :key="bill.id" @click="openDetails(bill.id)">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ bill.title }}</td>
                                        <td>{{ bill.paidBy }}</td>
                                        <td>{{ bill.totalAmount }}</td>
                                        <td>{{ bill.createdAt }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn custom-btn" @click="createNewBill()">新增項目</button>
                        <button type="button" class="btn custom-btn-secondary" data-bs-dismiss="modal"
                            @click="resetForm()">關閉</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <bill v-model="itineraryInfo" :toggleModal="toggleModal" @refreshData="getBillsData()"></bill>
    <BillDetails v-model="itineraryInfo" :billWithDetails="selectedItem" :toggleModal="toggleModal"
        @refreshData="getBillsData()"></BillDetails>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import BillDetails from './billDetails.vue';
import bill from './bill.vue';
import axios from "axios";
import CarouselsCycle from "@/components/CarouselsCycle.vue"; // 引入輪播組件

// 添加頁面掛載和卸載時的樣式處理
onMounted(() => {
    document.body.classList.add('bill-list-page');
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
    document.body.classList.remove('bill-list-page');
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
    modelValue: Object,
});

const selectedItem = ref(null)
const selectedFilter = ref("all");
const searchBill = ref();
const dataList = ref([]);
const bills = ref([]);
const details = ref([]);
let itineraryInfo = ref();
let itineraryId = ref();
let itineraryTitle = ref();

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        itineraryInfo.value = {
            itinerary: newValue,
            groupInfo: { members: ["蘋果", "香蕉", "草莓", "西瓜"] }
        };
        getBillsData();
        toggleModal('modalBillList', 'show');
    }
});

const resetForm = () => {
    selectedFilter.value = 'all';
    searchQuery.value = '';
}
const searchQuery = ref();
const filteredBills = computed(() => {
    return bills.value.filter(bill => {
        let isValid = true;

        const query = (searchQuery.value || "").toLowerCase();
        if (searchQuery.value && !(
            bill.title?.toLowerCase().includes(query) ||
            bill.totalAmount?.toString().includes(query) ||
            bill.paidBy?.toLowerCase().includes(query))) {
            isValid = false;
        }

        if (selectedFilter.value === 'paid' && bill.billDetails.some(detail => detail.paid === false)) {
            isValid = false;
        } else if (selectedFilter.value === 'unpaid' && bill.billDetails.every(detail => detail.paid === true)) {
            isValid = false;
        }
        return isValid;
    });
});

const getBillStatusClass = (bill) => {
    if (selectedFilter.value === 'all') {
        const isPaid = bill.billDetails.every(detail => detail.paid === true);
        return isPaid ? 'table-success' : 'table-warning';
    }
    return '';
};

const getBillsData = async () => {
    itineraryId = props.modelValue.itineraryId
    itineraryTitle = props.modelValue.itineraryTitle
    try {
        bills.value = [];
        details.value = [];
        const response = await axios.get(`https://localhost:7092/api/Bill/GetBillWithDetailsByItineraryId/${itineraryId}`);
        if (response.data) {
            dataList.value = response.data;
            bills.value = dataList.value.map(item => ({
                ...item.bill,
                billDetails: item.bill.billDetails || []  // 確保每個帳單都有 billDetails
            }));
        } else {
            alert("發生錯誤");
        }
    } catch (error) {
        console.log("Error: ", error);
        alert("提交失敗!");
    }
};

const openDetails = (BillId) => {
    const selectedBill = bills.value.find(item => item.id === BillId);
    if (!selectedBill) {
        alert("找不到該帳單");
        return;
    }
    selectedItem.value = selectedBill;
    toggleModal('modalBillList', 'hide');
    toggleModal('modalDetails', 'show');
}

const createNewBill = () => {
    toggleModal('modalBillList', 'hide');
    toggleModal('modalBill', 'show');
}

const toggleModal = (modalId, action) => {
    const modalEl = document.getElementById(modalId);
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    if (action === 'show') {
        modal.show();
    } else if (action === 'hide') {
        modal.hide();
    }
};
</script>

<style scoped>
.bill-list-page-container {
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
  height: 80%;
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
  overflow-y: auto;
}

.custom-input {
  border-radius: 8px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
  padding: 10px 15px;
}

.custom-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.custom-select {
  border-radius: 8px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.custom-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
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

.table-success {
  background-color: rgba(16, 185, 129, 0.1) !important;
}

.table-warning {
  background-color: rgba(245, 158, 11, 0.1) !important;
}

.pointer {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pointer:hover {
  background-color: rgba(79, 70, 229, 0.05);
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
  .custom-modal {
    height: 90%;
  }
}
</style>

<style>
/* 全局樣式 */
body.bill-list-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

body.bill-list-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.bill-list-page .header-container {
  background: transparent !important;
}

body.bill-list-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  body.bill-list-page .desktop-header,
  body.bill-list-page footer.footer-container {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }
}
</style>