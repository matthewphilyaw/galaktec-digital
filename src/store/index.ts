import { createStore } from 'vuex';
import { MemoryRegionDump } from '@/virtual-machine/risc-v/cpu-cores/peripherals/memory';
import { CoreState } from '@/virtual-machine/risc-v/cpu-cores/proto-core';

import {
  LOAD_PROGRAM,
  RESET_VM,
  STEP_VM, RUN_VM
} from './mutations';

import { VM } from '@/virtual-machine/vm';
import { Instruction } from '@/virtual-machine/grammar/assembly-statements';
import { IntermediateInstruction } from '@/virtual-machine/risc-v/assembler/intermediate-types';

export interface RootState {
  programLoaded: boolean,
  vmHalted: boolean,
  programDump?: MemoryRegionDump,
  ramDump?: MemoryRegionDump,
  registerDump?: number[],
  cpuState?: CoreState,
  programCounter: number,
  currentLineNumber: number,
  intermediateInstruction: IntermediateInstruction | undefined
}

let vm: VM;
let currentProgram: string;

function updateStateFromVM(vm: VM, state: RootState): void {
  state.cpuState = vm.getCoreState();
  state.programCounter = state.cpuState.programCounter;
  state.programDump = vm.getProgramStorage();
  state.ramDump = vm.getRam();
  state.registerDump = state.cpuState.registers;

  const intermediateInstruction = vm.getCurrentIntermediateInstruction();
  state.currentLineNumber = intermediateInstruction.instructionStatement.opcodeToken.line;
  state.intermediateInstruction = intermediateInstruction;

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
      currentLineNumber: 0,
      intermediateInstruction: undefined
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
    },
    [RUN_VM](state: RootState) {
      try {
        // Either mid execution of pipeline
        // or on the initial state.
        // Lets pump the clock once and run till next fetch
        do {
          vm.tick();
        } while (vm.getCoreState().pipelineState !== 'fetch');

        updateStateFromVM(vm, state);
      }
      catch (error) {
        console.log(error);
        state.vmHalted = true;
      }
      updateStateFromVM(vm, state);
    }
  }
});