<template lang="pug">
tr.mdc-data-table__row(:class="cssClasses", :tabindex="draggable && '0'", @mousedown="onMouseDown" @mousemove="debounceMouseOver")
  //:draggable="drag && 'true'" @dragstart="onDragstart", @dragend="onDragend", @dragover="onDragover", @drag="onDrag", @drop="onDrop")
  //, @click="onClick"

  mdc-table-cell(v-if="multiple")
    mdc-checkbox(v-model="model", :value="index", :disabled="disabled")
  slot
</template>

<script>
/*keydown: this.keydown,
dragenter: this.dragenter,
dragleave: this.dragleave,*/
import MdcTableCell from './TableCell.vue';

function resolveStartEnd(a, b) {
  const swap = a > b;
  // swap = false;
  // start = a + 1;
  // end = b + 1;

  // swap = true
  // start = b;
  // end = a - 1;

  return {
    start: swap ? b : a + 1,
    end: swap ? a - 1 : b + 1,
    swapped: swap,
  };
}

function styleChildren(children, str) {
  for(let i = 0; i < children.length; i++) {
    children[i].style.cssText = str;
  }
}

export default {
  name: 'MdcDataTableRow',
  components: { MdcTableCell: MdcTableCell },
  provide() {
    return {
      MdcDataTableRow: {
        rowIndex: this.index,
        getCellIndex: el => {
          const haystack = this.$slots.default.filter(vnode => !!vnode.tag);
          return haystack.findIndex(child => child.componentInstance === el);
        },
      }
    };
  },
  model: {
    event: 'change',
    prop: 'selected'
  },
  data() {
    return { debounceId: 0 };
  },

  props: {
    disabled: Boolean,
    index: Number,
    selected: {
      type: [Number, Array],
      default: null,
    },
    draggable: Boolean,
    drag: Object,
  },
  computed: {
    cssClasses() {
      return {
        'mdc-data-table__row--selected': this.isSelected,
        'mdc-data-table__row--disabled': this.disabled,
        'mdc-data-table__row--dragging': this.dragging,
      };
    },
    model: {
      get() {
        return this.selected;
      },
      set(value) {
        if(this.multiple) {
          const arr = Array.from(this.selected);
          const index = arr.indexOf(value);

          if(index == -1) {
            arr.push(value);
          } else {
            arr.splice(index, 1);
          }
          value = arr;
        }

        this.$emit('change', value);
      }
    },

    isSelected() {
      if(this.multiple) {
        return this.selected.includes(this.index);
      }
      return this.selected === this.index;
    },
    multiple() {
      return Array.isArray(this.selected);
    },
    dragging() {
      if(!this.draggable) return false;
      return this.drag.from === this.index && this.drag.dragging;
    },
  },

  methods: {
    onClick() {
      // TODO: prevent click when dragging happens
      if(this.selected == null || this.dragging) return;

      // Handle the v-model (can be multiple select or single select)
      let value = this.index;
      if(this.multiple) {
        value = this.selected;

        if(!this.isSelected) {
          value.push(this.index);
        } else {
          const index = value.indexOf(this.index);
          value.splice(index, 1);
        }
      } else if(this.selected === this.index) {
        value = -1; // deselect
      }

      this.$emit('change', value);
    },

    onMouseUp(e) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      // TODO: do click event if dragging didnt happen
      if(this.drag && !this.drag.dragging) {
        return this.onClick();
      }

      const { drag, $el } = this;
      const dropAccepted = drag.from !== -1 && drag.to !== drag.from;
      let transformY = 0;
      const { children } = $el.parentElement;

      // Do a 'preview' drop
      if(dropAccepted) {
        const { start, end, swapped } = resolveStartEnd(drag.from, drag.to);
        let height = 0;
        for(let i = start; i < end; i++) {
          height += children[i].offsetHeight;
        }

        transformY = swapped ? -height : height;
      }
      $el.style.cssText = `transform: translate(0, ${transformY}px)`;
      this.$emit('dragupdate', 'dragging', false);

      // Finalize the drop
      $el.addEventListener('transitionend', this.transitionEnd);
    },
    transitionEnd() {
      const { drag, $el } = this;
      const { children } = $el.parentElement;
      const dropAccepted = drag.from !== -1 && drag.to !== drag.from;

      if(dropAccepted) {
        this.$emit('move', drag.from, drag.to);
      }
      this.$emit('dragupdate', { from: -1, to: -1, height: 0, x: 0, y: 0 });

      // Prevent the transition from going off when transform is reset
      styleChildren(children, 'transition: none');
      requestAnimationFrame(_ => styleChildren(children, ''));
      $el.removeEventListener('transitionend', this.transitionEnd);
    },

    onMouseDown(e) {
      if(!this.draggable || e.button !== 0) return;
      e.preventDefault();

      const { $el } = this;
      const { pageX, pageY } = e;
      const rect = $el.getBoundingClientRect();
      const top = Math.round(rect.top);
      const left = Math.round(rect.left);

      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

      this.$emit('dragupdate', {
        from: this.index,
        to: this.index,
        dragging: false,
        height: $el.offsetHeight,
        x: pageX,
        y: pageY,
      });
    },
    onMouseMove(e) {
      if(!this.draggable) return;

      const { drag, $el } = this;
      const x = e.pageX - drag.x;
      const y = e.pageY - drag.y;
      $el.style.transform = `translate(${x}px, ${y}px)`;

      if(!this.drag.dragging) {
        this.$emit('dragupdate', 'dragging', true);
      }
    },

    debounceMouseOver(e) {
      clearTimeout(this.debounceId);
      this.debounceId = setTimeout(_ => {
        this.debounceId = 0;
        this.onMouseOver(e);
      }, 10);
    },

    onMouseOver(e) {
      if(!this.draggable || !this.drag.dragging) return;

      const { drag, index, $el } = this;
      const rect = $el.getBoundingClientRect();
      let dropIndex = index;

      // Calculate midpoint for to drop before or after element
      const midpoint = rect.top + ($el.offsetHeight / 2);
      if(drag.from < index) {
        if(e.pageY < midpoint && index > 0) {
          dropIndex -= 1;
        }
      } else {}

      // Update drag destination
      if(drag.to !== dropIndex) {
        const { start, end, swapped } = resolveStartEnd(drag.from, dropIndex);

        const { children } = this.$el.parentElement;
        for(let i = 0; i < children.length; i++) {
          const child = children[i];
          child.style.transform = i >= start && i < end ? `translate(0, ${swapped ? drag.height : -drag.height}px)` : '';
        }

        this.$emit('dragupdate', 'to', dropIndex);
      }
    },
  }
};
</script>