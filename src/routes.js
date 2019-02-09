/* Lazy load the routes */
//const Home = () => import('./components/Home.vue');
//const Calc = () => import('./components/Calc.vue');
//const DataTable = () => import('./components/DataTable.vue');
import Home from './components/Home.vue';
import Calc from './components/Calc.vue';
import DataTable from './components/DataTable.vue';

export default [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Welcome'
    }
  },
  {
    path: '/calc',
    component: Calc,
    meta: {
      title: 'Calculator 2.0'
    }
  },
  {
    path: '/mdc-data-table',
    component: DataTable,
    meta: {
      title: 'MDC Data Table Example'
    }
  },
];
