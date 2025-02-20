<template>
    <div class="modal fade" id="modalBillList" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalBillListLabel">行程ID + 行程名稱</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr class="text-center">
                                <th>ID</th>
                                <th>項目名稱</th>
                                <th>價格</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="text-center" v-for="item in dataList" :key="item.id" @click="openDetails(item)">
                                <td>{{ item.id }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.price }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">新增項目</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>
    <BillDetails></BillDetails>
    <div class="container d-flex justify-content-center">
        <a class="btn btn-primary" data-bs-toggle="modal" href="#modalBillList">開啟列表</a>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import BillDetails from './billDetails.vue';
import axios from "axios";

//測試區
const props = defineProps({
    getParaId: Number, // 透過 v-model 傳遞選取的行程 ID
});
const dataFromDB = ref();
const getBillsData = async () => {
    const id = props.getParaId
    try {
        const response = await axios.get(`https://localhost:7092/api/Bill/GetBillWithDetailsByItineraryId/${id}`);
        if (response.data) {
            dataFromDB.value = response.data;
            // alert(JSON.stringify(dataFromDB.value));
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
        //showModal();
    }
});
//

const dataList = ref([
    { id: 1, name: '商品 A', price: 100 },
    { id: 2, name: '商品 B', price: 200 },
    { id: 3, name: '商品 C', price: 300 }
]);

// modal觸發測試

const selectedItem = ref(null)

const openDetails = (item) => {
    selectedItem.value = item

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