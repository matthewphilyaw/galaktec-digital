import { assemble } from './risc-v/assembler/assembler';
import { ProtoCore, CoreState } from './risc-v/cpu-cores/proto-core';
import { MemoryRegion, MemoryRegionDump } from './risc-v/cpu-cores/peripherals/memory';

const protoMemoryLayout: MemoryRegion[] = [
  {
    regionName: 'program',
    startAddress: 0x0,
    lengthInBytes: 128,
    accessWidthInBytes: 1,
    clockCyclesForWrite: 4,
    clockCyclesForRead: 4,
    readonly: false
  },
  {
    regionName: 'ram',
    startAddress: 0x80,
    lengthInBytes: 64,
    accessWidthInBytes: 1,
    clockCyclesForWrite: 1,
    clockCyclesForRead: 1,
    readonly: false
  }
];

export class VM {
  private program: string;
  private core: ProtoCore;

  constructor(program: string) {
    this.program = program;

    const ctx = assemble(program, 2**6);
    this.core = new ProtoCore(protoMemoryLayout);

    this.core.loadProgram(ctx.programMemoryBuffer);
    this.core.memoryController.dumpMemories(4);
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

