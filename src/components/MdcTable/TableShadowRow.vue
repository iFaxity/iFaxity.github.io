<script>
/* Templated CSS Code 
  .mdc-data-table__row{
    transition: transform .2s ease;
    cursor: grab;
    user-select: none;
    pointer-events: none;
    box-sizing: border-box;

    border: 1px solid black; // transparent?

    &--dragging {
      cursor: grabbing;
      z-index: 1000;
      border-style: dashed

      position: fixed;
      transition: none;
      margin: none;
    }
  }
*/

export default {
  functional: true,
  model: {
    event: 'change',
    prop: 'selected'
  },
  props: {
    selected: [Number, Array],
    index: Number,
    draggable: Boolean,
    drag: Object,
  },

  render(h, ctx) {
    const row = ctx.children[0];
    const opts = row.componentOptions;

    opts.propsData = Object.assign({}, opts.propsData, ctx.props);
    opts.listeners = ctx.listeners;
    return row;
  },
  
  created() {
    this.$on('dragupdate', this.dragupdate);
  },
  methods: {
    dragupdate(...args) {
      this.$emit('dragupdate', ...args);
    },
  },
};
</script>