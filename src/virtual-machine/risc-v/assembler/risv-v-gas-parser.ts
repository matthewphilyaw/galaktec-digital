import {alt, createLanguage, end, newline, regex, seq, seqMap, string} from 'parsimmon';

const RISC_V_LANG = createLanguage({
  optWhitespace: () => regex(/[^\S\r\n]*/)
    .desc('optional whitespace'),

  whitespace: () => regex(/[^\S\r\n]+/)
    .desc('whitespace'),

  identifier: () => regex(/\w+/)
    .desc('identifier')
    .node('identifier'),

  integer: () => regex(/[-+]?\d+/)
    .desc('integer literal')
    .map(parseInt),

  hex: () => regex(/[+-]?0x[a-fA-F0-9]+/)
    .desc('hex literal')
    .map(parseInt),

  comment: (r) => regex(/#.+/)
    .desc('comment')
    .trim(r.optWhitespace)
    .map(() => undefined)
    .node('comment'),

  program: r =>
    newline.map(() => undefined)
      .or(r.statement.skip(end))
      .many()
      .map(p => p.flat().filter(p => p !== undefined).map(p => p.value))
      .node('program'),

  statement: (r) => seqMap(
    alt(
      r.comment,
      r.constant,
      seq(r.label, r.directive),
      seq(r.label, r.instruction),
      r.label,
      r.directive,
      r.instruction,
    ),
    r.comment.atMost(1),
    (statement, comment) => statement
  ).desc('statement')
    .node('statement'),

  label: r => r.identifier
    .skip(string(':'))
    .trim(r.optWhitespace)
    .desc('label')
    .node('label'),

  directive: r => seqMap(
    string(".") ,
    r.identifier,
    r.parameterList.atMost(1).map(([p]) => p),
    (_, directive, parameters) => [directive, parameters]
  ).trim(r.optWhitespace)
    .desc('directive')
    .node('directive'),

  constant: (r) => seqMap(
    r.identifier.trim(r.optWhitespace),
    string('='),
    r.identifier.trim(r.optWhitespace),
    (symbol, _, value) => [ symbol, value ]
  ).desc('a constant expression')
    .node('constant'),

  instruction: (r) => seqMap(
    r.identifier,
    r.parameterList.atMost(1).map(([p]) => p),
    (identifier, parameters) => parameters ? [identifier, parameters] : [identifier]
  ).trim(r.optWhitespace)
    .desc('instruction')
    .node('instruction'),

  parameterList: (r) => seq(
    r.whitespace,
    r.parameterValue.sepBy(r.parameterSeparator)
  ).map(([_, params]) => params.map(p => p.value))
    .node('parameterList'),

  parameterValue: (r) => alt(
    r.operandFunction,
    r.number,
    r.identifier,
  ).node('parameter'),

  parentheticalIdentifier: (r) => r.identifier.trim(r.optWhitespace).wrap(
    string('('),
    string(')')
  ).node('statementExpressionTarget'),

  operandFunction: (r) => seqMap(
    alt(
      seqMap(string('%'), r.identifier, (_, functionName) => ({ functionName })),
      r.number.map(numerical_offset => ({ numerical_offset })),
      r.identifier.map(constantIdentifier => ({ constantIdentifier })),
    ).atMost(1).map(p => p[0]),
    r.parentheticalIdentifier,
    (context= { numerical_offset: 0}, identifier) => [
      context,
      identifier
    ]
  ).node('statementExpression'),

  parameterSeparator: (r) => seq(r.optWhitespace, string(','), r.optWhitespace),
  number: (r) => alt(
    r.hex,
    r.integer,
  ).node('number'),

});

export default function parse(program: string) {
  return RISC_V_LANG.program.parse(program);
}