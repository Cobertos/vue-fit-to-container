import Vue from 'vue';
import main from './main.vue';
import directive from '../../src/overflow-resize.js';

Vue.directive('overflow-resize', directive);

let c = new (Vue.extend(main))();
let e = document.createElement('div');
document.body.appendChild(e);
c.$mount(e);
