<template lang="pug">
mdc-app(id="app", align-start, style="background-color: var(--mdc-theme-background, #fff);")
  mdc-top-app-bar(slot="nav", title="Data Table Example")

  main(style="margin-top: 10px;")
    p Same data table styles as in mdc-data-table npm package. However the vue code is not uploaded.
    p Click headers to sort by ascending/decending. Click checkboxes to select row.

    mdc-data-table(:rows="list", select="multiple", v-model="selected")
      mdc-data-table-row(slot-scope="{ item }")
        mdc-data-table-cell(column="Dessert (100g serving)", name="name", sortable) {{ item.name }}
        mdc-data-table-cell(column="Calories", name="cal", sortable) {{ item.cal }}
        mdc-data-table-cell(column="Fat (g)", name="fat", sortable) {{ item.fat }}
        mdc-data-table-cell(column="Carbs (g)", name="carbs", sortable) {{ item.carbs }}
        mdc-data-table-cell(column="Protein (g)", name="prot", sortable) {{ item.prot }}
</template>

<script>
import MdcDataTable from './MdcTable';

export default {
  name: 'DataTable',
  data() {
    return {
      list: [
        { name: 'Frozen yogurt', cal: 159, fat: 6, carbs: 24, prot: 4 },
        { name: 'Ice cream sandwich', cal: 237, fat: 9, carbs: 37, prot: 4.3 },
        { name: 'Eclair', cal: 262, fat: 16, carbs: 24, prot: 6 },
        { name: 'Cupcake', cal: 305, fat: 3.7, carbs: 67, prot: 3.9 },
        { name: 'Gingerbread', cal: 356, fat: 16, carbs: 49, prot: 0 },
        { name: 'Jelly bean', cal: 375, fat: 0, carbs: 94, prot: 0 },
        { name: 'Lollipop', cal: 392, fat: 0.2, carbs: 98, prot: 6.5 },
        { name: 'Honeycomb', cal: 408, fat: 3.2, carbs: 87, prot: 4.9 },
      ],
      selected: [],
    };
  },
};
</script>