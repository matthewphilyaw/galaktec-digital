import { assemble } from './risc-v/assembler/assembler';
import { ProtoCore, CoreState } from './risc-v/cpu-cores/proto-core';
import { MemoryRegion, MemoryRegionDump } from './risc-v/cpu-cores/peripherals/memory';

const programMemory: MemoryRegion = {
  regionName: 'program',
  startAddress: 0x0,
  lengthInBytes: 128,
  accessWidthInBytes: 1,
  clockCyclesForWrite: 4,
  clockCyclesForRead: 4,
  readonly: false
};

// Yes I know Random Access Memory Memory...
const ramMemory: MemoryRegion = {
  regionName: 'ram',
  startAddress: 0x80,
  lengthInBytes: 64,
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

  constructor(program: string) {
    this.program = program;

    const ctx = assemble(program, programMemory.lengthInBytes);
    this.core = new ProtoCore(protoMemoryLayout);

    this.core.loadProgram(ctx.programMemoryBuffer);
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

