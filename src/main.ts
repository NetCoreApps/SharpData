import './app.scss';
import 'es6-shim';

import Vue, {VueConstructor} from 'vue';

import Controls from '@servicestack/vue';
Vue.use(Controls);

import { App } from './App';

import { router } from './shared/router';

const app = new Vue({
    el: '#app',
    render: (h) => h(App),
    router,
});
