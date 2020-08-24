@preprocessor typescript

@{%
import * as moo from 'moo';
import * as astat from './assembly-statements';
const empty = (): null => null;

const lexer = moo.compile({
  ws:         /[ \t]/,
  // @ts-ignore
  hex:        { match: /0[xX][0-9a-fA-F]+/, value: (m) => parseInt(m.slice(2).toLowerCase(), 16) },
  // @ts-ignore
  bin:        { match: /0b[01]+/, value: (m) => parseInt(m.slice(2), 2) },
  ident:      /[_0-9A-Za-z]*[_A-Za-z]+[_0-9A-Za-z]*/,
  // @ts-ignore
  int:        { match: /[-+]?[0-9]+/, value: m => parseInt(m) },
  string:     /"(?:\\['\\nt]|[^\n'\\])*"/,
  special:    /[\.:,\(\)%]/,
  comment:    /#[^\n]*/,
  nl: { match: /\n/, lineBreaks: true }
});

%}

@lexer lexer

program     -> statement (%nl statement):* {%
  (rule): astat.AssemblyStatement[] => {
    const statements: astat.AssemblyStatement[] = [];

    const flattenStatement = (statement: astat.AssemblyStatement | astat.AssemblyStatement[]) => {
   	  if (Array.isArray(statement)) {
	    const toPush = statement.flatMap(s => s);
	    statements.push(...toPush);
	  } else {
	    statements.push(statement);
	  }
	}

	const flattenRule = (rule: any) => {
	  for (const statement of rule) {
      	if (!statement[1]) { continue; }

        flattenStatement(statement[1]);
      }
	};

    if (rule[0]) {
	  flattenStatement(rule[0]);
    }

    flattenRule(rule[1]);
    return statements;
  }
%}

statement   -> _ instruction eol {% ([, inst,]) => inst %}
             | _ label eol {% ([, label, ]) => label %}
             | _ label _ instruction eol {% ([, label, , instr]) => [label, instr] %}
             | _ label _ directive eol {% ([, label, , dir]) => [label, dir] %}
             | _ directive eol {% ([, directive, ]) => directive %}
             | eol {% empty %}

directive   -> directiveId {% rule => new astat.Directive(rule[0], []) %}
             | directiveId __ (dirArg sep):* dirArg {%
  rule => {
    const nameToken = rule[0];
    const args = [];

    for (const arg of rule[2]) {
      args.push(arg[0][0]);
    }

    args.push(rule[3][0]);

    return new astat.Directive(
      nameToken,
      args
    );
  }
%}

instruction -> %ident {% rule => new astat.Instruction(rule[0], []) %}
             | %ident __ (instrArg sep):* instrArg {%
  rule => {
    const opCodeToken = rule[0];
    const args = [];

    for (const arg of rule[2]) {
      args.push(arg[0][0]);
    }

    args.push(rule[3][0]);

    return new astat.Instruction(
      opCodeToken,
      args
    );
  }
%}

instrArg    -> %int
             | %hex
             | %bin
             | %ident
             | reloc
             | offset

dirArg      -> %int
             | %hex
             | %bin
             | %ident
             | directiveId
             | %string

# Line Fragments
directiveId -> "." %ident {% rule => rule[1] %}
label       -> (%ident | %int) ":" {% rule => new astat.Label(rule[0][0]) %}
offset      -> (%ident | %int | %hex | %bin):? "(" %ident ")" {%
  rule => {
    let offset = null;
    if (rule[0]) {
      offset = rule[0][0];
    }

    return new astat.Offset(
      rule[2], // base
      offset   // offset
    );
  }
%}

reloc       -> ("%" %ident "(" %ident ")" | "%" %ident "(" %ident ")" "(" %ident ")") {%
  rule => {
	if (rule[0][6]) {
	  return new astat.PseudoRelocation(
		rule[0][1], // reloc type
		rule[0][6], // base
		rule[0][3]  // offset
      );
	} else {
	  return new astat.PseudoRelocation(
		rule[0][1], // reloc type
		rule[0][3]  // base
	  );
    }
  }
%}

sep         -> _ "," _ {% empty %}
eol         -> _ %comment:? {% empty %}

# Whitespace
__          -> %ws:+ {% empty %}
_           -> %ws:* {% empty %}