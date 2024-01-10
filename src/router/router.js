import {createRouter, createWebHistory} from 'vue-router';

import UiMainHeader from "@/components/UiMainHeader.vue";
import AdminMenu from "@/components/AdminPanel/AdminMenu.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import UiRenderAllProducts from "@/components/UiRenderAllProducts.vue";
import UiCatalog from "@/components/UiCatalog.vue";
import UiRenderProductsCategory from "@/components/UiRenderProductsCategory.vue";
import UiConfirmationOrder from "@/components/UiConfirmationOrder.vue";


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
        component: UiMainHeader
    },
    {
        path: '/product/:id',
        name: 'ProductDetails',
        component: ProductDetails,
        props: true
    },
    {
        path: '/image/:category',
        name: 'UiRenderProductsCategory',
        component: UiRenderProductsCategory,
        props: true
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('accessToken'); // Получение токена из localStorage или другого хранилища

    // Проверка, если маршрут требует аутентификации и токен отсутствует
    if (to.name === 'AdminMenu' && !token) {
        next('/login'); // Перенаправление на страницу входа
    } else {
        next(); // Продолжаем навигацию
    }
});
export default router;