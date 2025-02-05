import { defineStore, acceptHMRUpdate } from 'pinia'

export const useProductPara = defineStore({
    id: 'item',
    state: () => ({
        selectItem: []
    }),
    actions: {
        selectToPay(item) {
            this.selectItem.push(item);
        }
    }

})