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
        minPrice: 0,
        maxPrice: 2000,
        categoryItem: null,
        checkCart: false,
        checkInput: false,
        checkShowVariety: false,
        openVariety: false,
        showVariationModal: false,
        varieties: [],
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
            this.showVariationModal = false;
            this.varieties = [];
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
        sortByDate (a, b) {
            if (a.popularity_item !== b.popularity_item) {
                // Если у a значение popularity_item равно 1, он идет первым
                return b.popularity_item - a.popularity_item;
            }

            // Если значения popularity_item одинаковы, сравниваем по дате
            const dateA = new Date(a.date_item);
            const dateB = new Date(b.date_item);

            if (a.quan_item !== b.quan_item) {
                return b.quan_item - a.quan_item;
            }

            return dateB - dateA;
        },
        async fetchData() {
            // Проверяем, не загружены ли товары уже
            if (this.products.length > 0) {
                console.log('Товары уже загружены. Пропускаем запрос.');
                return;
            }

            try {
                // Асинхронный запрос на получение данных о товарах
                const productsResponse = await axios.get('https://eseniabila.com.ua/getProducts');
                this.products = productsResponse.data;
                this.products.sort(this.sortByDate);
                const lastItem = this.products.reduce((acc, curr) => curr.id > acc.id ? curr : acc);
                this.lastId = lastItem.id + 1
                this.priceItem = this.products[0].price_item;

                // Асинхронные запросы на получение других данных
                const [ordersResponse, productVarietiesResponse, productImgResponse] = await Promise.all([
                    axios.get('https://eseniabila.com.ua/getOrders'),
                    axios.get('https://eseniabila.com.ua/getProductVarieties'),
                    axios.get('https://eseniabila.com.ua/getProductImg')
                ]);

                this.orders = ordersResponse.data;
                this.productVarieties = productVarietiesResponse.data;
                this.productImg = productImgResponse.data;

                // Другие действия, которые нужно выполнить после получения всех данных
                this.getCartItems();
            } catch (error) {
                console.error('Произошла ошибка:', error);
            }
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