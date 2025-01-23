import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
    // 狀態，像 Vue 的 Data
    state: () => ({
        cartItems: [], // 購物車中的商品列表 (陣列)
    }),
    // 計算屬性，像 Vue 的 Computed
    getters: {
        totalPrice: (state) => {
            // 計算購物車總金額，透過 reduce 函式累計每個商品的價格
            return state.cartItems.reduce(
                (total, item) => total + item.price,
                0
            );
        },
    },
    // 動作，像 Vue 的 function
    actions: {
        // 將商品加入購物車
        addToCart(product) {
            this.cartItems.push(product);
        },
        // 從購物車中移除商品
        removeFromCart(productId) {
            this.cartItems = this.cartItems.filter(
                (item) => item.id !== productId
            );
        },
    },
});
