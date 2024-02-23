import {defineStore} from 'pinia'
import axios from "axios";
import {ref} from "vue";

export const useMyStore = defineStore({
    id: 'myStore',
    state: () => ({
        allPriceProducts: null,
        cartProducts: [],
        products: [],
        showResults: false,
        searchQuery: '',
        checkInput: false,
        productVarieties: [],
        productById: {
            id: [],
            img: [],
            varieties: [],
        },
        selectPoshta: {
            postIndex: null,
            cities: '',
            searchQuery: null,
        },
        orders: [],
        radioPrice: [],
        radioQuan: [],
        radioName: [],
        lastId: 1,
        lastIdOrders: 1,
        priceItem: null,
        radioOptions: [],
        categoryItem: null,
        productImg: [],
        adminLogin: '',
        adminPassword: '',
        isOpenMenu: false,
        isOpenCart: false,
        isOpenShowPage: false,
        checkCart: false,
        addProductsInAdmin: {
            poshtaInfo: '1',
        },
        showCheckAuth: {
            showAuthA: false,
            showAuthB: false,
        }
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
        swapOpenMenu() {
            this.isOpenMenu = !this.isOpenMenu;
            this.updateCommonState()
            this.isOpenCart = false;
            this.checkCart = false;

            if (!this.isOpenShowPage) {
                this.isOpenShowPage = !this.isOpenShowPage;
            }
        },
        swapOpenCart() {
            this.checkCart = !this.checkCart;
            setTimeout(() => {
                document.body.style.overflow = 'hidden';
                this.updateCommonState()
                this.isOpenCart = !this.isOpenCart;
                this.isOpenMenu = false;

                if (!this.isOpenShowPage) {
                    this.isOpenShowPage = !this.isOpenShowPage;
                }
            }, 40);
        },
        swapOpenAuth() {
            this.showCheckAuth.showAuthB = !this.showCheckAuth.showAuthB;
            this.isOpenMenu = false;
        },
        swapShowPage() {
            document.body.style.overflow = 'auto';
            this.isOpenMenu = false;
            this.updateCommonState()
            this.isOpenCart = false;
            this.isOpenShowPage = false;
            this.showCheckAuth.showAuthB = false;
            this.checkCart = false;
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
            // Запрашиваем товары с сервера
            axios.get('https://eseniabila.com.ua/getProducts')
                .then(response => {
                    // Обрабатываем данные и сохраняем их в состоянии магазина
                    const newProducts = response.data;
                    const lastItem = newProducts.reduce((acc, curr) => curr.id > acc.id ? curr : acc);
                    const newLastId = lastItem.id + 1;

                    // Проверка наличия новых товаров
                    if (newLastId > this.lastId) {
                        // Есть новые товары, обновим состояние
                        this.products = [...this.products, ...newProducts];
                        this.lastId = newLastId;
                        console.log('В сторе выводим lastId:', this.lastId);
                        this.priceItem = this.products[0].price_item;
                    }
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