import { assemble, AssemblerContext } from './risc-v/assembler/assembler';
import { ProtoCore, CoreState } from './risc-v/cpu-cores/proto-core';
import { MemoryRegion, MemoryRegionDump } from './risc-v/cpu-cores/peripherals/memory';
import { IntermediateInstruction } from './risc-v/assembler/intermediate-types';

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

export class VM {
  private program: string;
  private core: ProtoCore;
  private assemblerCtx: AssemblerContext;

  constructor(program: string) {
    this.program = program;

    this.assemblerCtx = assemble(program, programMemory.lengthInBytes);
    this.core = new ProtoCore(protoMemoryLayout);

    this.core.loadProgram(this.assemblerCtx.programMemoryBuffer);
  }

  getCurrentIntermediateInstruction(): IntermediateInstruction {
    const currentAddress = this.core.getState().programCounter;
    const intermediate = this.assemblerCtx.programMap.get(currentAddress);
    if (!intermediate) {
      throw new Error(`Can't find intermeidate at address: ${currentAddress.toString(16).padStart(8, '0')}`);
    }

    return intermediate;
  }

  getRam(): MemoryRegionDump {
    return this.core.memoryController.getRegionDump('ram');
  }

  getProgramStorage(): MemoryRegionDump {
    return this.core.memoryController.getRegionDump('program');
  }

  getCoreState(): CoreState {
    return this.core.getState();
  }

  tick() {
    this.core.tick();
  }
}

