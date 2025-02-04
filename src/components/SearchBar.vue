<template>
    <div class="container w-100 my-3">
        <div class="row w-100 ms-auto me-0">
            <input type="text" class="form-control col-lg-12" v-model="keyword" @keyup="updateKeyword"
                placeholder="請輸入篩選關鍵字" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


// import { ref, reactive, computed, watch } from 'vue';
const keyword = ref('');
const emit = defineEmits(['updateKeyword']);

const updateKeyword = () => {
    emit('updateKeyword', keyword.value);
}
</script>

<style scoped></style>