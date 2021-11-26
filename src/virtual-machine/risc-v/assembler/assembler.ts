import * as astat from '../../grammar/assembly-statements';
import * as ainst from '../assembler/instruction-assembler';

import riscVGrammar from '../../grammar/risc-v-grammar';

import { Grammar, Parser } from 'nearley';
import { IntermediateInstruction, IntermediateLabel } from '@/virtual-machine/risc-v/assembler/intermediate-types';
import { SymbolTable } from '@/virtual-machine/risc-v/assembler/symbol-table';

export class AssemblerError {
  constructor(
    public reason: string,
    public formattedInstruction: string,
    public ctx: astat.AssemblyStatement
  ) {}
}

export class AssembledInstruction {
  constructor(
    public encodedInstruction: number,
    public formattedBinary: string,
    public formattedInstruction: string
  ) {}
}

export class AssemblerContext {
  public programMap: Map<number, IntermediateInstruction>;
  public programMemoryBuffer: ArrayBuffer;

  constructor(targetMemSize: number) {
    this.programMap = new Map<number, IntermediateInstruction>();
    this.programMemoryBuffer = new ArrayBuffer(targetMemSize);
  }
}

export function assemble(program: string, targetMemSize: number): AssemblerContext {
  const parser = new Parser(Grammar.fromCompiled(riscVGrammar));

  const ctx = new AssemblerContext(targetMemSize);

  // This function will layout the program into the programMemoryBuffer
  // AssemblerContext is just where the buffer resides.
  const programMemory = new DataView(ctx.programMemoryBuffer);

  parser.feed(program.toString());
  const parsedProgram = parser.results[0] as astat.AssemblyStatement[];
  const symbolTable = new SymbolTable();

  const programIntermediates = [];

  let programCounter = 0;
  for (const statement of parsedProgram) {
    if (statement instanceof astat.Instruction) {
      const assembled = ainst.assembleStatement(statement, symbolTable, programCounter);

      if (assembled instanceof AssemblerError) {
        throw assembled;
      } else if (assembled instanceof IntermediateInstruction) {
        programIntermediates.push(assembled);
        programCounter += 4;
      } else {
      }
    } else if (statement instanceof astat.Label) {
      const name = statement.nameToken.value;
      symbolTable.defineLabel(name);

      programIntermediates.push(new IntermediateLabel(
        name,
        statement
      ));
    }
  }

  // resolve label address against fake pc

  let pc = 0;
  for (const intermediate of programIntermediates) {
    if (intermediate instanceof IntermediateLabel) {
      symbolTable.setLabelAddress(intermediate.name, pc);
      continue;
    }

    pc += 4;
  }

  symbolTable.resolveLabelsAddresses();

  pc = 0;

  for (const intermediate of programIntermediates.filter(p => p instanceof IntermediateInstruction) as IntermediateInstruction[]) {
    intermediate.encode();
    ctx.programMap.set(pc, intermediate);
    for (const encoded of intermediate.encodedInstructions) {
      programMemory.setUint32(pc, encoded, true);
      pc += 4;
    }
  }

  return ctx;
}
