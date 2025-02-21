<template>
    <div class="modal fade" id="modalBill" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-center">
                    <h5 class="modal-title w-100 ms-5" id="modalBillLabel">
                        {{ "行程名: " + ItineraryName + " 行程ID: " + ItineraryId }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
                                @click="selectAllText" @input="handleTotalPrice"
                                @keydown="handleTotalPriceInput($event)">
                        </div>
                    </div>

                    <div class="container border rounded-1">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr class="text-center">
                                    <th class="w-25 pe-5">姓名</th>
                                    <th class="w-25 pe-5">比例(%)</th>
                                    <th class="w-25 pe-5">金額</th>
                                    <th class="pe-4" style="width:1%">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(p, index) in insideData" :key="index">
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
                                            @click="selectAllText($event)" :class="{ 'border-danger': p.manual }">
                                    </td>
                                    <td>
                                        <input class="form-control text-center" type="number" v-model.number="p.price"
                                            @input="updateValue(index, 'price')"
                                            @keydown="handleKeydown(index, $event, 'price')"
                                            @click="selectAllText($event)" :class="{ 'border-danger': p.manual }">
                                    </td>
                                    <th class="align-middle">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="flexCheckDefault"
                                                v-model="insideData[index].paid">
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
                            <option value="" disabled>選擇墊款人</option>
                            <option v-for="(option, optIndex) in members" :key="optIndex" :value="option">
                                {{ option }}
                            </option>
                        </select>
                    </div>

                    <!-- radio button -->
                    <div class="btn-group">
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="avg"
                            autocomplete="off" v-model="selectedOption" @change="selectionChange">
                        <label class="btn btn-outline-primary" for="btnradio1">平分</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" value="custom"
                            autocomplete="off" v-model="selectedOption" @change="selectionChange">
                        <label class="btn btn-outline-primary" for="btnradio3">自訂</label>
                    </div>
                    <!-- radio button -->
                    <div>
                        <button type="button" class="btn btn-primary text-light me-2" @click="getData">儲存</button>
                        <button type="button" class="btn btn-secondary text-light" @click="backToList">返回</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import axios from 'axios';

let isUpdating = false;
const selectedOption = ref('avg');
const insideData = reactive([]);
const totalPrice = ref(0);
const members = [
    "蘋果",
    "香蕉",
    "草莓",
    "西瓜",
];

const backToList = () => {
    // 隱藏 Details Modal
    const detailsModalEl = document.getElementById('modalBill')
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

onMounted(() => {
    getExchangeRates();

    members.forEach(() => {
        insideData.push({
            exactPercentage: null,
            exactPrice: null,
            percentage: null,
            price: null,
            manual: false,
            Paid: false,
        });
    });
});
// mark
const keyword = ref('');
const filteredRates = computed(() => {
    if (!keyword.value) {
        return rates.value;
    }
    return Object.fromEntries(
        Object.entries(rates.value).filter(([currency]) => currency.includes(keyword.value.toUpperCase()))
    );
});
// 
//匯率api測試
let ExchangeRates = ref();
let rates = ref();
const selectedCurrency = ref('');
const getExchangeRates = async () => {
    // 後端自己叫的期交所api，現在用另一個
    // const response = await axios.get(`${baseAddress}/api/ExchangeRates`)
    const ExchangeRatesApiKey = "3bbb6fbca51af86d327efec8";
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${ExchangeRatesApiKey}/latest/TWD`);
    ExchangeRates.value = response.data;
    rates.value = ExchangeRates.value.conversion_rates;
    // console.log("=================");
    // console.log(rates.value)
}
//

// 非同步 測試區域
const baseAddress = "https://localhost:7092";
const ItineraryId = ref(1);
const ItineraryName = ref("測試用行程名稱");
const Title = ref("測試品項");
const PaidBy = ref("");

const generateBill = () => {
    return {
        ItineraryId: ItineraryId.value,
        ItineraryName: ItineraryName.value,
        Title: Title.value,
        TotalAmount: totalPrice.value,
        PaidBy: PaidBy.value,
        CreatedAt: new Date(),
    };
};

const generateBillDetails = () => {
    return insideData.map((item, index) => ({
        BillId: 1,
        MemberName: members[index],
        Amount: item.price,
        Paid: item.paid
    }));
};

const getData = async () => {
    const billDto = {
        bill: generateBill(),
        details: generateBillDetails()
    };
    console.log(JSON.stringify(billDto));

    try {
        const response = await axios.post(`${baseAddress}/api/Bill/AddBillWithDetails`, billDto);
        if (response.data.success) {
            alert("資料創建成功!");
        } else {
            alert("資料創建失敗!");
        }
    } catch (error) {
        console.log("Error: ", error);
        alert("提交失敗!");
    }
};
// 非同步 測試區域

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
        // if (type === 'percentage') {
        //     item.price = ((totalPrice.value * item.percentage) / 100);
        // } else if (type === 'price') {
        //     item.percentage = ((item.price / totalPrice.value) * 100);
        // }
        //----------------  
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

        insideData.forEach(item => {
            if (!item.manual) {
                item.exactPrice = totalPrice.value ? (totalPrice.value * item.exactPercentage) / 100 : 0;
                item.price = parseFloat(item.exactPrice.toFixed(2));
                // item.percentage = parseFloat(item.exactPercentage.toFixed(2));
            }
        });
        isUpdating = false;
    },
    { deep: true }
);

</script>

<style scoped></style>
