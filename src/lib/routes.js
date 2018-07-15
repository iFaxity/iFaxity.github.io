import Home from '../components/Home.vue';
import Calc from '../components/Calc.vue';
import DataTable from '../components/DataTable.vue';

export default [
  {
    path: '/',
    component: Home,
    meta: {
      title: 'Faxity\'s fun projects'
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
  /*,
  {
    path: String, component: VueComponent
    meta: {
      title: String
    }
  }*/
];