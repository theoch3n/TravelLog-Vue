<template>
    <div class="modal fade" id="modalDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-center">
                    <h5 class="modal-title w-100" id="staticBackdropLabel">
                        {{ "id = " + itinerary.itineraryId }}, {{ "title" + itinerary.itineraryTitle }} </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3" v-if="datas">
                        <strong>品項：</strong>{{ datas.title }}<br>
                        <strong>總金額：</strong>{{ datas.totalAmount }}<br>
                        <strong>墊款人：</strong>{{ datas.paidBy }}<br>
                        <strong>建立時間：</strong>{{ datas.createdAt }}
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
                                <tr class="text-center" v-for="(data, index) in datas?.billDetails" :key="data.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ data.id }}</td>
                                    <td>{{ data.billId }}</td>
                                    <td>{{ data.memberName }}</td>
                                    <td>{{ data.amount }}</td>
                                    <td>
                                        <span v-if="data?.paid" class="text-success">✅</span>
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
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';

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

const datas = computed(() => props.billWithDetails)
const itinerary = computed(() => props.modelValue?.itinerary || "");
const groupInfo = computed(() => props.groupInfo);

const backToList = () => {
    props.toggleModal('modalDetails', 'hide')
    props.toggleModal('modalBillList', 'show')
}

</script>

<style scoped></style>