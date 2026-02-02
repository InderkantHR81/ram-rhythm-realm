import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOKEN_COLORS, TOKEN_BG_COLORS } from "@/types/lexer";
import { cn } from "@/lib/utils";

interface TokenStatsProps {
  stats: {
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
  };
}

const statItems = [
  { key: "keywords", label: "Keywords", type: "KEYWORD" as const },
  { key: "identifiers", label: "Identifiers", type: "IDENTIFIER" as const },
  { key: "operators", label: "Operators", type: "OPERATOR" as const },
  { key: "numbers", label: "Numbers", type: "LITERAL_NUMBER" as const },
  { key: "strings", label: "Strings", type: "LITERAL_STRING" as const },
  { key: "chars", label: "Characters", type: "LITERAL_CHAR" as const },
  { key: "separators", label: "Separators", type: "SEPARATOR" as const },
  { key: "comments", label: "Comments", type: "COMMENT" as const },
  { key: "preprocessors", label: "Preprocessor", type: "PREPROCESSOR" as const },
  { key: "errors", label: "Errors", type: "ERROR" as const },
];

export function TokenStats({ stats }: TokenStatsProps) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Token Statistics
          <span className="text-sm font-normal text-muted-foreground">
            Total: {total}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {statItems.map((item) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                TOKEN_BG_COLORS[item.type]
              )}
            >
              <span className={cn("text-sm font-medium", TOKEN_COLORS[item.type])}>
                {item.label}
              </span>
              <span className="text-sm font-bold text-foreground">
                {stats[item.key as keyof typeof stats]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
