<template lang="pug">
#home-view
  h1 Verktyg

  ul
    li
      router-link(to="/calc") Kalkylatorn
    li
      router-link(to="/mdc-data-table") MDC Data Table
</template>

<script>
export default {
  name: 'Home',
};
</script>
