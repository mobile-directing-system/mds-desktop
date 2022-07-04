import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import MainApplication from '../views/MainApplication.vue';
import CreateNewUser from '../views/CreateNewUser.vue';

const routes:RouteRecordRaw[] = [
    {
        path: '/create-user',
        name: 'createUser',
        component: CreateNewUser,
    },
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