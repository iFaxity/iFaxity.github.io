<template lang="pug">
.mdc-data-table__footer
  span Rows per page:
  mdc-select(v-model="rows")
    mdc-select-option(v-for="", value="")

</template>

<script>
export default {
  name: 'MDCDataTableFooter',
  props: {
    rowSize: [String, Number],
    
  },

  data() {
    return {
      rows: this.rows
    };
  },
  computed: {},
  
  methods: {},
};
</script>