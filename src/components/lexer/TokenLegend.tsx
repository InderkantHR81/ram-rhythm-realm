import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOKEN_COLORS, TOKEN_BG_COLORS, TokenType } from "@/types/lexer";
import { cn } from "@/lib/utils";

const legendItems: { type: TokenType; label: string; example: string }[] = [
  { type: "KEYWORD", label: "Keywords", example: "int, return, if" },
  { type: "IDENTIFIER", label: "Identifiers", example: "main, count, x" },
  { type: "OPERATOR", label: "Operators", example: "+, ==, ++" },
  { type: "LITERAL_NUMBER", label: "Numbers", example: "42, 3.14, 0xFF" },
  { type: "LITERAL_STRING", label: "Strings", example: '"hello"' },
  { type: "LITERAL_CHAR", label: "Characters", example: "'a', '\\n'" },
  { type: "SEPARATOR", label: "Separators", example: "{, }, ;, ," },
  { type: "COMMENT", label: "Comments", example: "// comment" },
  { type: "PREPROCESSOR", label: "Preprocessor", example: "#include" },
  { type: "ERROR", label: "Errors", example: "unclosed string" },
];

export function TokenLegend() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Token Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {legendItems.map((item) => (
            <div
              key={item.type}
              className={cn(
                "p-2 rounded-md",
                TOKEN_BG_COLORS[item.type]
              )}
            >
              <div className={cn("font-medium", TOKEN_COLORS[item.type])}>
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {item.example}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
