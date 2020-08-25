import { createStore } from 'vuex';
import { MemoryRegionDump } from '@/virtual-machine/risc-v/cpu-cores/peripherals/memory';
import { CoreState } from '@/virtual-machine/risc-v/cpu-cores/proto-core';

import {
  LOAD_PROGRAM,
  RESET_VM,
  STEP_VM
} from './mutations';

import { VM } from '@/virtual-machine/vm';

export interface RootState {
  programLoaded: boolean,
  vmHalted: boolean,
  programDump?: MemoryRegionDump,
  ramDump?: MemoryRegionDump,
  registerDump?: number[],
  cpuState?: CoreState,
  programCounter: number
}

let vm: VM;
let currentProgram: string;

function updateStateFromVM(vm: VM, state: RootState): void {
  state.cpuState = vm.getCoreState();
  state.programCounter = state.cpuState.programCounter;
  state.programDump = vm.getProgramStorage();
  state.ramDump = vm.getRam();
  state.registerDump = state.cpuState.registers;

  state.programLoaded = true;
}

export const store = createStore<RootState>({
  state() {
    return {
      programLoaded: false,
      vmHalted: true,
      programDump: undefined,
      ramDump: undefined,
      registerDump: undefined,
      cpuState: undefined,
      programCounter: 0,
    };
  },
  mutations: {
    [LOAD_PROGRAM](state: RootState, program: string) {
      currentProgram = program;
      vm = new VM(currentProgram);
      updateStateFromVM(vm, state);

      state.vmHalted = false;
    },
    [RESET_VM](state: RootState) {
      vm = new VM(currentProgram);
      updateStateFromVM(vm, state);

      state.vmHalted = false;
    },
    [STEP_VM](state: RootState) {
      try {
        vm.tick();
      }
      catch (error) {
        console.log(error);
        state.vmHalted = true;
      }
      updateStateFromVM(vm, state);
    }
  }
});