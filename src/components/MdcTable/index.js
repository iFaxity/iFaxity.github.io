import MdcDataTable from "./Table.vue";
import MdcDataTableRow from "./TableRow.vue";
import MdcDataTableCell from "./TableCell.vue";

//export { MdcDataTable };
export default {
  install(Vue) {
    Vue.component(MdcDataTable.name, MdcDataTable);
    Vue.component(MdcDataTableRow.name, MdcDataTableRow);
    Vue.component(MdcDataTableCell.name, MdcDataTableCell);
  }
};