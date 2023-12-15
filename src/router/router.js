import { createRouter, createWebHistory } from 'vue-router';
import App from "@/App.vue";
import UiCartItems from "@/components/UiCartItems.vue";



const routes = [
    {
        path: '/',
        component: App
    },
    {
        path: '/cart',
        component: UiCartItems
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;