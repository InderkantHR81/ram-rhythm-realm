export type TokenType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "OPERATOR"
  | "LITERAL_NUMBER"
  | "LITERAL_STRING"
  | "LITERAL_CHAR"
  | "SEPARATOR"
  | "COMMENT"
  | "PREPROCESSOR"
  | "ERROR"
  | "WHITESPACE";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  errorMessage?: string;
}

export interface TokenStats {
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
}

export const C_KEYWORDS = [
  "auto", "break", "case", "char", "const", "continue", "default", "do",
  "double", "else", "enum", "extern", "float", "for", "goto", "if",
  "int", "long", "register", "return", "short", "signed", "sizeof", "static",
  "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while",
  "_Bool", "_Complex", "_Imaginary", "inline", "restrict"
];

export const C_OPERATORS = [
  // Multi-character operators (must check first)
  "<<=", ">>=", "...",
  "++", "--", "<<", ">>", "<=", ">=", "==", "!=", "&&", "||",
  "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "->",
  // Single-character operators
  "+", "-", "*", "/", "%", "=", "<", ">", "&", "|", "^", "~", "!", "?", ":"
];

export const C_SEPARATORS = ["{", "}", "(", ")", "[", "]", ";", ",", "."];

export const TOKEN_COLORS: Record<TokenType, string> = {
  KEYWORD: "text-purple-400",
  IDENTIFIER: "text-cyan-400",
  OPERATOR: "text-orange-400",
  LITERAL_NUMBER: "text-green-400",
  LITERAL_STRING: "text-pink-400",
  LITERAL_CHAR: "text-pink-300",
  SEPARATOR: "text-yellow-400",
  COMMENT: "text-gray-500",
  PREPROCESSOR: "text-amber-500",
  ERROR: "text-red-500 underline decoration-wavy",
  WHITESPACE: "text-transparent",
};

export const TOKEN_BG_COLORS: Record<TokenType, string> = {
  KEYWORD: "bg-purple-500/20",
  IDENTIFIER: "bg-cyan-500/20",
  OPERATOR: "bg-orange-500/20",
  LITERAL_NUMBER: "bg-green-500/20",
  LITERAL_STRING: "bg-pink-500/20",
  LITERAL_CHAR: "bg-pink-400/20",
  SEPARATOR: "bg-yellow-500/20",
  COMMENT: "bg-gray-500/20",
  PREPROCESSOR: "bg-amber-500/20",
  ERROR: "bg-red-500/30",
  WHITESPACE: "bg-transparent",
};
