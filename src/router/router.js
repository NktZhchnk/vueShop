import {createRouter, createWebHistory} from 'vue-router';
import App from "@/App.vue";
import UiCartItems from "@/components/UiCartItems.vue";
import UiMainHeader from "@/components/UiMainHeader.vue";
import AdminMenu from "@/components/AdminMenu.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import UiRenderAllProducts from "@/components/UiRenderAllProducts.vue";


const routes = [
    {
        name: 'RenderProducts',
        path: '/',
        component: UiRenderAllProducts,
    },
    {
        name: 'AdminMenu',
        path: '/adminMenu',
        component: AdminMenu,
    },
    {
        name: 'Cart',
        path: '/cart',
        component: UiCartItems
    }, {
        name: 'Header',
        path: '/header',
        component: UiMainHeader
    },
    {
        path: '/product/:id',
        component: ProductDetails,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;