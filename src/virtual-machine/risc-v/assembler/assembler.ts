import * as astat from '../../grammar/assembly-statements';
import * as ainst from '../assembler/instruction-assembler';

import riscVGrammar from '../../grammar/risc-v-grammar';

import { Grammar, Parser } from 'nearley';
import {IntermediateInstruction} from "@/virtual-machine/risc-v/assembler/intermediate-types";

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

export class AssemblerLineContext {
  constructor(
    public assemblyStatement: astat.AssemblyStatement,
    public assembledStatement: IntermediateInstruction
  ) {}

}

export class AssemblerContext {
  public programMap: Record<number, AssemblerLineContext>;
  public programMemoryBuffer: ArrayBuffer;

  constructor(targetMemSize: number) {
    this.programMap = {};
    this.programMemoryBuffer = new ArrayBuffer(targetMemSize);
  }
}

export function assemble(program: string, targetMemSize: number): AssemblerContext {
  const parser = new Parser(Grammar.fromCompiled(riscVGrammar));

  const ctx = new AssemblerContext(targetMemSize);

  // This function will layout the program into the programMemoryBuffer
  // AssemblerContext is just where the buffer resides.
  const programMemory = new DataView(ctx.programMemoryBuffer);

  let pc = 0;

  parser.feed(program.toString());
  const parsedProgram = parser.results[0] as astat.AssemblyStatement[];

  for (const statement of parsedProgram) {
    if (statement instanceof astat.Instruction) {
      const assembled = ainst.assembleStatement(statement);

      if (assembled instanceof AssemblerError) {
        throw assembled;
      } else if (assembled instanceof IntermediateInstruction) {

        ctx.programMap[pc] = new AssemblerLineContext(
          statement,
          assembled
        );

        for (const encoded of assembled.encodedInstructions) {
          programMemory.setUint32(pc, encoded, true);
          pc += 4;
        }
      } else {
        throw new Error('Invalid state.');
      }
    } else {
      throw new Error(`statement type: ${typeof statement} is not supported`);
    }
  }

  return ctx;
}
