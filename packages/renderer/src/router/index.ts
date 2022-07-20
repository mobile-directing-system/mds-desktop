import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import MainApplication from '../views/MainApplication.vue';
import EditGroup from '../views/EditGroup.vue';
import AllGroups from '../views/AllGroups.vue';
import CreateNewGroup from '../views/CreateNewGroup.vue';

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
        children:[
          {
            path: '/groups',
            name: 'Groups',
            component: AllGroups,
          },
          {
            path: '/edit-group/:selectedGroupID',
            name: 'EditCurrentGroup',
            component: EditGroup,
          },
          {
            path: '/create-new-group',
            name: 'CreateGroup',
            component: CreateNewGroup,
          },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;