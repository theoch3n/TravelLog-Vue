<template>
    <div class="modal fade" id="modalBillList" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalBillListLabel"> {{ itineraryId }} , {{ itineraryTitle }}
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
    <bill></bill>
    <BillDetails :billWithDetails="selectedItem"></BillDetails>
    <div class="container d-flex justify-content-center">
        <a class="btn btn-primary" data-bs-toggle="modal" href="#modalBillList">開啟列表</a>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import BillDetails from './billDetails.vue';
import bill from './bill.vue';
import axios from "axios";

//測試區
const createNewBill = () => {
    // 隱藏 Bill List Modal
    const listModalEl = document.getElementById('modalBillList')
    let listModal = bootstrap.Modal.getInstance(listModalEl)
    if (!listModal) {
        listModal = new bootstrap.Modal(listModalEl)
    }
    listModal.hide()

    // 顯示 Bill Modal
    const billModalEl = document.getElementById('modalBill')
    let billModal = bootstrap.Modal.getInstance(billModalEl)
    if (!billModal) {
        billModal = new bootstrap.Modal(billModalEl)
    }
    billModal.show()
}

const props = defineProps({
    getParaId: Number, // 透過 v-model 傳遞選取的行程 ID
});

const dataList = ref([]);
const bills = ref([]);
const details = ref([]);
const itineraryId = ref("這邊放id");
const itineraryTitle = ref("這邊放標題");
const getBillsData = async () => {
    const id = props.getParaId
    try {
        const response = await axios.get(`https://localhost:7092/api/Bill/GetBillWithDetailsByItineraryId/${id}`);
        if (response.data) {
            dataList.value = response.data;
            bills.value = [];
            details.value = [];
            for (const item of response.data) {
                bills.value.push(item.bill);
                details.value.push(item.bill.billDetails);
            }
            console.log(bills.value)
            console.log(details.value)
        } else {
            alert("發生錯誤");
        }
    } catch (error) {
        console.log("Error: ", error);
        alert("提交失敗!");
    }
};

//

// 監聽 modelValue，當變更時顯示 Modal
const showModal = () => {
    const modalEl = document.getElementById("modalBillList");
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
};

watch(() => props.getParaId, (newValue) => {
    if (newValue && newValue != -1) {
        getBillsData();
        showModal();
    }
});

// modal觸發測試

const selectedItem = ref(null)

const openDetails = (BillId) => {
    const selectedBill = bills.value.find(item => item.id === BillId);
    if (!selectedBill) {
        alert("找不到該帳單");
        return;
    }

    selectedItem.value = selectedBill;

    // 隱藏 List Modal
    const listModalEl = document.getElementById('modalBillList')
    let listModal = bootstrap.Modal.getInstance(listModalEl)
    if (!listModal) {
        listModal = new bootstrap.Modal(listModalEl)
    }
    listModal.hide()

    // 顯示 Details Modal
    const detailsModalEl = document.getElementById('modalDetails')
    let detailsModal = bootstrap.Modal.getInstance(detailsModalEl)
    if (!detailsModal) {
        detailsModal = new bootstrap.Modal(detailsModalEl)
    }
    detailsModal.show()
}
// modal觸發測試

</script>

<style scoped></style>