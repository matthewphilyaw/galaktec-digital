import * as astat from '@/virtual-machine/grammar/assembly-statements';
import { Instruction, PseudoRelocation, Offset } from '@/virtual-machine/grammar/assembly-statements';
import { Token } from 'moo';
import {
  encodeIType,
  I_TYPE_PATTERN,
  R_TYPE_PATTERN, encodeRType, S_TYPE_PATTERN, encodeSType, encodeUType, U_TYPE_PATTERN
} from '@/virtual-machine/risc-v/assembler/instruction-type-encoder';
import { AssembledInstruction, AssemblerError } from '@/virtual-machine/risc-v/assembler/assembler';
import { REGISTER_MAP } from '@/virtual-machine/risc-v/assembler/resgisters';
import { binWord, Chunk } from '@/virtual-machine/utils/binary-string-formatter';

export abstract class InstructionAssembler {
  protected opcode: number;
  protected f3?: number;
  protected f7?: number;

  constructor(opcode: number, f3?: number, f7?: number) {
    this.opcode = opcode;
    this.f3 = f3;
    this.f7 = f7;
  }

  abstract assemble(instruction: Instruction): AssembledInstruction
}

export class ITypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): AssembledInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = (instruction.argTokens[0] as Token).value;
    let rs1;
    let imm;

    if (instruction.argTokens[1] instanceof astat.Offset) {
      const offsetArg = instruction.argTokens[1];
      rs1 = offsetArg.base.value;
      imm = (offsetArg.offset as unknown) as number;
    } else if(instruction.argTokens[1] instanceof astat.PseudoRelocation) {
      throw new Error('PsuedoRelocation not supported yet.');
    } else {
      rs1 = (instruction.argTokens[1] as Token).value;
      imm = (((instruction.argTokens[2] as Token).value) as unknown) as number;
    }

    // F7 is only supplied for SRAI to indicate it's an arithmetic shift
    if (this.f7) {
      imm |= (this.f7 << 5);
    }

    const formattedInstruction = formatInstruction(instruction);
    const word = encodeIType(
      this.opcode,
      REGISTER_MAP[rd],
      REGISTER_MAP[rs1],
      imm,
      this.f3!
    );
    const formattedWord = binWord(word, Chunk.CUSTOM, I_TYPE_PATTERN);

    return new AssembledInstruction(word, formattedWord, formattedInstruction);
  }
}

export class STypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): AssembledInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = instruction.argTokens[0] as Token;
    const offset = instruction.argTokens[1] as astat.Offset;

    const formattedInstruction = formatInstruction(instruction);
    const word = encodeSType(
      this.opcode,
      REGISTER_MAP[offset.base.value],
      REGISTER_MAP[rd.value],
      (offset.offset.value as unknown) as number,
      this.f3!,
    );
    const formatted = binWord(word, Chunk.CUSTOM, S_TYPE_PATTERN);

    return new AssembledInstruction(word, formatted, formattedInstruction);
  }
}

export class UTypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): AssembledInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = instruction.argTokens[0] as Token;
    const imm = (((instruction.argTokens[1] as Token).value) as unknown) as number;

    const formattedInstruction = formatInstruction(instruction);
    const word = encodeUType(
      this.opcode,
      REGISTER_MAP[rd.value],
      imm
    );
    const formatted = binWord(word, Chunk.CUSTOM, U_TYPE_PATTERN);

    return new AssembledInstruction(word, formatted, formattedInstruction);
  }
}

export class RTypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): AssembledInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = (instruction.argTokens[0] as Token).value;
    const rs1 = (instruction.argTokens[1] as Token).value;
    const rs2 = (instruction.argTokens[2] as Token).value;

    const formattedInstruction = formatInstruction(instruction);
    const word = encodeRType(
      this.opcode,
      REGISTER_MAP[rd],
      REGISTER_MAP[rs1],
      REGISTER_MAP[rs2],
      this.f3!,
      this.f7 ?? 0);
    const formatted = binWord(word, Chunk.CUSTOM, R_TYPE_PATTERN);

    return new AssembledInstruction(word, formatted, formattedInstruction);
  }
}

