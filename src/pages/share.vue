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
                        標題:這邊用行程名稱

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
                            <input type="text" class="form-control w-100" v-model="price">
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
                                <tr v-for="(p, index) in members" :key="p">
                                    <td>
                                        <select class="form-select text-center">
                                            <option v-for="(option, optIndex) in members" :key="optIndex"
                                                :value="option" :selected="optIndex === index">
                                                {{ option }}
                                            </option>
                                        </select>
                                    </td>
                                    <td><input class="form-control text-center"></td>
                                    <td>
                                        <input class="form-control text-center" :value="avgPrice === 0 ? '' : avgPrice">
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
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
                        <label class="btn btn-outline-primary" for="btnradio1">平分 (預設)</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btnradio2">百分比</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btnradio3">自訂</label>
                    </div>
                    <!-- radio button -->
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary">你要確</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const selectedIndex = ref('');
const price = ref();
const members = [
    "小明",
    "張三",
    "李四",
    "王五",
];
const avgPrice = computed(() => {
    const result = price.value / members.length;
    return isNaN(result) ? '' : result;
});

</script>

<style scoped></style>