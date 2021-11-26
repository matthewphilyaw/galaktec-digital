import {MemoryController, MemoryRegion} from './peripherals/memory';
import { FullOpcodeConstants, OpcodeGroupsConstants } from '@/virtual-machine/risc-v/cpu-cores/opcode';

enum InstructionFormat {
  R,
  I,
  S,
  B,
  U,
  J
}

class DecodedInstruction {
  constructor(
    public instructionFormat: InstructionFormat,
    public fullOpcode: number, // combines opcode, func3 and func7 for  easy comparison
    public destinationRegisterIndex: number,
    public firstRegisterValue: number,
    public secondRegisterValue: number,
    public immediate: number
  ) {}
}

export interface CoreState {
  pipelineState:  'fetch' | 'decode' | 'execute' | 'memory-access' | 'write-back';
  programCounter: number;
  fetchedInstruction: number;
  decodedInstruction?: DecodedInstruction;
  ALUResult: number;
  memoryAccessResult: number;
  registers: number[];

}

export class ProtoCore {
  public  memoryController: MemoryController;
  private pc: number;
  private registers: number[] = new Array(32).fill(0);

  private instruction: number;
  private decodedInstruction?: DecodedInstruction;
  private executionResult: number;
  private memoryAccessResult: number;

  private state: 'fetch' | 'decode' | 'execute' | 'memory-access' | 'write-back';

  private jump: boolean;

  constructor(memoryController: MemoryRegion[]) {
    this.memoryController = new MemoryController(memoryController);
    this.pc = 0;
    this.state = 'fetch';

    this.instruction = 0;
    this.executionResult = 0;
    this.memoryAccessResult = 0;

    this.jump = false;
  }

  loadProgram(programBuffer: ArrayBuffer): void {
    const dv = new DataView(programBuffer);

    for (let address = 0; address < programBuffer.byteLength; address++) {
      const byte = dv.getUint8(address);
      this.memoryController.writeByte(address, byte);
    }
  }

  getState(): CoreState {
    return {
      pipelineState:  this.state,
      programCounter: this.pc,
      fetchedInstruction: this.instruction,
      decodedInstruction: this.decodedInstruction,
      ALUResult: this.executionResult,
      memoryAccessResult: this.memoryAccessResult,
      registers: this.registers
    };
  }

  tick(): void {
    switch (this.state) {
      case 'fetch':
        this.fetch();
        this.state = 'decode';
        break;
      case 'decode':
        this.decode();
        this.state = 'execute';
        break;
      case 'execute':
        this.execute();
        this.state = 'memory-access';
        break;
      case 'memory-access':
        this.accessMemory();
        this.state = 'write-back';
        break;
      case 'write-back':
        this.writeRegisters();
        this.state = 'fetch';

        this.instruction = 0;
        this.decodedInstruction = undefined;
        this.executionResult = 0;
        this.memoryAccessResult = 0;

        if (!this.jump) {
          this.pc += 4;
        } else {
          this.jump = false;
        }
        break;
      default:
        throw new Error('Invalid state');
    }
  }

  fetch(): void {
    this.instruction = this.memoryController.readWord(this.pc);
  }

  decode(): void {
    const instruction = this.instruction;

    const opcode = instruction & 0x7F;
    const funct3 = (instruction >>> 12) & 0x7;

    const funct7 = (instruction >>> 25) & 0x7F;
    const rd = (instruction >>> 7) & 0x1f;
    const r1 = (instruction >>> 15) & 0x1f;
    const r2 = (instruction >>> 20) & 0x1f;

    let decoded = null;
    let immediate = 0;

    switch (opcode) {
      case OpcodeGroupsConstants.JALR:
      case OpcodeGroupsConstants.ALU_IMMEDIATE:
      case OpcodeGroupsConstants.LOAD:
        immediate = (instruction >>> 20) & 0xfff;
        decoded = new DecodedInstruction(
          InstructionFormat.I,
          (funct3 << 7) | opcode,
          rd,
          r1 === 0 ? 0 : this.registers[r1],
          0,
          immediate
        );
        break;
      case OpcodeGroupsConstants.BRANCHING:
      case OpcodeGroupsConstants.STORE:
        immediate = (funct7 << 5) | rd;
        decoded = new DecodedInstruction(
          InstructionFormat.S,
          (funct3 << 7) | opcode,
          0,
          r1 === 0 ? 0 : this.registers[r1],
          r2 === 0 ? 0 : this.registers[r2],
          immediate
        );
        break;
      case OpcodeGroupsConstants.ALU:
        decoded = new DecodedInstruction(
          InstructionFormat.R,
          (funct7 << 10) | (funct3 << 7) | opcode,
          rd,
          r1 === 0 ? 0 : this.registers[r1],
          r2 === 0 ? 0 : this.registers[r2],
          0
        );
        break;
      case OpcodeGroupsConstants.JAL: {
        const imm1to10 = (instruction & 0x7FE00000) >>> 21;
        const imm11 = (instruction & 0x100000) >>> 20;
        const imm12to19 = (instruction & 0xFF000) >>> 12;
        const imm20 = (instruction & 0x80000000) >>> 31;

        immediate = 0;
        immediate = (imm20 << 20) | (imm12to19 << 12) | (imm11 << 11) | (imm1to10 << 1);
        immediate = (((immediate << 12) >> 12));

        decoded = new DecodedInstruction(
          InstructionFormat.J,
          opcode,
          rd,
          0,
          0,
          immediate // jump is relative to PC
        );
        break;
      }
      case OpcodeGroupsConstants.LUI:
      case OpcodeGroupsConstants.AUIPC: {

        immediate = instruction & 0xffff_f000;

        decoded = new DecodedInstruction(
          InstructionFormat.U,
          opcode,
          rd,
          r1 === 0 ? 0 : this.registers[r1],
          0,
          immediate
        );
        break;
      }
      default:
        throw Error('Opcode not recognized!');
    }

    this.decodedInstruction = decoded;
  }

