<template>
  <div class="blade brushed-metal"
       :class="[ `${ layoutModel.vertical }-${ layoutModel.horizontal }` ]">
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { LayoutModel } from './knife';

export default defineComponent({
  name: 'KnifeBlade',
  props: {
    layoutModel: {
      type: LayoutModel,
      required: true
    }
  },
});

</script>

<style lang="scss" scoped>

.blade {
 background: var(--primary-color);
 grid-row-start: 1;
 grid-row-end: 3;

 &.top-left {
   border-top-left-radius: var(--ux-bar-blade-rad);
 }

 &.bottom-left {
   border-bottom-left-radius: var(--ux-bar-blade-rad);
 }

 &.top-right {
   border-top-right-radius: var(--ux-bar-blade-rad);
 }

 &.bottom-right {
   border-bottom-right-radius: var(--ux-bar-blade-rad);
 }
}

</style>