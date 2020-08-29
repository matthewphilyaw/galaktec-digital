import * as astat from '@/virtual-machine/grammar/assembly-statements';
import { Instruction, PseudoRelocation, Offset } from '@/virtual-machine/grammar/assembly-statements';
import { Token } from 'moo';
import { encodeIType, I_TYPE_PATTERN } from '@/virtual-machine/risc-v/assembler/instruction-type-encoder';
import { AssembledInstruction, AssemblerError } from '@/virtual-machine/risc-v/assembler/assembler';
import { REGISTER_MAP } from '@/virtual-machine/risc-v/assembler/resgisters';
import { binWord, Chunk } from '@/virtual-machine/utils/binary-string-formatter';

export interface InstructionAssembler {
  assemble: (instruction: Instruction) => AssembledInstruction;
}

export class ITypeAssembler implements InstructionAssembler {
  private opcode: number;
  private f3: number;
  private f7?: number;

  constructor(opcode: number, f3: number, f7?: number) {
    this.opcode = opcode;
    this.f3 = f3;
    this.f7 = f7;
  }

  assemble(instruction: Instruction): AssembledInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = (instruction.argTokens[0] as Token).value;
    const rs1 = (instruction.argTokens[1] as Token).value;
    let imm = (((instruction.argTokens[2] as Token).value) as unknown) as number;

    // F7 is only supplied for SRAI to indicate it's an arithmetic shift
    if (this.f7) {
      imm |= (this.f7 << 5);
    }

    const formattedInstruction = formatInstruction(instruction);
    const word = encodeIType(this.opcode, REGISTER_MAP[rd], REGISTER_MAP[rs1], imm, this.f3);
    const formattedWord = binWord(word, Chunk.CUSTOM, I_TYPE_PATTERN);

    return new AssembledInstruction(word, formattedWord, formattedInstruction);
  }
}

export const instructionAssemblerLookup: Record<string, InstructionAssembler> = {
  /*
  'LUI': {
    opcode: 0b0110111,
  },
  'AUIPC': {
    opcode: 0b0010111,
  },
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
  'LB': {
    opcode: 0b0000011,
  },
  'LH': {
    opcode: 0b0000011,
  },
  'LW': {
    opcode: 0b0000011,
  },
  'LBU': {
    opcode: 0b0000011,
  },
  'LHU': {
    opcode: 0b0000011,
  },
  'SB': {
    opcode: 0b0100011,
  },
  'SH': {
    opcode: 0b0100011,
  },
  'SW': {
    opcode: 0b0100011,
  },*/
  'ADDI': new ITypeAssembler(
    0b0010011,
     0b000
  ),
  'SLTI': new ITypeAssembler(
    0b0010011,
    0b010
  ),
  'SLTIU': new ITypeAssembler(
    0b0010011,
    0b011
  ),
  'XORI': new ITypeAssembler(
    0b0010011,
    0b100
  ),
  'ORI': new ITypeAssembler(
    0b0010011,
    0b110
  ),
  'ANDI': new ITypeAssembler(
    0b0010011,
    0b111
  ),
  'SLLI': new ITypeAssembler(
    0b0010011,
   0b001
  ),
  'SRLI': new ITypeAssembler(
    0b0010011,
    0b101
  ),
  'SRAI': new ITypeAssembler(
    0b0010011,
    0b101,
    0b100000
  ),
  /*
  'ADD': {
    opcode: 0b0110011,
  },
  'SUB': {
    opcode: 0b0110011,
  },
  'SLL': {
    opcode: 0b0110011,
  },
  'SLT': {
    opcode: 0b0110011,
  },
  'SLTU': {
    opcode: 0b0110011,
  },
  'XOR': {
    opcode: 0b0110011,
  },
  'SRL': {
    opcode: 0b0110011,
  },
  'SRA': {
    opcode: 0b0110011,
  },
  'OR': {
    opcode: 0b0110011,
  },
  'AND': {
    opcode: 0b0110011,
  },
  'FENCE': {
    opcode: 0b0001111,
  },
  'FENCE.I': {
    opcode: 0b0001111,
  },
  'ECALL': {
    opcode: 0b1110011,
  },
  'EBREAK': {
    opcode: 0b1110011,
  },
  'CSRRW': {
    opcode: 0b1110011,
  },
  'CSRRS': {
    opcode: 0b1110011,
  },
  'CSRRC': {
    opcode: 0b1110011,
  },
  'CSRRWI': {
    opcode: 0b1110011,
  },
  'CSRRSI': {
    opcode: 0b1110011,
  },
  'CSRRCI': {
    opcode: 0b1110011,
  }
 */
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

