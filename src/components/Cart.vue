<script setup>
import { reactive, computed } from "vue";
import { useCartStore } from "../stores/cart";

const cartStore = useCartStore(); // 取得購物車的狀態

const state = reactive({
    // 購物車中的商品 (計算屬性，直接使用購物車的狀態)
    cartItems: computed(() => cartStore.cartItems),
    // 購物車中的總金額 (計算屬性，直接使用購物車的狀態)
    totalPrice: computed(() => {
        // 如果購物車中有商品，計算總金額、若無商品則直接返回 0
        return cartStore.cartItems.length > 0
            ? cartStore.cartItems.reduce((total, item) => total + item.price, 0)
            : 0;
    }),
});
</script>

<template>
    <div>
        <ul>
            <li v-for="item in state.cartItems" :key="item.id">
                {{ item.name }} - {{ item.price }}
                <button @click="cartStore.removeFromCart(item.id)">移除</button>
            </li>
        </ul>
        <p>總價：{{ state.totalPrice }}</p>
        <button
            @click="cartStore.addToCart({ id: 1, name: '蘋果', price: 20 })"
        >
            加入蘋果
        </button>
        <button
            @click="cartStore.addToCart({ id: 2, name: '香蕉', price: 30 })"
        >
            加入香蕉
        </button>
        <button
            @click="cartStore.addToCart({ id: 3, name: '鳳梨', price: 30 })"
        >
            加入鳳梨
        </button>
    </div>
</template>
