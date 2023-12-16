import {createRouter, createWebHistory} from 'vue-router';
import App from "@/App.vue";
import UiCartItems from "@/components/UiCartItems.vue";
import UiMainHeader from "@/components/UiMainHeader.vue";
import AdminMenu from "@/components/AdminMenu.vue";



const routes = [
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
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;