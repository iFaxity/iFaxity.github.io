//TODO: add vuex to avoid globals and ugly magic in plugins (toaster for example)
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import "whatwg-fetch"; // fetch polyfill

import "vue-mdc-adapter/dist/vue-mdc-adapter.css";
import VueMDCAdapter from "vue-mdc-adapter";

import Layout from "./layout.vue";
import routes from "./lib/routes";

const Router = new VueRouter({
  mode: "hash",
  routes
});

Vue.use(VueRouter);
Vue.use(VueMDCAdapter);

// Title plugin
Router.beforeEach((to, from, next) => {
  const match = to.matched.find(record => record.meta.title);
  if(match && match.meta && match.meta.title) {
    document.title = match.meta.title;
  }
  next();
});

// Create vue instance
const vm = new Vue({
  el: "#app",
  router: Router,
  render: h => h(Layout)
});
