<template>
    <div id="app" class="container my-3">
        <SearchBar @updateKeyword="axiosData" />
        <ProductList :categoryArray="categoryArray" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ProductList from './components/ProductList.vue';
import SearchBar from './components/SearchBar.vue';

const baseAddress = 'https://localhost:7206';
const categoryArray = ref([]);

const axiosData = async (keyword = '') => {
    try {
        const request = { eventName: keyword, eventDescription: keyword };
        const response = await axios.post(`${baseAddress}/api/TourBundles/GetTourBundlesByKeyword`, request);
        //alert(JSON.stringify(response.data));
        categoryArray.value = response.data;
    } catch (error) {
        alert(error.message);
    }
};

onMounted(axiosData);
</script>
