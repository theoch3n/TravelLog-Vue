<template>
    <div class="travel-package-container">
        <div class="overlay-mask"></div>
        <CarouselsCycle class="background-carousel" />
        
        <div class="content-wrapper">
            <div class="search-container">
                <h1 class="page-title">探索旅遊套餐</h1>
                <p class="page-subtitle">尋找您的下一個完美旅程</p>
                <SearchBar @updateKeyword="getData" />
            </div>
            
            <div class="product-container">
                <ProductList :categoryArray="categoryArray" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import ProductList from '../components/ProductList.vue';
import SearchBar from '../components/SearchBar.vue';
import CarouselsCycle from "@/components/CarouselsCycle.vue";

const baseAddress = 'https://localhost:7092';
const categoryArray = ref([]);

const getData = async (keyword = '') => {
    try {
        const request = { itineraryTitle: keyword };
        const response = await axios.post(`${baseAddress}/api/TravelPackage/GetTravelPackageByKeyword`, request);
        categoryArray.value = response.data;
    } catch (error) {
        $Error(error.message + "\n檢查你的api有沒有開");
    }
};

onMounted(() => {
    getData();
    
    document.body.classList.add('travel-package-page');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    
    // 獲取header和footer元素
    const header = document.querySelector('.desktop-header');
    const footer = document.querySelector('footer.footer-container');
    
    // 添加透明背景
    if (header) header.style.backgroundColor = 'transparent';
    if (footer) footer.style.backgroundColor = 'transparent';
});

onBeforeUnmount(() => {
    document.body.classList.remove('travel-package-page');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    
    // 獲取header和footer元素
    const header = document.querySelector('.desktop-header');
    const footer = document.querySelector('footer.footer-container');
    
    // 恢復原來的背景
    if (header) header.style.backgroundColor = '';
    if (footer) footer.style.backgroundColor = '';
});
</script>

<style scoped>
.travel-package-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow-y: auto;
}

.overlay-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
    z-index: 4;
    pointer-events: none;
}

.background-carousel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.content-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 20px 40px;
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.search-container {
    text-align: center;
    margin-bottom: 20px;
    padding: 30px 0;
}

.page-title {
    font-size: 3.5rem;
    font-weight: 300;
    color: #fff;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    font-family: 'Times New Roman', serif;
}

.page-subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.product-container {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    margin-bottom: 40px;
}

/* 響應式設計 */
@media (max-width: 1024px) {
    .content-wrapper {
        padding: 80px 20px 30px;
    }
    
    .page-title {
        font-size: 3rem;
    }
}

@media (max-width: 768px) {
    .content-wrapper {
        padding: 70px 15px 20px;
    }
    
    .page-title {
        font-size: 2.5rem;
    }
    
    .product-container {
        padding: 20px;
    }
}

@media (max-width: 576px) {
    .page-title {
        font-size: 2rem;
    }
    
    .page-subtitle {
        font-size: 1rem;
    }
    
    .product-container {
        padding: 15px;
    }
}
</style>

<style>
/* 全局樣式 */
body.travel-package-page {
    overflow-y: auto !important;
    height: auto !important;
    position: relative;
}

body.travel-package-page .desktop-header {
    background: transparent !important;
    z-index: 100;
}

body.travel-package-page .header-container {
    background: transparent !important;
}

body.travel-package-page footer.footer-container {
    background: transparent !important;
    z-index: 100;
    position: relative;
}

/* 確保頁面容器不受影響 */
body.travel-package-page .page-container {
    background: transparent !important;
}

/* 修改 SearchBar 樣式以適應新設計 */
body.travel-package-page .search-bar {
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 30px !important;
    padding: 10px 20px !important;
    backdrop-filter: blur(5px) !important;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease !important;
    max-width: 600px !important;
    margin: 0 auto !important;
}

body.travel-package-page .search-bar:focus-within {
    background: rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

body.travel-package-page .search-bar input {
    color: white !important;
}

body.travel-package-page .search-bar input::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
}

body.travel-package-page .search-bar .v-btn {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
}

body.travel-package-page .search-bar .v-btn:hover {
    background: rgba(255, 255, 255, 0.3) !important;
}
</style>