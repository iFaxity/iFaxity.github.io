<template lang="pug">
td.mdc-data-table__cell(:class="cssClasses")
  // @click="onClick", @blur="onBlur", :contenteditable="editing && 'true'")
  slot
</template>

<script>
  //TODO: make inline editable
  // support v-model somehow for inter data communications set text dynamically also

export default {
  name: 'MdcDataTableCell',
  inject: [ 'MdcDataTable', 'MdcDataTableRow' ],
  props: {
    numeric: Boolean,
    name: String,
    column: String,
    sortable: Boolean,
    //value: [String, Number],
    //editable: Boolean,
  },
  computed: {
    cssClasses() {
      return this.numeric && 'mdc-data-table__cell--numeric';
    }
  },
  /*data() {
    return { editing: false };
  },*/

  beforeMount() {
    const { rowIndex, getCellIndex } = this.MdcDataTableRow;
    const { columns } = this.MdcDataTable;

    if(rowIndex === 0 && this.column && this.name) {
      const cellIndex = getCellIndex(this);

      this.$set(columns, cellIndex, {
        name: this.name,
        text: this.column,
        sortable: this.sortable,
        numeric: this.numeric
      });
    }
  },

  /*methods: {
    onClick(e) {
      if(!this.editable) return;

      this.editing = true;
      this.$el.focus();
    },
    onBlur() {
      this.editing = false;
    }
  }*/
};
</script>