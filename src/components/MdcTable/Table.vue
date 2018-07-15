<template lang="pug">
.mdc-data-table(:class="cssClasses")
  table.mdc-data-table__content
    thead
      tr.mdc-data-table__row
        mdc-table-column(v-if="multiple")
          mdc-checkbox(:checked="allSelected", :indeterminate="indeterminate", @change="selectAll")
        mdc-table-column(v-for="column in columns", v-bind="column")
    
    //(@dragleave="dragleave", @dragenter="dragenter")
    tbody
      shadow-row(v-for="row of _rows", :index="row.index", :drag="drag", :draggable="dragAllowed", v-model="selected", @move="move", @dragupdate="dragupdate")
        slot(:item="row.cells", :index="row.index")
</template>

<script>
import MdcTableRow from './TableRow.vue'; 
import MdcTableColumn from './TableColumn.vue';
import ShadowRow from './TableShadowRow.vue';
/** TODO:
// Fixed footer and header
header
 - Title and search field
 - Add/remove buttons and show how many selected
 - Selected counter
footer
  - Pagination

adding footer and adjusting to material guidelines better
adding pagination
*/

export default {
  name: 'MdcDataTable',
  components: { MdcTableRow: MdcTableRow, MdcTableColumn: MdcTableColumn, ShadowRow: ShadowRow },
  provide() {
    return { 
      MdcDataTable: { 
        columns: this.columns,
        sort: this.sort,
      },
    };
  },
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    filter: String,
    sortFn: Function,
    filterFn: Function,
    select: {
      type: String,
      validator: value => value === 'select' || value === 'multiple',
    },
    rows: {
      type: Array,
      required: true,
    },
    selected: [Number, Array],
    draggable: Boolean,
  },
  
  computed: {
    _rows() {
      let rows = this.indexRows();

      if(this.filter) {
        const filterFn = this.filterFn || this.filterRows;
        rows = filterFn(this.rows, this.filter);
      }

      // Sort rows by column
      if(this.sort.order) {
        const sortFn = this.sortFn || this.sortDefault;
        rows.sort(sortFn(this.sort.by, this.sort.order));
      }
      return rows;
    },

    cssClasses() {
      return {
        'mdc-data-table--select-multiple': this.multiple,
        'mdc-data-table--select': this.select === 'select',
        'mdc-data-table--draggable': this.dragAllowed,
      }
    },
    allSelected() {
      if(!this.multiple) return false;

      if(this.selected.length !== this.rows.length) {
        const allowedRows = this.rows.filter(row => !row.disabled);
        return this.selected.length === allowedRows.length;
      }
      return true;
    },
    multiple() {
      return this.select === 'multiple' && Array.isArray(this.selected);
    },
    indeterminate() {
      //if(!this.multiple) return false;
      return this.multiple && this.selected.length > 0 && !this.allSelected;
    },
    dragAllowed() {
      return this.draggable && !(this.filter || this.sort.by);
    },
  },
  data() {
    return {
      columns: [],
      sort: {
        order: '',
        by: ''
      },
      drag: {
        from: -1,
        to: -1,
        dragging: false,
        height: 0,
        x: 0,
        y: 0,
      },
    };
  },

  methods: {
    selectAll() {
      const reducer = (arr, row, index) => {
        if(!row.disabled) arr.push(index);
        return arr;
      };

      const value = this.allSelected ? [] : this._rows.reduce(reducer, []);
      this.$emit('select', value);
    },
    sortDefault(by, order) {
      const aLarger = order === 'descending' ? 1 : -1;
      const bLarger = order === 'descending' ? -1 : 1;

      return (a, b) => {
        if(a.cells[by] < b.cells[by]) {
          return bLarger;
        } else if(a.cells[by] > b.cells[by]) {
          return aLarger;
        }
        return 0;
      };
    },
    indexRows() {
      // Preserve the real index for sorting purposes
      return this.rows.map((cells, index) => ({ index, cells }));
    },
    filterRows(rows, filter) {
      // Filtering is case insensitive
      const query = filter.toLowerCase();
      return rows.filter(row => {
        // Iterate all props to compare the cell with the query
        return Object.keys(row).some(prop => {
          const value = row[prop];
          if(typeof value === 'object') return false;

          const str = (value + '').toLowerCase();
          return str.includes(str);
        });
      });
    },

    dragupdate(key, value) {
      // Simple event wrapper to prevent DRY
      if(typeof key == 'object') {
        this.drag = Object.assign({}, this.drag, key);
      } else if(typeof key == 'string' && key in this.drag) {
        this.$set(this.drag, key, value);
      } else {
        throw 'Error updating drag object';
      }
    },
    move(from, to) {
      this.$emit('move', from, to);
    }
  }
};
</script>