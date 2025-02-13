<template>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary my-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        你是一顆土豆
    </button>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">
                        {{ thisTestTitle }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex my-3">
                        <div class="form-group w-100 me-3">
                            <label class="form-label">品項</label>
                            <input type="text" class="form-control w-100">
                        </div>
                        <div class="form-group w-100">
                            <label class="form-label">價格</label>
                            <input type="number" class="form-control w-100" v-model="totalPrice">
                        </div>
                    </div>

                    <div class="container border rounded-1">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th class="w-25">姓名</th>
                                    <th class="w-25">比例(%)</th>
                                    <th class="w-25">金額</th>
                                    <th style="width:1%">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(p, index) in insideData" :key="index">
                                    <td>
                                        <select class="form-select text-center" disabled>
                                            <option v-for="(option, optIndex) in members" :key="optIndex"
                                                :value="option" :selected="optIndex === index">
                                                {{ option }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <input class="form-control text-center" type="number"
                                            v-model.number="p.percentage" @input="updatePriceFromPercentage(index)"
                                            @keydown="handleKeydown(index, $event)">
                                    </td>
                                    <td>
                                        <input class="form-control text-center" type="number" v-model.number="p.price"
                                            @input="updatePercentageFromPrice(index)">
                                    </td>
                                    <th class="align-middle">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value=""
                                                id="flexCheckDefault">
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <!-- radio button -->
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" value="avg"
                            autocomplete="off" v-model="selectedOption" @change="selectionChange">
                        <label class="btn btn-outline-primary" for="btnradio1">平分</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" value="custom"
                            autocomplete="off" v-model="selectedOption" @change="selectionChange">
                        <label class="btn btn-outline-primary" for="btnradio3">自訂</label>
                    </div>
                    <!-- radio button -->
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="getData">你要確</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import axios from 'axios';
let isUpdating = false;
const totalPrice = ref();
const members = [
    "蘋果",
    "香蕉",
    "草莓",
    // "蜘蛛"
];

const insideData = reactive([]);
onMounted(() => {
    members.forEach(() => {
        insideData.push({
            percentage: null,
            price: null,
            manual: false
        });
    });
});
// 非同步 測試區域
const baseAddress = "https://localhost:7092";
const thisTestTitle = "標題:這邊用行程名稱";
const bill = ref({
    Title: "標題測試",
    TotalAmount: 2000,
    PaidBy: "測試1",
    CreatedAt: new Date(),
});

const billDetails = ref([
    { BillId: 1, MemberName: "測試1", Amount: 1000, Paid: true },
    { BillId: 1, MemberName: "測試2", Amount: 2000, Paid: false },
    { BillId: 1, MemberName: "測試3", Amount: 3000, Paid: false },
]);

const getData = async () => {
    const billDto = {
        bill: { ...bill.value }, // 拷貝資料
        details: [...billDetails.value] // 拷貝資料
    };

    try {
        const response = await axios.post(`${baseAddress}/api/Bill/AddBillWithDetails`, billDto);
        if (response.data.success) {
            alert("Test Bill created successfully!");
        } else {
            alert("Failed to create bill.");
        }
    } catch (error) {
        console.log("Error submitting test bill:", error);
        alert("An error occurred while submitting the bill.");
    }
};
// 非同步 測試區域



const getMaxPercentage = (index) => {
    const manualSum = insideData.reduce((sum, item, i) => {
        return sum + (i !== index && item.manual && item.percentage != null ? Number(item.percentage) : 0);
    }, 0);
    return Math.max(0, 100 - manualSum);
};

const getMaxPrice = (index) => {
    const manualSum = insideData.reduce((sum, item, i) => {
        return sum + (i !== index && item.manual && item.price != null ? Number(item.price) : 0);
    }, 0);
    return Math.max(0, totalPrice.value - manualSum);
};

const updatePriceFromPercentage = (index) => {
    const item = insideData[index];
    item.manual = true;
    checkRange(index);
    if (totalPrice.value && item.percentage != null) {
        item.price = (totalPrice.value * item.percentage) / 100;
    }
};

const updatePercentageFromPrice = (index) => {
    const item = insideData[index];
    item.manual = true;
    if (totalPrice.value && item.price != null) {
        item.percentage = ((item.price / totalPrice.value) * 100);
    }
};

const checkRange = (index) => {
    selectedOption.value = 'custom';
    if (insideData[index].percentage < 0) {
        insideData[index].percentage = 0;
    } else if (insideData[index].percentage > 100) {
        insideData[index].percentage = 100;
    }
};

const selectedOption = ref('avg');

const selectionChange = () => {
    insideData.forEach(item => {
        if (selectedOption.value === 'avg') {
            item.manual = false;
            item.price = totalPrice.value ? (totalPrice.value * item.percentage) / 100 : 0;
        } else {
            item.manual = true;
        }
    })
}
const handleKeydown = (index, event) => {
    if (!insideData[index].manual) {
        insideData[index].manual = true;
    }

    if (event.key === "Backspace") {
        const currentValue = String(insideData[index].percentage)

        if (currentValue.length === 1) {
            insideData[index].percentage = 0
            insideData[index].price = 0
            event.preventDefault()
        }
    }
}

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
                    item.percentage = autoValue
                }
            });
        }

        insideData.forEach((item) => {
            if (!item.manual) {
                item.price = totalPrice.value ? (totalPrice.value * item.percentage) / 100 : 0;
            }
        });
        isUpdating = false;
    },
    { deep: true }
);

</script>

<style scoped></style>
