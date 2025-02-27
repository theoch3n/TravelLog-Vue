<template>
    <div id="app" class="my-3">
        <SearchBar @updateKeyword="getData" />
        <ProductList :categoryArray="categoryArray" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductList from '../components/ProductList.vue';
import SearchBar from '../components/SearchBar.vue';

const baseAddress = 'https://localhost:7092';
const categoryArray = ref([]);

const getData = async (keyword = '') => {
    try {
        const request = { eventName: keyword, eventDescription: keyword };
        const response = await axios.get(`${baseAddress}/api/TravelPackage`);
        //alert(JSON.stringify(response.data));
        categoryArray.value = response.data;
    } catch (error) {
        alert(error.message + "\n檢查你的api有沒有開");
    }
};

onMounted(getData);
</script>
