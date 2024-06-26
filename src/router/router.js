import {createRouter, createWebHistory} from 'vue-router';
import UiMainHeader from "@/components/UiMainHeader.vue";
import AdminMenu from "@/components/AdminPanel/AdminMenu.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import UiRenderAllProducts from "@/components/UiRenderAllProducts.vue";
import UiCatalog from "@/components/UiCatalog.vue";
import UiRenderProductsCategory from "@/components/UiRenderProductsCategory.vue";
import UiConfirmationOrder from "@/components/UiConfirmationOrder.vue";
import UiAuth from "@/components/Users/UiAuth.vue";
import UiRegistration from "@/components/Users/UiRegistration.vue";
import UiOrders from "@/components/AdminPanel/UiOrders.vue";
import OrderDetails from "@/components/AdminPanel/OrderDetails.vue";
import UiOrdersComplete from "@/components/AdminPanel/UiOrdersComplete.vue";
import UiEditProducts from "@/components/AdminPanel/UiEditProducts.vue";
import UiDetailsOrdersUsers from "@/components/Users/UiDetailsOrdersUsers.vue";
import UiInformationForUser from "@/components/Users/UiInformationForUser.vue";
import UiUserAgreement from "@/components/Users/UiUserAgreement.vue";


const routes = [
    {
        name: 'RenderProducts',
        path: '/',
        component: UiRenderAllProducts,
    },
    {
        name: 'UiConfirmationOrder',
        path: '/uiConfirmationOrder',
        component: UiConfirmationOrder,
    },
    {
        name: 'AdminMenu',
        path: '/adminMenu',
        component: AdminMenu,
    },
    {
        name: 'Catalog',
        path: '/catalog',
        component: UiCatalog,
    },
    {
        name: 'Header',
        path: '/header',
        component: UiMainHeader,
    },
    {
        name: 'Auth',
        path: '/authLogin',
        component: UiAuth,
    },
    {
        name: 'Registration',
        path: '/registration',
        component: UiRegistration,
    },
    {
        name: 'UiUserAgreement',
        path: '/uiUserAgreement',
        component: UiUserAgreement,
    },
    {
        name: 'UiOrders',
        path: '/uiOrders',
        component: UiOrders,
    },
    {
        name: 'UiOrdersComplete',
        path: '/uiOrdersComplete',
        component: UiOrdersComplete,
    },
    {
        name: 'UiEditProducts',
        path: '/uiEditProducts',
        component: UiEditProducts,
    },
    {
        name: 'UiDetailsOrdersUsers',
        path: '/uiDetailsOrdersUsers',
        component: UiDetailsOrdersUsers,
    },
    {
        name: 'UiInformationForUser',
        path: '/uiInformationForUser',
        component: UiInformationForUser,
    },
    {
        path: '/product/:id',
        name: 'ProductDetails',
        component: ProductDetails,
        props: true
    },
    {
        path: '/order-details/:orderId',
        name: 'OrderDetails',
        component: OrderDetails,
    },
    {
        path: '/image/:category',
        name: 'UiRenderProductsCategory',
        component: UiRenderProductsCategory,
        props: true
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('accessToken');
    const userLogin = localStorage.getItem('userLogin'); // Предположим, что вы храните логин пользователя в localStorage

    if (to.name === 'UiDetailsOrdersUsers' && !token) {
        // Если маршрут требует аутентификации и отсутствует токен, перенаправляем на страницу входа
        next('/authLogin');
    } else if ((to.name === 'AdminMenu' || to.name === 'UiOrders' || to.name === 'UiOrdersComplete' || to.name === 'UiEditProducts') && (!token || userLogin !== 'admin')) {
        // Если маршрут требует аутентификации и логин не равен 'admin', перенаправляем на страницу входа
        next('/authLogin');
    } else {
        // Продолжаем навигацию
        next();
    }
});
export default router;