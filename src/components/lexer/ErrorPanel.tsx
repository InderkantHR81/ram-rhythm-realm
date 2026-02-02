import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Token } from "@/types/lexer";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ErrorPanelProps {
  errors: Token[];
}

export function ErrorPanel({ errors }: ErrorPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {errors.length > 0 ? (
            <>
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Errors ({errors.length})</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No Errors</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.length > 0 ? (
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-red-500/10 border border-red-500/30 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-mono text-xs">
                      [{error.line}:{error.column}]
                    </span>
                    <span className="text-red-300">{error.errorMessage}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    Near: "{error.value}"
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your code has no lexical errors. ✓
          </p>
        )}
      </CardContent>
    </Card>
  );
}
