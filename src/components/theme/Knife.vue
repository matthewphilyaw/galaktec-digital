<template>
  <div class="knife"
       :class="[ layoutModel.vertical ]">
    <BarBlade v-if="kind === 'blade'"
              :layout-model="layoutModel"/>
    <BarHandle v-if="kind === 'handle'"
               :layout-model="layoutModel"/>
    <BarHandle v-if="kind === 'handle-no-trans'"
               :layout-model="layoutModel"
               :no-transition="true"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {validKind, validLayout, parseLayout } from './knife';

import KnifeBlade from './KnifeBlade.vue';
import KnifeHandle from './KnifeHandle.vue';

export default defineComponent({
  name: 'Knife',
  components: {
    BarBlade: KnifeBlade,
    BarHandle: KnifeHandle
  },
  props: {
    layout: {
      type: String,
      required: true,
      validator: validLayout
    },
    kind: {
      type: String,
      required: true,
      validator: validKind
    }
  },
  setup(props) {
    const layoutModel = parseLayout(props.layout);
    return {
      layoutModel: layoutModel
    };
  }
});

</script>

<style lang="scss">
.knife {
  height: 100%;
  width: 100%;
  display: grid;
  background: var(--background-color);
  color: var(--on-background-color);

  &.top {
    grid-template-rows: var(--ux-bar-container-split) auto;
    grid-template-areas: "primary"
                         "secondary";
  }

  &.bottom {
    grid-template-rows: auto var(--ux-bar-container-split);
    grid-template-areas: "secondary"
                         "primary";
  }

  .primary {
    grid-area: primary;
  }

  .secondary {
    grid-area: secondary;
  }
}
</style>