import {defineStore} from 'pinia'
import axios from "axios";
import {ref} from "vue";
export const useMyStore = defineStore({
    id: 'myStore',
    state: () => ({
        products: [],
        productVarieties: [],
        radioPrice: [],
        radioQuan: [],
        radioName: [],
        lastId: 2,
        priceItem: null,
        radioOptions: [],
        categoryItem: null,
    }),
    mutations: {},
    actions: {
        updateCategoryItem(newValue) {
            this.categoryItem = newValue
        },
        fetchData() {
            // Здесь вы можете использовать Axios, Fetch API или другую библиотеку для получения данных с сервера
            axios.get('https://eseniabila.com.ua/getProducts')
                .then(response => {
                    // Обработка данных и сохранение их в состоянии магазина
                    this.products = response.data;
                    const lastItem = this.products.reduce((acc, curr) => curr.id > acc.id ? curr : acc);
                    this.lastId = lastItem.id + 1
                    console.log('в сторе вывожу лст айди:', this.lastId)
                    this.priceItem = this.products[0].price_item;
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
            axios.get('https://eseniabila.com.ua/getProductVarieties')
                .then(response => {
                    this.productVarieties = response.data
                    console.log(this.productVarieties)
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