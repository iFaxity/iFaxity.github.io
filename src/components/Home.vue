<template lang="pug">
#home-view
  h2 Vue Verktyg

  router-link(to="/calc") Kalkylatorn
  router-link(to="/mdc-data-table") MDC Data Table
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>