export const instructionAssemblerLookup: Record<string, InstructionAssembler> = {
  'LUI': new UTypeAssembler(0b0110111),
  'AUIPC': new UTypeAssembler(0b0010111),
  /*
  'JAL': {
    opcode: 0b1101111,
  },
  'JALR': {
    opcode: 0b1100111,
  },
  'BEQ': {
    opcode: 0b1100011,
  },
  'BNE': {
    opcode: 0b1100011,
  },
  'BLT': {
    opcode: 0b1100011,
  },
  'BGE': {
    opcode: 0b1100011,
  },
  'BLTU': {
    opcode: 0b1100011,
  },
  'BGEU': {
    opcode: 0b1100011,
  },
 */
  'LB': new ITypeAssembler(0b0000011, 0b000),
  'LH': new ITypeAssembler(0b0000011, 0b001),
  'LW': new ITypeAssembler(0b0000011, 0b010),
  'LBU': new ITypeAssembler(0b0000011, 0b100),
  'LHU': new ITypeAssembler(0b0000011, 0b101),
  'SB': new STypeAssembler(0b0100011, 0b000),
  'SH': new STypeAssembler(0b0100011, 0b001),
  'SW': new STypeAssembler(0b0100011, 0b010),
  'ADDI': new ITypeAssembler(0b0010011,0b000 ),
  'SLTI': new ITypeAssembler(0b0010011, 0b010),
  'SLTIU': new ITypeAssembler(0b0010011, 0b011),
  'XORI': new ITypeAssembler(0b0010011, 0b100),
  'ORI': new ITypeAssembler(0b0010011, 0b110),
  'ANDI': new ITypeAssembler(0b0010011, 0b111),
  'SLLI': new ITypeAssembler(0b0010011, 0b001),
  'SRLI': new ITypeAssembler(0b0010011, 0b101),
  'SRAI': new ITypeAssembler(0b0010011, 0b101, 0b100000),
  'ADD': new RTypeAssembler(0b0110011, 0b000),
  'SUB': new RTypeAssembler(0b0110011, 0b000, 0b0100000),
  'SLL': new RTypeAssembler(0b0110011, 0b001),
  'SLT': new RTypeAssembler(0b0110011, 0b010),
  'SLTU': new RTypeAssembler(0b0110011, 0b011),
  'XOR': new RTypeAssembler(0b0110011, 0b100),
  'SRL': new RTypeAssembler(0b0110011, 0b101),
  'SRA': new RTypeAssembler(0b0110011, 0b101, 0b0100000),
  'OR': new RTypeAssembler(0b0110011, 0b110),
  'AND': new RTypeAssembler(0b0110011, 0b111),
}

function printArg(arg: Token | PseudoRelocation | Offset): string {
  if ('line' in arg) {
    return `${arg.type}: ${arg.value}`;
  } else if (arg instanceof PseudoRelocation) {
    if (arg.offset) {
      return `${arg.type.value}: ( offset: ${arg.offset}, base: ${arg.base} )`;
    } else {
      return `${arg.type.value}: ( base: ${arg.base} )`;
    }
  } else if (arg instanceof Offset) {
    return `offset: ( offset: ${arg.offset}, base: ${arg.base} )`;
  }

  throw new Error('Arg is not a known type');
}

function formatInstruction(instruction: astat.Instruction): string {
  if (!instruction.argTokens) {
    return '';
  }

  const args = instruction.argTokens.map(printArg);

  let argList = '';
  if (args.length > 0) {
    argList = `(${args.join(', ')})`;
  }

  return `opcode: ${instruction.opcodeToken.value} ${argList}`;
}

export function assembleStatement(instruction: astat.Instruction): AssembledInstruction | AssemblerError {
  const instrAssembler = instructionAssemblerLookup[instruction.opcodeToken.value.toUpperCase()];

  if (!instrAssembler) {
    return new AssemblerError(
      'Instruction not supported',
      formatInstruction(instruction),
      instruction
    );
  }

  return instrAssembler.assemble(instruction);
}

