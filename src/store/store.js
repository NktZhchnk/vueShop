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
        lastId: 2,
        priceItem: null,
        radioOptions: [],
    }),
    mutations: {},
    actions: {
        fetchData() {
            // Здесь вы можете использовать Axios, Fetch API или другую библиотеку для получения данных с сервера
            axios.get('https://eseniabila.com.ua/getProducts')
                .then(response => {
                    // Обработка данных и сохранение их в состоянии магазина
                    this.data = response.data;
                    const lastItem = this.data.reduce((acc, curr) => curr.id > acc.id ? curr : acc);
                    this.lastId = lastItem.id
                    console.log('в сторе вывожу лст айди:', this.lastId)
                    this.priceItem = this.data[0].price_item;
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        },
        getRadioPrice() {
            console.log(this.radioOptions)
            console.log('test GetRadio')
            console.log("получиние айдишника ласт" + this.lastId)
            this.radioPrice = this.radioOptions.map(item => item.price)
            this.radioName = this.radioOptions.map(item => item.label)
            this.radioQuan = this.radioOptions.map(item => item.quantity)
        }
    },
});