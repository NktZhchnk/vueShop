import {defineStore} from 'pinia'
import axios from "axios";
import {ref} from "vue";

export const useMyStore = defineStore({
    id: 'myStore',
    state: () => ({
        adminLogin: '',
        adminPassword: '',
        allPriceProducts: null,
        cartProducts: [],
        categoryItem: null,
        checkCart: false,
        checkInput: false,
        checkShowVariety: false,
        openVariety: false,
        products: [],
        usersCountOnline: 0,
        showResults: false,
        searchQuery: '',
        productVarieties: [],
        orders: [],
        radioPrice: [],
        radioQuan: [],
        radioName: [],
        lastId: 1,
        lastIdOrders: 1,
        priceItem: null,
        radioOptions: [],
        productImg: [],
        isOpenMenu: false,
        isOpenCart: false,
        isOpenShowPage: false,
        addProductsInAdmin: {
            poshtaInfo: '1',
        },
        showCheckAuth: {
            showAuthA: false,
            showAuthB: false,
        },
        productById: {
            id: [],
            img: [],
            varieties: [],
        },
        selectPoshta: {
            postIndex: '',
            cities: '',
            searchQuery: '',
        },
    }),
    mutations: {},
    actions: {
        updatePoshtaInfo(item) {
            console.log(this.addProductsInAdmin.poshtaInfo);
            this.addProductsInAdmin.poshtaInfo = item;
            console.log(this.addProductsInAdmin.poshtaInfo);
        },
        updateCommonState() {
            this.showResults = false;
            this.searchQuery = '';
            this.checkInput = false;
        },
        updateCommonStateAndCloseMenus() {
            this.updateCommonState()
            this.isOpenMenu = false;
            this.isOpenCart = false;
            this.checkCart = false;
        },
        swapOpenMenu() {
            this.isOpenMenu = !this.isOpenMenu;
            document.body.style.overflow = 'hidden';
            this.updateCommonState()
            this.isOpenCart = false;
            this.checkCart = false;

            this.checkShowVariety = false;
            this.openVariety = false;
            if (!this.isOpenShowPage) {
                this.isOpenShowPage = !this.isOpenShowPage;
            }
        },
        swapOpenCart() {
            setTimeout(() => {
                this.checkCart = !this.checkCart;
                setTimeout(() => {
                    document.body.style.overflow = 'hidden';
                    this.updateCommonState()
                    this.isOpenMenu = false;
                    this.openVariety = false;
                    this.checkShowVariety = false;
                    this.isOpenCart = !this.isOpenCart;
                    if (!this.isOpenShowPage) {
                        this.isOpenShowPage = !this.isOpenShowPage;
                    }
                }, 50);
            }, 60)
        },
        swapOpenAuth() {
            this.showCheckAuth.showAuthB = !this.showCheckAuth.showAuthB;
            this.isOpenMenu = false;
        },
        swapShowPage() {
            document.body.style.overflow = 'auto';
            this.updateCommonStateAndCloseMenus()

            this.isOpenShowPage = false;
            this.showCheckAuth.showAuthB = false;
            this.openVariety = false;
            this.checkShowVariety = false;
        },
        swapShowVarietyProduct() {
            this.checkShowVariety = !this.checkShowVariety;
            setTimeout(() => {
                this.openVariety = !this.openVariety;
                document.body.style.overflow = 'hidden';
                this.updateCommonStateAndCloseMenus()
                if (!this.isOpenShowPage) {
                    this.isOpenShowPage = !this.isOpenShowPage;
                }
            }, 40);
        },
        updateCategoryItem(newValue) {
            this.categoryItem = newValue
        },
        fetchData() {
            // Проверяем, не загружены ли товары уже
            if (this.products.length > 0) {
                console.log('Товары уже загружены. Пропускаем запрос.');
                return;
            }
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
            this.getOrders();
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
            this.getCartItems()
        },
        getOrders() {
            axios.get('https://eseniabila.com.ua/getOrders')
                .then(response => {
                    // Обработка данных и сохранение их в состоянии магазина
                    this.orders = response.data;
                    const lastItem = this.orders.reduce((acc, curr) => curr.id > acc.id ? curr : acc);
                    this.lastIdOrders = lastItem.id + 1
                    console.log('в сторе вывожу лст айди:', this.lastIdOrders)
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        },
        getCartItems() {
            const savedCartProducts = sessionStorage.getItem('cartProducts');
            if (savedCartProducts) {
                this.cartProducts = JSON.parse(savedCartProducts);
                console.log('Загружена корзина товаров:', this.cartProducts);
            }
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