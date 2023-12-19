import {defineStore} from 'pinia'
import axios from "axios";
import {ref} from "vue";

export const useMyStore = defineStore({
    id: 'myStore',
    state: () => ({
        test: [],
        products: [],
        productById: {
            id: [],
            img: [],
            varieties: [],
        },
        productVarieties: [],
        radioPrice: [],
        radioQuan: [],
        radioName: [],
        lastId: 2,
        priceItem: null,
        radioOptions: [],
        categoryItem: null,
        productImg: [],
        adminLogin: '',
        adminPassword: '',
        isOpenMenu: false,
        addProductsInAdmin:{
            poshtaInfo: '1',
        }
    }),
    mutations: {},
    actions: {
        updatePoshtaInfo(item) {
            console.log(this.addProductsInAdmin.poshtaInfo )
            this.addProductsInAdmin.poshtaInfo = item;
            console.log(this.addProductsInAdmin.poshtaInfo )
        },
        swapOpenMenu(item) {
            this.isOpenMenu = !this.isOpenMenu
        },
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
                    console.log('product', this.productVarieties)
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
            axios.get('https://eseniabila.com.ua/getProductImg')
                .then(response => {
                    this.productImg = response.data
                    console.log('Img:', this.productImg)
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        },
        AthData() {
            axios.get('https://eseniabila.com.ua/getUsers')
                .then(response => {
                    response.data.forEach((item) => {
                        this.adminPassword = item.password
                        this.adminLogin = item.login
                    })
                })
        },
        getRadioPrice() {
            console.log(this.radioOptions)
            console.log('test GetRadio')
            console.log("получиние айдишника ласт" + this.lastId)
            this.radioPrice = this.radioOptions.map(item => item.price)
            this.radioName = this.radioOptions.map(item => item.label)
            this.radioQuan = this.radioOptions.map(item => item.quantity)
        },

    },
});