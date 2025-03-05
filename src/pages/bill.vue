<template>
    <div class="bill-page-container">
        <!-- 背景輪播 -->
        <CarouselsCycle class="background-carousel" />
        
        <!-- 遮罩層 -->
        <div class="overlay-mask"></div>
        
        <div class="modal fade" id="modalBill" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content custom-modal">
                    <div class="modal-header text-center">
                        <h5 class="modal-title w-100 ms-5" id="modalBillLabel"> {{ itinerary.itineraryTitle }} </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" @click="clearForm()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex my-3">
                            <div class="form-group w-100 me-3 text-center">
                                <label class="form-label">品項</label>
                                <input type="text" class="form-control custom-input w-100 text-center" v-model="Title">
                            </div>
                            <div class="form-group w-100 text-center">
                                <label class="form-label">價格</label>
                                <input type="number" class="form-control custom-input w-100 text-center" v-model.number="totalPrice"
                                    @click="selectAllText" @input="handleTotalPrice()"
                                    @keydown="handleTotalPriceInput($event)">
                            </div>
                        </div>

                        <div class="container">
                            <table class="table table-bordered table-hover custom-table">
                                <thead class="table-header">
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
                                            <select class="form-select custom-select text-center" disabled>
                                                <option v-for="(option, optIndex) in members" :key="optIndex"
                                                    :value="option" :selected="optIndex === index">
                                                    {{ option }}
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <input class="form-control custom-input text-center" type="number"
                                                v-model.number="p.percentage" @input="updateValue(index, 'percentage')"
                                                @keydown="handleKeydown(index, $event, 'percentage')"
                                                @click="selectAllText($event)" :class="{ 'border-highlight': p.manual }">
                                        </td>
                                        <td>
                                            <input class="form-control custom-input text-center" type="number" v-model.number="p.price"
                                                @input="updateValue(index, 'price')"
                                                @keydown="handleKeydown(index, $event, 'price')"
                                                @click="selectAllText($event)" :class="{ 'border-highlight': p.manual }">
                                        </td>
                                        <th class="align-bottom">
                                            <div class="form-check">
                                                <input class="form-check-input custom-checkbox m-0 me-2" style="transform: scale(1.5)"
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
                            <input type="text" class="form-control custom-input text-center w-25 me-1" v-model="keyword"
                                placeholder="搜尋">
                            <select class="form-select custom-select text-center w-50" v-model="selectedCurrency">
                                <option value="" disabled>選擇幣別</option>
                                <option v-for="(rate, currency) in filteredCurrencies" :key="currency" :value="rate">
                                    <!-- {{ currency }} - -->
                                    {{ rate }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <select class="form-select custom-select text-center" v-model="PaidBy">
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
                            <label class="btn custom-btn-outline" for="btnradio1">平分</label>

                            <input type="radio" class="btn-check" name="btnradio" id="btnradio3" value="custom"
                                autocomplete="off" v-model="selectedOption" @change="selectionChange()">
                            <label class="btn custom-btn-outline" for="btnradio3">自訂</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn custom-btn-secondary" data-bs-dismiss="modal" @click="clearForm()">取消</button>
                        <button type="button" class="btn custom-btn" @click="saveData()">儲存</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from "vue";
import axios from 'axios';
import CarouselsCycle from "@/components/CarouselsCycle.vue"; // 引入輪播組件

// 添加頁面掛載和卸載時的樣式處理
onMounted(() => {
    document.body.classList.add('bill-page');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    
    // 獲取header和footer元素
    const header = document.querySelector('.desktop-header');
    const footer = document.querySelector('footer.footer-container');
    
    // 添加透明背景
    if (header) header.style.backgroundColor = 'transparent';
    if (footer) footer.style.backgroundColor = 'transparent';

    // 匯率api次數快用完了，省點
    // getExchangeRates();
});

onBeforeUnmount(() => {
    document.body.classList.remove('bill-page');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    
    // 獲取header和footer元素
    const header = document.querySelector('.desktop-header');
    const footer = document.querySelector('footer.footer-container');
    
    // 恢復原來的背景
    if (header) header.style.backgroundColor = '';
    if (footer) footer.style.backgroundColor = '';
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

// const filteredRates = computed(() => {
//     if (!keyword.value) {
//         return rates.value;
//     }
//     return Object.fromEntries(
//         Object.entries(rates.value).filter(([currency]) => currency.includes(keyword.value.toUpperCase()))
//     );
// });

const filteredCurrencies = computed(() => {
    if (!keyword.value) {
        return currencies;
    }
    return currencies.filter(currency => currency.includes(keyword.value.toUpperCase()));
});
const currencyBaseOn = ref();
const getExchangeRates = async () => {
    const ExchangeRatesApiKey = "3bbb6fbca51af86d327efec8";
    currencyBaseOn.value = selectedCurrency.value;
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${ExchangeRatesApiKey}/latest/TWD`);
    ExchangeRates.value = response.data;
    rates.value = ExchangeRates.value.conversion_rates;
}

const currencies = [
    "USD", "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD",
    "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR",
    "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD",
    "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD",
    "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN",
    "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD", "SSP",
    "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF",
    "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
]
const generateBill = () => {
    return {
        ItineraryId: itinerary.value.itineraryId,
        ItineraryName: itinerary.value.itineraryTitle,
        Title: Title.value,
        TotalAmount: totalPrice.value,
        Currency: selectedCurrency.value,
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
        Currency: selectedCurrency.value === "" ? "幣別不能為空" : "",
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
                $Success("資料創建成功!");
                clearForm();
                backToList();
            } else {
                $Error("資料創建失敗!");
            }
        } catch (error) {
            console.log("Error: ", error);
            $Error("提交失敗!");
        }
    } else {
        const errorMessage = Object.values(validation).filter(Boolean).join("<br>");
        Swal.fire({
            title: "表單驗證失敗",
            html: errorMessage,
            icon: "error",
            confirmButtonText: '再試一次',
            customClass: {
                popup: 'travel-swal-popup',
                title: 'travel-swal-title',
                content: 'travel-swal-content',
                confirmButton: 'travel-swal-button travel-swal-confirm-button travel-swal-error-button',
                icon: 'travel-swal-icon'
            },
            buttonsStyling: false
        });
    }
};

const clearForm = () => {
    Title.value = "";
    totalPrice.value = "";
    PaidBy.value = "";
    keyword.value = "";
    insideData.forEach(item => {
        item.paid = false;
    });
    selectedOption.value = 'avg';
    selectedCurrency.value = "";
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

<style scoped>
.bill-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
}

.background-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
  z-index: 4;
  pointer-events: none;
}

.custom-modal {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: none;
  animation: fadeIn 0.5s ease-out;
}

.modal-header {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-bottom: none;
}

.modal-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.modal-body {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
}

.custom-input {
  border-radius: 8px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
  padding: 10px 15px;
}

.custom-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.border-highlight {
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
}

.custom-select {
  border-radius: 8px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.custom-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.table-header {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white;
}

.custom-checkbox:checked {
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.custom-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 8px 24px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4) !important;
  border: none;
}

.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5) !important;
}

.custom-btn-secondary {
  background: linear-gradient(135deg, #6366f1, #818cf8) !important;
  color: white !important;
  border-radius: 30px !important;
  padding: 8px 24px !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
  border: none;
}

.custom-btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
}

.custom-btn-outline {
  color: #4f46e5 !important;
  border: 1px solid #4f46e5 !important;
  background-color: transparent !important;
  transition: all 0.3s ease;
}

.custom-btn-outline:hover {
  background-color: rgba(79, 70, 229, 0.1) !important;
}

.btn-check:checked + .custom-btn-outline {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
  border-color: transparent !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style>
/* 全局樣式 */
body.bill-page {
  overflow-y: auto !important;
  height: auto !important;
  position: relative;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

body.bill-page .desktop-header {
  background: transparent !important;
  z-index: 10;
}

body.bill-page .header-container {
  background: transparent !important;
}

body.bill-page footer.footer-container {
  background: transparent !important;
  z-index: 10;
}

/* 響應式調整 */
@media (max-width: 768px) {
  body.bill-page .desktop-header,
  body.bill-page footer.footer-container {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
  }
}
</style>