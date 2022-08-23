import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import { modulesStore } from '/@/store';
import Multiselect from '@vueform/multiselect';
import '../index.css';
import 'flowbite';

/**
 * load the content into the #app div and
 * tell vue.js that we are using a store
 * and a router.
 */
createApp(App).use(modulesStore).use(router).component('Multiselect', Multiselect).mount('#app');

