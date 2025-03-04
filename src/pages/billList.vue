<template>
    <div class="modal fade" id="modalBillList" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-center">
                    <h5 class="modal-title w-100" id="modalBillListLabel"> {{ itineraryTitle }} </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm()"></button>
                </div>
                <div class="modal-body">
                    <!-- 篩選條件下拉選單 -->
                    <div class="d-flex flex-column">
                        <div class="mb-3 w-50 d-flex align-items-center">
                            <input type="text" id="Search" class="form-control me-1" placeholder="搜尋明細"
                                v-model="searchQuery">
                            <select class="form-select" id="filterSelect" v-model="selectedFilter">
                                <option value="all">全部</option>
                                <option value="paid">已結單</option>
                                <option value="unpaid">未結單</option>
                            </select>
                        </div>
                    </div>

                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr class="text-center">
                                <th>#</th>
                                <th>標題</th>
                                <th>代墊人</th>
                                <th>金額</th>
                                <th>幣別</th>
                                <th>創建日期</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="text-center pointer" :class="getBillStatusClass(bill)"
                                v-for="(bill, index) in filteredBills" :key="bill.id" @click="openDetails(bill.id)">
                                <td>{{ index + 1 }}</td>
                                <td v-html="highlight(bill.title)"></td>
                                <td v-html="highlight(bill.paidBy)"></td>
                                <td v-html="highlight(bill.totalAmount)"></td>
                                <td v-html="highlight(bill.currency)"></td>
                                <td v-html="highlight(bill.createdAt)"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="createNewBill()">新增項目</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        @click="resetForm()">關閉</button>
                </div>
            </div>
        </div>
    </div>
    <bill v-model="itineraryInfo" :toggleModal="toggleModal" @refreshData="getBillsData()"></bill>
    <BillDetails v-model="itineraryInfo" :billWithDetails="selectedItem" :toggleModal="toggleModal"
        @refreshData="getBillsData()"></BillDetails>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import BillDetails from './billDetails.vue';
import bill from './bill.vue';
import axios from "axios";

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

function highlight(text) {
    const query = (searchQuery.value || "").toLowerCase();
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.toString().replace(regex, '<span style="color: skyblue; font-weight: bold;">$1</span>');
}

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
            bill.currency?.toLowerCase().includes(query) ||
            bill.createdAt?.toString().includes(query) ||
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
        return isPaid ? 'table-default' : 'table-danger';
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
        //dataList.value = response.data;
        // console.log(JSON.stringify(dataList.value))
        //bills.value = [];
        //details.value = [];
        //for (const item of dataList.value) {
        //    bills.value.push(item.bill);
        //    details.value.push(item.bill.billDetails);
        //}
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
    resetForm();
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
.modal-content {
    height: 80%;
    overflow: hidden;
}

.modal-body {
    overflow-y: auto;
}
</style>