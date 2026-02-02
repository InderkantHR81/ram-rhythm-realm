import { Token, TokenType, C_KEYWORDS, C_OPERATORS, C_SEPARATORS } from "@/types/lexer";

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let column = 1;

  while (pos < code.length) {
    const startLine = line;
    const startColumn = column;

    // Whitespace
    if (/\s/.test(code[pos])) {
      let value = "";
      while (pos < code.length && /\s/.test(code[pos])) {
        if (code[pos] === "\n") {
          line++;
          column = 1;
        } else {
          column++;
        }
        value += code[pos];
        pos++;
      }
      tokens.push({ type: "WHITESPACE", value, line: startLine, column: startColumn });
      continue;
    }

    // Preprocessor directives
    if (code[pos] === "#") {
      let value = "#";
      pos++;
      column++;
      while (pos < code.length && code[pos] !== "\n") {
        value += code[pos];
        pos++;
        column++;
      }
      tokens.push({ type: "PREPROCESSOR", value, line: startLine, column: startColumn });
      continue;
    }

    // Single-line comment
    if (code[pos] === "/" && code[pos + 1] === "/") {
      let value = "//";
      pos += 2;
      column += 2;
      while (pos < code.length && code[pos] !== "\n") {
        value += code[pos];
        pos++;
        column++;
      }
      tokens.push({ type: "COMMENT", value, line: startLine, column: startColumn });
      continue;
    }

    // Multi-line comment
    if (code[pos] === "/" && code[pos + 1] === "*") {
      let value = "/*";
      pos += 2;
      column += 2;
      let closed = false;
      while (pos < code.length) {
        if (code[pos] === "*" && code[pos + 1] === "/") {
          value += "*/";
          pos += 2;
          column += 2;
          closed = true;
          break;
        }
        if (code[pos] === "\n") {
          line++;
          column = 1;
        } else {
          column++;
        }
        value += code[pos];
        pos++;
      }
      if (!closed) {
        tokens.push({
          type: "ERROR",
          value,
          line: startLine,
          column: startColumn,
          errorMessage: "Unclosed multi-line comment",
        });
      } else {
        tokens.push({ type: "COMMENT", value, line: startLine, column: startColumn });
      }
      continue;
    }

    // String literal
    if (code[pos] === '"') {
      let value = '"';
      pos++;
      column++;
      let closed = false;
      while (pos < code.length && code[pos] !== "\n") {
        if (code[pos] === "\\") {
          value += code[pos];
          pos++;
          column++;
          if (pos < code.length) {
            value += code[pos];
            pos++;
            column++;
          }
          continue;
        }
        if (code[pos] === '"') {
          value += '"';
          pos++;
          column++;
          closed = true;
          break;
        }
        value += code[pos];
        pos++;
        column++;
      }
      if (!closed) {
        tokens.push({
          type: "ERROR",
          value,
          line: startLine,
          column: startColumn,
          errorMessage: "Unclosed string literal",
        });
      } else {
        tokens.push({ type: "LITERAL_STRING", value, line: startLine, column: startColumn });
      }
      continue;
    }

    // Character literal
    if (code[pos] === "'") {
      let value = "'";
      pos++;
      column++;
      let closed = false;
      while (pos < code.length && code[pos] !== "\n") {
        if (code[pos] === "\\") {
          value += code[pos];
          pos++;
          column++;
          if (pos < code.length) {
            value += code[pos];
            pos++;
            column++;
          }
          continue;
        }
        if (code[pos] === "'") {
          value += "'";
          pos++;
          column++;
          closed = true;
          break;
        }
        value += code[pos];
        pos++;
        column++;
      }
      if (!closed) {
        tokens.push({
          type: "ERROR",
          value,
          line: startLine,
          column: startColumn,
          errorMessage: "Unclosed character literal",
        });
      } else {
        tokens.push({ type: "LITERAL_CHAR", value, line: startLine, column: startColumn });
      }
      continue;
    }

    // Numbers
    if (/[0-9]/.test(code[pos]) || (code[pos] === "." && /[0-9]/.test(code[pos + 1]))) {
      let value = "";
      let hasError = false;
      let errorMsg = "";

      // Hex
      if (code[pos] === "0" && (code[pos + 1] === "x" || code[pos + 1] === "X")) {
        value = code[pos] + code[pos + 1];
        pos += 2;
        column += 2;
        if (!/[0-9a-fA-F]/.test(code[pos])) {
          hasError = true;
          errorMsg = "Invalid hexadecimal number";
        }
        while (pos < code.length && /[0-9a-fA-F]/.test(code[pos])) {
          value += code[pos];
          pos++;
          column++;
        }
      }
      // Octal
      else if (code[pos] === "0" && /[0-7]/.test(code[pos + 1])) {
        while (pos < code.length && /[0-7]/.test(code[pos])) {
          value += code[pos];
          pos++;
          column++;
        }
        if (/[8-9]/.test(code[pos])) {
          hasError = true;
          errorMsg = "Invalid octal number";
          while (pos < code.length && /[0-9]/.test(code[pos])) {
            value += code[pos];
            pos++;
            column++;
          }
        }
      }
      // Decimal / Float
      else {
        while (pos < code.length && /[0-9]/.test(code[pos])) {
          value += code[pos];
          pos++;
          column++;
        }
        if (code[pos] === ".") {
          value += ".";
          pos++;
          column++;
          while (pos < code.length && /[0-9]/.test(code[pos])) {
            value += code[pos];
            pos++;
            column++;
          }
        }
        if (code[pos] === "e" || code[pos] === "E") {
          value += code[pos];
          pos++;
          column++;
          if (code[pos] === "+" || code[pos] === "-") {
            value += code[pos];
            pos++;
            column++;
          }
          if (!/[0-9]/.test(code[pos])) {
            hasError = true;
            errorMsg = "Invalid exponent in number";
          }
          while (pos < code.length && /[0-9]/.test(code[pos])) {
            value += code[pos];
            pos++;
            column++;
          }
        }
      }

      // Suffix (f, l, u, etc.)
      while (pos < code.length && /[fFlLuU]/.test(code[pos])) {
        value += code[pos];
        pos++;
        column++;
      }

      if (hasError) {
        tokens.push({ type: "ERROR", value, line: startLine, column: startColumn, errorMessage: errorMsg });
      } else {
        tokens.push({ type: "LITERAL_NUMBER", value, line: startLine, column: startColumn });
      }
      continue;
    }

    // Identifiers and Keywords
    if (/[a-zA-Z_]/.test(code[pos])) {
      let value = "";
      while (pos < code.length && /[a-zA-Z0-9_]/.test(code[pos])) {
        value += code[pos];
        pos++;
        column++;
      }
      const type: TokenType = C_KEYWORDS.includes(value) ? "KEYWORD" : "IDENTIFIER";
      tokens.push({ type, value, line: startLine, column: startColumn });
      continue;
    }

    // Operators (check multi-char first)
    let foundOp = false;
    for (const op of C_OPERATORS) {
      if (code.substring(pos, pos + op.length) === op) {
        tokens.push({ type: "OPERATOR", value: op, line: startLine, column: startColumn });
        pos += op.length;
        column += op.length;
        foundOp = true;
        break;
      }
    }
    if (foundOp) continue;

    // Separators
    if (C_SEPARATORS.includes(code[pos])) {
      tokens.push({ type: "SEPARATOR", value: code[pos], line: startLine, column: startColumn });
      pos++;
      column++;
      continue;
    }

    // Unknown character
    tokens.push({
      type: "ERROR",
      value: code[pos],
      line: startLine,
      column: startColumn,
      errorMessage: `Unknown character '${code[pos]}'`,
    });
    pos++;
    column++;
  }

  return tokens;
}

export function calculateStats(tokens: Token[]): {
  keywords: number;
  identifiers: number;
  operators: number;
  numbers: number;
  strings: number;
  chars: number;
  separators: number;
  comments: number;
  preprocessors: number;
  errors: number;
} {
  return {
    keywords: tokens.filter((t) => t.type === "KEYWORD").length,
    identifiers: tokens.filter((t) => t.type === "IDENTIFIER").length,
    operators: tokens.filter((t) => t.type === "OPERATOR").length,
    numbers: tokens.filter((t) => t.type === "LITERAL_NUMBER").length,
    strings: tokens.filter((t) => t.type === "LITERAL_STRING").length,
    chars: tokens.filter((t) => t.type === "LITERAL_CHAR").length,
    separators: tokens.filter((t) => t.type === "SEPARATOR").length,
    comments: tokens.filter((t) => t.type === "COMMENT").length,
    preprocessors: tokens.filter((t) => t.type === "PREPROCESSOR").length,
    errors: tokens.filter((t) => t.type === "ERROR").length,
  };
}
