import {createRouter, createWebHistory} from 'vue-router';
import App from "@/App.vue";
import UiCartItems from "@/components/UiCartItems.vue";
import UiMainHeader from "@/components/UiMainHeader.vue";
import AdminMenu from "@/components/AdminPanel/AdminMenu.vue";
import ProductDetails from "@/components/ProductDetails.vue";
import UiRenderAllProducts from "@/components/UiRenderAllProducts.vue";
import UiCatalog from "@/components/UiCatalog.vue";
import UiRenderProductsCategory from "@/components/UiRenderProductsCategory.vue";


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

export default router;