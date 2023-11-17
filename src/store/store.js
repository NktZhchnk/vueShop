import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";

export const useMyStore = defineStore({
    id: 'myStore',
    state: () => ({
        data: [],
        priceItem: null,
        radioOptions: ref([]),
    }),
    actions: {
        fetchData() {
            // Здесь вы можете использовать Axios, Fetch API или другую библиотеку для получения данных с сервера
            axios.get('https://eseniabila.com.ua/getProducts')
                .then(response => {
                    // Обработка данных и сохранение их в состоянии магазина
                    this.data = response.data;
                    this.priceItem = this.data[0].price_item;
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        },
    },
});