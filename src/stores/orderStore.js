import { defineStore } from "pinia";

export const useOrderStore = defineStore("orderStore", {
    state: () => ({
        order: null,
    }),
    actions: {
        setOrder(orderData) {
            this.order = orderData;
        },
    },
});
