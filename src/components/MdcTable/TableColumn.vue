<template lang="pug">
th.mdc-data-table__column(:class="cssClasses", :aria-sort="sortMode", @click="onClick")
  slot {{ text }}
</template>

<script>
export default {
  name: 'MdcDataTableColumn',
  inject: [ 'MdcDataTable' ],
  props: {
    numeric: Boolean,
    sortable: Boolean,
    text: String,
    name: String,
  },
  computed: {
    cssClasses() {
      return {
        'mdc-data-table__column--sortable': this.sortable,
        'mdc-data-table__column--numeric': this.numeric,
      };
    },
    sortMode() {
      const { order, by } = this.MdcDataTable.sort;
      return this.sortable && by === this.name && order;
    }
  },
  methods: {
    onClick() {
      if(!this.sortable) return;
      const { sort } = this.MdcDataTable;

      if(sort.by !== this.name) {
        sort.by = this.name;
        sort.order = 'descending';
      } else if(sort.order === 'descending') {
        sort.order = 'ascending';
      } else {
        sort.order = '';
        sort.by = '';
      }
    }
  }
};
</script>