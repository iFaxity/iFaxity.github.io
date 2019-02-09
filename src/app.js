//TODO: add vuex to avoid globals and ugly magic in plugins (toaster for example)
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'whatwg-fetch'; // fetch polyfill
import './styles.scss';

import VueMDC from 'vue-mdc-web';
import Layout from './Layout.vue';
import routes from './routes';
import MDCDataTable from './components/MdcTable';

Vue.use(VueRouter);
Vue.use(VueMDC);
Vue.use(MDCDataTable);

const Router = new VueRouter({
  mode: 'history',
  routes,
});

// Create vue instance
new Vue({
  el: '#app',
  router: Router,
  render: h => h(Layout),

  // Title plugin
  beforeEnter(to, from, next) {
    const match = to.matched.find(record => record.meta.title);
    if(match && match.meta && match.meta.title) {
      document.title = match.meta.title;
    }
    next();
  },
});

module.hot && module.hot.accept();
