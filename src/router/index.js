import { createRouter, createWebHistory } from 'vue-router';

import MenuPage from "@/views/MenuPage.vue";
import AdminOrderPage  from "@/views/AdminOrderPage.vue";

const routes = [
    {
        path: '/',
        name: 'MenuPage',
        component: MenuPage,
    },
    {
        path: '/order-page',
        name: 'AdminOrderPage',
        component: AdminOrderPage,
    },
];

const router = createRouter({
    history: createWebHistory(), // Sử dụng chế độ lịch sử trình duyệt
    routes,
});

export default router;
