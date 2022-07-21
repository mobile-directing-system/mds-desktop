import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import MainApplication from '../views/MainApplication.vue';
import AllUsersVue from '../views/AllUsers.vue';
import CreateNewUser from '../views/CreateNewUser.vue';
import EditUser from '../views/EditUser.vue';
import AllOperationsVue from '../views/AllOperations.vue';
import CreateNewOperation from '../views/CreateNewOperation.vue';
import EditOperation from '../views/EditOperation.vue';

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
        children: [
            {
                path: '/user',
                name: 'User',
                component: AllUsersVue,
            },
            {
                path: '/create-new-user',
                name: 'CreateUser',
                component: CreateNewUser,
            },
            {
                path: '/edit-user/:selectedUserID',
                name: 'EditCurrentUser',
                component: EditUser,
            },
            {
                path: '/operation',
                name: 'Operation',
                component: AllOperationsVue,
            },
            {
                path: '/create-new-operation',
                name: 'CreateOperation',
                component: CreateNewOperation,
            },
            {
                path: 'edit-operation/:selectedOperationID',
                name: 'EditCurrentOperation',
                component: EditOperation,
            },
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