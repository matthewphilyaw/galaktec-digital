<template>
  <div class="container">
    <div class="editor-top">
      <knife layout="top-left"
             class="left-handle"
             kind="handle" />
      <knife layout="top-right"
             class="right-handle"
             kind="blade" />
    </div>
    <div class="app-title">
      <div class="main-title">
        <h1>Galaktec Digital</h1>
        <h3>A division of Gigadyne Systems</h3>
      </div>
    </div>

    <div class="editor">
      <div class="editor-container">
        <textarea ref="editor"></textarea>
      </div>
      <div class="cmd-panel">
        <div class="cmd-container">
          <div class="fill x1 spacer-top"></div>
          <button class="cmd-item x2 spacer-top">Load</button>
          <div class="fill xf spacer-top"></div>
        </div>
        <div class="vert-spacer">

        </div>
      </div>
    </div>
    <VirtualMachine />
    <knife layout="bottom-left"
           kind="blade" />
    <knife layout="bottom-right"
           kind="handle" />
  </div>
</template>

<style lang="scss" scoped>
  .handle-no-rad {
    --ux-bar-handle-end-cap-rad-top: 0px;
    --ux-bar-handle-end-cap-rad-bottom: 0px;
  }

  .container {
    --ux-bar-container-split: 45%;
    --ux-bar-blade-rad: 100px 60px;
    --ux-bar-handle-end-cap-rad-top: 5px;
    --ux-bar-handle-end-cap-rad-bottom: 5px;
    --ux-bar-handle-trans-radius: 60px 30px;

    height: 100%;
    box-sizing: border-box;
    padding: 1rem;

    display: grid;
    grid-template-columns: 650px auto;
    grid-template-rows: 45px auto 40px;

    .editor-top {
      display: flex;

      .left-handle {
        flex: 1;
      }

      .right-handle {
        flex: 1;
      }
    }

    .editor {
      display: grid;
      grid-template-columns: auto 60px;

      .editor-container {
        position: relative;

        border: 3px solid #a9dc7608;
        border-radius: 10px;
      }
    }





    .app-title {
      font-family: 'Orbitron', sans-serif;;

      .main-title {
        margin-left: 150px;
      }

      h1 {
        padding: 0;
        margin: 0;

        font-size: 1.5em;
        text-transform: uppercase;
      }

      h3 {
        padding: 0;
        margin: 0;

        font-size: 0.75em;
      }
    }
  }
</style>

<script lang="ts">

declare const CodeMirror: any;

import { defineComponent, ref, onMounted } from 'vue';
import Knife from '../components/theme/Knife.vue';
import VirtualMachine from '../components/VirtualMachine.vue';

export default defineComponent({
  name: 'galaktec-digital-vm',
  components: {
    Knife,
    VirtualMachine
  },
  setup() {
    const editor = ref(null);

    onMounted(() => {
      const editorDiv = editor.value;
      const codeMirror = CodeMirror.fromTextArea(editorDiv, {
        lineNumbers: true,
        mode: 'gas',
        theme: 'material-darker',
        scrollbarStyle: 'overlay'
      });

    });

    return {
      editor
    };
  }
});

</script>
