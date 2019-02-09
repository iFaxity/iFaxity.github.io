//TODO: add vuex to avoid globals and ugly magic in plugins (toaster for example)
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'whatwg-fetch'; // fetch polyfill
import './styles.scss';

import VueMDC from 'vue-mdc-web';
import Layout from './Layout.vue';
import routes from './routes';
import MDCDataTable from './components/MdcTable';

// Define plugins
Vue.use(VueRouter);
Vue.use(VueMDC);
Vue.use(MDCDataTable);

// Create router instance
const Router = new VueRouter({
  mode: 'history',
  routes,

  // Title plugin
  /*beforeEnter(to, from, next) {
    console.log(to);
    console.log(from);

    debugger;
    const match = to.matched.find(record => record.meta.title);
    if(match && match.meta && match.meta.title) {
      document.title = match.meta.title;
    }
    next();
  },*/
});

// This is needed for github to allow history mode
Router.beforeEach((to, from, next) => {
  const page = to.query.p;
  if (page) {
    console.log(page);
    return next(page);
  }

  next();
});
Router.afterEach((to, from) => {
  const match = to.matched.find(record => record.meta.title);
  if(match && match.meta && match.meta.title) {
    document.title = match.meta.title;
  }
});

// Create vue instance
new Vue({
  el: '#app',
  router: Router,
  render: h => h(Layout),
});

module.hot && module.hot.accept();
