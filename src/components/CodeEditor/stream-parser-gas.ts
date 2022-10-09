function mkGas() {
  // If an architecture is specified, its initialization function may
  // populate this array with custom parsing functions which will be
  // tried in the event that the standard functions do not find a match.
  var custom: any = [];

  // The symbol used to start a line comment changes based on the target
  // architecture.
  // If no architecture is pased in "parserConfig" then only multiline
  // comments will have syntax support.
  var lineCommentStartSymbol = "#";

  // These directives are architecture independent.
  // Machine specific directives should go in their respective
  // architecture initialization function.
  // Reference:
  // http://sourceware.org/binutils/docs/as/Pseudo-Ops.html#Pseudo-Ops
  const directives: Record<string, string> = {
    ".abort" : "builtin",
    ".align" : "builtin",
    ".altmacro" : "builtin",
    ".ascii" : "builtin",
    ".asciz" : "builtin",
    ".balign" : "builtin",
    ".balignw" : "builtin",
    ".balignl" : "builtin",
    ".bundle_align_mode" : "builtin",
    ".bundle_lock" : "builtin",
    ".bundle_unlock" : "builtin",
    ".byte" : "builtin",
    ".cfi_startproc" : "builtin",
    ".comm" : "builtin",
    ".data" : "builtin",
    ".def" : "builtin",
    ".desc" : "builtin",
    ".dim" : "builtin",
    ".double" : "builtin",
    ".eject" : "builtin",
    ".else" : "builtin",
    ".elseif" : "builtin",
    ".end" : "builtin",
    ".endef" : "builtin",
    ".endfunc" : "builtin",
    ".endif" : "builtin",
    ".equ" : "builtin",
    ".equiv" : "builtin",
    ".eqv" : "builtin",
    ".err" : "builtin",
    ".error" : "builtin",
    ".exitm" : "builtin",
    ".extern" : "builtin",
    ".fail" : "builtin",
    ".file" : "builtin",
    ".fill" : "builtin",
    ".float" : "builtin",
    ".func" : "builtin",
    ".global" : "builtin",
    ".gnu_attribute" : "builtin",
    ".hidden" : "builtin",
    ".hword" : "builtin",
    ".ident" : "builtin",
    ".if" : "builtin",
    ".incbin" : "builtin",
    ".include" : "builtin",
    ".int" : "builtin",
    ".internal" : "builtin",
    ".irp" : "builtin",
    ".irpc" : "builtin",
    ".lcomm" : "builtin",
    ".lflags" : "builtin",
    ".line" : "builtin",
    ".linkonce" : "builtin",
    ".list" : "builtin",
    ".ln" : "builtin",
    ".loc" : "builtin",
    ".loc_mark_labels" : "builtin",
    ".local" : "builtin",
    ".long" : "builtin",
    ".macro" : "builtin",
    ".mri" : "builtin",
    ".noaltmacro" : "builtin",
    ".nolist" : "builtin",
    ".octa" : "builtin",
    ".offset" : "builtin",
    ".org" : "builtin",
    ".p2align" : "builtin",
    ".popsection" : "builtin",
    ".previous" : "builtin",
    ".print" : "builtin",
    ".protected" : "builtin",
    ".psize" : "builtin",
    ".purgem" : "builtin",
    ".pushsection" : "builtin",
    ".quad" : "builtin",
    ".reloc" : "builtin",
    ".rept" : "builtin",
    ".sbttl" : "builtin",
    ".scl" : "builtin",
    ".section" : "builtin",
    ".set" : "builtin",
    ".short" : "builtin",
    ".single" : "builtin",
    ".size" : "builtin",
    ".skip" : "builtin",
    ".sleb128" : "builtin",
    ".space" : "builtin",
    ".stab" : "builtin",
    ".string" : "builtin",
    ".struct" : "builtin",
    ".subsection" : "builtin",
    ".symver" : "builtin",
    ".tag" : "builtin",
    ".text" : "builtin",
    ".title" : "builtin",
    ".type" : "builtin",
    ".uleb128" : "builtin",
    ".val" : "builtin",
    ".version" : "builtin",
    ".vtable_entry" : "builtin",
    ".vtable_inherit" : "builtin",
    ".warning" : "builtin",
    ".weak" : "builtin",
    ".weakref" : "builtin",
    ".word" : "builtin"
  };
  const registers: Record<string, string> = {};

  for (let i = 0; i < 32; i++) {
    registers[`x${i}`] = 'variableName';
  }

  for (let i = 0; i < 7; i++) {
    registers[`t${i}`] = 'variableName.special';
  }

  for (let i = 0; i < 8; i++) {
    registers[`a${i}`] = 'variableName.special';
  }

  for (let i = 0; i < 12; i++) {
    registers[`s${i}`] = 'variableName.special';
  }

  registers.zero = 'variableName.special';
  registers.sp = 'variableName.special';
  registers.ra = 'variableName.special';
  registers.gp = 'variableName.special';
  registers.tp = 'variableName.special';
  registers.fp = 'variableName.special';

  const instructions: Record<string, string> = {
    lui: 'keyword',
    auipc: 'keyword',
    jal: 'keyword',
    jalr: 'keyword',
    beq: 'keyword',
    bne: 'keyword',
    blt: 'keyword',
    bge: 'keyword',
    bltu: 'keyword',
    bgeu: 'keyword',
    lb: 'keyword',
    lh: 'keyword',
    lw: 'keyword',
    lbu: 'keyword',
    lhu: 'keyword',
    sb: 'keyword',
    sh: 'keyword',
    sw: 'keyword',
    addi: 'keyword',
    slti: 'keyword',
    sltiu: 'keyword',
    xori: 'keyword',
    ori: 'keyword',
    andi: 'keyword',
    slli: 'keyword',
    srli: 'keyword',
    srai: 'keyword',
    add: 'keyword',
    sub: 'keyword',
    sll: 'keyword',
    slt: 'keyword',
    sltu: 'keyword',
    xor: 'keyword',
    srl: 'keyword',
    sra: 'keyword',
    or: 'keyword',
    and: 'keyword',
    fence: 'keyword',
    ecall: 'keyword',
    ebreak: 'keyword',
    nop: 'keyword',
    ret: 'keyword',
  };

  const operators: Record<string, string> = {
    '+': 'operator',
    '-': 'operator',
    '*': 'operator',
    '/': 'operator',
  }

  const brackets: Record<string, string> = {
    '{': 'bracket',
    '}': 'bracket',
    '(': 'bracket',
    ')': 'bracket'
  };

  function nextUntilUnescaped(stream: any, end: any) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (next === end && !escaped) {
        return false;
      }
      escaped = !escaped && next === "\\";
    }
    return escaped;
  }

  function clikeComment(stream: any, state: any) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (ch === "/" && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch === "*");
    }
    return "comment";
  }

  return {
    startState: function() {
      return {
        tokenize: null
      };
    },

    token: function(stream: any, state: any) {
      if (state.tokenize) {
        return state.tokenize(stream, state);
      }

      if (stream.eatSpace()) {
        return null;
      }

      var style, cur, ch = stream.next();

      if (ch === "/") {
        if (stream.eat("*")) {
          state.tokenize = clikeComment;
          return clikeComment(stream, state);
        }
      }

      if (ch === lineCommentStartSymbol) {
        stream.skipToEnd();
        return "comment";
      }

      if (ch === '"') {
        nextUntilUnescaped(stream, '"');
        return "string";
      }

      if (ch === '.') {
        stream.eatWhile(/\w/);
        cur = stream.current().toLowerCase();
        style = directives[cur];
        return style || null;
      }

      if (ch === '=') {
        stream.eatWhile(/\w/);
        return "tag";
      }

      if (brackets[ch]) {
        return "bracket";
      }

      if (operators[ch]) {
        return "operator";
      }

      if (/\d/.test(ch)) {
        if (ch === "0" && stream.eat("x")) {
          stream.eatWhile(/[0-9a-fA-F]/);
          return "number";
        }
        stream.eatWhile(/\d/);
        return "number";
      }

      if (/\w/.test(ch)) {
        stream.eatWhile(/\w/);
        if (stream.eat(":")) {
          return 'labelName';
        }
        cur = stream.current().toLowerCase();
        if (registers[cur]) {
          style = registers[cur];
        }
        else if (instructions[cur]) {
          style = instructions[cur];
        }
        else {
          style = 'labelName';
        }
        return style || null;
      }

      for (var i = 0; i < custom.length; i++) {
        style = custom[i](ch, stream, state);
        if (style) {
          return style;
        }
      }
    },

    languageData: {
      commentTokens: {
        line: lineCommentStartSymbol,
        block: {open: "/*", close: "*/"}
      }
    }
  };
}

export const gas = mkGas();