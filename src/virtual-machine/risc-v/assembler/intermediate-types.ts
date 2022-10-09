import { Instruction, Label } from '../..//grammar/assembly-statements';
import {
  encodeRType,
  R_TYPE_PATTERN,
  encodeIType,
  I_TYPE_PATTERN,
  encodeSType, S_TYPE_PATTERN, encodeBType, B_TYPE_PATTERN, encodeUType, U_TYPE_PATTERN, encodeJType, J_TYPE_PATTERN
} from './instruction-type-encoder';
import { binWord, Chunk } from '../../utils/binary-string-formatter';

export type Intermediate = IntermediateLabel | IntermediateInstruction;

export class IntermediateLabel {
  constructor(
    public name: string,
    public labelStatement: Label
  ) { }
}

export abstract class IntermediateInstruction {
  public opcode: number;
  public f3?: number;
  public f7?: number;
  public instructionStatement: Instruction;
  public instructionFormatType: string;

  public assembledAddress: number;
  public encodedInstructions: number[];
  public formattedEncodedInstructions: string[];

  protected constructor(opcode: number, instruction: Instruction, instructionFormatType: string, f3?: number, f7?: number) {
    this.opcode = opcode;
    this.instructionStatement = instruction;
    this.f3 = f3;
    this.f7 = f7;

    this.assembledAddress = 0;
    this.encodedInstructions = [];
    this.formattedEncodedInstructions = [];
    this.instructionFormatType = instructionFormatType;
  }

  abstract encode(): void;
}

export class RTypeIntermediate extends IntermediateInstruction{
  public rdIndex: number;
  public rs1Index: number;
  public rs2Index: number;

  constructor(
    rdIndex: number,
    rs1Index: number,
    rs2Index: number,
    opcode: number,
    instruction: Instruction,
    f3?: number,
    f7?: number
  ) {
    super(opcode, instruction, 'R', f3, f7);

    this.rdIndex = rdIndex;
    this.rs1Index = rs1Index;
    this.rs2Index = rs2Index;
  }

  encode() {
    const word = encodeRType(
      this.opcode,
      this.rdIndex,
      this.rs1Index,
      this.rs2Index,
      this.f3!,
      this.f7 ?? 0
    );

    this.encodedInstructions = [ word ];
    this.formattedEncodedInstructions = [ binWord(word, Chunk.CUSTOM, R_TYPE_PATTERN) ];
  }
}

export class ITypeIntermediate extends IntermediateInstruction {
  public rdIndex: number;
  public rs1Index: number;
  public immediate: number;

  constructor(
    rdIndex: number,
    rs1Index: number,
    immediate: number,
    opcode: number,
    instruction: Instruction,
    f3?: number
  ) {
    super(opcode, instruction, 'I', f3);

    this.rdIndex = rdIndex;
    this.rs1Index = rs1Index;
    this.immediate = immediate;

  }

  encode() {
    const word = encodeIType(
      this.opcode,
      this.rdIndex,
      this.rs1Index,
      this.immediate,
      this.f3!
    );

    this.encodedInstructions = [ word ];
    this.formattedEncodedInstructions = [ binWord(word, Chunk.CUSTOM, I_TYPE_PATTERN) ];
  }
}

export class SBTypeIntermediate extends IntermediateInstruction {
  public rs1Index: number;
  public rs2Index: number;
  public immediate: number;

  private readonly stype: boolean;

  constructor(
    stype: boolean,
    rs1Index: number,
    rs2Index: number,
    immediate: number,
    opcode: number,
    instruction: Instruction,
    f3?: number
  ) {
    super(opcode, instruction, stype ? 'S' : 'B', f3);

    this.stype = stype;

    this.rs1Index = rs1Index;
    this.rs2Index = rs2Index;
    this.immediate = immediate;
  }

  encode() {
    if (this.stype) {
      const word = encodeSType(
        this.opcode,
        this.rs1Index,
        this.rs2Index,
        this.immediate,
        this.f3!,
      );

      this.encodedInstructions = [ word ];
      this.formattedEncodedInstructions = [ binWord(word, Chunk.CUSTOM, S_TYPE_PATTERN) ];
    } else {
      const word = encodeBType(
        this.opcode,
        this.rs1Index,
        this.rs2Index,
        this.immediate,
        this.f3!,
      );

      this.encodedInstructions = [ word ];
      this.formattedEncodedInstructions = [ binWord(word, Chunk.CUSTOM, B_TYPE_PATTERN) ];
    }
  }

}

export class UJTypeIntermediate extends IntermediateInstruction {
  public rdIndex: number;
  public immediate?: number;

  private readonly utype: boolean;

  constructor(
    utype: boolean,
    rdIndex: number,
    opcode: number,
    instruction: Instruction,
    immediate?: number,
) {
    super(opcode, instruction, utype ? 'U' : 'J');

    this.utype = utype;

    this.rdIndex = rdIndex;
    this.immediate = immediate;
  }

  encode() {
    if (this.immediate === undefined) {
      throw new Error(`Immediate was not set, likely the target of a look up for a symbol`);
    }

    if (this.utype) {
      const word = encodeUType(
        this.opcode,
        this.rdIndex,
        this.immediate
      );

      this.encodedInstructions = [ word ];
      this.formattedEncodedInstructions = [ binWord(word, Chunk.CUSTOM, U_TYPE_PATTERN) ];
    } else {
      const word = encodeJType(
        this.opcode,
        this.rdIndex,
        this.immediate
      );

      this.encodedInstructions = [ word ];
      this.formattedEncodedInstructions = [ binWord(word, Chunk.CUSTOM, J_TYPE_PATTERN) ];
    }
  }
}


