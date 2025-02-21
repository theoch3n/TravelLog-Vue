<template>
    <!-- 按鈕觸發，目前沒用到 -->
    <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalDetails">
        詳細資料
    </button> -->

    <div class="modal fade" id="modalDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">行程ID + 行程名稱</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3" v-if="props.billWithDetails">
                        <strong>品項：</strong>{{ props.billWithDetails.title }}<br>
                        <strong>總金額：</strong>{{ props.billWithDetails.totalAmount }}<br>
                        <strong>墊款人：</strong>{{ props.billWithDetails.paidBy }}<br>
                        <strong>建立時間：</strong>{{ props.billWithDetails.createdAt }}
                    </div>
                    <div class="table-responsive rounded">
                        <table class="table table-bordered table-hover">
                            <thead class="table-light">
                                <tr class="text-center">
                                    <th>#</th>
                                    <th>ID</th>
                                    <th>BillId</th>
                                    <th>姓名</th>
                                    <th>金額</th>
                                    <th>已支付</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center" v-for="(item, index) in props.billWithDetails?.billDetails"
                                    :key="item.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.id }}</td>
                                    <td>{{ item.billId }}</td>
                                    <td>{{ item.memberName }}</td>
                                    <td>{{ item.amount }}</td>
                                    <td>
                                        <span v-if="item?.paid" class="text-success">✅</span>
                                        <span v-else class="text-danger">❌</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="backToList">回到列表</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                    <!-- <button class="btn btn-primary" data-bs-target="#modalBillList"
                        data-bs-toggle="modal">回到列表</button> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    billWithDetails: Object
    // bills: Array,
    // details: Array,
})

const backToList = () => {
    // 隱藏 Details Modal
    const detailsModalEl = document.getElementById('modalDetails')
    let detailsModal = bootstrap.Modal.getInstance(detailsModalEl)
    if (!detailsModal) {
        detailsModal = new bootstrap.Modal(detailsModalEl)
    }
    detailsModal.hide()

    // 顯示 List Modal
    const listModalEl = document.getElementById('modalBillList')
    let listModal = bootstrap.Modal.getInstance(listModalEl)
    if (!listModal) {
        listModal = new bootstrap.Modal(listModalEl)
    }
    listModal.show()
}

</script>

<style scoped></style>