  execute(): void {
    const instruction = this.decodedInstruction!;

    switch (instruction.fullOpcode) {
      case FullOpcodeConstants.SW: // sw
      case FullOpcodeConstants.ADDI: // addi
      case FullOpcodeConstants.LW: // lw
        this.executionResult = instruction.firstRegisterValue + instruction.immediate;
        break;
      case FullOpcodeConstants.ADD: // add
        this.executionResult = instruction.firstRegisterValue + instruction.secondRegisterValue;
        break;
      case FullOpcodeConstants.SUB:
        this.executionResult = instruction.secondRegisterValue - instruction.firstRegisterValue;
        break;
      case FullOpcodeConstants.JAL:
        this.executionResult = this.pc + 4; // result is the return address PC + 4
        this.pc = this.pc + instruction.immediate;
        this.jump = true;
        break;
      case FullOpcodeConstants.JALR: {
        this.executionResult = this.pc + 4; // result is the return address PC + 4
        this.pc = (instruction.firstRegisterValue + instruction.immediate) & 0xFFFF_FFFE;
        this.jump = true;
        break;
      }
      default:
        throw new Error('unknown instruction');
    }

  }

  accessMemory(): void {
    const opcode = this.decodedInstruction!.fullOpcode & 0x3f;
    // If no memory operation is needed then forward the value in execution along
    if (opcode !== OpcodeGroupsConstants.LOAD && opcode !== OpcodeGroupsConstants.STORE) {
      this.memoryAccessResult = this.executionResult;
      return;
    }

    const address = this.executionResult;
    switch (this.decodedInstruction!.fullOpcode) {
      case FullOpcodeConstants.LW:
        // execution result will be a memory address
        this.memoryAccessResult = this.memoryController.readWord(address);
        break;
      case FullOpcodeConstants.SW:
        this.memoryController.writeWord(address, this.decodedInstruction!.secondRegisterValue);
        break;
      default:
        throw new Error('Opcode not supported');
    }
  }

  writeRegisters(): void {
    // These formats don't modify registers
    if (this.decodedInstruction!.instructionFormat === InstructionFormat.S ||
        this.decodedInstruction!.instructionFormat === InstructionFormat.B) {
      return;
    }

    // this could be either a true value from memory or the result of an operation which was forwarded
    // along the pipeline for simplicity
    if (this.decodedInstruction!.destinationRegisterIndex !== 0) {
      this.registers[this.decodedInstruction!.destinationRegisterIndex] = this.memoryAccessResult;
    }
  }

}

/*

|- IF
|  - 1 cycle
|  - 2 cycle
|

- ID
- EX
- ME
- WB

*/

/**
 * Pipeline examples Notes
 *
 *   1 2 3 4 5 6 7 8 9 A B C D E F G
 *   F D X M M W
 *     F D X - M M W
 *       F D - X - M M W
 *         F - D - X - M M W
 *           - F - D - X - M M W
 *               - F - D - x - M M W
 *                   - F - D - X - M M W
 *                       - F - D - X - M W
 *                           - F - D - X M W
 *                               - F - D X M W
 *                                   - F D X M W
 *                                       F D X M W
 *
 *   1 2 3 4 5 6 7 8
 *   | | | | | | | |
 *   F D X M W                   - NOP
 *     F D X M W                 - NOP
 *       F D X M M W             - LW
 *         F D X - M W           - ADD
 *           F D - X M W         - ADD
 *             F - D X M W       - ADD
 *               - F D X M W     - ADD
 *
 *
 *   1 2 3 4 5 6 7 8
 *   | | | | | | | |
 *   F D X M W                               - NOP
 *     F D X M M W                           - LW
 *       F D X - M M W                       - LW
 *         F D - X - M M W                   - LW
 *           F - D - X - M M W               - LW
 *             - F - D - X - M M W           - LW
 *                   - F - D - X - M M W     - LW
 *
 *
 *
 * DONE every tick to simulate pipeline
 *
 * const fr = fetch.tick(this.pc);
 *
 * if (decode.stalled) {
 *   fetch.stall(); // will produce the same result next tick - effectively persisting to next tick
 *                  // and PC will not be incremented.
 * }
 *
 * const dr = decode.tick(fr); // if stalled nothing is done with fr
 *
 * if (execute.stalled) {
 *   decode.stall();
 * }
 *
 * const er = execute.tick(dr);
 *
 * if (mem.stalled) { // should stall on second tick for mem not first
 *  execute.stall();
 * }
 *
 * const mr = mem.tick(er);
 *
 * if (wb.stalled) {
 *  mem.stall();
 * }
 *
 * mb.tick(mr);
 *
 */
