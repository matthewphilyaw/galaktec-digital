<template>
  <div class="handle primary"
       :class="[ layoutModel.vertical, layoutModel.horizontal ]">
  </div>
  <div class="handle secondary"
       :class="[ layoutModel.vertical, layoutModel.horizontal, noTransition ? 'no-trans' : 'trans' ]">
    <div class="trans-rad"></div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import { LayoutModel } from './knife';

export default defineComponent({
  name: 'KnifeHandle',
  props: {
    layoutModel: {
      type: Object as PropType<LayoutModel>,
      required: true
    },
    noTransition: {
      type: Boolean,
      default: false
    }
  },
});

</script>

<style lang="scss" scoped>

.handle {
 background: var(--background-color);

 &.primary {
   background: var(--primary-color);

   &.left {
     border-top-left-radius: var(--ux-bar-handle-end-cap-rad-top);
     border-bottom-left-radius: var(--ux-bar-handle-end-cap-rad-bottom);
   }

   &.right {
     border-top-right-radius: var(--ux-bar-handle-end-cap-rad-top);
     border-bottom-right-radius: var(--ux-bar-handle-end-cap-rad-bottom);
   }
 }

  &.secondary.no-trans {
    background: var(--background-color);
  }

 &.secondary.trans {
   background: var(--primary-color);

   .trans-rad {
     height: 100%;
     background: var(--background-color);
   }
   /* Round the inner radius that connect to blade - which is the opposite of the horizontal direction supplied */
   &.top.left .trans-rad {
     border-top-right-radius: var(--ux-bar-handle-trans-radius);
   }

   &.bottom.left .trans-rad {
     border-bottom-right-radius: var(--ux-bar-handle-trans-radius);
   }

   &.top.right .trans-rad {
     border-top-left-radius: var(--ux-bar-handle-trans-radius);
   }

   &.bottom.right .trans-rad {
     border-bottom-left-radius: var(--ux-bar-handle-trans-radius);
   }
 }

}

</style>