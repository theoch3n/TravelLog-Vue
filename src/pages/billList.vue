<template>
    <div class="modal fade" id="modalBillList" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalBillListLabel"> {{ "ID = " + itineraryId }} , {{ "Title = " +
                        itineraryTitle }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr class="text-center">
                                <th>#</th>
                                <th>標題</th>
                                <th>代墊人</th>
                                <th>金額</th>
                                <th>創建日期</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="text-center" v-for="(bill, index) in bills" :key="bill.id"
                                @click="openDetails(bill.id)">
                                <td>{{ index + 1 }}</td>
                                <td>{{ bill.title }}</td>
                                <td>{{ bill.paidBy }}</td>
                                <td>{{ bill.totalAmount }}</td>
                                <td>{{ bill.createdAt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="createNewBill">新增項目</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>
    <bill :toggleModal="toggleModal"></bill>
    <BillDetails :billWithDetails="selectedItem" :toggleModal="toggleModal"></BillDetails>
</template>

<script setup>
import { ref, watch } from 'vue';
import BillDetails from './billDetails.vue';
import bill from './bill.vue';
import axios from "axios";

const props = defineProps({
    modelValue: Object, // 透過 v-model 傳遞選取的行程 ID
});

const dataList = ref([]);
const bills = ref([]);
const details = ref([]);
let itineraryId = ref();
let itineraryTitle = ref();

const getBillsData = async () => {
    itineraryId = props.modelValue.itineraryId
    itineraryTitle = props.modelValue.itineraryTitle
    try {
        const response = await axios.get(`https://localhost:7092/api/Bill/GetBillWithDetailsByItineraryId/${itineraryId}`);
        if (response.data) {
            dataList.value = response.data;
            bills.value = [];
            details.value = [];
            for (const item of response.data) {
                bills.value.push(item.bill);
                details.value.push(item.bill.billDetails);
            }
        } else {
            alert("發生錯誤");
        }
    } catch (error) {
        console.log("Error: ", error);
        alert("提交失敗!");
    }
};

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        getBillsData();
        toggleModal('modalBillList', 'show');
    }
});

const selectedItem = ref(null)
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

<style scoped></style>