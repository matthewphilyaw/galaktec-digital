<template>
  <div class="vm-container">
    <Knife class="top-handle"
           layout="top-left"
           kind="handle" />
    <Knife layout="top-right"
           kind="blade" />

    <div class="stats-container">
      <div class="header">
        <div v-if="programDump">{{ `${programDump.regionInfo.regionName} | ${programDump.regionInfo.lengthInBytes} (bytes)` }}</div>
      </div>
      <div class="addr-container">
        <template
            v-if="programDump">
        <div v-for="row in programDump.formattedLines"
             :key="row[0]"
             class="addr-line"
             :class="row[0] === programCounter.toString(16).padStart(8, '0') ? 'current-line' : 'other-line'">
          <div class="addr-start">{{ row[0] }}</div>
          <div class="addr-value-line">
            <div class="addr-value"
                 v-for="col in row.slice(1)"
                 :key="col">{{ col }}</div>
          </div>
        </div>
        </template>
      </div>
    </div>
    <div class="stats-container">
      <div class="header">
        <div v-if="ramDump">{{ `${ramDump.regionInfo.regionName} | ${ramDump.regionInfo.lengthInBytes} (bytes)` }}</div>
      </div>
      <div class="addr-container"
           v-if="ramDump">
        <div v-for="row in ramDump.formattedLines"
             :key="row[0]"
             class="addr-line">
          <div class="addr-start">{{ row[0] }}</div>
          <div class="addr-value-line">
            <div class="addr-value"
                 v-for="col in row.slice(1)"
                 :key="col">{{ col }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="stats-container">
      <div class="header">
        <div v-if="registerDump">Registers</div>
      </div>
      <template v-if="registerDump">
        <div v-for="row in registerDump"
             :key="row[0]"
             class="addr-line">
          <div class="addr-start" v-if="row[0].length === 2">&nbsp;{{ row[0] }}</div>
          <div class="addr-start" v-if="row[0].length === 3">{{ row[0] }}</div>
          <div class="addr-value">{{ row[1] }}</div>
        </div>
      </template>
    </div>
    <div class="stats-container">
      <div class="header">CPU Status</div>
      <div class="state-container">
        <div class="state-group program-counter-color">
          <div class="state-header">
            Program Counter (PC)
          </div>
          <div class="state-content program-counter">
            {{ programCounter.toString(16).padStart(8, '0') }}
          </div>
        </div>
        <div class="state-group program-counter-color">
          <div class="state-header">
            Pipeline Stage
          </div>
          <div class="state-content pipeline-container">
            <div class="stage"
                 :class="{ active: cpuState && cpuState.pipelineState === 'fetch' }">
              FE
            </div>
            <div class="stage"
              :class="{ active: cpuState && cpuState.pipelineState === 'decode' }">
              DE
            </div>
            <div class="stage"
                :class="{ active: cpuState && cpuState.pipelineState === 'execute' }">
              EX
            </div>
            <div class="stage"
                 :class="{ active: cpuState && cpuState.pipelineState === 'memory-access' }">
              MEM
            </div>
            <div class="stage"
                 :class="{ active: cpuState && cpuState.pipelineState === 'write-back' }">
              WB
            </div>
          </div>
        </div>
        <div class="state-group program-counter-color">
          <div class="state-header">
            Fetched Instruction
          </div>
          <div class="state-content program-counter">
            {{ cpuState ? cpuState.fetchedInstruction.toString(16).padEnd(8, '0') : 'N/A' }}
          </div>
        </div>
        <div class="state-group program-counter-color">
          <div class="state-header">
            Decoded Result
          </div>
          <div class="state-content cpu-state">
            <div class="pull-right">instr fmt</div><div>{{cpuState ? cpuState.decodedInstruction?.instructionFormat : '' }}</div>
            <div class="pull-right">full Opcode</div><div>{{cpuState ? cpuState.decodedInstruction?.fullOpcode.toString(2) : '' }}</div>
            <div class="pull-right">dest reg</div><div>{{cpuState ? cpuState.decodedInstruction?.destinationRegisterIndex : '' }}</div>
            <div class="pull-right">first reg</div><div>{{cpuState ? cpuState.decodedInstruction?.firstRegisterValue.toString(16).padStart(8, '0') : '' }}</div>
            <div class="pull-right">second reg</div><div>{{cpuState ? cpuState.decodedInstruction?.secondRegisterValue.toString(16).padStart(8, '0') : '' }}</div>
            <div class="pull-right">immediate</div><div>{{cpuState ? cpuState.decodedInstruction?.immediate.toString(16).padStart(8,'0') : '' }}</div>
          </div>
        </div>
        <div class="state-group program-counter-color">
          <div class="state-header">
            Execute Result
          </div>
          <div class="state-content program-counter">
            {{ cpuState ? cpuState.ALUResult.toString(16).padEnd(8, '0') : 'N/A' }}
          </div>
        </div>
        <div class="state-group program-counter-color">
          <div class="state-header">
            Memory Access Result
          </div>
          <div class="state-content program-counter">
            {{ cpuState ? cpuState.memoryAccessResult.toString(16).padEnd(8, '0') : 'N/A' }}
          </div>
        </div>
      </div>
    </div>
    <div class="cmd-panel">
      <div class="cmd-container">
        <div class="fill x1 spacer-top"></div>
        <div class="fill x1 spacer-top"
             v-if="!programLoaded"></div>
        <button class="cmd-item x1 spacer-top"
                v-if="programLoaded"
                @click="reset()">
          Reset
        </button>
        <div class="fill x1 spacer-top"></div>
        <div class="fill x2 spacer-top"
             v-if="!programLoaded || vmHalted" ></div>
        <button class="cmd-item x2 spacer-top"
                v-if="programLoaded && !vmHalted"
                @click="step()">
          Step
        </button>
        <div class="fill x1 spacer-top"></div>
        <div class="fill x2 spacer-top"
             v-if="!programLoaded || vmHalted" ></div>
        <button class="cmd-item x2 spacer-top"
                v-if="programLoaded && !vmHalted"
                @click="next()">
          Next
        </button>
        <div class="fill xf spacer-top"></div>
      </div>
      <div class="vert-spacer">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import Knife from '../components/theme/Knife.vue';
import { RESET_VM, STEP_VM, NEXT_VM } from '@/store/mutations';
import { RootState } from '@/store';
import { MemoryRegionDump } from '@/virtual-machine/risc-v/cpu-cores/peripherals/memory';

export default defineComponent({
  name: 'VirtualMachine' ,
  components: {
    Knife
  },
  setup() {
    const store = useStore<RootState>();

    function formatMemoryDump(dump?: MemoryRegionDump): string[][] {
      const addrLines: string[][] = [];

      if (!dump) {
        return addrLines;
      }

      const rbDv = new DataView(dump.regionBuffer);
      for (let row = 0; row < dump.regionBuffer.byteLength; row+=4) {
        const line: string[] = [];

        const address = dump.regionInfo.startAddress + row;
        line.push(address.toString(16).padStart(8, '0'));

        for (let col = 0; col < 4; col++) {
          const value = rbDv.getUint8(row + col);
          line.push(value.toString(16).padStart(2, '0'));
        }

        addrLines.push(line);
      }

      return addrLines;
    }

    const programLoaded = computed(() => store.state.programLoaded);
    const vmHalted = computed(() => store.state.vmHalted);
    const programDump = computed(() => {
      if (!store.state.programDump) {
        return undefined;
      }

      const regionInfo = store.state.programDump.regionInfo;

      return {
        regionInfo,
        formattedLines: formatMemoryDump(store.state.programDump)
      };
    });
    const ramDump = computed(() => {
      if (!store.state.ramDump) {
        return undefined;
      }

      const regionInfo = store.state.ramDump.regionInfo;

      return {
        regionInfo,
        formattedLines: formatMemoryDump(store.state.ramDump)
      };
    });

    const cpuState = computed(() => store.state.cpuState);
    const registerDump = computed(() => {
      const formattedReg: string[][] = [];

      if (!store.state.cpuState) {
        return formattedReg;
      }

      for (let i = 0; i < 32; i++) {
        formattedReg.push([
          `x${i.toString()}`,
          store.state.cpuState.registers[i].toString(16).padStart(8, '0')
        ]);
      }

      return formattedReg;
    });

    const programCounter = computed(() => store.state.programCounter);


    return {
      reset: () => store.commit(RESET_VM),
      step: () => store.commit(STEP_VM),
      next: () => store.commit(NEXT_VM),
      programLoaded,
      vmHalted,
      programDump,
      ramDump,
      cpuState,
      registerDump,
      programCounter
    }
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
    grid-template-columns: repeat(4, minmax(0, 1fr)) 70px;
    grid-template-rows: 35px auto;

    .top-handle {
      grid-column-start: 1;
      grid-column-end: 5;
    }

    .stats-container {
      border-right: 2px solid var(--mk-yellow-trans);
      display: flex;
      flex-direction: column;

      .header {
        display: flex;
        margin-bottom: 10px;
        justify-content: center;
        align-items: center;
        font-family: 'Roboto Mono', monospace;
        font-weight: 700;
        text-transform: uppercase;
      }

      .addr-line {
        display: flex;
        font-family: 'Roboto Mono', monospace;
        box-sizing: border-box;
        text-transform: uppercase;
        margin-right: 2px;

        &.current-line {
          background: var(--mk-orange);
        }

        .addr-start {
          padding-right: 5px;
          margin-right: 15px;
          margin-left: 5px;
          border-right: 1px solid var(--mk-yellow-trans);
        }

        .addr-value-line {
          display: flex;

          .addr-value {
            margin-right: 10px;
          }
        }
      }

      .state-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        .state-group {
          margin: 8px;
        }

        .state-header {
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Roboto Mono', monospace;
          font-weight: 700;
          text-transform: uppercase;
          height: 2rem;
          background: var(--header-color);
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }

        .state-content {
          font-family: 'Roboto Mono', monospace;
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          text-transform: uppercase;
        }

        .cpu-state {
          display: grid;
          grid-template-columns: 125px auto;
        }

        .pull-right {
          display: flex;
          justify-content: flex-end;
          padding-right: 10px;
        }

        .pipeline-container {
          display: flex;
          justify-content: space-evenly;

          .stage {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 1px 1.5px;
            width: 100%;
            border-bottom-left-radius: 2px;
            border-bottom-right-radius: 2px;
          }

          .active {
            background: var(--mk-pink);
          }

          .inactive {
            background: var(--mk-green);
          }
        }

        .program-counter-color {
          --header-color: var(--mk-blue);
          --border-color: var(--mk-blue);
        }

        .program-counter {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

  }
</style>