<template>
    <div class="modal fade" id="modalDetails" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-center">
                    <h5 class="modal-title w-100" id="staticBackdropLabel"> {{ itinerary.itineraryTitle }} </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" @click="clearForm()"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3" v-if="datas">
                        <strong>品項：</strong>{{ datas.title }}<br>
                        <strong>總金額：</strong>{{ datas.totalAmount }}<br>
                        <strong>幣別：</strong>{{ datas.currency }}<br>
                        <strong>付款人：</strong>{{ datas.paidBy }}<br>
                        <strong>建立時間：</strong>{{ datas.createdAt }}
                    </div>
                    <div class="table-responsive rounded">
                        <table class="table table-bordered table-hover">
                            <thead class="table-light">
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
                                        <span v-if="data?.paid" class="text-success">✅</span>
                                        <span v-else class="text-danger">❌</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <div class="form-group d-flex">
                        <input type="text" class="form-control text-center w-25 me-1" v-model="keyword"
                            placeholder="搜尋">
                        <select class="form-select text-center w-50" v-model="selectedCurrency">
                            <option value="" disabled>選擇幣別</option>
                            <option v-for="(rate, currency) in filteredRates" :key="currency" :value="currency">
                                {{ currency }} - {{ rate }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <button class="btn btn-primary me-1" @click="backToList()">回到列表</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="clearForm()">關閉</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { computed, ref, onMounted, watch } from 'vue';

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
const selectedCurrency = ref("");
const baseAddress = "https://localhost:7092";
const datas = computed(() => props.billWithDetails)
const itinerary = computed(() => props.modelValue?.itinerary || "");
const groupInfo = computed(() => props.groupInfo);
const clearForm = () => {
    selectedCurrency.value = "";
    keyword.value = "";
    if (originalData.value) {
        datas.value.totalAmount = originalData.value.totalAmount;
        datas.value.billDetails.forEach((item, index) => {
            item.amount = originalData.value.billDetails[index].amount;
        });
    }
};
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
    clearForm()
    props.toggleModal('modalDetails', 'hide')
    props.toggleModal('modalBillList', 'show')
}


let ExchangeRates = ref();
let rates = ref();
const keyword = ref();
const getExchangeRates = async () => {
    if (!datas.value?.currency) return;

    try {
        const ExchangeRatesApiKey = "3bbb6fbca51af86d327efec8";
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${ExchangeRatesApiKey}/latest/${datas.value.currency}`);
        ExchangeRates.value = response.data;
        rates.value = ExchangeRates.value.conversion_rates;
    } catch (error) {
        console.error("獲取匯率失敗:", error);
    }
};

const filteredRates = computed(() => {
    if (!keyword.value) {
        return rates.value;
    }
    return Object.fromEntries(
        Object.entries(rates.value).filter(([currency]) => currency.includes(keyword.value.toUpperCase()))
    );
});
let originalData = ref(null);

watch(() => datas.value?.currency, async (newCurrency) => {
    if (newCurrency) {
        // await getExchangeRates();
        originalData.value = JSON.parse(JSON.stringify(datas.value));
    }
});

watch(selectedCurrency, (newVal) => {
    if (newVal && rates.value[newVal] && originalData.value) {
        const rate = rates.value[newVal];
        datas.value.totalAmount = (originalData.value.totalAmount * rate).toFixed(2);
        datas.value.billDetails.forEach((item, index) => {
            item.amount = (originalData.value.billDetails[index].amount * rate).toFixed(2);
        });
    }
});

</script>

<style scoped></style>