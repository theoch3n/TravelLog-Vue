<template>
    <div class="container border py-3 my-3">
        <div class="row">
            <div class="col-lg-4" v-for="(item, index) in categoryArray" :key="index">

                <div class="card my-2" :data-bs-toggle="'modal'" :data-bs-target="'#modal-' + index">
                    <div class="card-body">
                        <h2 class="card-text d-flex justify-content-center">{{ item.eventName }}</h2>
                        <img src="/imgs/noImage.png" class="card-img-top" alt="應該要顯示封面" :title="item.eventName">
                        <p class="card-text d-flex justify-content-center fs-3">
                            <rating :rating="item.ratings" />
                        </p>
                    </div>
                </div>

                <div class="modal fade" :id="'modal-' + index" tabindex="-1" :aria-labelledby="'modalLabel-' + index"
                    aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" :id="'modalLabel-' + index">{{ item.eventName }}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>{{ item.eventDescription }}</p>
                                <div class="d-flex justify-content-between">
                                    <p>聯絡電話: {{ item.contactInfo }}</p>
                                    <p>售價: {{ item.price }}</p>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-primary" @click="show(item)">加到購物車</button>
                                <button class="btn btn-primary" @click="show(item)">立即結帳</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import Rating from './Rating.vue';
const show = (item) => {
    alert(JSON.stringify(item.eventName));
}
defineProps({
    categoryArray: Array
});
</script>