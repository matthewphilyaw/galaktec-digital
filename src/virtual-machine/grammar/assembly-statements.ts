import { Token } from 'moo';

export class PseudoRelocation {
  constructor(
    public type: Token,
    public base: Token,
    public offset?: Token
  ) {}
}

export class Offset {
  constructor(
    public base: Token,
    public offset: Token
  ) {}
}

export class Instruction {
  constructor(
    public opcodeToken: Token,
    public argTokens?: (Token | PseudoRelocation | Offset)[]
  ) {}
}

export class Directive {
  constructor(
    public nameToken: Token,
    public argTokens?: Token[]
  ) {}
}

export class Label {
  constructor(
    public nameToken: Token,
  ) {}
}

export type AssemblyStatement = Instruction | Directive | Label;
