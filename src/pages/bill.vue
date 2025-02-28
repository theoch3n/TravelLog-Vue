<template>
    <div class="modal fade" id="modalBill" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-center">
                    <h5 class="modal-title w-100 ms-5" id="modalBillLabel"> {{ itinerary.itineraryTitle }} </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" @click="clearForm()"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex my-3">
                        <div class="form-group w-100 me-3 text-center">
                            <label class="form-label">品項</label>
                            <input type="text" class="form-control w-100 text-center" v-model="Title">
                        </div>
                        <div class="form-group w-100 text-center">
                            <label class="form-label">價格</label>
                            <input type="number" class="form-control w-100 text-center" v-model.number="totalPrice"
                                @click="selectAllText" @input="handleTotalPrice()"
                                @keydown="handleTotalPriceInput($event)">
                        </div>
                    </div>

                    <div class="container">
                        <table class="table table-bordered  table-hover">
                            <thead class="table-light">
                                <tr class="text-center">
                                    <th class="w-25">姓名</th>
                                    <th class="w-25">比例(%)</th>
                                    <th class="w-25">金額</th>
                                    <th class="col-1">已付</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(p, index) in insideData" :key="p.id">
                                    <td class="ps-4">
                                        <select class="form-select text-center" disabled>
                                            <option v-for="(option, optIndex) in members" :key="optIndex"
                                                :value="option" :selected="optIndex === index">
                                                {{ option }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <input class="form-control text-center" type="number"
                                            v-model.number="p.percentage" @input="updateValue(index, 'percentage')"
                                            @keydown="handleKeydown(index, $event, 'percentage')"
                                            @click="selectAllText($event)" :class="{ 'border-info': p.manual }">
                                    </td>
                                    <td>
                                        <input class="form-control text-center" type="number" v-model.number="p.price"
                                            @input="updateValue(index, 'price')"
                                            @keydown="handleKeydown(index, $event, 'price')"
                                            @click="selectAllText($event)" :class="{ 'border-info': p.manual }">
                                    </td>
                                    <th class="align-bottom">
                                        <div class="form-check">
                                            <input class="form-check-input m-0 me-2" style="transform: scale(1.5)"
                                                type="checkbox" id="flexCheckDefault" v-model="p.paid"
                                                :disabled="members[index] === PaidBy || p.price == 0">
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer justify-content-between">
                    <div class="form-group d-flex">
                        <input type="text" class="form-control text-center w-25 me-1" v-model="keyword"
                            placeholder="搜尋">
                        <select class="form-select text-center w-50" v-model="selectedCurrency">
                            <option value="" disabled>選擇幣別</option>
                            <option v-for="(rate, currency) in filteredRates" :key="currency" :value="rate">
                                {{ currency }} -
                                {{ rate }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <select class="form-select text-center" v-model="PaidBy">
                            <option value="" disabled>選擇付款人</option>
                            <option v-for="(option, optIndex) in members" :key="optIndex" :value="option"
                                :disabled="totalPrice == 0">
                                {{ option }}
                            </option>
                        </select>
                    </div>
                    <div class="btn-group">
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="avg"
                            autocomplete="off" v-model="selectedOption" @change="selectionChange()">
                        <label class="btn btn-outline-primary" for="btnradio1">平分</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" value="custom"
                            autocomplete="off" v-model="selectedOption" @change="selectionChange()">
                        <label class="btn btn-outline-primary" for="btnradio3">自訂</label>
                    </div>
                    <div>
                        <button type="button" class="btn btn-primary text-light me-2" @click="saveData()">儲存</button>
                        <button type="button" class="btn btn-secondary text-light" @click="backToList()">返回</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import axios from 'axios';

onMounted(() => {
    // 匯率api次數快用完了，省點
    // getExchangeRates();
});

let isUpdating = false;
let savePaidByData;
let ExchangeRates = ref();
let rates = ref();

const selectedOption = ref('avg');
const insideData = reactive([]);
const totalPrice = ref(0);
const baseAddress = "https://localhost:7092";
const Title = ref("");
const PaidBy = ref("");
const keyword = ref('');
const selectedCurrency = ref('');

const props = defineProps({
    toggleModal: {
        Type: Function,
        required: true
    },
    modelValue: Object
})

const emit = defineEmits(['refreshData']);

const itinerary = computed(() => props.modelValue?.itinerary || "")
const members = computed(() => props.modelValue?.groupInfo?.members || []);

const backToList = () => {
    props.toggleModal('modalBill', 'hide')
    props.toggleModal('modalBillList', 'show')
    clearForm();
}

const filteredRates = computed(() => {
    if (!keyword.value) {
        return rates.value;
    }
    return Object.fromEntries(
        Object.entries(rates.value).filter(([currency]) => currency.includes(keyword.value.toUpperCase()))
    );
});

const getExchangeRates = async () => {
    const ExchangeRatesApiKey = "3bbb6fbca51af86d327efec8";
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${ExchangeRatesApiKey}/latest/TWD`);
    ExchangeRates.value = response.data;
    rates.value = ExchangeRates.value.conversion_rates;
}

const generateBill = () => {
    return {
        ItineraryId: itinerary.value.itineraryId,
        ItineraryName: itinerary.value.itineraryTitle,
        Title: Title.value,
        TotalAmount: totalPrice.value,
        PaidBy: PaidBy.value,
        CreatedAt: new Date(),
    };
};

const generateBillDetails = () => {
    return insideData.map((item, index) => ({
        // BillId: 0,
        MemberName: members.value[index],
        Amount: item.price,
        Paid: item.paid
    }));
};

const validateForm = () => {
    const errors = {
        totalPrice: totalPrice.value <= 0 ? "總價格應大於0" : "",
        PaidBy: PaidBy.value === "" ? "付款人不能為空" : "",
        Title: Title.value === "" ? "標題不能為空" : "",
    };

    const hasErrors = Object.values(errors).some(error => error !== "");
    return hasErrors ? errors : true;
}

const saveData = async () => {
    const validation = validateForm();
    if (validation === true) {
        const billDto = {
            bill: generateBill(),
            details: generateBillDetails()
        };
        console.log(billDto);
        try {
            const response = await axios.post(`${baseAddress}/api/Bill/AddBillWithDetails`, billDto);
            if (response.data.success) {
                emit('refreshData');
                alert("資料創建成功!");
                clearForm();
                backToList();
            } else {
                alert("資料創建失敗!");
            }
        } catch (error) {
            console.log("Error: ", error);
            alert("提交失敗!");
        }
    } else {
        const errorMessage = Object.values(validation).filter(Boolean).join("\n");
        alert(`表單驗證失敗，請檢查以下內容:\n\n${errorMessage}`);
        console.log("Validation errors: ", validation);
    }
};

const clearForm = () => {
    Title.value = "";
    totalPrice.value = "";
    PaidBy.value = "";
    insideData.forEach(item => {
        item.paid = false;
    });
    selectedOption.value = 'avg';
    selectionChange();
}

const selectAllText = (event) => {
    event.target.select();
};

const getMaxValue = (index, type) => {
    const manualSum = insideData.reduce((sum, item, i) => {
        if (i !== index && item.manual && item[type] != null) {
            return sum + Number(item[type]);
        }
        return sum;
    }, 0);

    const maxValue = type === 'percentage' ? 100 : totalPrice.value;
    return Math.max(0, maxValue - manualSum);
};

const checkRange = (index, type) => {
    selectedOption.value = 'custom';
    const maxValue = getMaxValue(index, type)
    if (insideData[index][type] <= 0) {
        insideData[index][type] = 0;
    } else if (insideData[index][type] >= maxValue) {
        insideData[index][type] = maxValue;
    }
};

const updateValue = (index, type) => {
    const item = insideData[index];
    item.manual = true;
    checkRange(index, type);

    if (totalPrice.value && item[type] != null) {
        if (type === 'percentage') {
            item.exactPrice = ((totalPrice.value * item.percentage) / 100);
            item.price = parseFloat(item.exactPrice.toFixed(2));
        } else if (type === 'price') {
            item.exactPercentage = ((item.price / totalPrice.value) * 100);
            item.percentage = parseFloat(item.exactPercentage.toFixed(2));
        }
    }
};

const selectionChange = () => {
    insideData.forEach(item => {
        if (selectedOption.value === 'avg') {
            item.manual = false;
            item.price = totalPrice.value ? (totalPrice.value * item.percentage) / 100 : 0;
        }
    })
}

const handleKeydown = (index, event, type) => {
    if (!insideData[index].manual) {
        insideData[index].manual = true;
    }
    if (insideData[index][type] == 0) {
        if (event.key == '0') {
            insideData[index][type] = 0;
            event.preventDefault();
        }
    }
}

const handleTotalPriceInput = (event) => {
    if (totalPrice.value == 0) {
        if (event.key == 0) {
            totalPrice.value = 0;
            event.preventDefault();
        }
    }
}

const handleTotalPrice = () => {
    insideData.forEach((item) => {
        item.exactPrice = totalPrice.value ? (totalPrice.value * item.exactPercentage) / 100 : 0;
        item.price = item.exactPrice.toFixed(2);
    });
}

watch(PaidBy, (newVal, oldVal) => {

    if (oldVal) {
        insideData.forEach((p, index) => {
            if (members.value[index] === oldVal) {
                p.paid = savePaidByData;
            }
        });
    }

    if (newVal) {
        insideData.forEach((p, index) => {
            if (members.value[index] === newVal) {
                savePaidByData = p.paid;
                p.paid = true;
            }
        });
    }
});

watch(() => props.modelValue?.groupInfo?.members, (newMembers) => {
    if (!newMembers?.length) return;
    insideData.splice(0, insideData.length, ...newMembers.map(() => ({
        exactPercentage: null,
        exactPrice: null,
        percentage: null,
        price: null,
        manual: false,
        paid: false,
    })));
}, { deep: true, immediate: true });

watch(
    [insideData, totalPrice],
    ([newInsideData, newTotalPrice]) => {
        newInsideData.forEach((item) => {
            if (item.percentage === '') {
                item.percentage = 0;
            }
            if (item.price === '') {
                item.price = 0;
            }
        });

        if (newTotalPrice <= 0 || newTotalPrice === '') {
            totalPrice.value = 0;
            PaidBy.value = '';
            selectedOption.value = 'avg';
            selectionChange();
        }
    },
    { deep: true }
);

watch(
    [insideData, totalPrice],
    () => {
        if (isUpdating) {
            return;
        }
        isUpdating = true;

        const manualSum = insideData.reduce((sum, item) => {
            return sum + (item.manual && item.percentage != null ? Number(item.percentage) : 0);
        }, 0);

        const autoFields = insideData.filter(item => !item.manual);
        const autoCount = autoFields.length;
        const remaining = 100 - manualSum;

        if (autoCount > 0) {
            const autoValue = remaining / autoCount;
            insideData.forEach(item => {
                if (!item.manual) {
                    item.exactPercentage = autoValue;
                    item.percentage = parseFloat(autoValue.toFixed(2));
                }
            });
        }

        insideData.forEach((item, index) => {

            if (item.price == 0 && PaidBy.value != members.value[index]) {
                item.paid = false;
            }

            if (!item.manual) {
                item.exactPrice = totalPrice.value ? (totalPrice.value * item.exactPercentage) / 100 : 0;
                item.price = parseFloat(item.exactPrice.toFixed(2));
            }
        });
        isUpdating = false;
    },
    { deep: true }
);

</script>

<style scoped></style>