import {alt, createLanguage, end, Mark, newline, regex, Result, seq, seqMap, string} from 'parsimmon';
import {
  ConstantExpression,
  CurrentAssembledAddress,
  DefaultExpression,
  Directive,
  FunctionExpression,
  Identifier,
  IdentifierWithParameters,
  Index,
  Label,
  LocalSymbolReplace,
  Location,
  Number,
  OffsetExpression,
} from './gas-ast';

function convertMarkToLocation(mark: Mark<any>): Location {
  return new Location(
    new Index(mark.start.offset, mark.start.line, mark.start.column),
    new Index(mark.end.offset, mark.end.line, mark.end.column),
  )
}

const RISC_V_LANG = createLanguage({
  optWhitespace: () => regex(/[^\S\r\n]*/)
    .desc('optional whitespace'),

  whitespace: () => regex(/[^\S\r\n]+/)
    .desc('whitespace'),

  rawIdentifier: () => regex(/[a-zA-Z_$][a-zA-Z_$0-9]*/)
    .desc('identifier')
    .mark()
    .map(p => new Identifier(p.value, convertMarkToLocation(p))),

  identifier: (r) => alt(
    seq(string("\\"), r.rawIdentifier).map(([_, p]) => new LocalSymbolReplace(p)),
    r.rawIdentifier
  ),

  integer: () => regex(/[-+]?\d+/)
    .desc('integer literal')
    .map(parseInt),

  hex: () => regex(/[+-]?0x[a-fA-F0-9]+/)
    .desc('hex literal')
    .map(parseInt),

  comment: (r) => regex(/#.+/)
    .desc('comment')
    .trim(r.optWhitespace)
    .map(() => undefined),

  program: r =>
    newline.map(() => undefined)
      .or(r.statement.skip(end))
      .many()
      .map(p => p.filter(p => p !== undefined).map(p => p)),

  statement: (r) => seqMap(
    alt(
      r.comment,
      r.constant,
      seq(r.label, r.directive),
      seq(r.label, r.identifierWithParameters),
      r.label,
      r.macroDirective,
      r.directive,
      r.identifierWithParameters,
    ),
    r.comment.atMost(1),
    (statement) => statement
  ).desc('statement'),

  label: r => r.identifier.or(r.number)
    .skip(string(':'))
    .trim(r.optWhitespace)
    .desc('label')
    .map(label => new Label(label)),

  macroDirective: r => seqMap(
    string("."),
    string('macro').mark().map(p => new Identifier(p.value, convertMarkToLocation(p))),
    r.identifierWithParameters,
    (_, directive, parameters) => new Directive(directive, parameters ?? [])
  ).trim(r.optWhitespace)
    .desc('directive'),

  directive: r => seqMap(
    string(".") ,
    r.identifier,
    r.parameterList.atMost(1).map(([p]) => p),
    (_, directive, parameters) => new Directive(directive, parameters ?? [])
  ).trim(r.optWhitespace)
    .desc('directive'),

  constant: (r) => seqMap(
    r.identifier.trim(r.optWhitespace),
    string('='),
    r.identifier.or(r.number).trim(r.optWhitespace),
    (symbol, _, value) => new Directive(new Identifier('equ'), [symbol, value])
  ).desc('a constant expression'),

  identifierWithParameters: (r) => seqMap(
    r.identifier,
    r.parameterList.atMost(1).map(([p]) => p),
    (identifier, parameters) => new IdentifierWithParameters(identifier, parameters ?? [])
  ).trim(r.optWhitespace)
    .desc('instruction'),

  parameterList: (r) => seq(
    r.whitespace,
    r.parameterValue.sepBy(r.parameterSeparator)
  ).map(([_, params]) => params.map(p => p)),

  parameterValue: (r) => alt(
    r.statementExpression,
    r.number,
    r.identifier,
    string(".").mark().map(v => new CurrentAssembledAddress(v.value, convertMarkToLocation(v)))
  ),

  parentheticalIdentifier: (r) => r.identifier.trim(r.optWhitespace).wrap(
    string('('),
    string(')')
  ),

  statementExpression: (r) => seqMap(
    alt(
      seqMap(string('%'), r.identifier, (_, functionName) => ({ type: 'function',  value: functionName })),
      r.number.map(numerical_offset => ({ type: 'numerical_offset', value: numerical_offset})),
      r.identifier.map(constantIdentifier => ({ type:'constant_sub_in', value: constantIdentifier })),
    ).atMost(1).map(p => p[0]),
    r.parentheticalIdentifier,
    (context, identifier) => {
      if (!context)  {
        return new DefaultExpression(identifier);
      }

      if (context.type === 'numerical_offset') {
        return new OffsetExpression(context.value, identifier);
      } else if (context.type === 'constant_sub_in') {
        return new ConstantExpression(context.value, identifier);
      } else if (context.type === 'function') {
        return new FunctionExpression(context.value, identifier);
      }

      throw new Error(`Invalid context type of: ${context.type}`);
    }
  ),

  parameterSeparator: (r) => seq(r.optWhitespace, string(','), r.optWhitespace),
  number: (r) => alt(
    r.hex,
    r.integer,
  ).mark().map(v => new Number(v.value, convertMarkToLocation(v)))

});

export default function parse(program: string): Result<(Label | Directive | IdentifierWithParameters)[]> {
  return RISC_V_LANG.program.parse(program);
}