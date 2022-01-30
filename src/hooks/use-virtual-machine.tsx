import {assemble, AssemblerContext, AssemblerError} from '../virtual-machine/risc-v/assembler/assembler';
import {ProtoCore, CoreState} from '../virtual-machine/risc-v/cpu-cores/proto-core';
import {MemoryRegion, MemoryRegionDump} from '../virtual-machine/risc-v/cpu-cores/peripherals/memory';
import {IntermediateInstruction} from '../virtual-machine/risc-v/assembler/intermediate-types';
import {useRef, useState} from 'react';

const programMemory: MemoryRegion = {
  regionName: 'program',
  startAddress: 0x0,
  lengthInBytes: 2048,
  accessWidthInBytes: 1,
  clockCyclesForWrite: 4,
  clockCyclesForRead: 4,
  readonly: false
};

// Yes I know Random Access Memory Memory...
const ramMemory: MemoryRegion = {
  regionName: 'ram',
  startAddress: 0x800,
  lengthInBytes: 1024,
  accessWidthInBytes: 1,
  clockCyclesForWrite: 1,
  clockCyclesForRead: 1,
  readonly: false
};

const protoMemoryLayout: MemoryRegion[] = [
  programMemory,
  ramMemory
];

let nextConsoleLineNumber = 0;
export interface ConsoleLine {
  id: number,
  value: string
}

export interface VMState {
  coreState: CoreState;
  fetchedInstructionContext?: IntermediateInstruction;
  programDump: MemoryRegionDump;
  ramDump: MemoryRegionDump;
  consoleBuffer: ConsoleLine[];
  error: Boolean;
}

export class VM {
  private program: string;
  private core: ProtoCore;
  private assemblerCtx?: AssemblerContext;
  private readonly consoleBuffer: ConsoleLine[];
  private inErrorState: boolean;

  constructor(program: string) {
    this.program = program;
    this.core = new ProtoCore(protoMemoryLayout);
    this.consoleBuffer = [];
    this.inErrorState = false;

    try {
      this.assemblerCtx = assemble(program, programMemory.lengthInBytes);
      this.core.loadProgram(this.assemblerCtx.programMemoryBuffer);
    } catch (error: unknown) {
      if (error instanceof AssemblerError) {
        this.setConsoleMessage(error.reason);
      }
      else if (error instanceof Error) {
        this.setConsoleMessage(error.message);
      }
      else {
        this.setConsoleMessage(JSON.stringify(error));
      }

      this.inErrorState = true;
    }
  }

  setConsoleMessage(msg: string) {
    this.consoleBuffer.push({
      id: nextConsoleLineNumber++,
      value: msg,
    })
  }

  getState(): VMState {
    const coreState = this.core.getState();

    let fetchedInstructionContext = undefined;
    if (coreState.pipelineState === 'decode') {
      const currentAddress = this.core.getState().programCounter;
      const intermediate = this.assemblerCtx?.programMap.get(currentAddress);

      if (!intermediate) {
        this.setConsoleMessage(`Can't find intermediate at address: ${currentAddress.toString(16).padStart(8, '0')}`);
      } else {
        fetchedInstructionContext = intermediate;
      }
    }

    return {
      coreState: this.core.getState(),
      fetchedInstructionContext,
      ramDump: this.core.memoryController.getRegionDump('ram'),
      programDump: this.core.memoryController.getRegionDump('program'),
      consoleBuffer: this.consoleBuffer,
      error: this.inErrorState
    }
  }

  tick() {
    if (this.inErrorState) {
      this.setConsoleMessage('VM is in an error state, must recreate VM.');
    }

    try {
      this.core.tick();
    } catch(error) {
      if (error instanceof Error) {
        this.setConsoleMessage(error.message);
      }
      else {
        this.setConsoleMessage(JSON.stringify(error));
      }

      this.inErrorState = true;
    }
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

let vm = new VM('');

export function useVirtualMachine(): VMHook {
  const [vmState, setVmState] = useState(vm.getState());

  function loadProgram(program: string) {
    vm = new VM(program);
    setVmState(vm.getState());
  }

  function run() {
    if (!vm) {
      const msg = 'VM has not be initialized.';
      console.log(msg);
      throw new Error(msg);
    }

    let tries = 0;
    do {
      vm.tick()
    } while (vm.getState().coreState.pipelineState !== 'fetch' && !vm.getState().error);

    setVmState(vm.getState());
  }

  function step() {
    if (!vm) {
      const msg = 'VM has not be initialized.';
      console.log(msg);
      throw msg;
    }

    vm.tick()
    setVmState(vm.getState());
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