import {VM} from '../virtual-machine/vm';
import {CoreState} from '../virtual-machine/risc-v/cpu-cores/proto-core';
import {MemoryRegionDump} from '../virtual-machine/risc-v/cpu-cores/peripherals/memory';
import {IntermediateInstruction} from '../virtual-machine/risc-v/assembler/intermediate-types';
import {useRef, useState} from 'react';

export interface VMState {
  coreState: CoreState;
  programDump: MemoryRegionDump;
  ramDump: MemoryRegionDump;
  intermediateInstruction: IntermediateInstruction
}

function getVMState(vm: VM): VMState {
  return {
    coreState: vm.getCoreState(),
    programDump: vm.getProgramStorage(),
    ramDump: vm.getRam(),
    intermediateInstruction: vm.getCurrentIntermediateInstruction()
  }
}

export interface VMControls {
  loadProgram: (program: string) => void;
  run: () => void;
  step: () => void;
}

export interface VMHook {
  vmState: VMState;
  controls: VMControls;
}

export function useVirtualMachine(initialProgram: string): VMHook {
  const vmRef = useRef(new VM(initialProgram));
  const [vmState, setVmState] = useState(getVMState(vmRef.current));

  function loadProgram(program: string) {
    vmRef.current = new VM(program);
    setVmState(getVMState(vmRef.current));
  }

  function run() {
    if (!vmRef.current) {
      const msg = 'VM has not be initialized.';
      console.log(msg);
      throw msg;
    }

    do {
      vmRef.current.tick()
    } while (vmRef.current.getCoreState().pipelineState !== 'fetch');

    setVmState(getVMState(vmRef.current));
  }

  function step() {
    if (!vmRef.current) {
      const msg = 'VM has not be initialized.';
      console.log(msg);
      throw msg;
    }

    vmRef.current.tick()
    setVmState(getVMState(vmRef.current));
  }

  return {
    vmState,
    controls: {
      loadProgram,
      run,
      step
    }
  };
}