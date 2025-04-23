import { createRouter, createWebHistory } from 'vue-router';

import MenuPage from "@/views/MenuPage.vue";

const routes = [
    {
        path: '/',
        name: 'MenuPage',
        component: MenuPage,
    }
    // ,
    // {
    //     path: '/aaa',
    //     name: 'CreateOrder',
    //     component: App,
    // },
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'NotFound',
    //     component: App,
    // },
];

const router = createRouter({
    history: createWebHistory(), // Sử dụng chế độ lịch sử trình duyệt
    routes,
});

export default router;
