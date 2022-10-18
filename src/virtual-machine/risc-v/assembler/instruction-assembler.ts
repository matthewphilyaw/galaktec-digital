import * as astat from '../../grammar/assembly-statements';
import {Instruction, Offset, PseudoRelocation} from '../../grammar/assembly-statements';
import {Token} from 'moo';
import {AssemblerError} from './assembler';
import {REGISTER_MAP} from './resgisters';
import {
  IntermediateInstruction,
  ITypeIntermediate,
  RTypeIntermediate,
  SBTypeIntermediate,
  UJTypeIntermediate,
} from './intermediate-types';
import {SymbolTable} from './symbol-table';

export abstract class InstructionAssembler {
  protected opcode: number;
  protected f3?: number;
  protected f7?: number;

  constructor(opcode: number, f3?: number, f7?: number) {
    this.opcode = opcode;
    this.f3 = f3;
    this.f7 = f7;
  }

  abstract assemble(instruction: Instruction, symbolTable: SymbolTable, pc: number): IntermediateInstruction
}

export class ITypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): IntermediateInstruction {
    // TODO: Revisit this. If pseudo instruction needs to emit more than one instruction this does not work.
    // TODO: Potentially need to the building of the instruction outside of the assembler
    switch (instruction.opcodeToken.text.toLowerCase()) {
      case 'nop':
        return this.buildPseudoNOP(instruction);
      case 'ret':
        return this.buildPseudoRET(instruction);
      default:
        return this.buildGenericIType(instruction);
    }

  }

  buildPseudoNOP(instruction: Instruction): IntermediateInstruction {
    return new ITypeIntermediate(
      REGISTER_MAP['x0'],
      REGISTER_MAP['x0'],
      0,
      this.opcode,
      instruction,
      this.f3
    );
  }

  buildPseudoRET(instruction: Instruction): IntermediateInstruction {
    return new ITypeIntermediate(
      REGISTER_MAP['x0'],
      REGISTER_MAP['x1'],
      0,
      this.opcode,
      instruction,
      this.f3
    );
  }

  buildGenericIType(instruction: Instruction): IntermediateInstruction {
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

    return new ITypeIntermediate(
      REGISTER_MAP[rd],
      REGISTER_MAP[rs1],
      imm,
      this.opcode,
      instruction,
      this.f3
    );
  }
}

export class STypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): IntermediateInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = instruction.argTokens[0] as Token;
    const offset = instruction.argTokens[1] as astat.Offset;
    const immediate = (offset.offset.value as unknown) as number;

    return new SBTypeIntermediate(
      true,
      REGISTER_MAP[offset.base.value],
      REGISTER_MAP[rd.value],
      immediate,
      this.opcode,
      instruction,
      this.f3,
    );
  }
}

export class UTypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): IntermediateInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = instruction.argTokens[0] as Token;
    const imm = (((instruction.argTokens[1] as Token).value) as unknown) as number;

    return new UJTypeIntermediate(
      true,
      REGISTER_MAP[rd.value],
      this.opcode,
      instruction,
      imm
    );
  }
}

export class JTypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction, symbolTable: SymbolTable, pc: number): IntermediateInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = instruction.argTokens[0] as Token;
    const immToken = instruction.argTokens[1] as Token;

    let intermediate: UJTypeIntermediate;
    if (immToken.type === 'ident') {
      const symbol = immToken.value;

      intermediate = new UJTypeIntermediate(
        false,
        REGISTER_MAP[rd.value],
        this.opcode,
        instruction,
        0
      );

      symbolTable.onLabelAddressResolve(symbol, (addr) => {
        intermediate.immediate = addr - pc;
      });
    } else {
      const imm = (((instruction.argTokens[1] as Token).value) as unknown) as number;
      intermediate = new UJTypeIntermediate(
        false,
        REGISTER_MAP[rd.value],
        this.opcode,
        instruction,
        imm
      );
    }

    return intermediate;
  }
}

export class RTypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction): IntermediateInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rd = (instruction.argTokens[0] as Token).value;
    const rs1 = (instruction.argTokens[1] as Token).value;
    const rs2 = (instruction.argTokens[2] as Token).value;

    return new RTypeIntermediate(
      REGISTER_MAP[rd],
      REGISTER_MAP[rs1],
      REGISTER_MAP[rs2],
      this.opcode,
      instruction,
      this.f3,
      this.f7
    );
  }
}

export class BTypeAssembler extends InstructionAssembler {
  assemble(instruction: Instruction, symbolTable: SymbolTable, pc: number): IntermediateInstruction {
    if (!instruction.argTokens) {
      throw new Error('argTokens is undefined on instruction. Validate should be called prior to this function to catch these errors');
    }

    const rs1 = (instruction.argTokens[0] as Token).value;
    const rs2 = (instruction.argTokens[1] as Token).value;
    const immToken = instruction.argTokens[2] as Token;

    let intermediate: SBTypeIntermediate;
    if (immToken.type === 'ident') {
      const symbol = immToken.value;

      intermediate = new SBTypeIntermediate(
        false,
        REGISTER_MAP[rs1],
        REGISTER_MAP[rs2],
        0,
        this.opcode,
        instruction,
        this.f3
      );

      symbolTable.onLabelAddressResolve(symbol, (addr) => {
        intermediate.immediate = addr - pc;
      });
    }
    else {
      const imm = (((instruction.argTokens[2] as Token).value) as unknown) as number;

      intermediate = new SBTypeIntermediate(
        false,
        REGISTER_MAP[rs1],
        REGISTER_MAP[rs2],
        imm,
        this.opcode,
        instruction,
        this.f3
      );
    }



    return intermediate;
  }
}

export const instructionAssemblerLookup: Record<string, InstructionAssembler> = {
  'LUI': new UTypeAssembler(0b0110111),
  'AUIPC': new UTypeAssembler(0b0010111),
  'JAL': new JTypeAssembler(0b1101111),
  'JALR': new ITypeAssembler(0b1100111),
  'RET': new ITypeAssembler(0b1100111),
  'BEQ': new BTypeAssembler(0b1100011, 0b000),
  'BNE': new BTypeAssembler(0b1100011, 0b001),
  'BLT': new BTypeAssembler(0b1100011, 0b100),
  'BGE': new BTypeAssembler(0b1100011, 0b101),
  'BLTU': new BTypeAssembler(0b1100011, 0b110),
  'BGEU': new BTypeAssembler(0b1100011, 0b111),
  'LB': new ITypeAssembler(0b0000011, 0b000),
  'LH': new ITypeAssembler(0b0000011, 0b001),
  'LW': new ITypeAssembler(0b0000011, 0b010),
  'LBU': new ITypeAssembler(0b0000011, 0b100),
  'LHU': new ITypeAssembler(0b0000011, 0b101),
  'SB': new STypeAssembler(0b0100011, 0b000),
  'SH': new STypeAssembler(0b0100011, 0b001),
  'SW': new STypeAssembler(0b0100011, 0b010),
  'ADDI': new ITypeAssembler(0b0010011,0b000 ),
  'NOP': new ITypeAssembler(0b0010011,0b000 ),
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

export function assembleStatement(instruction: astat.Instruction, symbolTable: SymbolTable, pc: number): IntermediateInstruction | AssemblerError {
  const instrAssembler = instructionAssemblerLookup[instruction.opcodeToken.value.toUpperCase()];

  if (!instrAssembler) {
    return new AssemblerError(
      'Instruction not supported',
      formatInstruction(instruction),
      instruction
    );
  }

  return instrAssembler.assemble(instruction, symbolTable, pc);
}

