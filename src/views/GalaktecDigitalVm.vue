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
          <button class="cmd-item x2 spacer-top"
                  @click="loadProgram()">
            Load
          </button>
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

<style lang="scss">
.highlight {
  border: 1px solid var(--mk-orange);
}
</style>

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

    @media (min-width: 1720px) {
      grid-template-columns: 650px auto;
    }
    @media (max-width: 1720px) {
      grid-template-columns: 580px auto;
    }
    @media (max-width: 1640px) {
      grid-template-columns: 500px auto;
    }
    @media (max-width: 1580px) {
      grid-template-columns: 450px auto;
    }
    @media (max-width: 1520px) {
      grid-template-columns: 380px auto;
    }

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
      display: flex;
      flex-direction: column;
      justify-items: center;
      font-family: 'Orbitron', sans-serif;;
      padding-left: 7em;

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


import { RootState } from '@/store';

declare const CodeMirror: any;

import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Knife from '../components/theme/Knife.vue';

import { LOAD_PROGRAM } from '../store/mutations';
import VirtualMachine from '../components/VirtualMachine.vue';
import { sampleProgram } from '../virtual-machine/default-program';

export default defineComponent({
  name: 'GalaktecDigitalVm',
  components: {
    Knife,
    VirtualMachine
  },
  setup() {
    const store = useStore();
    const editor = ref(null);
    let codeMirror: any;

    onMounted(() => {
      const editorDiv = editor.value;
      codeMirror = CodeMirror.fromTextArea(editorDiv, {
        lineNumbers: true,
        mode: 'gas',
        theme: 'material-darker',
        scrollbarStyle: 'overlay'
      });

      codeMirror.setValue(sampleProgram);
      store.commit(LOAD_PROGRAM, sampleProgram);
    });

    function loadProgram() {
      codeMirror.eachLine((lh: object) => {
        codeMirror.removeLineClass(lh, 'background', null);
      });

      const program = codeMirror.getValue();
      store.commit(LOAD_PROGRAM, program);
    }

    store.watch(function(state) { return state.currentLineNumber; }, function (newLine, oldLine) {
      codeMirror.removeLineClass(oldLine - 1, 'background', null);
      codeMirror.addLineClass(newLine - 1, 'background', 'highlight');
      codeMirror.scrollIntoView(newLine, 60);
    });

    return {
      editor,
      loadProgram
    };
  }
});

</script>
