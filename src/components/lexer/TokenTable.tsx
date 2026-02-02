import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Token, TOKEN_COLORS, TOKEN_BG_COLORS } from "@/types/lexer";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface TokenTableProps {
  tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
  const visibleTokens = tokens.filter((t) => t.type !== "WHITESPACE");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Token Details
          <span className="text-sm font-normal text-muted-foreground">
            {visibleTokens.length} tokens
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[60px]">Line</TableHead>
                <TableHead className="w-[60px]">Col</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleTokens.map((token, index) => (
                <TableRow key={index} className={token.type === "ERROR" ? "bg-red-500/10" : ""}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm max-w-[150px] truncate">
                    <span className={TOKEN_COLORS[token.type]}>
                      {token.value.length > 20 ? token.value.slice(0, 20) + "..." : token.value}
                    </span>
                    {token.errorMessage && (
                      <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {token.errorMessage}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        TOKEN_BG_COLORS[token.type],
                        TOKEN_COLORS[token.type]
                      )}
                    >
                      {token.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{token.line}</TableCell>
                  <TableCell className="font-mono text-xs">{token.column}</TableCell>
                </TableRow>
              ))}
              {visibleTokens.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No tokens yet. Start typing C code above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
