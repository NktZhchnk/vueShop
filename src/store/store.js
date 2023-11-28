import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import axios from "axios";


export const useMyStore = defineStore({
    id: 'myStore',
    state: () => ({
        data: [],
        radioPrice: [],
        radioQuan: [],
        radioName: [],
        lastId: 0,
        priceItem: null,
        radioOptions: ref([]),
    }),
    mutations:{

    },
    actions: {
        fetchData() {
            // Здесь вы можете использовать Axios, Fetch API или другую библиотеку для получения данных с сервера
            axios.get('https://eseniabila.com.ua/getProducts')
                .then(response => {
                    // Обработка данных и сохранение их в состоянии магазина
                    this.data = response.data;
                    const lastItem = this.data.reduce((acc, curr) => curr.id > acc.id ? curr : acc);
                    this.lastId = lastItem.id + 1
                    console.log('в сторе вывожу ласт айди:', this.lastId)
                    this.priceItem = this.data[0].price_item;
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        },
        getRadioPrice(){
            this.radioPrice = this.radioOptions.map(item => item.price)
            this.radioName = this.radioOptions.map(item => item.label)
            this.radioQuan = this.radioOptions.map(item => item.quantity)
        }
    },
});