import { defineStore } from "pinia";

export const useProductPara = defineStore("productPara", {
    state: () => ({
        selectItem: null,
    }),
    actions: {
        selectToPay(item) {
            this.selectItem = item;
        },
        clearCart() {
            this.selectItem = null;
        },
    },
});
