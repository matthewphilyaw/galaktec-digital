

export class Index {
  constructor(
    public offset: number,
    public line: number,
    public column: number
  ) {}
}

export class Location {
  constructor(
    public start: Index,
    public end: Index,
  ) {}
}

export class Identifier {
  constructor(
    public name: string,
    public location?: Location
  ) {}
}

export class Number {
  constructor(
    public value: number,
    public location: Location
  ) {}
}

export class FunctionExpression {
  constructor(
    public identifier: Identifier,
    public target: Identifier
  ) {}
}

export class OffsetExpression {
  constructor(
    public offset: Number,
    public target: Identifier
  ) {}
}

export class ConstantExpression {
  constructor(
    public identifier: Identifier,
    public target: Identifier
  ) {}
}

export class DefaultExpression {
  constructor(
    public target: Identifier
  ) {}
}

export class LocalSymbolReplace {
  constructor(
    public identifier: Identifier,
  ) {}
}

export class CurrentAssembledAddress {
  constructor(
    public symbol: string,
    public location?: Location
  ) {}
}

export class Label {
  constructor(
    public symbol: Identifier | Number,
  ) { }
}

export class IdentifierWithParameters {
  constructor(
    public identifier: Identifier,
    public parameters: (FunctionExpression | OffsetExpression | Number)[]
  ) {}
}

export class Directive {
  constructor(
    public identifier: Identifier,
    public parameters: (FunctionExpression | OffsetExpression | Number)[]
  ) {}
}