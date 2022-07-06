import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import MainApplication from '../views/MainApplication.vue';


const routes:RouteRecordRaw[] = [
    {

        path: '/',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/main',
        name: 'Main',
        component: MainApplication,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;