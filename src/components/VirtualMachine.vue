<template>
  <div class="vm-container">
    <Knife class="top-handle"
           layout="top-left"
           kind="handle" />
    <Knife layout="top-right"
           kind="blade" />
    <div>
      Program Mem
    </div>
    <div>
      Ram
    </div>
    <div>
      Reg
    </div>
    <div>
      stats
    </div>
    <div class="cmd-panel">
      <div class="cmd-container">
        <div class="fill x1 spacer-top"></div>
        <button class="cmd-item x1 spacer-top">Reset</button>
        <div class="fill x2 spacer-top"></div>
        <button class="cmd-item x2 spacer-top">Step</button>
        <div class="fill xf spacer-top"></div>
      </div>
      <div class="vert-spacer">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Knife from '../components/theme/Knife.vue';

export default defineComponent({
  name: 'VirtualMachine' ,
  components: {
    Knife
  }
});
</script>

<style lang="scss" scoped>
  .vm-container {
    --ux-bar-container-split: 45%;
    --ux-bar-blade-rad: 100px 60px;
    --ux-bar-handle-end-cap-rad-top: 5px;
    --ux-bar-handle-end-cap-rad-bottom: 5px;
    --ux-bar-handle-trans-radius: 60px 30px;

    --primary-color: var(--mk-blue);
    --secondary-color: var(--mk-purple);

    margin: 0;
    padding: 0.5rem 1rem;
    display: grid;
    grid-template-columns: auto auto auto auto 70px;
    grid-template-rows: 35px auto;

    .top-handle {
      grid-column-start: 1;
      grid-column-end: 5;
    }
  }
</style>